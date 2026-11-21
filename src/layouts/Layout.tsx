import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import { RUTAS } from '../lib/rutas'
import MenuUsuario from '../componentes/MenuUsuario'
import SelectorTema, { type PreferenciaTema } from '../componentes/SelectorTema'

export default function Layout() {
  const { sesion, cerrarSesion, tieneRol } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [tema, setTema] = useState<PreferenciaTema>(() => {
    const preferencia = localStorage.getItem('pulsepass-tema')
    return preferencia === 'claro' || preferencia === 'oscuro'
      ? preferencia
      : 'sistema'
  })
  const [sistemaOscuro, setSistemaOscuro] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const oscuro = tema === 'sistema' ? sistemaOscuro : tema === 'oscuro'

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-color-scheme: dark)')
    const actualizarPreferenciaSistema = (event: MediaQueryListEvent) =>
      setSistemaOscuro(event.matches)
    consulta.addEventListener('change', actualizarPreferenciaSistema)
    return () =>
      consulta.removeEventListener('change', actualizarPreferenciaSistema)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro)
  }, [oscuro])

  const cambiarTema = (siguiente: PreferenciaTema) => {
    setTema(siguiente)
    localStorage.setItem('pulsepass-tema', siguiente)
  }

  const links = [
    { to: RUTAS.eventos, label: 'Eventos' },
    { to: RUTAS.artistas, label: 'Artistas' },
    { to: RUTAS.sedes, label: 'Sedes' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-3"
        href="#contenido"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <nav
          aria-label="Principal"
          className="mx-auto flex min-h-12 max-w-6xl items-center justify-between px-4"
        >
          <Link
            className="flex shrink-0 items-center gap-2 text-sm font-extrabold"
            to={RUTAS.inicio}
          >
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-sm text-white">
              ♫
            </span>
            <span>PulsePass</span>
          </Link>
          <button
            className="rounded-md p-2 md:hidden"
            aria-expanded={abierto}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto(!abierto)}
          >
            {abierto ? '×' : '☰'}
          </button>
          <div
            className={`${abierto ? 'flex' : 'hidden'} absolute top-full left-0 w-full flex-col gap-1 border-b border-slate-200 bg-white p-3 md:static md:flex md:w-auto md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 dark:border-slate-800 dark:bg-slate-900`}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                onClick={() => setAbierto(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-xs font-medium ${isActive ? 'bg-indigo-950 text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
            {tieneRol('STAFF', 'ADMIN') && (
              <>
                <NavLink
                  onClick={() => setAbierto(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-xs font-medium ${isActive ? 'bg-indigo-950 text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`
                  }
                  to={RUTAS.validacion}
                >
                  Validar ingreso
                </NavLink>
                <NavLink
                  onClick={() => setAbierto(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-xs font-medium ${isActive ? 'bg-indigo-950 text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`
                  }
                  to={RUTAS.ticketsPagados}
                >
                  Tickets pagados
                </NavLink>
              </>
            )}
            {tieneRol('ADMIN') && (
              <NavLink
                onClick={() => setAbierto(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-xs font-medium ${isActive ? 'bg-indigo-950 text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`
                }
                to={RUTAS.adminEventos}
              >
                Administrar evento
              </NavLink>
            )}
            {sesion.estado === 'autenticado' ? (
              <MenuUsuario
                nombre={sesion.usuario.username}
                esUsuario={tieneRol('USER')}
                tema={tema}
                onCambiarTema={cambiarTema}
                onCerrarSesion={cerrarSesion}
              />
            ) : sesion.estado === 'anonimo' ? (
              <div className="flex items-center gap-2 md:ml-2">
                <SelectorTema
                  className="max-w-28"
                  value={tema}
                  onChange={cambiarTema}
                />
                <Link className="px-2 py-2 text-xs font-medium" to={RUTAS.login}>
                  Ingresar
                </Link>
                <Link className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700" to={RUTAS.registro}>
                  Registrarse
                </Link>
              </div>
            ) : null}
          </div>
        </nav>
      </header>
      <main
        id="contenido"
        className="mx-auto w-full max-w-6xl flex-1 bg-slate-50 px-4 py-8 dark:bg-slate-950"
      >
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 sm:flex-row">
          <span>© {new Date().getFullYear()} PulsePass · Caso de estudio académico</span>
          <span className="flex gap-4">
            <Link className="hover:text-indigo-400" to={RUTAS.sedes}>Sedes</Link>
            <Link className="hover:text-indigo-400" to={RUTAS.artistas}>Artistas</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
