import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BasePageHeader from './base-page-header.vue'

const routerLinkStub = {
  props: ['to'],
  template: "<a :href=\"typeof to === 'string' ? to : '#'\"><slot /></a>",
}

describe('BasePageHeader', () => {
  it('renderiza el título recibido por prop', () => {
    const { getByText } = render(BasePageHeader, {
      props: { title: 'Pacientes' },
    })
    expect(getByText('Pacientes')).toBeTruthy()
  })

  it('no renderiza el breadcrumb si no se pasa la prop "back"', () => {
    const { container } = render(BasePageHeader, {
      props: { title: 'Pacientes' },
      global: { stubs: { RouterLink: routerLinkStub } },
    })
    expect(container.querySelector('.page-breadcrumb')).toBeNull()
  })

  it('renderiza el breadcrumb con el enlace al padre y el tramo actual cuando se pasa "back"', () => {
    const { container, getByText } = render(BasePageHeader, {
      props: {
        title: 'Juan Pérez',
        back: { to: '/pacientes', label: 'Pacientes' },
      },
      global: { stubs: { RouterLink: routerLinkStub } },
    })
    const link = container.querySelector('a.page-breadcrumb-link')
    expect(link).not.toBeNull()
    expect(link?.textContent).toContain('Pacientes')
    expect(link?.getAttribute('href')).toBe('/pacientes')
    // El tramo actual no es clicable
    expect(getByText('Juan Pérez', { selector: '.page-breadcrumb-current' })).toBeTruthy()
  })

  it('renderiza el contenido del slot "badges"', () => {
    const { getByText } = render(BasePageHeader, {
      props: { title: 'Pacientes' },
      slots: { badges: '<span>Activo</span>' },
    })
    expect(getByText('Activo')).toBeTruthy()
  })

  it('no renderiza el contenedor de acciones si no se usa el slot "actions"', () => {
    const { container } = render(BasePageHeader, {
      props: { title: 'Pacientes' },
    })
    expect(container.querySelector('.page-header-actions')).toBeNull()
  })

  it('renderiza el contenido del slot "actions" cuando se usa', () => {
    const { container, getByText } = render(BasePageHeader, {
      props: { title: 'Pacientes' },
      slots: { actions: '<button>Nuevo</button>' },
    })
    expect(getByText('Nuevo')).toBeTruthy()
    expect(container.querySelector('.page-header-actions')).not.toBeNull()
  })
})
