import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useNotify } from './useNotify'

describe('useNotify', () => {
  beforeEach(() => {
    // El estado es un singleton de módulo: lo vaciamos entre tests.
    useNotify().notifications.value.splice(0)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('success añade una notificación de tipo success', () => {
    const { notifications, success } = useNotify()
    success('Guardado correctamente')

    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]).toMatchObject({
      type: 'success',
      message: 'Guardado correctamente',
    })
  })

  it('cada tipo (error/info/warning) marca su type', () => {
    const { notifications, error, info, warning } = useNotify()
    error('Falló')
    info('Info')
    warning('Cuidado')

    expect(notifications.value.map((n) => n.type)).toEqual(['error', 'info', 'warning'])
  })

  it('auto-descarta la notificación tras la duración por defecto (4s)', () => {
    const { notifications, success } = useNotify()
    success('Temporal')
    expect(notifications.value).toHaveLength(1)

    vi.advanceTimersByTime(4000)

    expect(notifications.value).toHaveLength(0)
  })

  it('duration=0 mantiene la notificación (no auto-descarta)', () => {
    const { notifications, notify } = useNotify()
    notify('info', 'Persistente', { duration: 0 })

    vi.advanceTimersByTime(60_000)

    expect(notifications.value).toHaveLength(1)
  })

  it('dismiss elimina por id', () => {
    const { notifications, success } = useNotify()
    const id = success('A', { duration: 0 })
    success('B', { duration: 0 })

    useNotify().dismiss(id)

    expect(notifications.value.map((n) => n.message)).toEqual(['B'])
  })

  it('acepta un título opcional', () => {
    const { notifications, error } = useNotify()
    error('Sin permisos', { title: 'Error 403', duration: 0 })

    expect(notifications.value[0].title).toBe('Error 403')
  })
})
