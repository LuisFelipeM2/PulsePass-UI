import type { ComponentProps } from 'react'
import clsx from 'clsx'

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma'

const estilos: Record<Variante, string> = {
  primario: 'bg-marca-600 text-white hover:bg-marca-700',
  secundario:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  peligro: 'bg-red-600 text-white hover:bg-red-700',
  fantasma:
    'text-marca-600 hover:bg-marca-50 dark:text-marca-500 dark:hover:bg-slate-800',
}

interface BotonProps extends ComponentProps<'button'> {
  variante?: Variante
  cargando?: boolean
}

export default function Boton({
  variante = 'primario',
  cargando = false,
  type = 'button',
  disabled,
  className,
  children,
  ...resto
}: BotonProps) {
  return (
    <button
      {...resto}
      type={type}
      disabled={disabled || cargando}
      aria-busy={cargando}
      className={clsx(
        'focus-visible:outline-marca-600 inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500',
        estilos[variante],
        className,
      )}
    >
      {cargando ? 'Cargando…' : children}
    </button>
  )
}
