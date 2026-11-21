import { useState } from 'react'
import { useTicket } from '../funcionalidades/tickets/hooks'
import { useUsarTicket } from '../funcionalidades/tickets/hooks'
import type { TicketResponse } from '../funcionalidades/tickets/tipos'
import { ApiError } from '../lib/http'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import Tarjeta from '../componentes/Tarjeta'
import Badge from '../componentes/Badge'
import Aviso from '../componentes/Aviso'

type Feedback = { tipo: 'exito' | 'error' | 'advertencia'; mensaje: string }

function mensajeError(error: Error): Feedback {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return { tipo: 'advertencia', mensaje: 'Ticket no encontrado.' }
    }
    if (error.status === 403) {
      return { tipo: 'error', mensaje: 'Sin permisos.' }
    }
  }
  return {
    tipo: 'error',
    mensaje: error.message || 'No se pudo consultar el ticket.',
  }
}

export default function ValidacionIngreso() {
  const [code, setCode] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const query = useTicket(searchCode)
  const mutation = useUsarTicket()
  const ticket: TicketResponse | undefined =
    mutation.data && mutation.variables === searchCode
      ? mutation.data
      : query.data

  const buscar = (value: string) => {
    const normalized = value.trim().toUpperCase()
    if (!normalized) {
      setFeedback({ tipo: 'error', mensaje: 'Ingresa un código de ticket.' })
      setSearchCode('')
      return
    }
    setFeedback(null)
    mutation.reset()
    if (normalized === searchCode) {
      void query.refetch()
    } else {
      setSearchCode(normalized)
    }
  }

  const marcarUsado = () => {
    if (!ticket || ticket.status !== 'PAID') return
    mutation.mutate(ticket.ticketCode, {
      onSuccess: (updated) => {
        setCode('')
        setFeedback({
          tipo: 'exito',
          mensaje: `Ingreso registrado. ${updated.ticketCode}`,
        })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          const yaFueUsado =
            ticket.status === 'USED' || error.message.toUpperCase().includes('USED')
          setFeedback(
            yaFueUsado
              ? null
              : {
                  tipo: 'advertencia',
                  mensaje: 'El ticket no puede utilizarse en su estado actual. (409)',
                },
          )
          void query.refetch()
          return
        }
        setFeedback(mensajeError(error instanceof Error ? error : new Error()))
      },
    })
  }

  const errorBusqueda = query.error ? mensajeError(query.error) : null
  const mostrarTicketUsado =
    ticket?.status === 'USED' &&
    !(mutation.isSuccess && mutation.variables === searchCode)

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-3xl font-bold">Validación de ingreso</h1>
      <form
        className="flex flex-col items-end gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          buscar(code)
        }}
      >
        <div className="w-full flex-1">
          <Campo
            className="min-h-10"
            etiqueta="Código de ticket"
            autoFocus
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="TKT-..."
          />
        </div>
        <Boton type="submit" cargando={query.isFetching} className="w-full sm:w-auto">
          <svg aria-hidden="true" className="mr-2 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          Buscar
        </Boton>
      </form>

      {errorBusqueda && (
        <Aviso tipo={errorBusqueda.tipo}>{errorBusqueda.mensaje}</Aviso>
      )}
      {!errorBusqueda && ticket && (
        <Tarjeta className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold">{ticket.eventName}</h2>
            <Badge tono={ticket.status} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {ticket.type} · Titular: {ticket.userEmail}
          </p>
          {ticket.status === 'PAID' && (
            <Boton
              className="w-full"
              cargando={mutation.isPending}
              onClick={marcarUsado}
            >
              Marcar como usado
            </Boton>
          )}
        </Tarjeta>
      )}
      {mostrarTicketUsado && (
        <Aviso tipo="advertencia">El ticket ya fue utilizado. (409)</Aviso>
      )}
      {feedback && <Aviso tipo={feedback.tipo}>{feedback.mensaje}</Aviso>}
    </section>
  )
}
