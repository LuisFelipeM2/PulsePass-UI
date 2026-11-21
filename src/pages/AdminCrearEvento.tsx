import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EventCategorySchema } from '../funcionalidades/eventos/tipos'
import { useCrearEvento } from '../funcionalidades/eventos/hooks'
import { useSedesActivas } from '../funcionalidades/sedes/hooks'
import { RUTAS } from '../lib/rutas'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import Selector from '../componentes/Selector'
import Tarjeta from '../componentes/Tarjeta'
import Aviso from '../componentes/Aviso'
const categorias = EventCategorySchema.options
const CrearEventoSchema = z.object({
  eventCode: z.string().min(1, 'Campo obligatorio'),
  name: z.string().min(1, 'Campo obligatorio'),
  description: z.string().max(500),
  category: EventCategorySchema,
  eventDate: z.string().min(1, 'Campo obligatorio'),
  minimumAge: z.coerce.number().int().min(0),
  venueCode: z.string().min(1, 'Selecciona una sede'),
})

export default function AdminCrearEvento() {
  const form = useForm<
    z.input<typeof CrearEventoSchema>,
    unknown,
    z.output<typeof CrearEventoSchema>
  >({
    resolver: zodResolver(CrearEventoSchema),
    defaultValues: { category: 'MUSIC', description: '', minimumAge: 0 },
  })
  const venues = useSedesActivas()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const create = useCrearEvento()
  const crear = (data: z.output<typeof CrearEventoSchema>) =>
    create.mutate(data, {
      onSuccess: (event) => navigate(RUTAS.gestionarEvento(event.eventCode)),
      onError: (e) =>
        setError(
          e instanceof Error ? e.message : 'No se pudo crear el evento.',
        ),
    })
  return (
    <div className="mx-auto max-w-2xl">
      <Tarjeta className="space-y-5 p-7">
        <Link className="text-marca-600 text-sm" to={RUTAS.adminEventos}>
          ← Administración
        </Link>
        <h1 className="text-3xl font-bold">Crear evento</h1>
        {error && <Aviso tipo="error">{error}</Aviso>}
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={form.handleSubmit((d) => {
            setError('')
            crear(d)
          })}
        >
          <Campo
            etiqueta="Código"
            error={form.formState.errors.eventCode?.message}
            {...form.register('eventCode')}
          />
          <Campo
            etiqueta="Nombre del evento"
            error={form.formState.errors.name?.message}
            {...form.register('name')}
          />
          <Selector
            etiqueta="Categoría"
            error={form.formState.errors.category?.message}
            {...form.register('category')}
          >
            {categorias.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Selector>
          <Campo
            etiqueta="Fecha y hora"
            type="datetime-local"
            error={form.formState.errors.eventDate?.message}
            {...form.register('eventDate')}
          />
          <Campo
            etiqueta="Edad mínima"
            type="number"
            error={form.formState.errors.minimumAge?.message}
            {...form.register('minimumAge')}
          />
          <Selector
            etiqueta="Sede"
            error={form.formState.errors.venueCode?.message}
            {...form.register('venueCode')}
          >
            <option value="">Selecciona una sede</option>
            {venues.data?.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name} · {v.city}
              </option>
            ))}
          </Selector>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Descripción</span>
            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-300 bg-transparent p-3"
              maxLength={500}
              {...form.register('description')}
            />
          </label>
          <Boton
            className="sm:col-span-2"
            type="submit"
            cargando={create.isPending}
          >
            Crear evento
          </Boton>
        </form>
      </Tarjeta>
    </div>
  )
}
