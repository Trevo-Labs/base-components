import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BaseBox from './base-box.vue'

describe('BaseBox', () => {
  it('renderiza el contenido del slot default', () => {
    const { getByText } = render(BaseBox, { slots: { default: 'Contenido' } })
    expect(getByText('Contenido')).toBeTruthy()
  })

  it('renderiza el título cuando se pasa la prop title', () => {
    const { getByText, container } = render(BaseBox, {
      props: { title: 'Mi título' },
      slots: { default: 'x' },
    })
    expect(getByText('Mi título')).toBeTruthy()
    expect(container.querySelector('.box-title')).not.toBeNull()
  })

  it('no renderiza la cabecera si no hay título ni slot header', () => {
    const { container } = render(BaseBox, { slots: { default: 'x' } })
    expect(container.querySelector('.box-header')).toBeNull()
  })

  it('renderiza el slot header en lugar del título por defecto', () => {
    const { getByText, container } = render(BaseBox, {
      props: { title: 'Ignorado' },
      slots: { header: '<strong>Cabecera custom</strong>', default: 'x' },
    })
    expect(getByText('Cabecera custom')).toBeTruthy()
    expect(container.querySelector('.box-title')).toBeNull()
  })

  it('renderiza la cabecera si solo se pasa el slot header (sin title)', () => {
    const { container } = render(BaseBox, {
      slots: { header: 'Solo header', default: 'x' },
    })
    expect(container.querySelector('.box-header')).not.toBeNull()
  })

  it('no renderiza el body si no hay slot default', () => {
    const { container } = render(BaseBox, { props: { title: 'Solo título' } })
    expect(container.querySelector('.box-body')).toBeNull()
  })

  it('no aplica la clase flush por defecto', () => {
    const { container } = render(BaseBox, { slots: { default: 'x' } })
    const body = container.querySelector('.box-body') as HTMLElement
    expect(body.classList.contains('box-body--flush')).toBe(false)
  })

  it('aplica la clase flush cuando la prop flush es true', () => {
    const { container } = render(BaseBox, {
      props: { flush: true },
      slots: { default: 'x' },
    })
    const body = container.querySelector('.box-body') as HTMLElement
    expect(body.classList.contains('box-body--flush')).toBe(true)
  })
})
