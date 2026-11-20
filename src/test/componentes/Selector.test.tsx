import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Selector from '../../componentes/Selector'

describe('Selector', () => {
  it('asocia la etiqueta con la lista y muestra sus opciones', () => {
    render(
      <Selector etiqueta="Categoría">
        <option value="MUSIC">MUSIC</option>
      </Selector>,
    )
    expect(
      screen.getByRole('combobox', { name: 'Categoría' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'MUSIC' })).toBeInTheDocument()
  })
})
