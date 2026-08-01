import { fireEvent, render } from '@testing-library/vue'
import BaseDatePicker from './base-date-picker.vue'
import { describe, it, expect } from 'vitest'

describe('BaseDatePicker', () => {
  it('muestra la fecha formateada en el trigger', () => {
    const { getByRole } = render(BaseDatePicker, {
      props: { modelValue: '2026-07-02' },
    })
    // es-ES devuelve dd/mm/yyyy.
    expect(getByRole('button').textContent).toContain('2/7/2026')
  })

  it('muestra placeholder cuando no hay valor', () => {
    const { getByRole } = render(BaseDatePicker, {
      props: { modelValue: '' },
    })
    expect(getByRole('button').textContent).toContain('dd/mm/aaaa')
  })

  it('abre el calendario y emite la fecha al elegir un día', async () => {
    const { getByRole, getAllByRole, emitted } = render(BaseDatePicker, {
      props: { modelValue: '2026-07-02' },
    })

    // Cerrado inicialmente
    expect(() => getByRole('dialog')).toThrow()

    await fireEvent.click(getByRole('button'))
    expect(getByRole('dialog')).toBeTruthy()

    // Elegir el día "15" del mes visible (julio 2026)
    const dia15 = getAllByRole('button').find((b) => b.textContent?.trim() === '15')
    await fireEvent.click(dia15!)

    expect(emitted()['update:modelValue']?.[0]).toEqual(['2026-07-15'])
  })

  it('emite cadena vacía al pulsar Borrar', async () => {
    const { getByRole, getByText, emitted } = render(BaseDatePicker, {
      props: { modelValue: '2026-07-02' },
    })
    await fireEvent.click(getByRole('button'))
    await fireEvent.click(getByText('Borrar'))
    expect(emitted()['update:modelValue']?.[0]).toEqual([''])
  })

  describe('withTime', () => {
    it('muestra fecha y hora en el trigger', () => {
      const { getByRole } = render(BaseDatePicker, {
        props: { modelValue: '2026-07-02T09:30', withTime: true },
      })
      expect(getByRole('button').textContent).toContain('2/7/2026')
      expect(getByRole('button').textContent).toContain('09:30')
    })

    it('al elegir un día conserva la hora y no cierra el panel', async () => {
      const { getByRole, getAllByRole, emitted } = render(BaseDatePicker, {
        props: { modelValue: '2026-07-02T09:30', withTime: true },
      })
      await fireEvent.click(getByRole('button'))
      const dia15 = getAllByRole('button').find((b) => b.textContent?.trim() === '15')
      await fireEvent.click(dia15!)

      expect(emitted()['update:modelValue']?.[0]).toEqual(['2026-07-15T09:30'])
      // Sigue abierto para ajustar la hora
      expect(getByRole('dialog')).toBeTruthy()
    })

    it('al elegir una hora conserva la fecha', async () => {
      const { getByRole, getAllByRole, emitted } = render(BaseDatePicker, {
        props: { modelValue: '2026-07-02T09:30', withTime: true },
      })
      await fireEvent.click(getByRole('button'))
      // La celda de hora "14" (hay muchos botones "14"; el de la columna de horas)
      const celda14 = getAllByRole('button').filter((b) => b.textContent?.trim() === '14')
      // La última "14" es la de la columna de horas (tras el día 14 del calendario)
      await fireEvent.click(celda14[celda14.length - 1])

      expect(emitted()['update:modelValue']?.[0]).toEqual(['2026-07-02T14:30'])
    })
  })
})
