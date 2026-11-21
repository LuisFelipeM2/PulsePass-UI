import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../funcionalidades/auth/AuthContext'
import Cargando from '../componentes/Cargando'
import { RUTAS } from '../lib/rutas'
import type { Rol } from '../funcionalidades/auth/tipos'

export function RutaProtegida() {
  const { sesion } = useAuth(); const location = useLocation()
  if (sesion.estado === 'cargando') return <Cargando />
  return sesion.estado === 'autenticado' ? <Outlet /> : <Navigate to={RUTAS.login} replace state={{ desde: location }} />
}
export function RutaPorRol({ roles }: { roles: Rol[] }) {
  const { sesion, tieneRol } = useAuth()
  if (sesion.estado === 'cargando') return <Cargando />
  return sesion.estado === 'autenticado' && tieneRol(...roles) ? <Outlet /> : <Navigate to={RUTAS.sinPermisos} replace />
}
export function SoloAnonimo() { const { sesion } = useAuth(); if (sesion.estado === 'cargando') return <Cargando />; return sesion.estado === 'autenticado' ? <Navigate to={RUTAS.inicio} replace /> : <Outlet /> }
