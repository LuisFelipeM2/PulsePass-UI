import { solicitar } from '../../lib/http'
import { UserResponseSchema, type RegisterUserRequest } from './tipos'

export const postUsuario = (body: RegisterUserRequest) =>
  solicitar('/users', UserResponseSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const getUsuarioPorEmail = (email: string) =>
  solicitar(
    `/users/by-email?email=${encodeURIComponent(email)}`,
    UserResponseSchema,
  )
export const getUsuarioPorNombre = (username: string) =>
  solicitar(
    `/users/by-username?username=${encodeURIComponent(username)}`,
    UserResponseSchema,
  )
