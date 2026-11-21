import { useMutation } from '@tanstack/react-query'
import { useAuth } from './AuthContext'

export function useLogin() {
  const { iniciarSesion } = useAuth()
  return useMutation({ mutationFn: iniciarSesion })
}
