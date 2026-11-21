import { z } from 'zod'
import { solicitar } from '../../lib/http'
import { ArtistResponseSchema } from './tipos'

const listaArtistas = z.array(ArtistResponseSchema)
export const getArtistasActivos = () =>
  solicitar('/artists/active', listaArtistas)
export const getArtista = (id: number) =>
  solicitar(`/artists/${id}`, ArtistResponseSchema)
export const getArtistaPorNombre = (stageName: string) =>
  solicitar(
    `/artists/by-stage-name?stageName=${encodeURIComponent(stageName)}`,
    ArtistResponseSchema,
  )
