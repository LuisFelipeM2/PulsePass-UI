import { useId, type ComponentProps } from 'react'
import clsx from 'clsx'

interface SelectorProps extends ComponentProps<'select'> {
  etiqueta: string
  error?: string
}

export default function Selector({
  etiqueta,
  error,
  id,
  className,
  children,
  ...resto
}: SelectorProps) {
  const idGenerado = useId()
  const idCampo = id ?? idGenerado
  const idError = `${idCampo}-error`

  return (
    <div>
      <label
        htmlFor={idCampo}
        className="mb-1 block text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        {etiqueta}
      </label>
      <select
        {...resto}
        id={idCampo}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        className={clsx(
          'focus-visible:outline-marca-600 block min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-slate-900 dark:text-slate-100',
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700',
          className,
        )}
      >
        {children}
      </select>
      {error && (
        <p
          id={idError}
          role="alert"
          className="mt-1 text-sm text-red-700 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  )
}
