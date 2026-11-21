import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { PurchaseTicketRequest } from './tipos'

export const clavesTickets = {
  todos: ['tickets'],
  usuario: (email: string) => ['tickets', 'usuario', email],
  detalle: (code: string) => ['ticket', code],
  pagadosEvento: (code: string) => ['tickets', 'pagados', code],
}
export function useTicket(code: string) {
  return useQuery({
    queryKey: clavesTickets.detalle(code),
    queryFn: () => api.getTicket(code),
    enabled: !!code,
  })
}
export function useMisTickets(email: string) {
  return useQuery({
    queryKey: clavesTickets.usuario(email),
    queryFn: () => api.getTicketsUsuario(email),
    enabled: !!email,
  })
}
export function useTicketsPagadosPorEvento(code: string) {
  return useQuery({
    queryKey: clavesTickets.pagadosEvento(code),
    queryFn: () => api.getTicketsPagadosEvento(code),
    enabled: !!code,
  })
}
export function useComprarTicket() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: PurchaseTicketRequest) => api.postComprarTicket(body),
    onSuccess: (_ticket, body) => {
      void client.invalidateQueries({
        queryKey: clavesTickets.usuario(body.userEmail),
      })
      void client.invalidateQueries({ queryKey: ['evento', body.eventCode] })
    },
  })
}
export function useCancelarTicket(code: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => api.patchCancelarTicket(code),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: clavesTickets.todos })
      void client.invalidateQueries({ queryKey: clavesTickets.detalle(code) })
    },
  })
}
export function useUsarTicket() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => api.patchUsarTicket(code),
    onSuccess: (ticket) => {
      void client.invalidateQueries({ queryKey: clavesTickets.todos })
      void client.invalidateQueries({
        queryKey: clavesTickets.detalle(ticket.ticketCode),
      })
    },
  })
}
