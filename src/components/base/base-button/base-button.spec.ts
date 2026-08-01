import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import BaseButton from './base-button.vue'

describe('BaseButton', () => {
  it('renderiza el contenido del slot', () => {
    const { getByRole } = render(BaseButton, { slots: { default: 'Guardar' } })
    expect(getByRole('button').textContent).toContain('Guardar')
  })

  it('aplica la variante y el tamaño por defecto (primary / md)', () => {
    const { getByRole } = render(BaseButton, { slots: { default: 'x' } })
    const btn = getByRole('button')
    expect(btn.classList.contains('base-button--primary')).toBe(true)
    expect(btn.classList.contains('base-button--md')).toBe(true)
  })

  it('aplica la variante y el tamaño indicados por props', () => {
    const { getByRole } = render(BaseButton, {
      props: { variant: 'danger', size: 'lg' },
      slots: { default: 'x' },
    })
    const btn = getByRole('button')
    expect(btn.classList.contains('base-button--danger')).toBe(true)
    expect(btn.classList.contains('base-button--lg')).toBe(true)
  })

  it('usa type="button" por defecto', () => {
    const { getByRole } = render(BaseButton, { slots: { default: 'x' } })
    expect(getByRole('button').getAttribute('type')).toBe('button')
  })

  it('respeta el type indicado (submit)', () => {
    const { getByRole } = render(BaseButton, {
      props: { type: 'submit' },
      slots: { default: 'x' },
    })
    expect(getByRole('button').getAttribute('type')).toBe('submit')
  })

  it('no muestra el spinner cuando no está en loading', () => {
    const { container } = render(BaseButton, { slots: { default: 'x' } })
    expect(container.querySelector('.btn-spinner')).toBeNull()
  })

  it('muestra el spinner, marca la clase loading y deshabilita el botón cuando loading', () => {
    const { getByRole, container } = render(BaseButton, {
      props: { loading: true },
      slots: { default: 'x' },
    })
    const btn = getByRole('button') as HTMLButtonElement
    expect(container.querySelector('.btn-spinner')).not.toBeNull()
    expect(btn.classList.contains('base-button--loading')).toBe(true)
    expect(btn.disabled).toBe(true)
  })

  it('deshabilita el botón cuando disabled es true', () => {
    const { getByRole } = render(BaseButton, {
      props: { disabled: true },
      slots: { default: 'x' },
    })
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('invoca el handler de click cuando está activo', async () => {
    const onClick = vi.fn()
    const { getByRole } = render(BaseButton, {
      props: { onClick },
      slots: { default: 'Ok' },
    })
    await fireEvent.click(getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('no invoca el handler al hacer click cuando está deshabilitado', () => {
    const onClick = vi.fn()
    const { getByRole } = render(BaseButton, {
      props: { disabled: true, onClick },
      slots: { default: 'x' },
    })
    const btn = getByRole('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    btn.click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('no invoca el handler al hacer click cuando está en loading', () => {
    const onClick = vi.fn()
    const { getByRole } = render(BaseButton, {
      props: { loading: true, onClick },
      slots: { default: 'x' },
    })
    const btn = getByRole('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    btn.click()
    expect(onClick).not.toHaveBeenCalled()
  })
})
