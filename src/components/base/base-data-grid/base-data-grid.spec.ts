import { render, fireEvent } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import BaseDataGrid from './base-data-grid.vue'

interface Row {
  id: string
  nombre: string
  email: string
}

const rows: Row[] = [
  { id: '1', nombre: 'Ana', email: 'ana@x.com' },
  { id: '2', nombre: 'Bruno', email: 'bruno@x.com' },
  { id: '3', nombre: 'Carla', email: 'carla@x.com' },
]

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
]

function renderGrid(props: Record<string, unknown> = {}) {
  return render(BaseDataGrid, {
    props: { columns, rows, rowKey: 'id', ...props },
  })
}

describe('BaseDataGrid', () => {
  it('pinta una fila por registro con sus valores', () => {
    const { getByText, getAllByRole } = renderGrid()
    expect(getByText('Ana')).toBeTruthy()
    expect(getByText('bruno@x.com')).toBeTruthy()
    // cabecera + 3 filas de datos
    expect(getAllByRole('row')).toHaveLength(4)
  })

  it('muestra el estado vacío cuando no hay filas', () => {
    const { getByText, queryAllByRole } = renderGrid({ rows: [] })
    expect(getByText('No hay datos para mostrar.')).toBeTruthy()
    expect(queryAllByRole('row')).toHaveLength(0)
  })

  it('muestra el estado de carga y no las filas', () => {
    const { getByText, queryByText } = renderGrid({ loading: true })
    expect(getByText('Cargando...')).toBeTruthy()
    expect(queryByText('Ana')).toBeNull()
  })

  it('el buscador filtra las filas visibles', async () => {
    const { getByRole, queryByText } = renderGrid({
      searchable: true,
      searchAccessor: 'nombre',
    })
    await fireEvent.update(getByRole('searchbox'), 'car')

    expect(queryByText('Carla')).toBeTruthy()
    expect(queryByText('Ana')).toBeNull()
    expect(queryByText('Bruno')).toBeNull()
  })

  it('emite row-click con la fila al hacer click', async () => {
    const { getAllByRole, emitted } = renderGrid()
    const dataRows = getAllByRole('row').slice(1) // saltar la cabecera
    await fireEvent.click(dataRows[0])

    expect(emitted()['row-click']?.[0]).toEqual([rows[0]])
  })

  it('marcar la cabecera selecciona todas las filas visibles', async () => {
    const { getAllByRole, emitted } = renderGrid({ selectable: true })
    const checkboxes = getAllByRole('checkbox')
    await fireEvent.click(checkboxes[0]) // "seleccionar todo"

    const ev = emitted()['update:selected']
    expect(ev).toBeTruthy()
    expect(ev?.[0][0] as unknown[]).toHaveLength(3)
  })

  it('marcar una fila emite solo esa fila', async () => {
    const { getAllByRole, emitted } = renderGrid({ selectable: true })
    const checkboxes = getAllByRole('checkbox')
    await fireEvent.click(checkboxes[1]) // primera fila de datos

    const selected = emitted()['update:selected']?.[0][0] as Row[]
    expect(selected).toHaveLength(1)
    expect(selected[0].id).toBe('1')
  })

  it('muestra el estado de error (no el vacío) y emite retry al reintentar', async () => {
    const { getByRole, getByText, queryByText, emitted } = renderGrid({
      rows: [],
      error: 'No se pudieron cargar los datos.',
    })

    expect(getByRole('alert')).toBeTruthy()
    expect(getByText('No se pudieron cargar los datos.')).toBeTruthy()
    // No cae en el estado vacío pese a no tener filas.
    expect(queryByText('No hay datos para mostrar.')).toBeNull()

    await fireEvent.click(getByRole('button', { name: 'Reintentar' }))
    expect(emitted().retry).toBeTruthy()
  })

  // ── Ordenación ────────────────────────────────────────────────────────────
  const sortColumns = [
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email' },
  ]

  function nombresEnOrden(container: Element): string[] {
    return [...container.querySelectorAll('.grid-row')].map(
      (r) => r.querySelector('.grid-td-text')?.textContent?.trim() ?? ''
    )
  }

  it('no ordena si la columna no es sortable', async () => {
    const cols = [
      { key: 'nombre', label: 'Nombre' }, // sin `sortable`
      { key: 'email', label: 'Email' },
    ]
    const unsorted = [
      { id: '1', nombre: 'Carla', email: 'c@x.com' },
      { id: '2', nombre: 'Ana', email: 'a@x.com' },
      { id: '3', nombre: 'Bruno', email: 'b@x.com' },
    ]
    const { getByText, container } = renderGrid({ rows: unsorted, columns: cols })
    // columna sin `sortable`: clic en cabecera no reordena
    await fireEvent.click(getByText('Nombre'))
    expect(nombresEnOrden(container)).toEqual(['Carla', 'Ana', 'Bruno'])
  })

  it('clic en cabecera ordena asc, luego desc, luego restaura el orden original', async () => {
    const unsorted = [
      { id: '1', nombre: 'Carla', email: 'c@x.com' },
      { id: '2', nombre: 'Ana', email: 'a@x.com' },
      { id: '3', nombre: 'Bruno', email: 'b@x.com' },
    ]
    const { getByText, container } = renderGrid({
      rows: unsorted,
      columns: sortColumns,
    })

    expect(nombresEnOrden(container)).toEqual(['Carla', 'Ana', 'Bruno'])

    await fireEvent.click(getByText('Nombre'))
    expect(nombresEnOrden(container)).toEqual(['Ana', 'Bruno', 'Carla'])

    await fireEvent.click(getByText('Nombre'))
    expect(nombresEnOrden(container)).toEqual(['Carla', 'Bruno', 'Ana'])

    await fireEvent.click(getByText('Nombre'))
    expect(nombresEnOrden(container)).toEqual(['Carla', 'Ana', 'Bruno'])
  })

  it('refleja el estado de orden en aria-sort de la cabecera', async () => {
    const { getByText } = renderGrid({ columns: sortColumns })
    const header = getByText('Nombre').closest('[role="columnheader"]') as HTMLElement
    expect(header.getAttribute('aria-sort')).toBe('none')

    await fireEvent.click(getByText('Nombre'))
    expect(header.getAttribute('aria-sort')).toBe('ascending')

    await fireEvent.click(getByText('Nombre'))
    expect(header.getAttribute('aria-sort')).toBe('descending')
  })

  it('ordena numéricamente por un accessor de función', async () => {
    const numRows = [
      { id: '1', nombre: 'A', email: '', total: 100 },
      { id: '2', nombre: 'B', email: '', total: 9 },
      { id: '3', nombre: 'C', email: '', total: 30 },
    ]
    const cols = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'total', label: 'Total', sortable: (r: { total: number }) => r.total },
    ]
    const { getByText, container } = renderGrid({
      rows: numRows,
      columns: cols,
    })
    await fireEvent.click(getByText('Total'))
    expect(nombresEnOrden(container)).toEqual(['B', 'C', 'A'])
  })

  // ── Paginación ────────────────────────────────────────────────────────────
  const manyRows = Array.from({ length: 60 }, (_, i) => ({
    id: String(i + 1),
    nombre: `Fila ${String(i + 1).padStart(2, '0')}`,
    email: `f${i + 1}@x.com`,
  }))

  it('pagina por defecto a pageSize y navega entre páginas', async () => {
    const { container, getByText, getByLabelText } = renderGrid({
      rows: manyRows,
      pageSize: 25,
    })
    expect(container.querySelectorAll('.grid-row')).toHaveLength(25)
    expect(getByText('1–25 de 60')).toBeTruthy()

    await fireEvent.click(getByLabelText('Página siguiente'))
    expect(container.querySelectorAll('.grid-row')).toHaveLength(25)
    expect(getByText('26–50 de 60')).toBeTruthy()

    await fireEvent.click(getByLabelText('Página siguiente'))
    expect(container.querySelectorAll('.grid-row')).toHaveLength(10)
    expect(getByText('51–60 de 60')).toBeTruthy()
  })

  it('cambiar el tamaño de página reencuadra el rango', async () => {
    const { container, getByText, getByLabelText } = renderGrid({
      rows: manyRows,
      pageSize: 25,
    })
    await fireEvent.update(getByLabelText('Filas por página'), '50')
    expect(container.querySelectorAll('.grid-row')).toHaveLength(50)
    expect(getByText('1–50 de 60')).toBeTruthy()
  })

  it('no muestra el pie si hay menos filas que el tamaño mínimo', () => {
    const { queryByText } = renderGrid({ rows })
    expect(queryByText('Filas por página')).toBeNull()
  })

  it('mantiene el orden aplicado al cambiar de página', async () => {
    // 30 filas cuyo orden alfabético descendente invierte el orden natural,
    // para distinguir "página 2 del orden aplicado" de "página 2 sin ordenar".
    const ordRows = Array.from({ length: 30 }, (_, i) => ({
      id: String(i + 1),
      nombre: `Fila ${String(i + 1).padStart(2, '0')}`,
      email: `f${i + 1}@x.com`,
    }))
    const { getByText, getByLabelText, container } = renderGrid({
      rows: ordRows,
      columns: [
        { key: 'nombre', label: 'Nombre', sortable: true },
        { key: 'email', label: 'Email' },
      ],
      pageSize: 25,
    })

    // Ordena descendente: Fila 30 … Fila 01.
    await fireEvent.click(getByText('Nombre')) // asc
    await fireEvent.click(getByText('Nombre')) // desc
    expect(nombresEnOrden(container)[0]).toBe('Fila 30')

    // Página 2: debe seguir el mismo orden descendente (Fila 05 … Fila 01),
    // no reiniciarse al orden natural.
    await fireEvent.click(getByLabelText('Página siguiente'))
    expect(nombresEnOrden(container)).toEqual([
      'Fila 05',
      'Fila 04',
      'Fila 03',
      'Fila 02',
      'Fila 01',
    ])
  })
})
