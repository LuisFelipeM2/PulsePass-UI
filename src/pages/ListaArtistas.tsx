import { Link } from 'react-router'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import { RUTAS } from '../lib/rutas'
import Tarjeta from '../componentes/Tarjeta'
import { EstadoLista } from './compartidos'

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

const colores = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200',
]

export default function ListaArtistas() {
  const query = useArtistasActivos()
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-extrabold">Artistas</h1>
      <EstadoLista
        data={query.data}
        isPending={query.isPending}
        error={query.error}
        refetch={query.refetch}
        empty="Aún no hay artistas activos."
      >
        {(items) => (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((artist, index) => (
              <Link key={artist.id} to={RUTAS.artista(artist.id)}>
                <Tarjeta className="flex min-h-28 flex-col items-center justify-center gap-2 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className={`grid h-12 w-12 place-items-center rounded-full text-sm font-bold ${colores[index % colores.length]}`}>
                    {iniciales(artist.stageName)}
                  </span>
                  <h2 className="text-xs font-bold">{artist.stageName}</h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {artist.genre || 'Artista'}
                  </p>
                </Tarjeta>
              </Link>
            ))}
          </div>
        )}
      </EstadoLista>
    </section>
  )
}
