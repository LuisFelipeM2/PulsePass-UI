import { z } from 'zod'

export const ArtistResponseSchema = z.object({
  id: z.number(),
  stageName: z.string(),
  country: z.string().nullable(),
  genre: z.string().nullable(),
  active: z.boolean(),
})
export type ArtistResponse = z.infer<typeof ArtistResponseSchema>
