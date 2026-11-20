import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PrecioCOP from '../../componentes/PrecioCOP'

describe('PrecioCOP', () => {
  it('muestra el valor en pesos colombianos', () => {
    render(<PrecioCOP valor={250000} />)
    expect(screen.getByText(/250\.000/)).toBeInTheDocument()
  })
})
