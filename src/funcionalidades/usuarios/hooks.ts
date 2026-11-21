import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from './api'
import type { RegisterUserRequest } from './tipos'

export function useUsuarioPorEmail(email: string, enabled = true) {
  return useQuery({
    queryKey: ['usuario', 'email', email],
    queryFn: () => api.getUsuarioPorEmail(email),
    enabled: enabled && !!email,
  })
}
export function useUsuarioPorNombre(username: string, enabled = true) {
  return useQuery({
    queryKey: ['usuario', 'username', username],
    queryFn: () => api.getUsuarioPorNombre(username),
    enabled: enabled && !!username,
  })
}
export function useRegistrarUsuario() {
  return useMutation({
    mutationFn: (body: RegisterUserRequest) => api.postUsuario(body),
  })
}
