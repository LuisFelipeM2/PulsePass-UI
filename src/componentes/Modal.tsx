import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface ModalProps {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

export default function Modal({
  abierto,
  titulo,
  onCerrar,
  children,
}: ModalProps) {
  const idTitulo = useId()
  const panel = useRef<HTMLDivElement>(null)

  // Al abrir, el foco entra al diálogo; al cerrar, vuelve a donde estaba.
  useEffect(() => {
    if (!abierto) return
    const anterior = document.activeElement
    panel.current?.focus()
    return () => {
      if (anterior instanceof HTMLElement) anterior.focus()
    }
  }, [abierto])

  // Esc cierra el modal y Tab no deja salir el foco del diálogo.
  useEffect(() => {
    if (!abierto) return

    function alPulsar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        onCerrar()
        return
      }
      if (evento.key !== 'Tab' || !panel.current) return

      const enfocables = Array.from(
        panel.current.querySelectorAll<HTMLElement>(ENFOCABLES),
      )
      const primero = enfocables.at(0)
      const ultimo = enfocables.at(-1)
      if (!primero || !ultimo) {
        evento.preventDefault()
        return
      }

      const activo = document.activeElement
      if (evento.shiftKey && (activo === primero || activo === panel.current)) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && activo === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
                className="w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-xl outline-none dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id={idTitulo}
            className="font-titulo text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="focus-visible:outline-marca-600 rounded-lg p-1 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
