import { useId, type ComponentProps } from 'react'
import clsx from 'clsx'

interface CampoProps extends ComponentProps<'input'> { etiqueta: string; error?: string }
export default function Campo({ etiqueta, error, id, className, ...props }: CampoProps) {
  const generatedId = useId(); const fieldId = id ?? generatedId; const errorId = `${fieldId}-error`
  return <div><label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-slate-900 dark:text-slate-100">{etiqueta}</label><input {...props} id={fieldId} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} className={clsx('focus-visible:outline-marca-600 block min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-slate-900 dark:text-slate-100', error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700', className)}/>{error && <p id={errorId} role="alert" className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>}</div>
}
