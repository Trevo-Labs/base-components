import { fireEvent, render } from '@testing-library/vue'
import BaseSelect from './base-select.vue'
import { describe, it, expect } from 'vitest'

const slot = '<option value="one">One</option><option value="two">Two</option>'

describe('BaseSelect', () => {
  it('muestra la opción seleccionada en el trigger', () => {
    const { getByRole } = render(BaseSelect, {
      props: { modelValue: 'one' },
      slots: { default: slot },
    })

    const trigger = getByRole('button')
    expect(trigger.textContent).toContain('One')
  })

  it('abre el panel y emite el valor al elegir una opción', async () => {
    const { getByRole, getAllByRole, emitted } = render(BaseSelect, {
      props: { modelValue: 'one' },
      slots: { default: slot },
    })

    // El panel no está montado hasta abrir
    expect(() => getByRole('listbox')).toThrow()

    await fireEvent.click(getByRole('button'))

    const options = getAllByRole('option')
    expect(options).toHaveLength(2)

    await fireEvent.click(options[1]) // "Two"
    expect(emitted()['update:modelValue']?.[0]).toEqual(['two'])
  })

  it('mantiene un select nativo oculto sincronizado para formularios', () => {
    const { container } = render(BaseSelect, {
      props: { modelValue: 'two' },
      slots: { default: slot },
    })

    const native = container.querySelector('select') as HTMLSelectElement
    expect(native).not.toBeNull()
    expect(native.value).toBe('two')
  })
})
