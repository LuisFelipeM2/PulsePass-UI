import { Link } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { useUsuarioPorEmail } from '../funcionalidades/usuarios/hooks'
import { RUTAS } from '../lib/rutas'
import Boton from '../componentes/Boton'
import Tarjeta from '../componentes/Tarjeta'
import Cargando from '../componentes/Cargando'
import { ErrorCarga } from './compartidos'

export default function Cuenta() {
  const { sesion, cerrarSesion, tieneRol } = useAuth()
  const email = sesion.estado === 'autenticado' ? sesion.usuario.email : ''
  const query = useUsuarioPorEmail(email, sesion.estado === 'autenticado')

  if (sesion.estado === 'cargando') return <Cargando />
  if (sesion.estado !== 'autenticado') return null
  if (query.isPending) return <Cargando />
  if (query.error)
    return <ErrorCarga error={query.error} reintentar={() => void query.refetch()} />

  const user = query.data!
  const roles = sesion.usuario.roles.map((role) =>
    role.startsWith('ROLE_') ? role.slice(5) : role,
  )
  const birthDate = user.birthDate
    ? new Date(`${user.birthDate}T00:00:00`).toLocaleDateString('es-CO')
    : null

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-extrabold">Mi cuenta</h1>
      <Tarjeta className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
            {user.firstName.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold capitalize">
              {user.firstName} {user.lastName}
            </h2>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              @{user.username} · {user.email}
            </p>
            {birthDate && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Nacimiento: {birthDate}
              </p>
            )}
          </div>
        </div>

        <dl className="flex shrink-0 flex-row gap-5 text-[10px] sm:flex-col sm:gap-1 sm:text-right">
          <div className="flex gap-1 sm:justify-end">
            <dt className="text-slate-500 dark:text-slate-400">Rol:</dt>
            <dd>{roles.join(', ') || 'USER'}</dd>
          </div>
          <div className="flex items-center gap-1 sm:justify-end">
            <dt className="text-slate-500 dark:text-slate-400">Estado:</dt>
            <dd>
              <span className={`rounded-full px-2 py-0.5 font-semibold ${user.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                {user.active ? 'Activo' : 'Inactivo'}
              </span>
            </dd>
          </div>
        </dl>
      </Tarjeta>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        {tieneRol('USER') && (
          <Link
            className="inline-flex min-h-9 items-center justify-center gap-2 self-start rounded-lg bg-marca-600 px-3 py-2 text-xs font-semibold text-white hover:bg-marca-700"
            to={RUTAS.misTickets}
          >
            <span aria-hidden="true">▣</span> Ver mis tickets
          </Link>
        )}
        <Boton className="self-start text-xs sm:self-auto" variante="secundario" onClick={cerrarSesion}>
          Cerrar sesión
        </Boton>
      </div>
    </section>
  )
}
