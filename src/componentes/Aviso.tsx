import { useEffect, type ReactNode } from 'react'
import clsx from 'clsx'

type Tipo = 'exito' | 'error' | 'info' | 'advertencia'

const estilos: Record<Tipo, string> = {
  exito: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-marca-500/30 bg-marca-50 text-marca-700',
  advertencia: 'border-amber-200 bg-amber-50 text-amber-800',
}

function Icono({ tipo }: { tipo: Tipo }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 size-5 shrink-0"
    >
      {tipo === 'exito' && <path d="M20 6 9 17l-5-5" />}
      {tipo === 'info' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </>
      )}
      {(tipo === 'error' || tipo === 'advertencia') && (
        <>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4M12 17h.01" />
        </>
      )}
    </svg>
  )
}

interface AvisoProps {
  tipo: Tipo
  children: ReactNode
  onCerrar?: () => void
  className?: string
}

export default function Aviso({
  tipo,
  children,
  onCerrar,
  className,
}: AvisoProps) {
  // Un aviso de éxito desaparece solo a los 4 segundos.
  useEffect(() => {
    if (tipo !== 'exito' || !onCerrar) return
    const temporizador = setTimeout(onCerrar, 4000)
    return () => clearTimeout(temporizador)
  }, [tipo, onCerrar])

  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      className={clsx(
        'flex items-start gap-3 rounded-lg border p-3 text-sm',
        estilos[tipo],
        className,
      )}
    >
      <Icono tipo={tipo} />
      <div className="flex-1">{children}</div>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar aviso"
          className="focus-visible:outline-marca-600 rounded p-0.5 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
