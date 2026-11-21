import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'

export default function ErrorPagina() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-3xl font-bold">Algo salió mal</h1>
      <p className="mt-3 text-slate-500">No pudimos mostrar esta página.</p>
      <Link className="text-marca-600 mt-6 inline-block" to={RUTAS.inicio}>
        Volver al inicio
      </Link>
    </div>
  )
}
