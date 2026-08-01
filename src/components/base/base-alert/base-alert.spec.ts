import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BaseAlert from './base-alert.vue'

describe('BaseAlert', () => {
  it('renderiza el contenido del slot con role="alert"', () => {
    const { getByRole } = render(BaseAlert, { slots: { default: 'Todo correcto' } })
    expect(getByRole('alert').textContent).toContain('Todo correcto')
  })

  it('usa la variante info por defecto', () => {
    const { getByRole } = render(BaseAlert, { slots: { default: 'x' } })
    expect(getByRole('alert').classList.contains('base-alert--info')).toBe(true)
  })

  it.each(['success', 'warning', 'error', 'info'] as const)(
    'aplica la clase de la variante "%s"',
    (type) => {
      const { getByRole } = render(BaseAlert, {
        props: { type },
        slots: { default: 'x' },
      })
      expect(getByRole('alert').classList.contains(`base-alert--${type}`)).toBe(true)
    }
  )

  it('muestra el título cuando se pasa la prop title', () => {
    const { getByText } = render(BaseAlert, {
      props: { title: 'Atención' },
      slots: { default: 'cuerpo' },
    })
    const titulo = getByText('Atención')
    expect(titulo).toBeTruthy()
    expect(titulo.classList.contains('alert-title')).toBe(true)
  })

  it('no renderiza el título cuando no se pasa la prop', () => {
    const { container } = render(BaseAlert, { slots: { default: 'x' } })
    expect(container.querySelector('.alert-title')).toBeNull()
  })

  it('muestra el icono por defecto', () => {
    const { container } = render(BaseAlert, { slots: { default: 'x' } })
    expect(container.querySelector('.alert-icon')).not.toBeNull()
  })

  it('oculta el icono cuando hideIcon es true', () => {
    const { container } = render(BaseAlert, {
      props: { hideIcon: true },
      slots: { default: 'x' },
    })
    expect(container.querySelector('.alert-icon')).toBeNull()
  })
})
