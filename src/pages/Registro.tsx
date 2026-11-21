import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegistrarUsuario } from '../funcionalidades/usuarios/hooks'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import Tarjeta from '../componentes/Tarjeta'
import Aviso from '../componentes/Aviso'

const RegistroSchema = z.object({
  username: z.string().min(3, 'Usa al menos 3 caracteres'),
  email: z.email('Ingresa un correo válido'),
  firstName: z.string().min(1, 'Campo obligatorio'),
  lastName: z.string().min(1, 'Campo obligatorio'),
  birthDate: z
    .string()
    .min(1, 'Campo obligatorio')
    .refine(
      (date) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
        const parsed = new Date(`${date}T00:00:00`)
        return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date
      },
      'Ingresa una fecha válida',
    )
    .refine(
      (date) => {
        const hoy = new Date()
        const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
        return date <= fechaHoy
      },
      'La fecha de nacimiento no puede ser futura',
    ),
  password: z
    .string()
    .min(12, 'Usa al menos 12 caracteres')
    .refine(
      (password) => new TextEncoder().encode(password).length <= 72,
      'La contraseña no puede superar 72 bytes en UTF-8',
    ),
})

function nivelSeguridad(password: string) {
  if (!password) return 0
  return [
    password.length >= 12,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length
}

const coloresSeguridad = [
  'bg-slate-200 dark:bg-slate-700',
  'bg-red-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-emerald-500',
]

export default function Registro() {
  const form = useForm<z.infer<typeof RegistroSchema>>({
    resolver: zodResolver(RegistroSchema),
  })
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const navigate = useNavigate()
  const mutation = useRegistrarUsuario()
  const password = useWatch({
    control: form.control,
    name: 'password',
    defaultValue: '',
  })
  const seguridad = nivelSeguridad(password)

  const registrar = (datos: z.infer<typeof RegistroSchema>) =>
    mutation.mutate(datos, {
      onSuccess: () =>
        navigate(RUTAS.login, { replace: true, state: { registrado: true } }),
      onError: (e) => {
        if (e instanceof ApiError && e.status === 409) {
          setError('El usuario o correo ya está registrado.')
        } else if (e instanceof ApiError && e.status === 400) {
          const campos: Record<string, keyof z.infer<typeof RegistroSchema>> = {
            username: 'username',
            email: 'email',
            firstName: 'firstName',
            firstname: 'firstName',
            first_name: 'firstName',
            lastName: 'lastName',
            lastname: 'lastName',
            last_name: 'lastName',
            birthDate: 'birthDate',
            birthdate: 'birthDate',
            birth_date: 'birthDate',
            password: 'password',
          }
          let errorSinCampo = false
          for (const [nombre, message] of Object.entries(e.details)) {
            const campo = campos[nombre]
            if (campo) form.setError(campo, { type: 'server', message })
            else errorSinCampo = true
          }
          if (!Object.keys(e.details).length || errorSinCampo)
            setError(e.message || 'Revisa los datos ingresados.')
        } else {
          setError(e instanceof Error ? e.message : 'No se pudo crear la cuenta.')
        }
      },
    })

  return (
    <div className="mx-auto w-full py-2" style={{ maxWidth: '24rem' }}>
      <Tarjeta className="w-full space-y-3 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col items-center text-center">
          <span aria-hidden="true" className="mb-1 flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-base text-white">
            ♫
          </span>
          <h1 className="text-base font-extrabold">Crea tu cuenta</h1>
        </div>

        {error && <Aviso tipo="error">{error}</Aviso>}

        <form
          className="grid grid-cols-2 gap-x-2.5 gap-y-2"
          onSubmit={form.handleSubmit((datos) => {
            setError('')
            registrar(datos)
          })}
        >
          <div className="col-span-2">
            <Campo
              className="min-h-9 text-xs"
              etiqueta="Nombre de usuario"
              autoComplete="username"
              required
              error={form.formState.errors.username?.message}
              {...form.register('username')}
            />
          </div>
          <div className="col-span-2">
            <Campo
              className="min-h-9 text-xs"
              etiqueta="Correo electrónico"
              type="email"
              autoComplete="email"
              required
              error={form.formState.errors.email?.message}
              {...form.register('email')}
            />
          </div>
          <Campo
            className="min-h-9 text-xs"
            etiqueta="Nombre"
            autoComplete="given-name"
            required
            error={form.formState.errors.firstName?.message}
            {...form.register('firstName')}
          />
          <Campo
            className="min-h-9 text-xs"
            etiqueta="Apellido"
            autoComplete="family-name"
            required
            error={form.formState.errors.lastName?.message}
            {...form.register('lastName')}
          />
          <div className="col-span-2">
            <Campo
              className="min-h-9 text-xs"
              etiqueta="Fecha de nacimiento"
              type="date"
              autoComplete="bday"
              required
              error={form.formState.errors.birthDate?.message}
              {...form.register('birthDate')}
            />
          </div>
          <div className="relative col-span-2">
            <Campo
              className="min-h-9 pr-10 text-xs"
              etiqueta="Contraseña (mín. 12 caracteres)"
              type={mostrarPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              error={form.formState.errors.password?.message}
              {...form.register('password')}
            />
            <button
              aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={mostrarPassword}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:hover:bg-slate-800"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              style={{ position: 'absolute', right: '0.5rem', top: '1.75rem' }}
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                {mostrarPassword ? (
                  <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 002.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.6 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.2 0 2.3-.2 3.3-.7" /></>
                ) : (
                  <><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="2.5" /></>
                )}
              </svg>
            </button>
            {password && (
              <div className="mt-2" aria-live="polite">
                <div className="flex gap-1" aria-hidden="true">
                  {[1, 2, 3, 4].map((nivel) => (
                    <span className={`h-1 flex-1 rounded ${nivel <= seguridad ? coloresSeguridad[seguridad] : 'bg-slate-200 dark:bg-slate-700'}`} key={nivel} />
                  ))}
                </div>
                <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                  Seguridad: {['', 'Débil', 'Media', 'Buena', 'Fuerte'][seguridad]}
                  {' · '}Máximo 72 bytes UTF-8.
                </p>
              </div>
            )}
          </div>
          <Boton
            type="submit"
            className="col-span-2 min-h-9"
            cargando={mutation.isPending}
          >
            Crear cuenta
          </Boton>
        </form>

        <p className="text-center text-[10px] text-slate-500 dark:text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <Link className="font-semibold text-marca-600 hover:underline dark:text-indigo-300" to={RUTAS.login}>
            Inicia sesión
          </Link>
        </p>
      </Tarjeta>
    </div>
  )
}
