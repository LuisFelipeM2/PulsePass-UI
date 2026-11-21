import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import { getArtistaPorNombre } from '../artistas/api'
import type { CreateEventRequest } from './tipos'

export const clavesEventos = {
  publicados: ['eventos', 'publicados'],
  porArtista: (name: string) => ['eventos', 'artista', name],
  detalle: (code: string) => ['evento', code],
}
export function useEventosPublicados() {
  return useQuery({
    queryKey: clavesEventos.publicados,
    queryFn: api.getEventosPublicados,
  })
}
export function useEventosCatalogo(stageName: string) {
  return useQuery({
    queryKey: stageName
      ? clavesEventos.porArtista(stageName)
      : clavesEventos.publicados,
    queryFn: async () => {
      if (!stageName) return api.getEventosPublicados()
      const artista = await getArtistaPorNombre(stageName)
      return api.getEventosPorArtista(artista.stageName)
    },
  })
}
export function useEventosPorArtista(stageName: string, enabled = true) {
  return useQuery({
    queryKey: clavesEventos.porArtista(stageName),
    queryFn: () => api.getEventosPorArtista(stageName),
    enabled: enabled && !!stageName,
  })
}
export function useEvento(code: string, enabled = true) {
  return useQuery({
    queryKey: clavesEventos.detalle(code),
    queryFn: () => api.getEvento(code),
    enabled: enabled && !!code,
  })
}
export function useCrearEvento() {
  return useMutation({
    mutationFn: (body: CreateEventRequest) => api.postEvento(body),
  })
}
export function usePublicarEvento(code: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.patchPublicarEvento(code),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: clavesEventos.detalle(code),
      })
      void queryClient.invalidateQueries({ queryKey: clavesEventos.publicados })
    },
  })
}
export function useAsociarArtista(code: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (artistId: number) => api.postAsociarArtista(code, artistId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: clavesEventos.detalle(code),
      })
    },
  })
}
