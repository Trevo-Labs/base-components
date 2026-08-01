import { render, fireEvent } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import PwaUpdateBanner from './pwa-update-banner.vue'

describe('PwaUpdateBanner', () => {
  it('no muestra el banner cuando model-value es false', () => {
    const { queryByRole } = render(PwaUpdateBanner)
    expect(queryByRole('alert')).toBeNull()
  })

  it('muestra el banner cuando model-value es true', () => {
    const { getByRole } = render(PwaUpdateBanner, { props: { modelValue: true } })
    expect(getByRole('alert')).toBeTruthy()
  })

  it('muestra los textos por defecto', () => {
    const { getByText } = render(PwaUpdateBanner, { props: { modelValue: true } })
    expect(getByText('Nueva versión disponible')).toBeTruthy()
    expect(getByText('Actualiza para usar los últimos cambios.')).toBeTruthy()
    expect(getByText('Actualizar')).toBeTruthy()
  })

  it('permite personalizar título, mensaje y texto del botón', () => {
    const { getByText } = render(PwaUpdateBanner, {
      props: {
        modelValue: true,
        title: 'Hay algo nuevo',
        message: 'Recarga cuando quieras.',
        actionText: 'Recargar',
      },
    })
    expect(getByText('Hay algo nuevo')).toBeTruthy()
    expect(getByText('Recarga cuando quieras.')).toBeTruthy()
    expect(getByText('Recargar')).toBeTruthy()
  })

  it('emite update al pulsar el botón', async () => {
    const onUpdate = vi.fn()
    const { getByText } = render(PwaUpdateBanner, {
      props: { modelValue: true, onUpdate },
    })

    await fireEvent.click(getByText('Actualizar'))

    expect(onUpdate).toHaveBeenCalledTimes(1)
  })

  it('no emite update si no se pulsa el botón', () => {
    const onUpdate = vi.fn()
    render(PwaUpdateBanner, { props: { modelValue: true, onUpdate } })

    expect(onUpdate).not.toHaveBeenCalled()
  })
})
