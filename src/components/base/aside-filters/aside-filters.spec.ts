import { fireEvent, render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import AsideFilters from './aside-filters.vue'
import {
  emptyFilterValues,
  type FilterConfig,
  type FilterValues,
} from '../base-data-grid/datagrid-filters'
import { firstPayload } from '@/test-utils'

// Tres tipos de filtro representativos: texto, select y multiselect (checkboxes).
const filters: FilterConfig[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', accessor: 'nombre' },
  {
    key: 'estado',
    label: 'Estado',
    type: 'select',
    accessor: 'estado',
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'baja', label: 'Baja' },
    ],
  },
  {
    key: 'tags',
    label: 'Etiquetas',
    type: 'multiselect',
    accessor: 'tags',
    options: [
      { value: 'vip', label: 'VIP' },
      { value: 'nuevo', label: 'Nuevo' },
    ],
  },
]

function renderAside(
  overrides: Partial<{ modelValue: boolean; filters: FilterConfig[]; values: FilterValues }> = {}
) {
  const f = overrides.filters ?? filters
  return render(AsideFilters, {
    props: {
      modelValue: overrides.modelValue ?? true,
      filters: f,
      values: overrides.values ?? emptyFilterValues(f),
    },
  })
}

describe('AsideFilters', () => {
  it('no renderiza el panel cuando modelValue es false', () => {
    const { queryByRole } = renderAside({ modelValue: false })
    expect(queryByRole('dialog')).toBeNull()
  })

  it('renderiza un grupo por cada filtro recibido, con su label', () => {
    const { getByText } = renderAside()

    expect(getByText('Nombre')).toBeTruthy()
    expect(getByText('Estado')).toBeTruthy()
    expect(getByText('Etiquetas')).toBeTruthy()
  })

  it('muestra el mensaje de "sin filtros" cuando no hay ninguno configurado', () => {
    const { getByText, queryByText } = renderAside({ filters: [] })

    expect(getByText('No hay filtros disponibles.')).toBeTruthy()
    expect(queryByText('Nombre')).toBeNull()
  })

  it('filtro de texto: al escribir y pulsar "Filtrar" emite el valor', async () => {
    const { getByLabelText, getByText, emitted } = renderAside()

    const input = getByLabelText('Nombre') as HTMLInputElement
    await fireEvent.update(input, 'Ana')
    await fireEvent.click(getByText('Filtrar'))

    expect(firstPayload<FilterValues>(emitted(), 'apply')).toMatchObject({ nombre: 'Ana' })
    // Al aplicar también se cierra el panel.
    expect(emitted()['update:modelValue']?.[0]).toEqual([false])
  })

  it('filtro select: al elegir una opción y pulsar "Filtrar" emite el valor', async () => {
    const { getByLabelText, getByText, emitted } = renderAside()

    const select = getByLabelText('Estado') as HTMLSelectElement
    await fireEvent.update(select, 'baja')
    await fireEvent.click(getByText('Filtrar'))

    expect(firstPayload<FilterValues>(emitted(), 'apply')).toMatchObject({ estado: 'baja' })
  })

  it('filtro multiselect: al marcar una opción y pulsar "Filtrar" emite el array', async () => {
    const { getByLabelText, getByText, emitted } = renderAside()

    await fireEvent.click(getByLabelText('VIP'))
    await fireEvent.click(getByText('Filtrar'))

    expect(firstPayload<FilterValues>(emitted(), 'apply')).toMatchObject({ tags: ['vip'] })
  })

  it('el botón "Limpiar" resetea los filtros antes de aplicar', async () => {
    const initialValues: FilterValues = {
      ...emptyFilterValues(filters),
      nombre: 'Ana',
      tags: ['vip'],
    }
    const { getByLabelText, getByText, emitted } = renderAside({ values: initialValues })

    // Arranca con los valores ya aplicados cargados en el borrador.
    expect((getByLabelText('Nombre') as HTMLInputElement).value).toBe('Ana')

    await fireEvent.click(getByText('Limpiar'))
    await fireEvent.click(getByText('Filtrar'))

    expect(firstPayload<FilterValues>(emitted(), 'apply')).toEqual({
      nombre: '',
      estado: '',
      tags: [],
    })
  })

  it('el botón "Cancelar" cierra el panel sin emitir "apply"', async () => {
    const { getByText, emitted } = renderAside()

    await fireEvent.click(getByText('Cancelar'))

    expect(emitted()['update:modelValue']?.[0]).toEqual([false])
    expect(emitted().apply).toBeUndefined()
  })

  it('el botón de cerrar (X) emite update:modelValue en false', async () => {
    const { getByRole, emitted } = renderAside()

    await fireEvent.click(getByRole('button', { name: 'Cerrar' }))

    expect(emitted()['update:modelValue']?.[0]).toEqual([false])
  })

  it('el click en el overlay cierra el panel', async () => {
    const { baseElement, emitted } = renderAside()

    const overlay = baseElement.querySelector('.aside-filters-overlay') as HTMLElement
    await fireEvent.click(overlay)

    expect(emitted()['update:modelValue']?.[0]).toEqual([false])
  })
})
