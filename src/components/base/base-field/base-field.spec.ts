import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import BaseField from './base-field.vue'
import BaseInput from '../base-input/base-input.vue'
import BaseSelect from '../base-select/base-select.vue'

describe('BaseField', () => {
  it('asocia el label con un BaseInput del slot (for/id)', () => {
    const { getByLabelText } = render(BaseField, {
      props: { label: 'Nombre' },
      slots: { default: () => h(BaseInput, { modelValue: 'Ana' }) },
    })

    // getByLabelText solo encuentra el input si el <label for> apunta a su id.
    const input = getByLabelText('Nombre', { exact: false }) as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    expect(input.value).toBe('Ana')
  })

  it('asocia el label con el select nativo de un BaseSelect del slot', () => {
    const { getByLabelText } = render(BaseField, {
      props: { label: 'Estado' },
      slots: {
        default: () =>
          h(BaseSelect, { modelValue: 'activo' }, () => [
            h('option', { value: 'activo' }, 'Activo'),
          ]),
      },
    })

    const control = getByLabelText('Estado', { exact: false })
    expect(control.tagName).toBe('SELECT')
  })

  it('muestra el error y oculta el hint cuando hay error', () => {
    const { getByText, queryByText } = render(BaseField, {
      props: { label: 'Email', error: 'Requerido', hint: 'pista' },
      slots: { default: '<input />' },
    })

    expect(getByText('Requerido')).toBeTruthy()
    expect(queryByText('pista')).toBeNull()
  })
})
