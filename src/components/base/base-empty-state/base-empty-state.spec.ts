import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BaseEmptyState from './base-empty-state.vue'

describe('BaseEmptyState', () => {
  it('renderiza el texto recibido por la prop text', () => {
    const { getByText } = render(BaseEmptyState, { props: { text: 'No hay resultados' } })
    expect(getByText('No hay resultados')).toBeTruthy()
  })

  it('no renderiza ningún párrafo si no se recibe la prop text', () => {
    const { container } = render(BaseEmptyState)
    expect(container.querySelector('p')).toBeNull()
  })

  it('renderiza el contenido del slot icon', () => {
    const { getByText } = render(BaseEmptyState, {
      slots: { icon: '<span>🔍</span>' },
    })
    expect(getByText('🔍')).toBeTruthy()
  })

  it('renderiza el contenido del slot default', () => {
    const { getByText } = render(BaseEmptyState, {
      slots: { default: '<button>Reintentar</button>' },
    })
    expect(getByText('Reintentar')).toBeTruthy()
  })

  it('renderiza un div con la clase base empty-state', () => {
    const { container } = render(BaseEmptyState)
    expect(container.querySelector('div.empty-state')).not.toBeNull()
  })

  it('no aplica los modificadores compact ni panel por defecto', () => {
    const { container } = render(BaseEmptyState)
    const root = container.querySelector('.empty-state') as HTMLElement
    expect(root.classList.contains('empty-state--compact')).toBe(false)
    expect(root.classList.contains('empty-state--panel')).toBe(false)
  })

  it('aplica la clase empty-state--compact cuando compact es true', () => {
    const { container } = render(BaseEmptyState, { props: { compact: true } })
    const root = container.querySelector('.empty-state') as HTMLElement
    expect(root.classList.contains('empty-state--compact')).toBe(true)
  })

  it('aplica la clase empty-state--panel cuando panel es true', () => {
    const { container } = render(BaseEmptyState, { props: { panel: true } })
    const root = container.querySelector('.empty-state') as HTMLElement
    expect(root.classList.contains('empty-state--panel')).toBe(true)
  })
})
