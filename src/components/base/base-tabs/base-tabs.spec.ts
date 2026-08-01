import { render, fireEvent } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BaseTabs, { type Tab } from './base-tabs.vue'

const tabs: Tab[] = [
  { key: 'general', label: 'General' },
  { key: 'documentos', label: 'Documentos' },
  { key: 'historial', label: 'Historial' },
]

describe('BaseTabs', () => {
  it('renderiza una pestaña por cada tab recibido', () => {
    const { getByText } = render(BaseTabs, { props: { tabs, modelValue: 'general' } })
    expect(getByText('General')).toBeTruthy()
    expect(getByText('Documentos')).toBeTruthy()
    expect(getByText('Historial')).toBeTruthy()
  })

  it('marca visualmente el tab activo según modelValue', () => {
    const { getByText } = render(BaseTabs, { props: { tabs, modelValue: 'documentos' } })
    const activo = getByText('Documentos') as HTMLButtonElement
    const inactivo = getByText('General') as HTMLButtonElement

    expect(activo.classList.contains('tab--active')).toBe(true)
    expect(activo.getAttribute('aria-selected')).toBe('true')
    expect(inactivo.classList.contains('tab--active')).toBe(false)
    expect(inactivo.getAttribute('aria-selected')).toBe('false')
  })

  it('emite update:modelValue con la key del tab al hacer click', async () => {
    const { getByText, emitted } = render(BaseTabs, { props: { tabs, modelValue: 'general' } })

    await fireEvent.click(getByText('Historial'))

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['historial'])
  })

  it('no renderiza las pestañas marcadas como hidden', () => {
    const tabsConOculta: Tab[] = [...tabs, { key: 'oculto', label: 'Oculto', hidden: true }]
    const { queryByText } = render(BaseTabs, {
      props: { tabs: tabsConOculta, modelValue: 'general' },
    })

    expect(queryByText('Oculto')).toBeNull()
  })
})
