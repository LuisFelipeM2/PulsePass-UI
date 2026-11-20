import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Cargando from '../../componentes/Cargando'

describe('Cargando', () => {
  it('se anuncia como ocupado con su mensaje', () => {
    render(<Cargando />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Cargando…')).toBeInTheDocument()
  })
})
