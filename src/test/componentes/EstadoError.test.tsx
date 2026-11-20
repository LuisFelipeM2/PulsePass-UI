import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import EstadoError from '../../componentes/EstadoError'

describe('EstadoError', () => {
  it('muestra el mensaje de error y reintenta al pulsar el botón', async () => {
    const onReintentar = vi.fn()
    const usuario = userEvent.setup()
    render(
      <EstadoError
        mensaje="No pudimos conectar con el servidor."
        onReintentar={onReintentar}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'No pudimos conectar con el servidor.',
    )
    await usuario.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onReintentar).toHaveBeenCalledTimes(1)
  })

  it('sin onReintentar no muestra el botón', () => {
    render(<EstadoError mensaje="Falló" />)
    expect(
      screen.queryByRole('button', { name: 'Reintentar' }),
    ).not.toBeInTheDocument()
  })
})
