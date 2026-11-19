import { z } from 'zod'

export const RolSchema = z.enum(['USER', 'STAFF', 'ADMIN'])
export type Rol = z.infer<typeof RolSchema>

export const LoginRequestSchema = z.object({
  identifier: z.string().min(1, 'Ingresa tu usuario o correo'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number(),
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const AuthenticatedUserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  roles: z.array(z.string()),
})
export type AuthenticatedUserResponse = z.infer<
  typeof AuthenticatedUserResponseSchema
>
