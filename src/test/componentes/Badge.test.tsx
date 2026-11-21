import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Badge from '../../componentes/Badge'

describe('Badge', () => {
  it('muestra el estado con el color de su tono', () => {
    render(<Badge tono="PAID" />)
    expect(screen.getByText('PAID')).toHaveClass('bg-emerald-100')
  })
})
