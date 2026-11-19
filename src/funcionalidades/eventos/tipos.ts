import { z } from 'zod'
import { ArtistResponseSchema } from '../artistas/tipos'

export const EventCategorySchema = z.enum([
  'MUSIC',
  'SPORTS',
  'TECHNOLOGY',
  'EDUCATION',
  'CULTURE',
  'ENTERTAINMENT',
])
export type EventCategory = z.infer<typeof EventCategorySchema>

export const EventStatusSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'SOLD_OUT',
  'CANCELLED',
  'FINISHED',
])
export type EventStatus = z.infer<typeof EventStatusSchema>

export const EventSummaryResponseSchema = z.object({
  id: z.number(),
  eventCode: z.string(),
  name: z.string(),
  category: EventCategorySchema,
  status: EventStatusSchema,
  eventDate: z.string(),
  venueName: z.string(),
})
export type EventSummaryResponse = z.infer<typeof EventSummaryResponseSchema>

export const EventResponseSchema = z.object({
  id: z.number(),
  eventCode: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: EventCategorySchema,
  status: EventStatusSchema,
  eventDate: z.string(),
  minimumAge: z.number(),
  venueCode: z.string(),
  venueName: z.string(),
  artists: z.array(ArtistResponseSchema),
})
export type EventResponse = z.infer<typeof EventResponseSchema>

export const CreateEventRequestSchema = z.object({
  eventCode: z.string().min(1),
  name: z.string().min(1),
  description: z.string().max(500),
  category: EventCategorySchema,
  eventDate: z.string().min(1),
  minimumAge: z.number().int().min(0),
  venueCode: z.string().min(1),
})
export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>
