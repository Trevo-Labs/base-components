import { describe, it, expect } from 'vitest'
import { useConfirm } from './use-confirm'

describe('useConfirm', () => {
  it('requestConfirm expone la petición con los valores por defecto', () => {
    const { current, requestConfirm, resolveConfirm } = useConfirm()
    requestConfirm({ title: '¿Eliminar?' })

    expect(current.value?.title).toBe('¿Eliminar?')
    expect(current.value?.message).toBe('')
    expect(current.value?.confirmText).toBe('Confirmar')
    expect(current.value?.cancelText).toBe('Cancelar')
    expect(current.value?.tone).toBe('primary')

    resolveConfirm(false) // limpia el estado para el resto de tests
  })

  it('aplica las opciones personalizadas (tono danger, textos)', () => {
    const { current, requestConfirm, resolveConfirm } = useConfirm()
    requestConfirm({
      title: 'Borrar cobro',
      message: 'Esta acción no se puede deshacer',
      confirmText: 'Sí, borrar',
      tone: 'danger',
    })

    expect(current.value?.message).toBe('Esta acción no se puede deshacer')
    expect(current.value?.confirmText).toBe('Sí, borrar')
    expect(current.value?.tone).toBe('danger')

    resolveConfirm(false)
  })

  it('resolveConfirm(true) resuelve la promesa a true y limpia el estado', async () => {
    const { current, requestConfirm, resolveConfirm } = useConfirm()
    const promise = requestConfirm({ title: 'Confirmar' })

    resolveConfirm(true)

    await expect(promise).resolves.toBe(true)
    expect(current.value).toBeNull()
  })

  it('resolveConfirm(false) resuelve la promesa a false (cancelar)', async () => {
    const { requestConfirm, resolveConfirm } = useConfirm()
    const promise = requestConfirm({ title: 'Confirmar' })

    resolveConfirm(false)

    await expect(promise).resolves.toBe(false)
  })
})
