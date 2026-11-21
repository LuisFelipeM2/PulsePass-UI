import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'

export default function NoEncontrada() {
  return (
    <div className="py-16 text-center">
      <p className="text-marca-600 text-7xl font-black">404</p>
      <h1 className="mt-4 text-3xl font-bold">No encontramos esta página</h1>
      <Link className="text-marca-600 mt-6 inline-block" to={RUTAS.inicio}>
        Volver al inicio
      </Link>
    </div>
  )
}
