import { useState } from 'react'
import { useParams } from 'react-router'
import { useEvento } from '../funcionalidades/eventos/hooks'
import { useTicketsPagadosPorEvento, useUsarTicket } from '../funcionalidades/tickets/hooks'
import type { TicketResponse } from '../funcionalidades/tickets/tipos'
import { formatearPrecioCOP } from '../lib/formato'
import { ApiError } from '../lib/http'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import Tarjeta from '../componentes/Tarjeta'
import Badge from '../componentes/Badge'
import Aviso from '../componentes/Aviso'
import EstadoVacio from '../componentes/EstadoVacio'
import Cargando from '../componentes/Cargando'
import { ErrorCarga } from './compartidos'

type Mensaje = { tipo: 'exito' | 'error' | 'advertencia'; texto: string }

function TablaTickets({
  items,
  alUsar,
  cargando,
  codigoActual,
}: {
  items: TicketResponse[]
  alUsar: (code: string) => void
  cargando: boolean
  codigoActual: string
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2 font-semibold">Código</th>
              <th className="px-3 py-2 font-semibold">Tipo</th>
              <th className="px-3 py-2 font-semibold">Titular</th>
              <th className="px-3 py-2 font-semibold">Precio</th>
              <th className="px-3 py-2 font-semibold">Estado</th>
              <th className="px-3 py-2 font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((ticket) => (
              <tr key={ticket.ticketCode}>
                <td className="px-3 py-2 font-mono text-xs">{ticket.ticketCode}</td>
                <td className="px-3 py-2">{ticket.type}</td>
                <td className="px-3 py-2">{ticket.userEmail}</td>
                <td className="px-3 py-2">{formatearPrecioCOP(ticket.price)}</td>
                <td className="px-3 py-2"><Badge tono={ticket.status} className="text-[10px]" /></td>
                <td className="px-3 py-2">
                  {ticket.status === 'PAID' && (
                    <Boton
                      className="min-h-8 px-3 py-1 text-xs"
                      cargando={cargando && codigoActual === ticket.ticketCode}
                      onClick={() => alUsar(ticket.ticketCode)}
                    >
                      Usar
                    </Boton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {items.map((ticket) => (
          <Tarjeta key={ticket.ticketCode} className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <code className="font-mono text-sm font-bold">{ticket.ticketCode}</code>
              <Badge tono={ticket.status} className="text-[10px]" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {ticket.type} · {ticket.userEmail} · {formatearPrecioCOP(ticket.price)}
            </p>
            {ticket.status === 'PAID' && (
              <Boton
                className="w-full"
                cargando={cargando && codigoActual === ticket.ticketCode}
                onClick={() => alUsar(ticket.ticketCode)}
              >
                Usar
              </Boton>
            )}
          </Tarjeta>
        ))}
      </div>
    </>
  )
}

export default function TicketsPagadosEvento() {
  const { eventCode = '' } = useParams()
  const [code, setCode] = useState(eventCode)
  const [buscar, setBuscar] = useState(eventCode)
  const [feedback, setFeedback] = useState<Mensaje | null>(null)
  const [codigoActual, setCodigoActual] = useState('')
  const event = useEvento(buscar)
  const query = useTicketsPagadosPorEvento(buscar)
  const usar = useUsarTicket()

  const buscarEvento = (value: string) => {
    const normalized = value.trim().toUpperCase()
    if (!normalized) {
      setFeedback({ tipo: 'error', texto: 'Ingresa el código del evento.' })
      setBuscar('')
      return
    }
    setFeedback(null)
    if (normalized === buscar) {
      void event.refetch()
      void query.refetch()
    } else {
      setBuscar(normalized)
    }
  }

  const marcarUsado = (ticketCode: string) => {
    setCodigoActual(ticketCode)
    setFeedback(null)
    usar.mutate(ticketCode, {
      onSuccess: (ticket) => {
        setFeedback({
          tipo: 'exito',
          texto: `Ingreso registrado: ${ticket.ticketCode}.`,
        })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setFeedback({
            tipo: 'advertencia',
            texto: 'El ticket ya fue utilizado. (409)',
          })
          void query.refetch()
          return
        }
        if (error instanceof ApiError && error.status === 404) {
          setFeedback({ tipo: 'advertencia', texto: 'Ticket no encontrado.' })
          void query.refetch()
          return
        }
        if (error instanceof ApiError && error.status === 403) {
          setFeedback({ tipo: 'error', texto: 'Sin permisos.' })
          return
        }
        setFeedback({
          tipo: 'error',
          texto: error instanceof Error ? error.message : 'No se pudo usar el ticket.',
        })
      },
      onSettled: () => setCodigoActual(''),
    })
  }

  const eventError = event.error
    ? event.error instanceof ApiError && event.error.status === 404
      ? 'Evento no encontrado.'
      : event.error.message
    : ''

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold">
            Tickets pagados{buscar ? ` · ${buscar}` : ''}
          </h1>
          {query.data && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Total: {query.data.length}</p>}
        </div>
        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            buscarEvento(code)
          }}
        >
          <div className="w-full sm:w-40">
            <Campo
              className="min-h-10"
              etiqueta="Evento"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Código del evento"
              required
            />
          </div>
          <Boton type="submit" cargando={event.isFetching || query.isFetching} className="min-h-10">
            Ir
          </Boton>
        </form>
      </div>

      {feedback && <Aviso tipo={feedback.tipo}>{feedback.texto}</Aviso>}
      {eventError ? (
        <Aviso tipo="advertencia">{eventError}</Aviso>
      ) : !buscar ? (
        <EstadoVacio mensaje="Busca un evento por su código para ver los tickets pagados." />
      ) : event.isPending || query.isPending ? (
        <Cargando />
      ) : query.error ? (
        <ErrorCarga error={query.error} reintentar={() => void query.refetch()} />
      ) : query.data?.length ? (
        <TablaTickets
          items={query.data}
          alUsar={marcarUsado}
          cargando={usar.isPending}
          codigoActual={codigoActual}
        />
      ) : (
        <EstadoVacio mensaje="No hay tickets pagados." />
      )}
    </section>
  )
}
