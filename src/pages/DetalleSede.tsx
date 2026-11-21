import { Link, useParams } from 'react-router'
import { ApiError } from '../lib/http'
import { useSede } from '../funcionalidades/sedes/hooks'
import { RUTAS } from '../lib/rutas'
import Tarjeta from '../componentes/Tarjeta'
import Cargando from '../componentes/Cargando'
import NoEncontrada from './NoEncontrada'
import { ErrorCarga } from './compartidos'

export default function DetalleSede() {
  const { code = '' } = useParams()
  const query = useSede(code, !!code)

  if (!code) return <NoEncontrada />
  if (query.isPending) return <Cargando />
  if (query.error) {
    if (query.error instanceof ApiError && query.error.status === 404)
      return <NoEncontrada />
    return (
      <ErrorCarga error={query.error} reintentar={() => void query.refetch()} />
    )
  }

  const venue = query.data!
  const datos = [
    { etiqueta: 'Código', valor: venue.code },
    { etiqueta: 'Ciudad', valor: venue.city },
    {
      etiqueta: 'Capacidad',
      valor: `${venue.capacity.toLocaleString('es-CO')} personas`,
    },
    ...(venue.address ? [{ etiqueta: 'Dirección', valor: venue.address }] : []),
    { etiqueta: 'Estado', valor: venue.active ? 'Activa' : 'Inactiva' },
  ]

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link
        className="inline-flex items-center gap-2 text-xs font-medium text-marca-600 hover:underline dark:text-indigo-300"
        to={RUTAS.sedes}
      >
        <span aria-hidden="true">←</span> Sedes
      </Link>
      <Tarjeta className="p-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h1 className="text-base font-extrabold">{venue.name}</h1>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${venue.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
            {venue.active ? 'Activa' : 'Inactiva'}
          </span>
        </div>
        <dl>
          {datos.map((dato) => (
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2 text-[11px] last:border-0 dark:border-slate-800" key={dato.etiqueta}>
              <dt className="text-slate-500 dark:text-slate-400">{dato.etiqueta}</dt>
              <dd className="text-right font-medium">{dato.valor}</dd>
            </div>
          ))}
        </dl>
      </Tarjeta>
    </div>
  )
}
