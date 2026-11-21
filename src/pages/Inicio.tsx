import { Link } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import { useEventosPublicados } from '../funcionalidades/eventos/hooks'
import { RUTAS } from '../lib/rutas'
import { EstadoLista, GridEventos } from './compartidos'

const coloresAvatar = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200',
]

export default function Inicio() {
  const eventos = useEventosPublicados()
  const artistas = useArtistasActivos()
  const { sesion } = useAuth()

  return (
    <div className="-mx-4 -mt-8 space-y-0 bg-slate-50 pb-8 dark:bg-slate-950 sm:-mx-6">
      <section className="bg-gradient-to-r from-marca-600 to-acento-500 px-6 py-8 text-white sm:px-10 sm:py-10">
        <h1 className="max-w-xl text-3xl leading-tight font-extrabold sm:text-4xl">
          Descubre los mejores eventos
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/90">
          Música, cultura, deporte y tecnología en un solo lugar.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            className="rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-marca-700 hover:bg-indigo-50"
            to={RUTAS.eventos}
          >
            Ver cartelera
          </Link>
          {sesion.estado === 'anonimo' && (
            <Link
              className="rounded-lg border border-white/70 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-white/10"
              to={RUTAS.registro}
            >
              Crear cuenta
            </Link>
          )}
        </div>
      </section>

      <div className="space-y-8 px-6 py-6 sm:px-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Próximos eventos</h2>
            <Link className="text-xs font-semibold text-marca-700 hover:underline dark:text-indigo-300" to={RUTAS.eventos}>
              Ver todos →
            </Link>
          </div>
          <EstadoLista
            data={eventos.data?.slice(0, 3)}
            isPending={eventos.isPending}
            error={eventos.error}
            refetch={eventos.refetch}
            empty="Aún no hay eventos publicados."
          >
            {(items) => <GridEventos eventos={items} />}
          </EstadoLista>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Artistas destacados</h2>
            <Link className="text-xs font-semibold text-marca-700 hover:underline dark:text-indigo-300" to={RUTAS.artistas}>
              Ver todos →
            </Link>
          </div>
          <EstadoLista
            data={artistas.data?.slice(0, 6)}
            isPending={artistas.isPending}
            error={artistas.error}
            refetch={artistas.refetch}
            empty="Aún no hay artistas destacados."
          >
            {(items) => (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-5">
                {items.map((artist, index) => (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full text-xs font-semibold hover:text-marca-700 dark:hover:text-indigo-300"
                    key={artist.id}
                    to={RUTAS.artista(artist.id)}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] ${coloresAvatar[index % coloresAvatar.length]}`}>
                      {artist.stageName.slice(0, 2).toUpperCase()}
                    </span>
                    {artist.stageName}
                  </Link>
                ))}
              </div>
            )}
          </EstadoLista>
        </section>
      </div>
    </div>
  )
}
