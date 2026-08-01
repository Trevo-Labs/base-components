import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BaseBadge from './base-badge.vue'

describe('BaseBadge', () => {
  it('renderiza el contenido del slot', () => {
    const { getByText } = render(BaseBadge, { slots: { default: 'Activo' } })
    expect(getByText('Activo')).toBeTruthy()
  })

  it('renderiza un span con la clase base badge', () => {
    const { container } = render(BaseBadge, { slots: { default: 'x' } })
    expect(container.querySelector('span.base-badge')).not.toBeNull()
  })

  it('aplica la variante por defecto (default)', () => {
    const { container } = render(BaseBadge, { slots: { default: 'x' } })
    const badge = container.querySelector('.base-badge') as HTMLElement
    expect(badge.classList.contains('base-badge--default')).toBe(true)
  })

  it.each(['primary', 'success', 'danger', 'warning', 'info', 'muted'] as const)(
    'aplica la clase de la variante "%s"',
    (variant) => {
      const { container } = render(BaseBadge, {
        props: { variant },
        slots: { default: 'x' },
      })
      const badge = container.querySelector('.base-badge') as HTMLElement
      expect(badge.classList.contains(`base-badge--${variant}`)).toBe(true)
    }
  )
})
