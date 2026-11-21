import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useCancelarTicket, useTicket } from '../funcionalidades/tickets/hooks'
import { RUTAS } from '../lib/rutas'
import { formatearPrecioCOP } from '../lib/formato'
import type { EventCategory, EventSummaryResponse } from '../funcionalidades/eventos/tipos'
import type { TicketResponse } from '../funcionalidades/tickets/tipos'
import Boton from '../componentes/Boton'
import Tarjeta from '../componentes/Tarjeta'
import Badge from '../componentes/Badge'
import Aviso from '../componentes/Aviso'
import EstadoVacio from '../componentes/EstadoVacio'
import EstadoError from '../componentes/EstadoError'
import Cargando from '../componentes/Cargando'
import Modal from '../componentes/Modal'
import { ApiError } from '../lib/http'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { useUsuarioPorEmail } from '../funcionalidades/usuarios/hooks'

export function ErrorCarga({
  error,
  reintentar,
}: {
  error: Error
  reintentar: () => void
}) {
  return (
    <EstadoError
      mensaje={error.message || 'No pudimos cargar la información.'}
      onReintentar={reintentar}
    />
  )
}

export function EstadoLista<T>({
  data,
  isPending,
  error,
  refetch,
  empty,
  children,
}: {
  data: T[] | undefined
  isPending: boolean
  error: Error | null
  refetch: () => void
  empty: string
  children: (items: T[]) => ReactNode
}) {
  if (isPending) return <Cargando />
  if (error)
    return <ErrorCarga error={error} reintentar={() => void refetch()} />
  return data?.length ? children(data) : <EstadoVacio mensaje={empty} />
}

const coloresCategoria: Record<EventCategory, { fondo: string; color: string }> = {
  MUSIC: { fondo: 'bg-violet-950', color: 'text-violet-200' },
  TECHNOLOGY: { fondo: 'bg-sky-950', color: 'text-sky-200' },
  SPORTS: { fondo: 'bg-emerald-950', color: 'text-emerald-200' },
  CULTURE: { fondo: 'bg-rose-950', color: 'text-rose-200' },
  EDUCATION: { fondo: 'bg-amber-950', color: 'text-amber-200' },
  ENTERTAINMENT: { fondo: 'bg-purple-950', color: 'text-purple-200' },
}

export function IconoCategoria({
  categoria,
  className = 'h-12 w-12',
}: {
  categoria: EventCategory
  className?: string
}) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 48 48">
      {categoria === 'MUSIC' && <path d="M29 34V10l14-3v24M29 34c0 3-3 6-7 7s-7-1-7-4 3-6 7-7 7 1 7 4Zm14-3c0 3-3 6-7 7s-7-1-7-4 3-6 7-7 7 1 7 4Z" />}
      {categoria === 'TECHNOLOGY' && <><rect x="5" y="7" width="38" height="27" rx="2" /><path d="M16 42h16M24 34v8" /></>}
      {categoria === 'SPORTS' && <><circle cx="24" cy="24" r="18" /><path d="M24 6v36M6 24h36" /></>}
      {categoria === 'CULTURE' && <path d="M5 42h38M9 42V19l15-11 15 11v23M17 22v13m7-13v13m7-13v13" />}
      {categoria === 'EDUCATION' && <><path d="m3 18 21-11 21 11-21 11L3 18Z" /><path d="M12 23v10c7 6 17 6 24 0V23M44 19v13" /></>}
      {categoria === 'ENTERTAINMENT' && <path d="m24 4 6 13 14 2-10 10 3 15-13-7-13 7 3-15L4 19l14-2 6-13Z" />}
    </svg>
  )
}

export function EventCard({ event }: { event: EventSummaryResponse }) {
  const visual = coloresCategoria[event.category]
  return (
    <Link to={RUTAS.evento(event.eventCode)} className="group block">
      <Tarjeta className="h-full overflow-hidden transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg">
        <div className={`flex h-24 items-center justify-center sm:h-28 ${visual.fondo} ${visual.color}`}>
          <IconoCategoria categoria={event.category} className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <div className="space-y-1.5 p-3 text-xs">
          <p className={`text-[10px] font-bold tracking-wide ${visual.color}`}>{event.category}</p>
          <h2 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-slate-100">{event.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">
            <span aria-hidden="true">▢ </span>
            {new Date(event.eventDate).toLocaleDateString('es-CO', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
          <p className="line-clamp-1 text-slate-500 dark:text-slate-400">
            <span aria-hidden="true">⌖ </span>{event.venueName}
          </p>
          <Badge tono={event.status} className="px-2 py-0 text-[10px]" />
        </div>
      </Tarjeta>
    </Link>
  )
}

export function GridEventos({ eventos }: { eventos: EventSummaryResponse[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {eventos.map((event) => (
        <EventCard key={event.eventCode} event={event} />
      ))}
    </div>
  )
}

function TicketRow({ ticket }: { ticket: TicketResponse }) {
  const [confirmar, setConfirmar] = useState(false)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const cancelar = useCancelarTicket(ticket.ticketCode)
  const fecha = new Date(ticket.purchaseDate).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const abrirModal = () => {
    setError('')
    setAviso('')
    setConfirmar(true)
  }
  const confirmarCancelacion = () =>
    cancelar.mutate(undefined, {
      onSuccess: () => {
        setError('')
        setConfirmar(false)
      },
      onError: (cause) => {
        if (cause instanceof ApiError && cause.status === 409) {
          setError('El ticket no puede cancelarse en su estado actual.')
          return
        }
        if (cause instanceof ApiError && (cause.status === 403 || cause.status === 404)) {
          setAviso(cause.message || 'No se pudo encontrar o cancelar este ticket.')
          setConfirmar(false)
          return
        }
        setError(cause instanceof Error ? cause.message : 'No se pudo cancelar el ticket.')
      },
    })

  return (
    <>
      {aviso && <Aviso tipo="error">{aviso}</Aviso>}
      <Tarjeta className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <h2 className="truncate font-bold">{ticket.eventName}</h2>
            <Badge tono={ticket.status} className="shrink-0 text-[10px]" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-mono">{ticket.ticketCode}</span>
            {' · '}{ticket.type}
            {' · '}{formatearPrecioCOP(ticket.price)}
            {' · '}{fecha}
          </p>
        </div>
        <div className="flex shrink-0 justify-end gap-2">
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            to={RUTAS.ticket(ticket.ticketCode)}
          >
            Ver detalle
          </Link>
          {ticket.status === 'PAID' && (
            <Boton variante="peligro" onClick={abrirModal}>
              Cancelar
            </Boton>
          )}
        </div>
      </Tarjeta>
      <Modal
        abierto={confirmar}
        titulo="Cancelar ticket"
        onCerrar={() => !cancelar.isPending && setConfirmar(false)}
      >
        <p className="mb-4 text-sm text-slate-700 dark:text-slate-200">
          ¿Quieres cancelar el ticket <strong>{ticket.ticketCode}</strong> ({ticket.type}) de {ticket.eventName}?
        </p>
        {error && <Aviso tipo="error" className="mb-4">{error}</Aviso>}
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" disabled={cancelar.isPending} onClick={() => setConfirmar(false)}>
            Volver
          </Boton>
          <Boton variante="peligro" cargando={cancelar.isPending} onClick={confirmarCancelacion}>
            Cancelar ticket
          </Boton>
        </div>
      </Modal>
    </>
  )
}

export function TicketList({ items }: { items: TicketResponse[] }) {
  return (
    <div className="space-y-3">
      {items.map((ticket) => (
        <TicketRow key={ticket.ticketCode} ticket={ticket} />
      ))}
    </div>
  )
}

export function TicketDetail({ mode }: { mode: 'detail' | 'confirmation' }) {
  const { ticketCode = '' } = useParams()
  const { sesion } = useAuth()
  const query = useTicket(ticketCode)
  const email = sesion.estado === 'autenticado' ? sesion.usuario.email : ''
  const perfil = useUsuarioPorEmail(email, sesion.estado === 'autenticado')
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [confirmar, setConfirmar] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [errorCopia, setErrorCopia] = useState('')
  const cancel = useCancelarTicket(ticketCode)

  const cerrarConfirmacionCancelacion = () => {
    if (cancel.isPending) return
    setError('')
    setConfirmar(false)
  }
  const copiarCodigo = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setErrorCopia('')
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 1800)
    } catch {
      setErrorCopia('No se pudo copiar. Selecciona el código para copiarlo.')
    }
  }
  const cancelar = () =>
    cancel.mutate(undefined, {
      onSuccess: () => {
        setError('')
        setConfirmar(false)
      },
      onError: (cause) => {
        if (cause instanceof ApiError && cause.status === 409) {
          setError('El ticket no puede cancelarse en su estado actual.')
          return
        }
        if (cause instanceof ApiError && (cause.status === 403 || cause.status === 404)) {
          setAviso(cause.message || 'No se pudo cancelar este ticket.')
          setConfirmar(false)
          return
        }
        setError(cause instanceof Error ? cause.message : 'No se pudo cancelar el ticket.')
      },
    })

  if (query.isPending) return <Cargando />
  if (query.error) {
    if (query.error instanceof ApiError && (query.error.status === 403 || query.error.status === 404)) {
      return <EstadoError mensaje="Ticket no disponible." />
    }
    return <ErrorCarga error={query.error} reintentar={() => void query.refetch()} />
  }

  const ticket = query.data!
  const titular = perfil.data
    ? `${perfil.data.firstName} ${perfil.data.lastName}`
    : ticket.userEmail
  const fechaCompra = new Date(ticket.purchaseDate).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  if (mode === 'confirmation') {
    return (
      <section className="mx-auto flex max-w-3xl justify-center py-6 sm:py-10">
        <Tarjeta className="w-full max-w-md space-y-4 p-6 text-center sm:p-8">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <svg aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </span>
          <h1 className="text-xl font-bold">¡Compra realizada con éxito!</h1>
          <div className="space-y-1">
            <h2 className="font-semibold">{ticket.eventName}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Ticket <code className="font-mono">{ticket.ticketCode}</code>
              {' · '}{ticket.type}
              {' · '}{formatearPrecioCOP(ticket.price)}
            </p>
            <Badge tono={ticket.status} className="text-[10px]" />
          </div>
          <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-marca-600 px-4 text-sm font-semibold text-white hover:bg-marca-700"
              to={RUTAS.misTickets}
            >
              Ver mis tickets
            </Link>
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              to={RUTAS.eventos}
            >
              Seguir explorando
            </Link>
          </div>
        </Tarjeta>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {aviso && <Aviso tipo="error">{aviso}</Aviso>}
      <Link className="inline-flex items-center gap-2 text-sm text-marca-600 hover:text-marca-700" to={RUTAS.misTickets}>
        <span aria-hidden="true">←</span> Mis tickets
      </Link>
      <Tarjeta className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold sm:text-2xl">{ticket.eventName}</h1>
          <Badge tono={ticket.status} />
        </div>
        <dl className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3 py-2.5">
            <dt className="text-slate-500 dark:text-slate-400">Código</dt>
            <dd className="flex items-center gap-3">
              <code className="font-mono">{ticket.ticketCode}</code>
              <Boton variante="secundario" className="min-h-8 px-3 py-1 text-xs" onClick={() => void copiarCodigo(ticket.ticketCode)}>
                {copiado ? 'Copiado' : 'Copiar'}
              </Boton>
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-slate-500 dark:text-slate-400">Tipo</dt>
            <dd className="font-medium">{ticket.type}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-slate-500 dark:text-slate-400">Precio</dt>
            <dd className="font-medium">{formatearPrecioCOP(ticket.price)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-slate-500 dark:text-slate-400">Comprado el</dt>
            <dd className="text-right font-medium">{fechaCompra}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-slate-500 dark:text-slate-400">Titular</dt>
            <dd className="text-right font-medium">{titular}</dd>
          </div>
        </dl>
        <p className="border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Presenta este código en el ingreso.
        </p>
        {errorCopia && <Aviso tipo="error">{errorCopia}</Aviso>}
      </Tarjeta>
      {ticket.status === 'PAID' && (
        <div className="flex justify-end">
          <Boton variante="peligro" onClick={() => { setError(''); setConfirmar(true) }}>
            Cancelar ticket
          </Boton>
        </div>
      )}
      <Modal
        abierto={confirmar}
        titulo="Cancelar ticket"
        onCerrar={cerrarConfirmacionCancelacion}
      >
        <p className="mb-4 text-sm text-slate-700 dark:text-slate-200">
          ¿Quieres cancelar el ticket <strong>{ticket.ticketCode}</strong> ({ticket.type}) de {ticket.eventName}?
        </p>
        {error && <Aviso tipo="error" className="mb-4">{error}</Aviso>}
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" disabled={cancel.isPending} onClick={cerrarConfirmacionCancelacion}>
            Volver
          </Boton>
          <Boton variante="peligro" cargando={cancel.isPending} onClick={cancelar}>
            Cancelar ticket
          </Boton>
        </div>
      </Modal>
    </div>
  )
}
