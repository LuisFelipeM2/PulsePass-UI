import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'
import Boton from './Boton'
import SelectorTema, { type PreferenciaTema } from './SelectorTema'

interface MenuUsuarioProps {
  nombre: string
  esUsuario: boolean
  tema: PreferenciaTema
  onCambiarTema: (tema: PreferenciaTema) => void
  onCerrarSesion: () => void
}

export default function MenuUsuario({
  nombre,
  esUsuario,
  tema,
  onCambiarTema,
  onCerrarSesion,
}: MenuUsuarioProps) {
  return (
    <details className="group relative md:ml-2">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 px-2 py-1 text-xs dark:border-slate-700">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-950 text-[10px] text-indigo-300">
          {nombre.slice(0, 1).toUpperCase()}
        </span>
        {nombre}
        <span aria-hidden="true">⌄</span>
      </summary>
      <div className="absolute right-0 z-40 mt-2 flex min-w-44 flex-col rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <Link className="rounded px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800" to={RUTAS.cuenta}>
          Mi cuenta
        </Link>
        {esUsuario && (
          <Link className="rounded px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800" to={RUTAS.misTickets}>
            Mis tickets
          </Link>
        )}
        <label className="flex items-center justify-between gap-3 rounded px-3 py-2 text-xs">
          <span>Tema</span>
          <SelectorTema value={tema} onChange={onCambiarTema} />
        </label>
        <Boton className="justify-start px-3" variante="fantasma" onClick={onCerrarSesion}>
          Salir
        </Boton>
      </div>
    </details>
  )
}
