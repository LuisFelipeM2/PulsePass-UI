import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Campo from '../../componentes/Campo'

describe('Campo', () => {
  it('asocia la etiqueta con el campo', () => {
    render(<Campo etiqueta="Correo" />)
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
  })

  it('con error marca el campo como inválido y muestra el mensaje', () => {
    render(<Campo etiqueta="Correo" error="Correo inválido" />)
    const campo = screen.getByLabelText('Correo')
    expect(campo).toBeInvalid()
    expect(campo).toHaveAccessibleDescription('Correo inválido')
    expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido')
  })
})
