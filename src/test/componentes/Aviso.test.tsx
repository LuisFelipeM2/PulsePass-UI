import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Aviso from '../../componentes/Aviso'

afterEach(() => {
  vi.useRealTimers()
})

describe('Aviso', () => {
  it('un error se anuncia como alerta', () => {
    render(<Aviso tipo="error">Algo falló</Aviso>)
    expect(screen.getByRole('alert')).toHaveTextContent('Algo falló')
  })

  it('un éxito se anuncia como estado', () => {
    render(<Aviso tipo="exito">Cuenta creada</Aviso>)
    expect(screen.getByRole('status')).toHaveTextContent('Cuenta creada')
  })

  it('el botón cerrar llama a onCerrar', async () => {
    const onCerrar = vi.fn()
    const usuario = userEvent.setup()
    render(
      <Aviso tipo="info" onCerrar={onCerrar}>
        Tu sesión expiró
      </Aviso>,
    )
    await usuario.click(screen.getByRole('button', { name: 'Cerrar aviso' }))
    expect(onCerrar).toHaveBeenCalledTimes(1)
  })

  it('un aviso de éxito se cierra solo a los 4 segundos', () => {
    vi.useFakeTimers()
    const onCerrar = vi.fn()
    render(
      <Aviso tipo="exito" onCerrar={onCerrar}>
        Listo
      </Aviso>,
    )
    vi.advanceTimersByTime(4000)
    expect(onCerrar).toHaveBeenCalledTimes(1)
  })

  it('un error no se cierra solo', () => {
    vi.useFakeTimers()
    const onCerrar = vi.fn()
    render(
      <Aviso tipo="error" onCerrar={onCerrar}>
        Falló
      </Aviso>,
    )
    vi.advanceTimersByTime(10000)
    expect(onCerrar).not.toHaveBeenCalled()
  })
})
