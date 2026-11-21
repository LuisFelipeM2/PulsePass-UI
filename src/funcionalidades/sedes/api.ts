import { z } from 'zod'
import { solicitar } from '../../lib/http'
import { VenueResponseSchema } from './tipos'

const listaSedes = z.array(VenueResponseSchema)
export const getSedesActivas = () => solicitar('/venues/active', listaSedes)
export const getSede = (code: string) =>
  solicitar(`/venues/${encodeURIComponent(code)}`, VenueResponseSchema)
