import { useState } from 'react'
import { Link } from 'react-router'
import { useEvento } from '../funcionalidades/eventos/hooks'
import { RUTAS } from '../lib/rutas'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import Tarjeta from '../componentes/Tarjeta'
import Aviso from '../componentes/Aviso'

export default function AdminEventos() {
  const [code, setCode] = useState('')
  const [buscar, setBuscar] = useState('')
  const query = useEvento(buscar)
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Administración de eventos</h1>
        <Link
          className="bg-marca-600 rounded-xl px-4 py-3 font-semibold text-white"
          to={RUTAS.crearEvento}
        >
          ＋ Nuevo evento
        </Link>
      </div>
      <Tarjeta className="space-y-4 p-5">
        <h2 className="font-bold">Buscar evento por código</h2>
        <form
          className="flex gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            setBuscar(code)
          }}
        >
          <Campo
            etiqueta="Código del evento"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CMF-2026"
          />
          <Boton type="submit">Buscar</Boton>
        </form>
        {query.error && <Aviso tipo="error">{query.error.message}</Aviso>}
        {query.data && (
          <Link
            className="block rounded-xl bg-slate-50 p-4 font-semibold dark:bg-slate-800"
            to={RUTAS.gestionarEvento(query.data.eventCode)}
          >
            {query.data.name} · {query.data.eventCode} →
          </Link>
        )}
      </Tarjeta>
    </div>
  )
}
