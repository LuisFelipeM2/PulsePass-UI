import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EstadoVacio from '../../componentes/EstadoVacio'

describe('EstadoVacio', () => {
  it('muestra el mensaje y la acción sugerida', () => {
    render(
      <EstadoVacio
        mensaje="Aún no hay eventos publicados"
        accion={<button type="button">Ver artistas</button>}
      />,
    )
    expect(
      screen.getByText('Aún no hay eventos publicados'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ver artistas' }),
    ).toBeInTheDocument()
  })
})
