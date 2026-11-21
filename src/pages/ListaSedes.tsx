import { Link } from 'react-router'
import { useSedesActivas } from '../funcionalidades/sedes/hooks'
import { RUTAS } from '../lib/rutas'
import Tarjeta from '../componentes/Tarjeta'
import { EstadoLista } from './compartidos'

export default function ListaSedes() {
  const query = useSedesActivas()
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-extrabold">Sedes</h1>
      <EstadoLista
        data={query.data}
        isPending={query.isPending}
        error={query.error}
        refetch={query.refetch}
        empty="No hay sedes activas."
      >
        {(items) => (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((venue) => (
              <Link key={venue.code} to={RUTAS.sede(venue.code)}>
                <Tarjeta className="h-full p-3 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-bold">{venue.name}</h2>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
                      Activa
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span aria-hidden="true">⌖ </span>
                    {venue.city} · Cap. {venue.capacity.toLocaleString('es-CO')}
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
