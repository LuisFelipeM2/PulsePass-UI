import { solicitar } from '../../lib/http'
import {
  AuthResponseSchema,
  AuthenticatedUserResponseSchema,
  type LoginRequest,
} from './tipos'

export const postLogin = (body: LoginRequest) =>
  solicitar('/auth/login', AuthResponseSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const getSesion = () =>
  solicitar('/auth/me', AuthenticatedUserResponseSchema)
