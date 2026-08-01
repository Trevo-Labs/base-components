import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import BaseNotify from './base-notify.vue'
import { useNotify } from '@/composables/use-notify'

describe('BaseNotify', () => {
  beforeEach(() => {
    // El estado de notificaciones es un singleton de módulo: lo vaciamos entre tests.
    useNotify().notifications.value.splice(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no renderiza ninguna notificación si no hay ninguna activa', () => {
    const { queryByRole } = render(BaseNotify)
    expect(queryByRole('alert')).toBeNull()
  })

  it('renderiza el mensaje y el título por defecto al añadir una notificación success', async () => {
    const { getByRole, getByText } = render(BaseNotify)
    const { success } = useNotify()

    success('Guardado correctamente')
    await nextTick()

    expect(getByText('Guardado correctamente')).toBeTruthy()
    expect(getByText('Hecho')).toBeTruthy()
    expect(getByRole('alert').classList.contains('notify--success')).toBe(true)
  })

  it('usa el título proporcionado en vez del título por defecto del tipo', async () => {
    const { getByText, queryByText } = render(BaseNotify)
    const { error } = useNotify()

    error('Fallo grave', { title: 'Error 500' })
    await nextTick()

    expect(getByText('Error 500')).toBeTruthy()
    expect(queryByText('Error')).toBeNull()
  })

  it('renderiza varias notificaciones con la clase correspondiente a su tipo', async () => {
    const { getAllByRole } = render(BaseNotify)
    const { success, error, info, warning } = useNotify()

    success('A', { duration: 0 })
    error('B', { duration: 0 })
    info('C', { duration: 0 })
    warning('D', { duration: 0 })
    await nextTick()

    const alerts = getAllByRole('alert')
    expect(alerts).toHaveLength(4)
    expect(alerts[0].classList.contains('notify--success')).toBe(true)
    expect(alerts[1].classList.contains('notify--error')).toBe(true)
    expect(alerts[2].classList.contains('notify--info')).toBe(true)
    expect(alerts[3].classList.contains('notify--warning')).toBe(true)
  })

  it('se auto-cierra tras la duración por defecto (4s)', async () => {
    vi.useFakeTimers()
    const { getByRole, queryByRole } = render(BaseNotify)
    const { success } = useNotify()

    success('Temporal')
    await nextTick()
    expect(getByRole('alert')).toBeTruthy()

    vi.advanceTimersByTime(4000)
    await nextTick()

    expect(queryByRole('alert')).toBeNull()
  })

  it('con duration 0 no se auto-cierra aunque pase mucho tiempo', async () => {
    vi.useFakeTimers()
    const { getByText } = render(BaseNotify)
    const { notify } = useNotify()

    notify('info', 'Persistente', { duration: 0 })
    await nextTick()

    vi.advanceTimersByTime(60_000)
    await nextTick()

    expect(getByText('Persistente')).toBeTruthy()
  })

  it('cierra manualmente la notificación al pulsar el botón de cerrar', async () => {
    const { getByRole, queryByText } = render(BaseNotify)
    const { success } = useNotify()

    success('Cerrar esto', { duration: 0 })
    await nextTick()

    await fireEvent.click(getByRole('button', { name: 'Cerrar' }))
    await nextTick()

    expect(queryByText('Cerrar esto')).toBeNull()
  })
})
