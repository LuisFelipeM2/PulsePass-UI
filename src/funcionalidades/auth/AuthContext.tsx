/* eslint react-refresh/only-export-components: off */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import { getSesion, postLogin } from './api'
import type { LoginRequest, Rol, UsuarioSesion } from './tipos'
import { queryClient } from '../../lib/queryClient'
import { getUsuarioPorNombre } from '../usuarios/api'

export type Sesion =
  | { estado: 'cargando' }
  | { estado: 'anonimo' }
  | {
      estado: 'autenticado'
      token: string
      expiraEn: number
      usuario: UsuarioSesion
    }
interface AuthValue {
  sesion: Sesion
  iniciarSesion: (datos: LoginRequest) => Promise<void>
  cerrarSesion: () => void
  tieneRol: (...roles: Rol[]) => boolean
}
type Accion =
  | {
      tipo: 'iniciar'
      token: string
      usuario: UsuarioSesion
      expiraEn: number
    }
  | { tipo: 'cerrar' }
const Contexto = createContext<AuthValue | null>(null)

function reducer(_sesion: Sesion, accion: Accion): Sesion {
  if (accion.tipo === 'cerrar') return { estado: 'anonimo' }
  return {
    estado: 'autenticado',
    token: accion.token,
    usuario: accion.usuario,
    expiraEn: accion.expiraEn,
  }
}

async function cargarUsuarioSesion(): Promise<UsuarioSesion> {
  const usuario = await getSesion()
  if (usuario.email) return { ...usuario, email: usuario.email }
  const perfil = await getUsuarioPorNombre(usuario.username)
  return { ...usuario, email: perfil.email }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, dispatch] = useReducer(
    reducer,
    sessionStorage.getItem('pulsepass-token')
      ? { estado: 'cargando' }
      : { estado: 'anonimo' },
  )
  useEffect(() => {
    const token = sessionStorage.getItem('pulsepass-token')
    if (!token) return
    const cerrar = () => {
      sessionStorage.removeItem('pulsepass-token')
      queryClient.clear()
      dispatch({ tipo: 'cerrar' })
    }
    void cargarUsuarioSesion()
      .then((usuario) =>
        dispatch({
          tipo: 'iniciar',
          token,
          usuario,
          expiraEn: Date.now() + 900_000,
        }),
      )
      .catch(cerrar)
    window.addEventListener('pulsepass:unauthorized', cerrar)
    return () => window.removeEventListener('pulsepass:unauthorized', cerrar)
  }, [])
  useEffect(() => {
    if (sesion.estado !== 'autenticado') return
    const timer = window.setTimeout(
      () => {
        sessionStorage.removeItem('pulsepass-token')
        queryClient.clear()
        dispatch({ tipo: 'cerrar' })
      },
      Math.max(0, sesion.expiraEn - Date.now()),
    )
    return () => window.clearTimeout(timer)
  }, [sesion])
  async function iniciarSesion(datos: LoginRequest) {
    const auth = await postLogin(datos)
    sessionStorage.setItem('pulsepass-token', auth.accessToken)
    try {
      const usuario = await cargarUsuarioSesion()
      dispatch({
        tipo: 'iniciar',
        token: auth.accessToken,
        usuario,
        expiraEn: Date.now() + auth.expiresIn * 1000,
      })
    } catch (error) {
      sessionStorage.removeItem('pulsepass-token')
      throw error
    }
  }
  function cerrarSesion() {
    sessionStorage.removeItem('pulsepass-token')
    queryClient.clear()
    dispatch({ tipo: 'cerrar' })
  }
  function tieneRol(...roles: Rol[]) {
    return (
      sesion.estado === 'autenticado' &&
      sesion.usuario.roles.some((rol) => {
        const rolNormalizado = rol.startsWith('ROLE_') ? rol.slice(5) : rol
        return roles.includes(rolNormalizado as Rol)
      })
    )
  }
  return (
    <Contexto.Provider
      value={{ sesion, iniciarSesion, cerrarSesion, tieneRol }}
    >
      {children}
    </Contexto.Provider>
  )
}

export function useAuth() {
  const value = useContext(Contexto)
  if (!value) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return value
}
