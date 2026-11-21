import { useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  useEvento,
  usePublicarEvento,
  useAsociarArtista,
} from '../funcionalidades/eventos/hooks'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import { RUTAS } from '../lib/rutas'
import Boton from '../componentes/Boton'
import Selector from '../componentes/Selector'
import Tarjeta from '../componentes/Tarjeta'
import Badge from '../componentes/Badge'
import Aviso from '../componentes/Aviso'
import Cargando from '../componentes/Cargando'
import { ErrorCarga } from './compartidos'

export default function AdminGestionEvento() {
  const { eventCode = '' } = useParams()
  const [artist, setArtist] = useState('')
  const [message, setMessage] = useState('')
  const event = useEvento(eventCode)
  const artists = useArtistasActivos()
  const publish = usePublicarEvento(eventCode)
  const publicar = () =>
    publish.mutate(undefined, {
      onError: (e) =>
        setMessage(e instanceof Error ? e.message : 'No se pudo publicar.'),
    })
  const associate = useAsociarArtista(eventCode)
  const asociar = () =>
    associate.mutate(Number(artist), {
      onSuccess: () => {
        setMessage('Artista asociado.')
      },
      onError: (e) =>
        setMessage(e instanceof Error ? e.message : 'No se pudo asociar.'),
    })
  if (event.isPending) return <Cargando />
  if (event.error)
    return (
      <ErrorCarga error={event.error} reintentar={() => void event.refetch()} />
    )
  const data = event.data!
  return (
    <div className="space-y-6">
      <Link className="text-marca-600" to={RUTAS.adminEventos}>
        ← Eventos
      </Link>
      <Tarjeta className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{data.eventCode}</p>
            <h1 className="text-3xl font-bold">{data.name}</h1>
          </div>
          <Badge tono={data.status} />
        </div>
        {message && <Aviso tipo="info">{message}</Aviso>}
        <div className="flex flex-wrap gap-3">
          <Boton
            onClick={publicar}
            cargando={publish.isPending}
            disabled={data.status !== 'DRAFT'}
          >
            Publicar evento
          </Boton>
          <Link
            className="rounded-lg border px-4 py-2"
            to={RUTAS.ticketsEvento(eventCode)}
          >
            Tickets pagados
          </Link>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Artistas</h2>
          <div className="flex flex-wrap gap-2">
            {data.artists.map((a) => (
              <span
                className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800"
                key={a.id}
              >
                {a.stageName}
              </span>
            ))}
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              asociar()
            }}
          >
            <Selector
              etiqueta="Asociar artista"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            >
              <option value="">Selecciona un artista</option>
              {artists.data?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.stageName}
                </option>
              ))}
            </Selector>
            <Boton
              type="submit"
              disabled={!artist}
              cargando={associate.isPending}
            >
              Asociar
            </Boton>
          </form>
        </div>
      </Tarjeta>
    </div>
  )
}
