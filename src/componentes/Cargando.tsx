interface CargandoProps {
  mensaje?: string
}

export default function Cargando({ mensaje = 'Cargando…' }: CargandoProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="animate-pulse space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="h-24 rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
      <span className="sr-only">{mensaje}</span>
    </div>
  )
}
