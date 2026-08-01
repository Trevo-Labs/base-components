import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import CellLink from './cell-link.vue'

const routerLinkStub = {
  props: ['to'],
  template: "<a :href=\"typeof to === 'string' ? to : '#'\"><slot /></a>",
}

describe('CellLink', () => {
  it('renderiza un RouterLink hacia el destino indicado cuando se pasa "to"', () => {
    const { container, getByText } = render(CellLink, {
      props: { to: '/pacientes/1', label: 'Ver ficha' },
      global: { stubs: { RouterLink: routerLinkStub } },
    })
    const link = container.querySelector('a.cell-link')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('/pacientes/1')
    expect(getByText('Ver ficha')).toBeTruthy()
  })

  it('acepta un destino de tipo objeto (RouteLocationRaw)', () => {
    const { container } = render(CellLink, {
      props: { to: { name: 'paciente-detalle', params: { id: '1' } }, label: 'Ver' },
      global: { stubs: { RouterLink: routerLinkStub } },
    })
    expect(container.querySelector('a.cell-link')).not.toBeNull()
  })

  it('prioriza el contenido del slot sobre la prop "label"', () => {
    const { getByText, queryByText } = render(CellLink, {
      props: { to: '/x', label: 'Label ignorado' },
      slots: { default: 'Contenido del slot' },
      global: { stubs: { RouterLink: routerLinkStub } },
    })
    expect(getByText('Contenido del slot')).toBeTruthy()
    expect(queryByText('Label ignorado')).toBeNull()
  })

  it('sin "to" renderiza un span (no un enlace) con el contenido', () => {
    const { container, getByText } = render(CellLink, {
      props: { label: 'Sin destino' },
    })
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('span')).not.toBeNull()
    expect(getByText('Sin destino')).toBeTruthy()
  })

  it('sin "to" ni "label" muestra el guion por defecto', () => {
    const { getByText } = render(CellLink)
    expect(getByText('—')).toBeTruthy()
  })
})
