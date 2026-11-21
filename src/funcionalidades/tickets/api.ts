import { z } from 'zod'
import { solicitar } from '../../lib/http'
import { TicketResponseSchema, type PurchaseTicketRequest } from './tipos'

const listaTickets = z.array(TicketResponseSchema)
export const getTicket = (code: string) =>
  solicitar(`/tickets/${encodeURIComponent(code)}`, TicketResponseSchema)
export const getTicketsUsuario = (email: string) =>
  solicitar(`/tickets/by-user?email=${encodeURIComponent(email)}`, listaTickets)
export const postComprarTicket = (body: PurchaseTicketRequest) =>
  solicitar('/tickets', TicketResponseSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const patchCancelarTicket = (code: string) =>
  solicitar(
    `/tickets/${encodeURIComponent(code)}/cancel`,
    TicketResponseSchema,
    { method: 'PATCH' },
  )
export const patchUsarTicket = (code: string) =>
  solicitar(`/tickets/${encodeURIComponent(code)}/use`, TicketResponseSchema, {
    method: 'PATCH',
  })
export const getTicketsPagadosEvento = (code: string) =>
  solicitar(`/events/${encodeURIComponent(code)}/tickets/paid`, listaTickets)
