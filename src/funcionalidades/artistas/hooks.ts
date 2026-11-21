import { useQuery } from '@tanstack/react-query'
import * as api from './api'

export function useArtistasActivos() {
  return useQuery({
    queryKey: ['artistas', 'activos'],
    queryFn: api.getArtistasActivos,
  })
}
export function useArtista(id: number, enabled = true) {
  return useQuery({
    queryKey: ['artista', id],
    queryFn: () => api.getArtista(id),
    enabled: enabled && Number.isInteger(id) && id > 0,
  })
}
export function useArtistaPorNombre(stageName: string, enabled = true) {
  return useQuery({
    queryKey: ['artista', 'nombre', stageName],
    queryFn: () => api.getArtistaPorNombre(stageName),
    enabled: enabled && !!stageName,
  })
}
