import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '../funcionalidades/auth/hooks'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import Tarjeta from '../componentes/Tarjeta'
import Aviso from '../componentes/Aviso'

const LoginSchema = z.object({
  identifier: z.string().min(1, 'Ingresa tu usuario o correo'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const registrado = Boolean(
    (location.state as { registrado?: boolean } | null)?.registrado,
  )
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  })
  const mutation = useLogin()

  const alIniciar = (datos: z.infer<typeof LoginSchema>) =>
    mutation.mutate(datos, {
      onSuccess: () => {
        const destino = (
          location.state as { desde?: { pathname?: string } } | null
        )?.desde?.pathname
        navigate(destino || RUTAS.inicio, { replace: true })
      },
      onError: (e) => {
        if (e instanceof ApiError && e.status === 401) {
          setError('Credenciales inválidas. Inténtalo de nuevo.')
        } else if (e instanceof ApiError && e.status === 400) {
          setError('Revisa los datos ingresados e inténtalo de nuevo.')
        } else {
          setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.')
        }
      },
    })

  return (
    <div className="mx-auto w-full py-2" style={{ maxWidth: '24rem' }}>
      <Tarjeta className="w-full space-y-3 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col items-center text-center">
          <span aria-hidden="true" className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-lg text-white">
            ♫
          </span>
          <h1 className="text-lg font-extrabold">Inicia sesión</h1>
        </div>

        {registrado && (
          <Aviso tipo="exito">Cuenta creada, inicia sesión.</Aviso>
        )}
        {error && <Aviso tipo="error">{error}</Aviso>}

        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((data) => {
            setError('')
            alIniciar(data)
          })}
        >
          <Campo
            etiqueta="Usuario o correo"
            autoComplete="username"
            error={form.formState.errors.identifier?.message}
            {...form.register('identifier')}
          />
          <div className="relative">
            <Campo
              etiqueta="Contraseña"
              type={mostrarPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="pr-11"
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
              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                {mostrarPassword ? (
                  <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 002.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.6 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.2 0 2.3-.2 3.3-.7" /></>
                ) : (
                  <><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="2.5" /></>
                )}
              </svg>
            </button>
          </div>
          <Boton type="submit" className="w-full" cargando={mutation.isPending}>
            Ingresar
          </Boton>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          ¿No tienes cuenta?{' '}
          <Link className="font-semibold text-marca-600 hover:underline dark:text-indigo-300" to={RUTAS.registro}>
            Regístrate
          </Link>
        </p>
      </Tarjeta>
    </div>
  )
}
