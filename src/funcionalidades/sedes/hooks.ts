import { useQuery } from '@tanstack/react-query'
import * as api from './api'

export function useSedesActivas() {
  return useQuery({
    queryKey: ['sedes', 'activas'],
    queryFn: api.getSedesActivas,
  })
}
export function useSede(code: string, enabled = true) {
  return useQuery({
    queryKey: ['sede', code],
    queryFn: () => api.getSede(code),
    enabled: enabled && !!code,
  })
}
