import { z } from 'zod'

export const UserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  active: z.boolean(),
})
export type UserResponse = z.infer<typeof UserResponseSchema>

export const RegisterUserRequestSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
  birthDate: z.string(),
})
export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>
