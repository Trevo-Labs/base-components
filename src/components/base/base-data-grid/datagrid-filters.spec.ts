import { describe, it, expect } from 'vitest'
import { applyFilters, emptyFilterValues, isFilterActive } from './datagrid-filters'
import type { FilterConfig } from './datagrid-filters'

// `emptyFilterValues` trabaja con el config sin genérico (como hace el grid vía
// `filtersBase`); casteamos igual para no propagar el tipo de fila al helper.
const asBase = (f: FilterConfig<Row>[]) => f as unknown as FilterConfig[]

interface Row {
  id: string
  fecha?: string
  estado: string
}

const rows: Row[] = [
  { id: 'a', fecha: '2026-01-10', estado: 'activo' },
  { id: 'b', fecha: '2026-03-15', estado: 'activo' },
  { id: 'c', fecha: '2026-06-01', estado: 'baja' },
  { id: 'd', estado: 'activo' }, // sin fecha
  { id: 'e', fecha: '2026-03-15T09:30:00.000Z', estado: 'baja' }, // fecha con hora
]

const dateFilter: FilterConfig<Row>[] = [
  { key: 'fecha', label: 'Fecha', type: 'daterange', accessor: 'fecha' },
]

function ids(result: Row[]) {
  return result.map((r) => r.id).sort()
}

describe('daterange filter', () => {
  it('filtra por ambos extremos (inclusive)', () => {
    const result = applyFilters(rows, {
      filters: dateFilter,
      values: { fecha: { from: '2026-03-01', to: '2026-03-31' } },
    })
    // b y e caen en marzo; e tiene hora pero se compara por la parte de fecha.
    expect(ids(result)).toEqual(['b', 'e'])
  })

  it('extremo "from" abierto: solo tope superior', () => {
    const result = applyFilters(rows, {
      filters: dateFilter,
      values: { fecha: { from: '', to: '2026-01-31' } },
    })
    expect(ids(result)).toEqual(['a'])
  })

  it('extremo "to" abierto: solo tope inferior', () => {
    const result = applyFilters(rows, {
      filters: dateFilter,
      values: { fecha: { from: '2026-06-01', to: '' } },
    })
    expect(ids(result)).toEqual(['c'])
  })

  it('las filas sin fecha se excluyen cuando el rango está activo', () => {
    const result = applyFilters(rows, {
      filters: dateFilter,
      values: { fecha: { from: '2026-01-01', to: '2026-12-31' } },
    })
    expect(ids(result)).not.toContain('d')
  })

  it('rango vacío (ambos extremos) no filtra nada', () => {
    const result = applyFilters(rows, {
      filters: dateFilter,
      values: { fecha: { from: '', to: '' } },
    })
    expect(result).toHaveLength(rows.length)
  })

  it('combina daterange con otro filtro (AND)', () => {
    const filters: FilterConfig<Row>[] = [
      ...dateFilter,
      { key: 'estado', label: 'Estado', type: 'select', accessor: 'estado' },
    ]
    const result = applyFilters(rows, {
      filters,
      values: { fecha: { from: '2026-01-01', to: '2026-12-31' }, estado: 'baja' },
    })
    // Con fecha en 2026 y estado baja: c y e.
    expect(ids(result)).toEqual(['c', 'e'])
  })
})

interface NumRow {
  id: string
  importe?: number | string
}

const numRows: NumRow[] = [
  { id: 'a', importe: 0 },
  { id: 'b', importe: 50 },
  { id: 'c', importe: '100.00' }, // como llega del backend (string)
  { id: 'd', importe: 250 },
  { id: 'e' }, // sin importe
]

const numFilter: FilterConfig<NumRow>[] = [
  { key: 'importe', label: 'Importe', type: 'numberrange', accessor: 'importe' },
]

function numIds(result: NumRow[]) {
  return result.map((r) => r.id).sort()
}

describe('numberrange filter', () => {
  it('filtra por ambos extremos (inclusive)', () => {
    const result = applyFilters(numRows, {
      filters: numFilter,
      values: { importe: { min: '50', max: '100' } },
    })
    // b (50) y c (100, string) entran; 100 inclusive.
    expect(numIds(result)).toEqual(['b', 'c'])
  })

  it('solo mínimo: sin tope superior', () => {
    const result = applyFilters(numRows, {
      filters: numFilter,
      values: { importe: { min: '100', max: '' } },
    })
    expect(numIds(result)).toEqual(['c', 'd'])
  })

  it('solo máximo: incluye el 0', () => {
    const result = applyFilters(numRows, {
      filters: numFilter,
      values: { importe: { min: '', max: '50' } },
    })
    expect(numIds(result)).toEqual(['a', 'b'])
  })

  it('las filas sin importe se excluyen cuando el rango está activo', () => {
    const result = applyFilters(numRows, {
      filters: numFilter,
      values: { importe: { min: '0', max: '' } },
    })
    expect(numIds(result)).not.toContain('e')
  })

  it('rango vacío no filtra nada', () => {
    const result = applyFilters(numRows, {
      filters: numFilter,
      values: { importe: { min: '', max: '' } },
    })
    expect(result).toHaveLength(numRows.length)
  })

  it('emptyFilterValues inicializa un numberrange vacío', () => {
    expect(emptyFilterValues(asBase(numFilter))).toEqual({ importe: { min: '', max: '' } })
  })

  it('isFilterActive: rango numérico vacío no está activo, con un extremo sí', () => {
    expect(isFilterActive({ min: '', max: '' })).toBe(false)
    expect(isFilterActive({ min: '0', max: '' })).toBe(true)
    expect(isFilterActive({ min: '', max: '100' })).toBe(true)
  })
})

describe('helpers de estado del filtro daterange', () => {
  it('emptyFilterValues inicializa un daterange vacío', () => {
    expect(emptyFilterValues(asBase(dateFilter))).toEqual({ fecha: { from: '', to: '' } })
  })

  it('isFilterActive: rango vacío no está activo, con un extremo sí', () => {
    expect(isFilterActive({ from: '', to: '' })).toBe(false)
    expect(isFilterActive({ from: '2026-01-01', to: '' })).toBe(true)
    expect(isFilterActive({ from: '', to: '2026-01-01' })).toBe(true)
  })
})
