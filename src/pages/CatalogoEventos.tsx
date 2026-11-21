import { useSearchParams } from 'react-router'
import { useEventosCatalogo } from '../funcionalidades/eventos/hooks'
import { EventCategorySchema } from '../funcionalidades/eventos/tipos'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import Campo from '../componentes/Campo'
import Selector from '../componentes/Selector'
import Boton from '../componentes/Boton'
import { EstadoLista, GridEventos } from './compartidos'

const categorias = EventCategorySchema.options

export default function CatalogoEventos() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const categoria = params.get('categoria') ?? ''
  const artista = params.get('artista') ?? ''
  const query = useEventosCatalogo(artista)
  const artistas = useArtistasActivos()
  const filtrados = (query.data ?? []).filter(
    (event) =>
      (!q || `${event.name} ${event.venueName}`.toLowerCase().includes(q.toLowerCase())) &&
      (!categoria || event.category === categoria),
  )
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }
  const limpiar = () => {
    const next = new URLSearchParams(params)
    next.delete('q')
    next.delete('categoria')
    next.delete('artista')
    setParams(next)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Cartelera</h1>
      <div className="grid items-end gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(150px,.8fr)_minmax(150px,.8fr)_auto]">
        <Campo
          etiqueta="Buscar por nombre"
          value={q}
          onChange={(e) => update('q', e.target.value)}
          placeholder="⌕  Buscar por nombre..."
          className="min-h-9 text-xs"
        />
        <Selector
          etiqueta="Categoría"
          value={categoria}
          onChange={(e) => update('categoria', e.target.value)}
          className="min-h-9 py-1 text-xs"
        >
          <option value="">Todas</option>
          {categorias.map((x) => <option key={x}>{x}</option>)}
        </Selector>
        <Selector
          etiqueta="Artista"
          value={artista}
          onChange={(e) => update('artista', e.target.value)}
          className="min-h-9 py-1 text-xs"
        >
          <option value="">Todos</option>
          {(artistas.data ?? []).map((x) => (
            <option key={x.id} value={x.stageName}>{x.stageName}</option>
          ))}
        </Selector>
        <Boton
          className="min-h-9 px-3 text-xs"
          variante="secundario"
          onClick={limpiar}
        >
          Limpiar
        </Boton>
      </div>
      <p aria-live="polite" className="text-xs text-slate-500 dark:text-slate-400">
        {query.isPending ? 'Cargando eventos…' : `${filtrados.length} ${filtrados.length === 1 ? 'evento' : 'eventos'}`}
      </p>
      <EstadoLista
        data={filtrados}
        isPending={query.isPending}
        error={query.error}
        refetch={query.refetch}
        empty="No hay eventos que coincidan con estos filtros."
      >
        {(items) => <GridEventos eventos={items} />}
      </EstadoLista>
    </div>
  )
}
