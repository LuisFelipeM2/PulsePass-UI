import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Tarjeta from '../../componentes/Tarjeta'

describe('Tarjeta', () => {
  it('muestra su contenido', () => {
    render(<Tarjeta>Contenido</Tarjeta>)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })
})
