import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { useMisTickets } from '../funcionalidades/tickets/hooks'
import type { TicketStatus } from '../funcionalidades/tickets/tipos'
import { RUTAS } from '../lib/rutas'
import { EstadoLista, TicketList } from './compartidos'

const filtros: { value: TicketStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PAID', label: 'Pagados' },
  { value: 'USED', label: 'Usados' },
  { value: 'CANCELLED', label: 'Cancelados' },
]

export default function MisTickets() {
  const { sesion } = useAuth()
  const email = sesion.estado === 'autenticado' ? sesion.usuario.email : ''
  const query = useMisTickets(email)
  const [filtro, setFiltro] = useState<TicketStatus | 'ALL'>('ALL')
  const items = query.data?.filter(
    (ticket) => filtro === 'ALL' || ticket.status === filtro,
  )

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold">Mis tickets</h1>
      <div className="flex flex-wrap gap-2" aria-label="Filtrar tickets por estado">
        {filtros.map((opcion) => (
          <button
            key={opcion.value}
            type="button"
            aria-pressed={filtro === opcion.value}
            onClick={() => setFiltro(opcion.value)}
            className={`min-h-9 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 ${filtro === opcion.value ? 'border-marca-600 bg-marca-600 text-white' : 'border-slate-300 bg-white text-slate-800 hover:border-marca-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`}
          >
            {opcion.label}
          </button>
        ))}
      </div>
      <EstadoLista
        data={items}
        isPending={query.isPending}
        error={query.error}
        refetch={query.refetch}
        empty={filtro === 'ALL' ? 'Aún no tienes tickets. Explora la cartelera.' : 'No tienes tickets en este estado.'}
      >
        {(tickets) => <TicketList items={tickets} />}
      </EstadoLista>
      <Link className="text-marca-600" to={RUTAS.eventos}>
        Ver cartelera →
      </Link>
    </section>
  )
}
