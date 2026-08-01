import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'

import BaseModal from './base-modal.vue'

function renderModal(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return render(BaseModal, {
    props: { modelValue: true, title: 'Título de prueba', ...props },
    slots,
  })
}

describe('BaseModal', () => {
  it('renderiza el diálogo, el título y el contenido cuando modelValue es true', () => {
    const { getByRole, getByText } = renderModal({}, { default: 'Contenido del modal' })

    expect(getByRole('dialog')).toBeTruthy()
    expect(getByText('Título de prueba')).toBeTruthy()
    expect(getByText('Contenido del modal')).toBeTruthy()
  })

  it('no renderiza nada cuando modelValue es false', () => {
    const { queryByRole } = renderModal({ modelValue: false })

    expect(queryByRole('dialog')).toBeNull()
  })

  it('emite update:modelValue(false) al pulsar el botón de cerrar', async () => {
    const { getByRole, emitted } = renderModal()

    await fireEvent.click(getByRole('button', { name: 'Cerrar' }))

    expect(emitted()['update:modelValue']?.[0]).toEqual([false])
  })

  it('emite el cierre al hacer click en el backdrop', async () => {
    const { baseElement, emitted } = renderModal()

    const overlay = baseElement.querySelector('.base-modal-overlay') as HTMLElement
    expect(overlay).not.toBeNull()
    await fireEvent.click(overlay)

    expect(emitted()['update:modelValue']?.[0]).toEqual([false])
  })

  it('no emite el cierre al hacer click dentro del modal', async () => {
    const { getByRole, emitted } = renderModal()

    await fireEvent.click(getByRole('dialog'))

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('no cierra por backdrop cuando closeOnBackdrop es false', async () => {
    const { baseElement, emitted } = renderModal({ closeOnBackdrop: false })

    const overlay = baseElement.querySelector('.base-modal-overlay') as HTMLElement
    await fireEvent.click(overlay)

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('renderiza el slot footer solo cuando se proporciona', () => {
    const withFooter = renderModal({}, { footer: '<button>Guardar</button>' })
    expect(withFooter.getByText('Guardar')).toBeTruthy()
    expect(withFooter.baseElement.querySelector('.footer')).not.toBeNull()
    withFooter.unmount()

    const withoutFooter = renderModal()
    expect(withoutFooter.baseElement.querySelector('.footer')).toBeNull()
  })
})
