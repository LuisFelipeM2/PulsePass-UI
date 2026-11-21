import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Modal from '../../componentes/Modal'

describe('Modal', () => {
  it('no muestra nada si está cerrado', () => {
    render(
      <Modal abierto={false} titulo="Confirmar compra" onCerrar={() => {}}>
        Contenido
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('abierto muestra el diálogo con su título', () => {
    render(
      <Modal abierto titulo="Confirmar compra" onCerrar={() => {}}>
        Contenido
      </Modal>,
    )
    expect(
      screen.getByRole('dialog', { name: 'Confirmar compra' }),
    ).toBeInTheDocument()
  })

  it('se cierra con Esc', async () => {
    const onCerrar = vi.fn()
    const usuario = userEvent.setup()
    render(
      <Modal abierto titulo="Confirmar compra" onCerrar={onCerrar}>
        Contenido
      </Modal>,
    )
    await usuario.keyboard('{Escape}')
    expect(onCerrar).toHaveBeenCalledTimes(1)
  })

  it('lleva el foco al diálogo y lo mantiene dentro al tabular', async () => {
    const usuario = userEvent.setup()
    render(
      <Modal abierto titulo="Confirmar compra" onCerrar={() => {}}>
        <button type="button">Aceptar</button>
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveFocus()

    await usuario.tab()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus()
    await usuario.tab()
    expect(screen.getByRole('button', { name: 'Aceptar' })).toHaveFocus()
    await usuario.tab()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus()
  })
})
