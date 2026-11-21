import type { ReactNode } from 'react'
import Tarjeta from './Tarjeta'

interface EstadoVacioProps {
  mensaje: string
  accion?: ReactNode
}

export default function EstadoVacio({ mensaje, accion }: EstadoVacioProps) {
  return (
    <Tarjeta className="flex flex-col items-center gap-3 p-8 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 text-slate-500"
      >
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
      <p className="font-semibold text-slate-900 dark:text-slate-100">
        {mensaje}
      </p>
      {accion}
    </Tarjeta>
  )
}
