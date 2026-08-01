import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'

import BaseDropdown from './base-dropdown.vue'

describe('BaseDropdown', () => {
  it('empieza cerrado: sin menú y aria-expanded false', () => {
    const { getByRole, queryByRole } = render(BaseDropdown)

    expect(queryByRole('menu')).toBeNull()
    expect(getByRole('button').getAttribute('aria-expanded')).toBe('false')
  })

  it('abre el menú al hacer click en el trigger', async () => {
    const { getByRole, queryByRole } = render(BaseDropdown)

    await fireEvent.click(getByRole('button'))

    expect(queryByRole('menu')).not.toBeNull()
    expect(getByRole('button').getAttribute('aria-expanded')).toBe('true')
  })

  it('cierra el menú al volver a hacer click en el trigger', async () => {
    const { getByRole } = render(BaseDropdown)

    const trigger = getByRole('button')
    await fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('cierra al hacer click fuera del menú', async () => {
    const { getByRole } = render(BaseDropdown)

    const trigger = getByRole('button')
    await fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.click(document.body)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('cierra al pulsar Escape', async () => {
    const { getByRole } = render(BaseDropdown)

    const trigger = getByRole('button')
    await fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('expone close al slot para cerrar al elegir un item', async () => {
    const { getByRole, getByText } = render(BaseDropdown, {
      slots: {
        default: ({ close }: { close: () => void }) =>
          h('button', { class: 'dropdown-item', onClick: close }, 'Eliminar'),
      },
    })

    const trigger = getByRole('button', { name: 'Acciones' })
    await fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.click(getByText('Eliminar'))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('usa la prop label como aria-label del trigger', () => {
    const { getByRole } = render(BaseDropdown, { props: { label: 'Más opciones' } })

    expect(getByRole('button', { name: 'Más opciones' })).toBeTruthy()
  })
})
