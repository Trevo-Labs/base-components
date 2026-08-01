import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect, afterEach } from 'vitest'

import BaseConfirmModal from './base-confirm-modal.vue'
import { useConfirm } from '@/composables/use-confirm'

const { current, requestConfirm, resolveConfirm } = useConfirm()

afterEach(() => {
  // Limpia el estado compartido del composable para no filtrar entre tests
  if (current.value) resolveConfirm(false)
})

describe('BaseConfirmModal', () => {
  it('no renderiza el diálogo cuando no hay ninguna petición de confirmación pendiente', () => {
    const { queryByRole } = render(BaseConfirmModal)
    expect(queryByRole('dialog')).toBeNull()
  })

  it('renderiza el título y el mensaje de la petición actual', () => {
    requestConfirm({ title: '¿Eliminar paciente?', message: 'Esta acción no se puede deshacer' })

    const { getByRole, getByText } = render(BaseConfirmModal)

    expect(getByRole('dialog')).toBeTruthy()
    expect(getByText('¿Eliminar paciente?')).toBeTruthy()
    expect(getByText('Esta acción no se puede deshacer')).toBeTruthy()
  })

  it('no renderiza el mensaje cuando no se especifica', () => {
    requestConfirm({ title: '¿Continuar?' })

    const { container } = render(BaseConfirmModal)

    expect(container.querySelector('.confirm-message')).toBeNull()
  })

  it('usa los textos por defecto de los botones cuando no se especifican', () => {
    requestConfirm({ title: 'Confirmar acción' })

    const { getByRole } = render(BaseConfirmModal)

    expect(getByRole('button', { name: 'Cancelar' })).toBeTruthy()
    expect(getByRole('button', { name: 'Confirmar' })).toBeTruthy()
  })

  it('usa los textos personalizados de los botones cuando se especifican', () => {
    requestConfirm({ title: 'Borrar cobro', confirmText: 'Sí, borrar', cancelText: 'No, volver' })

    const { getByRole } = render(BaseConfirmModal)

    expect(getByRole('button', { name: 'Sí, borrar' })).toBeTruthy()
    expect(getByRole('button', { name: 'No, volver' })).toBeTruthy()
  })

  it('aplica la variante "primary" al botón de confirmar por defecto', () => {
    requestConfirm({ title: 'Guardar cambios' })

    const { getByRole } = render(BaseConfirmModal)
    const confirmButton = getByRole('button', { name: 'Confirmar' })

    expect(confirmButton.classList.contains('base-button--primary')).toBe(true)
  })

  it('aplica la variante "danger" al botón de confirmar cuando el tono es danger', () => {
    requestConfirm({ title: 'Borrar cobro', tone: 'danger' })

    const { getByRole } = render(BaseConfirmModal)
    const confirmButton = getByRole('button', { name: 'Confirmar' })

    expect(confirmButton.classList.contains('base-button--danger')).toBe(true)
  })

  it('resuelve la promesa a true y cierra el modal al pulsar el botón de confirmar', async () => {
    const promise = requestConfirm({ title: 'Confirmar acción' })
    const { getByRole, queryByRole } = render(BaseConfirmModal)

    await fireEvent.click(getByRole('button', { name: 'Confirmar' }))

    await expect(promise).resolves.toBe(true)
    expect(queryByRole('dialog')).toBeNull()
  })

  it('resuelve la promesa a false al pulsar el botón de cancelar', async () => {
    const promise = requestConfirm({ title: 'Confirmar acción' })
    const { getByRole, queryByRole } = render(BaseConfirmModal)

    await fireEvent.click(getByRole('button', { name: 'Cancelar' }))

    await expect(promise).resolves.toBe(false)
    expect(queryByRole('dialog')).toBeNull()
  })

  it('resuelve la promesa a false al pulsar el botón de cerrar del modal', async () => {
    const promise = requestConfirm({ title: 'Confirmar acción' })
    const { getByRole } = render(BaseConfirmModal)

    await fireEvent.click(getByRole('button', { name: 'Cerrar' }))

    await expect(promise).resolves.toBe(false)
  })
})
