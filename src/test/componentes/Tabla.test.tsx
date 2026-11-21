import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Tabla from '../../componentes/Tabla'

interface Fila {
  codigo: string
  titular: string
}

const filas: Fila[] = [
  { codigo: 'TKT-1', titular: 'Andrea' },
  { codigo: 'TKT-2', titular: 'Carlos' },
]

describe('Tabla', () => {
  it('muestra los encabezados y una fila por elemento', () => {
    render(
      <Tabla
        columnas={[
          { encabezado: 'Código', celda: (fila) => fila.codigo },
          { encabezado: 'Titular', celda: (fila) => fila.titular },
        ]}
        filas={filas}
        clave={(fila) => fila.codigo}
      />,
    )
    expect(
      screen.getByRole('columnheader', { name: 'Código' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: /TKT-1/ })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: /Carlos/ })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })
})
