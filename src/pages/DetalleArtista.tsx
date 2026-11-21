import { Link, useParams } from 'react-router'
import { ApiError } from '../lib/http'
import { useEventosPorArtista } from '../funcionalidades/eventos/hooks'
import { useArtista } from '../funcionalidades/artistas/hooks'
import { RUTAS } from '../lib/rutas'
import Cargando from '../componentes/Cargando'
import Tarjeta from '../componentes/Tarjeta'
import NoEncontrada from './NoEncontrada'
import { ErrorCarga, EstadoLista, GridEventos } from './compartidos'

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export default function DetalleArtista() {
  const { id = '' } = useParams()
  const artistId = Number(id)
  const idValido = Number.isInteger(artistId) && artistId > 0
  const query = useArtista(artistId, idValido)
  const events = useEventosPorArtista(
    query.data?.stageName ?? '',
    Boolean(query.data),
  )

  if (!idValido) return <NoEncontrada />
  if (query.isPending) return <Cargando />
  if (query.error) {
    if (query.error instanceof ApiError && query.error.status === 404)
      return <NoEncontrada />
    return (
      <ErrorCarga error={query.error} reintentar={() => void query.refetch()} />
    )
  }

  const artist = query.data!
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-marca-600 hover:underline dark:text-indigo-300"
        to={RUTAS.artistas}
      >
        <span aria-hidden="true">←</span> Artistas
      </Link>

      <Tarjeta className="flex flex-col items-center gap-3 p-4 text-center sm:flex-row sm:text-left">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
          {iniciales(artist.stageName)}
        </span>
        <div>
          <h1 className="text-xl font-extrabold">{artist.stageName}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nombre artístico{artist.genre ? ` · ${artist.genre}` : ''}
          </p>
          <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${artist.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
            {artist.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </Tarjeta>

      <section className="space-y-3">
        <h2 className="text-sm font-bold">
          Próximos eventos de {artist.stageName}
        </h2>
        <EstadoLista
          data={events.data}
          isPending={events.isPending}
          error={events.error}
          refetch={events.refetch}
          empty="Sin eventos próximos."
        >
          {(items) => <GridEventos eventos={items} />}
        </EstadoLista>
      </section>
    </div>
  )
}
