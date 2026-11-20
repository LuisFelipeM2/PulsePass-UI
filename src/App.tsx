import { useState } from 'react'
import Aviso from './componentes/Aviso'
import Badge from './componentes/Badge'
import Boton from './componentes/Boton'
import Campo from './componentes/Campo'
import Cargando from './componentes/Cargando'
import EstadoError from './componentes/EstadoError'
import EstadoVacio from './componentes/EstadoVacio'
import Modal from './componentes/Modal'
import PrecioCOP from './componentes/PrecioCOP'
import Selector from './componentes/Selector'
import Tabla from './componentes/Tabla'
import Tarjeta from './componentes/Tarjeta'

interface Ticket {
  codigo: string
  tipo: string
  precio: number
}

const tickets: Ticket[] = [
  { codigo: 'TKT-8F2A1C', tipo: 'VIP', precio: 250000 },
  { codigo: 'TKT-91B07D', tipo: 'GENERAL', precio: 120000 },
]

export default function App() {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="font-titulo text-marca-600 text-3xl font-bold">
        Sistema visual
      </h1>

      <Tarjeta className="space-y-4 p-4">
        <div className="flex flex-wrap gap-3">
          <Boton>Primario</Boton>
          <Boton variante="secundario">Secundario</Boton>
          <Boton variante="peligro">Peligro</Boton>
          <Boton variante="fantasma">Fantasma</Boton>
          <Boton cargando>Comprar</Boton>
          <Boton variante="secundario" onClick={() => setModalAbierto(true)}>
            Abrir modal
          </Boton>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tono="DRAFT" />
          <Badge tono="PUBLISHED" />
          <Badge tono="SOLD_OUT" />
          <Badge tono="CANCELLED" />
          <Badge tono="FINISHED" />
          <Badge tono="RESERVED" />
          <Badge tono="PAID" />
          <Badge tono="USED" />
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Precio: <PrecioCOP valor={250000} />
        </p>
      </Tarjeta>

      <Tarjeta className="grid gap-4 p-4 sm:grid-cols-2">
        <Campo etiqueta="Campo normal" placeholder="Texto" />
        <Campo etiqueta="Campo con error" error="Este campo es obligatorio" />
        <Selector etiqueta="Categoría">
          <option>MUSIC</option>
          <option>SPORTS</option>
        </Selector>
      </Tarjeta>

      <div className="grid gap-3 sm:grid-cols-2">
        <Aviso tipo="exito">Cuenta creada, inicia sesión.</Aviso>
        <Aviso tipo="error">
          El ticket no puede cancelarse en su estado actual.
        </Aviso>
        <Aviso tipo="info">Tu sesión expiró. Inicia sesión de nuevo.</Aviso>
        <Aviso tipo="advertencia">El ticket ya fue utilizado.</Aviso>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Cargando />
        <EstadoVacio
          mensaje="Aún no hay eventos publicados"
          accion={<Boton variante="secundario">Ver artistas</Boton>}
        />
        <EstadoError
          mensaje="No pudimos conectar con el servidor."
          onReintentar={() => {}}
        />
      </div>

      <Tarjeta className="p-4">
        <Tabla
          columnas={[
            {
              encabezado: 'Código',
              celda: (ticket) => (
                <span className="font-mono">{ticket.codigo}</span>
              ),
            },
            { encabezado: 'Tipo', celda: (ticket) => ticket.tipo },
            {
              encabezado: 'Precio',
              celda: (ticket) => <PrecioCOP valor={ticket.precio} />,
            },
            { encabezado: 'Estado', celda: () => <Badge tono="PAID" /> },
          ]}
          filas={tickets}
          clave={(ticket) => ticket.codigo}
        />
      </Tarjeta>

      <Modal
        abierto={modalAbierto}
        titulo="Confirmar compra"
        onCerrar={() => setModalAbierto(false)}
      >
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          Evento: Caribbean Music Fest 2026 · Tipo: VIP
        </p>
        <Aviso tipo="error" className="mb-4">
          El usuario no cumple la edad mínima del evento.
        </Aviso>
        <div className="flex justify-end gap-3">
          <Boton variante="secundario" onClick={() => setModalAbierto(false)}>
            Cancelar
          </Boton>
          <Boton>Confirmar</Boton>
        </div>
      </Modal>
     </main>
    </div>
  )
}
