export type PreferenciaTema = 'sistema' | 'claro' | 'oscuro'

interface SelectorTemaProps {
  value: PreferenciaTema
  onChange: (value: PreferenciaTema) => void
  className?: string
}

export default function SelectorTema({
  value,
  onChange,
  className = '',
}: SelectorTemaProps) {
  return (
    <select
      aria-label="Tema de color"
      className={`rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${className}`}
      value={value}
      onChange={(event) => onChange(event.target.value as PreferenciaTema)}
    >
      <option value="sistema">Sistema</option>
      <option value="claro">Claro</option>
      <option value="oscuro">Oscuro</option>
    </select>
  )
}
