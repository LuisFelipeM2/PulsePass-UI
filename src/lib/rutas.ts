export const RUTAS = {
  inicio: '/', eventos: '/eventos', evento: (code: string) => `/eventos/${encodeURIComponent(code)}`,
  artistas: '/artistas', artista: (id: number | string) => `/artistas/${id}`,
  sedes: '/sedes', sede: (code: string) => `/sedes/${encodeURIComponent(code)}`,
  login: '/login', registro: '/registro', cuenta: '/cuenta', misTickets: '/mis-tickets',
  ticket: (code: string) => `/mis-tickets/${encodeURIComponent(code)}`,
  confirmacion: (code: string) => `/compra/confirmacion/${encodeURIComponent(code)}`,
  validacion: '/staff/validacion', ticketsPagados: '/staff/tickets', ticketsEvento: (code: string) => `/staff/eventos/${encodeURIComponent(code)}/tickets`,
  adminEventos: '/admin/eventos', crearEvento: '/admin/eventos/nuevo', gestionarEvento: (code: string) => `/admin/eventos/${encodeURIComponent(code)}`,
  sinPermisos: '/403',
} as const
