import { solicitar } from '../../lib/http'
import {
  EventResponseSchema,
  EventSummaryResponseSchema,
  type CreateEventRequest,
} from './tipos'
import { z } from 'zod'

const listaEventos = z.array(EventSummaryResponseSchema)
export const getEventosPublicados = () =>
  solicitar('/events/published', listaEventos)
export const getEvento = (code: string) =>
  solicitar(`/events/${encodeURIComponent(code)}`, EventResponseSchema)
export const getEventosPorArtista = (stageName: string) =>
  solicitar(
    `/events/by-artist?stageName=${encodeURIComponent(stageName)}`,
    listaEventos,
  )
export const postEvento = (body: CreateEventRequest) =>
  solicitar('/events', EventResponseSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const patchPublicarEvento = (code: string) =>
  solicitar(
    `/events/${encodeURIComponent(code)}/publish`,
    EventResponseSchema,
    { method: 'PATCH' },
  )
export const postAsociarArtista = (code: string, id: number) =>
  solicitar(`/events/${encodeURIComponent(code)}/artists/${id}`, z.unknown(), {
    method: 'POST',
  })
