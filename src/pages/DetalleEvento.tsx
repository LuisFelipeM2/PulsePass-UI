import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { useEvento } from '../funcionalidades/eventos/hooks'
import { useSede } from '../funcionalidades/sedes/hooks'
import { useComprarTicket } from '../funcionalidades/tickets/hooks'
import { RUTAS } from '../lib/rutas'
import Boton from '../componentes/Boton'
import Tarjeta from '../componentes/Tarjeta'
import Badge from '../componentes/Badge'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import Modal from '../componentes/Modal'
import { ErrorCarga, IconoCategoria } from './compartidos'

const tiposEntrada = ['GENERAL', 'VIP', 'BACKSTAGE', 'STUDENT'] as const

export default function DetalleEvento() {
  const { eventCode = '' } = useParams()
  const location = useLocation()
  const query = useEvento(eventCode)
  const sede = useSede(query.data?.venueCode ?? '', !!query.data)
  const { sesion, tieneRol } = useAuth()
  const [tipo, setTipo] = useState<(typeof tiposEntrada)[number]>('GENERAL')
  const [mensaje, setMensaje] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const navigate = useNavigate()
  const compra = useComprarTicket()

  if (query.isPending) return <Cargando />
  if (query.error)
    return (
      <ErrorCarga error={query.error} reintentar={() => void query.refetch()} />
    )

  const event = query.data!
  const confirmarCompra = () => {
    if (sesion.estado !== 'autenticado') return
    compra.mutate(
      { userEmail: sesion.usuario.email, eventCode, type: tipo },
      {
        onSuccess: (ticket) => navigate(RUTAS.confirmacion(ticket.ticketCode)),
        onError: (error) => setMensaje(error.message),
      },
    )
  }

  const fecha = new Date(event.eventDate)
  const compraDisponible = event.status === 'PUBLISHED' && !tieneRol('STAFF', 'ADMIN')
  const esComprador = sesion.estado === 'autenticado' && tieneRol('USER')
  const cerrarConfirmacion = () => {
    setModalAbierto(false)
    setMensaje('')
  }
  return (
    <div className={`mx-auto max-w-5xl space-y-5 ${compraDisponible ? 'pb-20 lg:pb-0' : ''}`}>
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-marca-600 hover:text-marca-700 dark:text-indigo-300"
        to={RUTAS.eventos}
      >
        <span aria-hidden="true">←</span> Volver a la cartelera
      </Link>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Tarjeta className="overflow-hidden">
          <div className={`flex h-36 items-center justify-center ${event.category === 'TECHNOLOGY' ? 'bg-sky-950 text-sky-200' : event.category === 'SPORTS' ? 'bg-emerald-950 text-emerald-200' : event.category === 'CULTURE' ? 'bg-rose-950 text-rose-200' : event.category === 'EDUCATION' ? 'bg-amber-950 text-amber-200' : event.category === 'ENTERTAINMENT' ? 'bg-purple-950 text-purple-200' : 'bg-violet-950 text-violet-200'}`}>
            <IconoCategoria categoria={event.category} className="h-16 w-16" />
          </div>

          <div className="space-y-3.5 p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-indigo-300">{event.category}</span>
              <Badge tono={event.status} className="px-2 py-0 text-[10px]" />
            </div>
            <h1 className="text-2xl leading-tight font-extrabold sm:text-3xl">
              {event.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Código del evento: <code className="font-mono font-semibold">{event.eventCode}</code>
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">▢</span>
                {fecha.toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                ·{' '}
                {fecha.toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">♙</span> Edad mínima: {event.minimumAge}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {event.description || 'Prepárate para vivir una experiencia única.'}
            </p>

            <section>
              <h2 className="text-sm font-bold">Artistas</h2>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {event.artists.map((artist, index) => (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full text-xs font-semibold hover:text-indigo-300"
                    key={artist.id}
                    to={RUTAS.artista(artist.id)}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] ${index % 2 ? 'bg-emerald-950 text-emerald-300' : 'bg-indigo-950 text-indigo-200'}`}
                    >
                      {artist.stageName.slice(0, 2).toUpperCase()}
                    </span>
                    {artist.stageName}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-1.5 text-sm font-bold">Sede</h2>
              <Link
                className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500"
                to={RUTAS.sede(event.venueCode)}
              >
                <span aria-hidden="true" className="text-lg text-indigo-300">⌂</span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{event.venueName}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {sede.data
                      ? `${sede.data.city} · Capacidad ${sede.data.capacity.toLocaleString('es-CO')}`
                      : 'Consulta los detalles de la sede'}
                  </span>
                </span>
              </Link>
            </section>
          </div>
        </Tarjeta>

        <Tarjeta className="space-y-3 p-4 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Entradas</h2>
          {compraDisponible ? (
            <>
              {esComprador ? (
                <fieldset className="space-y-1.5">
                  <legend className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                    Tipo de entrada
                  </legend>
                  {tiposEntrada.map((option) => (
                    <label
                      className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-semibold transition-colors ${tipo === option ? 'border-indigo-500 bg-indigo-950/70' : 'border-slate-200 hover:border-indigo-400 dark:border-slate-800'}`}
                      key={option}
                    >
                      <input
                        checked={tipo === option}
                        className="accent-indigo-500"
                        name="tipoEntrada"
                        onChange={() => setTipo(option)}
                        type="radio"
                        value={option}
                      />
                      {option}
                    </label>
                  ))}
                </fieldset>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Inicia sesión como usuario para elegir tu entrada.
                </p>
              )}
              {sesion.estado === 'anonimo' ? (
                <Link
                  className="hidden min-h-10 items-center justify-center rounded-lg bg-marca-600 px-4 text-center text-sm font-semibold text-white hover:bg-marca-700 lg:flex"
                  to={RUTAS.login}
                  state={{ desde: location }}
                >
                  Inicia sesión para comprar
                </Link>
              ) : (
                <Boton
                  className="hidden w-full lg:flex"
                  disabled={sesion.estado !== 'autenticado' || !tieneRol('USER')}
                  cargando={compra.isPending}
                  onClick={() => {
                    setMensaje('')
                    setModalAbierto(true)
                  }}
                >
                  Comprar entrada
                </Boton>
              )}
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                El precio lo define el sistema al confirmar.
              </p>
            </>
          ) : (
            <Aviso tipo="info">La compra no está disponible para este evento.</Aviso>
          )}
        </Tarjeta>
      </div>

      {compraDisponible && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          {sesion.estado === 'anonimo' ? (
            <Link
              className="flex min-h-11 w-full items-center justify-center rounded-lg bg-marca-600 px-4 text-sm font-semibold text-white hover:bg-marca-700"
              to={RUTAS.login}
              state={{ desde: location }}
            >
              Iniciar sesión para comprar
            </Link>
          ) : esComprador ? (
            <Boton
              className="w-full"
              cargando={compra.isPending}
              onClick={() => {
                setMensaje('')
                setModalAbierto(true)
              }}
            >
              Comprar entrada
            </Boton>
          ) : null}
        </div>
      )}

      <Modal
        abierto={modalAbierto}
        titulo="Confirmar compra"
        onCerrar={cerrarConfirmacion}
      >
        <dl className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-2 dark:border-slate-700">
            <dt className="text-slate-500 dark:text-slate-400">Evento</dt>
            <dd className="text-right font-medium">{event.name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-2 dark:border-slate-700">
            <dt className="text-slate-500 dark:text-slate-400">Tipo</dt>
            <dd className="font-medium">{tipo}</dd>
          </div>
          {sesion.estado === 'autenticado' && (
            <div className="flex justify-between gap-4 border-b border-slate-200 pb-2 dark:border-slate-700">
              <dt className="text-slate-500 dark:text-slate-400">Cuenta</dt>
              <dd className="text-right font-medium">{sesion.usuario.email}</dd>
            </div>
          )}
        </dl>
        {mensaje && <Aviso tipo="error" className="mb-4">{mensaje}</Aviso>}
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" onClick={cerrarConfirmacion}>
            Cancelar
          </Boton>
          <Boton cargando={compra.isPending} onClick={confirmarCompra}>
            Confirmar
          </Boton>
        </div>
      </Modal>
    </div>
  )
}
