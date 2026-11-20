import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Boton from '../../componentes/Boton'

describe('Boton', () => {
  it('muestra su texto como botón', () => {
    render(<Boton>Comprar</Boton>)
    expect(screen.getByRole('button', { name: 'Comprar' })).toBeInTheDocument()
  })

  it('con cargando se deshabilita y muestra Cargando…', () => {
    render(<Boton cargando>Comprar</Boton>)
    expect(screen.getByRole('button', { name: 'Cargando…' })).toBeDisabled()
  })
})
