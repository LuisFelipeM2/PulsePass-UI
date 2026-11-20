import type { ReactNode } from 'react'

interface Columna<T> {
  encabezado: string
  celda: (fila: T) => ReactNode
}

interface TablaProps<T> {
  columnas: Columna<T>[]
  filas: T[]
  clave: (fila: T) => string | number
}

export default function Tabla<T>({ columnas, filas, clave }: TablaProps<T>) {
  return (
    <table className="block w-full text-left text-sm text-slate-900 md:table dark:text-slate-100">
      <thead className="hidden border-b border-slate-200 text-slate-600 md:table-header-group dark:border-slate-800 dark:text-slate-400">
        <tr>
          {columnas.map((columna) => (
            <th
              key={columna.encabezado}
              scope="col"
              className="px-4 py-3 font-semibold"
            >
              {columna.encabezado}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block space-y-3 md:table-row-group md:space-y-0">
        {filas.map((fila) => (
          <tr
            key={clave(fila)}
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:bg-transparent md:p-0 md:shadow-none dark:border-slate-800 dark:bg-slate-900"
          >
            {columna_celdas(columnas, fila)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function columna_celdas<T>(columnas: Columna<T>[], fila: T) {
  return columnas.map((columna) => (
    <td
      key={columna.encabezado}
      data-label={columna.encabezado}
      className="block py-1 before:mr-2 before:font-medium before:text-slate-500 before:content-[attr(data-label)] md:table-cell md:px-4 md:py-3 md:before:content-none"
    >
      {columna.celda(fila)}
    </td>
  ))
}
