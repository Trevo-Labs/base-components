import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BaseSwitch from './base-switch.vue'

describe('BaseSwitch', () => {
  it('emite update:modelValue con el valor alternado al hacer toggle', async () => {
    const { getByRole, emitted } = render(BaseSwitch, {
      props: { modelValue: false },
    })

    await fireEvent.click(getByRole('switch'))

    expect(emitted()['update:modelValue']?.[0]).toEqual([true])
  })

  it('emite false cuando parte de estado activado', async () => {
    const { getByRole, emitted } = render(BaseSwitch, {
      props: { modelValue: true },
    })

    await fireEvent.click(getByRole('switch'))

    expect(emitted()['update:modelValue']?.[0]).toEqual([false])
  })

  it('refleja modelValue en el estado checked del input', () => {
    const { getByRole } = render(BaseSwitch, {
      props: { modelValue: true },
    })

    expect((getByRole('switch') as HTMLInputElement).checked).toBe(true)
  })

  it('aplica el atributo disabled al input', () => {
    const { getByRole } = render(BaseSwitch, {
      props: { modelValue: false, disabled: true },
    })

    expect((getByRole('switch') as HTMLInputElement).disabled).toBe(true)
  })

  it('renderiza el texto del slot por defecto', () => {
    const { getByText } = render(BaseSwitch, {
      props: { modelValue: false },
      slots: { default: 'Notificaciones' },
    })

    expect(getByText('Notificaciones')).toBeTruthy()
  })
})
