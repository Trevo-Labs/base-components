import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import BaseCheckbox from './base-checkbox.vue'

describe('BaseCheckbox', () => {
  it('emite update:modelValue con el nuevo estado al cambiar', async () => {
    const { getByRole, emitted } = render(BaseCheckbox, {
      props: { modelValue: false },
    })

    await fireEvent.click(getByRole('checkbox'))

    expect(emitted()['update:modelValue']?.[0]).toEqual([true])
  })

  it('refleja modelValue en el estado checked del input', () => {
    const { getByRole } = render(BaseCheckbox, {
      props: { modelValue: true },
    })

    expect((getByRole('checkbox') as HTMLInputElement).checked).toBe(true)
  })

  it('aplica el estado indeterminate como propiedad del DOM', async () => {
    const { getByRole } = render(BaseCheckbox, {
      props: { modelValue: false, indeterminate: true },
    })
    await nextTick()

    expect((getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true)
  })

  it('no marca indeterminate cuando la prop es false', async () => {
    const { getByRole } = render(BaseCheckbox, {
      props: { modelValue: false, indeterminate: false },
    })
    await nextTick()

    expect((getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(false)
  })

  it('aplica el atributo disabled al input', () => {
    const { getByRole } = render(BaseCheckbox, {
      props: { modelValue: false, disabled: true },
    })

    expect((getByRole('checkbox') as HTMLInputElement).disabled).toBe(true)
  })

  it('renderiza el texto del slot por defecto', () => {
    const { getByText } = render(BaseCheckbox, {
      props: { modelValue: false },
      slots: { default: 'Acepto los términos' },
    })

    expect(getByText('Acepto los términos')).toBeTruthy()
  })
})
