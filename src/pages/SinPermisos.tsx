import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'

export default function SinPermisos() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="text-marca-600 text-7xl font-black">403</p>
      <h1 className="mt-4 text-3xl font-bold">
        No tienes permiso para ver esta página
      </h1>
      <p className="mt-3 text-slate-500">
        Si crees que esto es un error, contacta a quien administra PulsePass.
      </p>
      <Link
        className="bg-marca-600 mt-6 inline-block rounded-lg px-5 py-3 font-semibold text-white"
        to={RUTAS.inicio}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
