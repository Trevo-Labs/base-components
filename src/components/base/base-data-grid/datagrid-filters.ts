/**
 * Tipos y utilidades para el sistema de filtros de BaseDataGrid.
 *
 * Un filtro se declara como objeto `FilterConfig` y se pasa al grid vía la prop
 * `:filters`. El grid filtra las filas en memoria (client-side) combinando todos
 * los filtros activos con AND, más el buscador de texto superior.
 */

export type FilterType = 'text' | 'select' | 'multiselect' | 'boolean' | 'daterange' | 'numberrange'

/** Cómo extraer de una fila el/los valor(es) sobre los que filtra un filtro. */
export type Accessor<T = unknown> = string | string[] | ((row: T) => unknown)

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig<T = Record<string, unknown>> {
  /** Identificador único del filtro (clave en el objeto de valores). */
  key: string
  /** Nombre mostrado en el panel de filtros. */
  label: string
  /** Tipo de control que muestra el aside. */
  type: FilterType
  /**
   * De dónde sale el valor a comparar en cada fila. Puede ser el nombre de un
   * campo, varios campos (se busca en todos), o una función. Para `text` suele
   * ser un array de campos; para `select` un solo campo.
   */
  accessor: Accessor<T>
  /** Opciones para `select`/`multiselect`. Array estático o getter (opciones dinámicas). */
  options?: FilterOption[] | (() => FilterOption[])
  /** Etiqueta del `true` en un filtro `boolean` (por defecto "Sí"). */
  trueLabel?: string
  /** Etiqueta del `false` en un filtro `boolean` (por defecto "No"). */
  falseLabel?: string
}

/** Rango de fechas (ISO `YYYY-MM-DD`); cadena vacía = extremo abierto. */
export interface DateRange {
  from: string
  to: string
}

/** Rango numérico; cadena vacía en un extremo = sin límite por ese lado. */
export interface NumberRange {
  min: string
  max: string
}

/** Valor que puede tomar cada filtro en el objeto de estado. */
export type FilterValue = string | string[] | boolean | DateRange | NumberRange | null

/** Estado de todos los filtros: { [key]: valor }. */
export type FilterValues = Record<string, FilterValue>

/** Resuelve las opciones de un filtro tanto si son array como getter. */
export function resolveOptions(filter: FilterConfig): FilterOption[] {
  if (!filter.options) return []
  return typeof filter.options === 'function' ? filter.options() : filter.options
}

/** ¿El valor es un objeto plano (candidato a rango de fecha o número)? */
function isPlainObject(value: FilterValue): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** ¿El valor es un rango de fechas? (tiene `from`/`to`). */
export function isDateRange(value: FilterValue): value is DateRange {
  return isPlainObject(value) && 'from' in (value as object)
}

/** ¿El valor es un rango numérico? (tiene `min`/`max`). */
export function isNumberRange(value: FilterValue): value is NumberRange {
  return isPlainObject(value) && 'min' in (value as object)
}

/** Devuelve true si un valor de filtro cuenta como "activo" (aplica de verdad). */
export function isFilterActive(value: FilterValue): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'boolean') return true
  if (isNumberRange(value)) return value.min.trim() !== '' || value.max.trim() !== ''
  if (isDateRange(value)) return value.from.trim() !== '' || value.to.trim() !== ''
  return false
}

/** Extrae de una fila los valores apuntados por un accessor, como strings en minúscula. */
function accessorValues<T>(row: T, accessor: Accessor<T>): string[] {
  let raw: unknown[]
  if (typeof accessor === 'function') raw = [accessor(row)]
  else if (Array.isArray(accessor)) raw = accessor.map((k) => (row as Record<string, unknown>)[k])
  else raw = [(row as Record<string, unknown>)[accessor]]
  return raw.filter((v) => v !== null && v !== undefined).map((v) => String(v).toLowerCase())
}

/** ¿La fila pasa un filtro concreto con el valor dado? */
function rowMatchesFilter<T>(row: T, filter: FilterConfig<T>, value: FilterValue): boolean {
  if (!isFilterActive(value)) return true
  const values = accessorValues(row, filter.accessor)

  switch (filter.type) {
    case 'text': {
      const q = String(value).toLowerCase().trim()
      return values.some((v) => v.includes(q))
    }
    case 'select': {
      const target = String(value).toLowerCase()
      return values.some((v) => v === target)
    }
    case 'multiselect': {
      const targets = (value as string[]).map((v) => v.toLowerCase())
      return values.some((v) => targets.includes(v))
    }
    case 'boolean': {
      // El accessor debe apuntar a un campo booleano; comparamos por su string.
      const target = String(value)
      return values.some((v) => v === target)
    }
    case 'daterange': {
      const { from, to } = value as DateRange
      // Comparamos por la parte de fecha (YYYY-MM-DD): el orden lexicográfico
      // coincide con el cronológico. Vacío en un extremo = sin límite por ese lado.
      return values.some((v) => {
        const date = v.slice(0, 10)
        if (from && date < from) return false
        if (to && date > to) return false
        return true
      })
    }
    case 'numberrange': {
      const { min, max } = value as NumberRange
      // El accessor de un importe puede llegar como string ("100.00") o número;
      // `values` ya lo trae como string, así que lo reparseamos a número. Vacío
      // en un extremo = sin límite por ese lado. Valores no numéricos no pasan.
      const minN = min.trim() === '' ? null : Number(min)
      const maxN = max.trim() === '' ? null : Number(max)
      return values.some((v) => {
        const n = parseFloat(v)
        if (Number.isNaN(n)) return false
        if (minN !== null && n < minN) return false
        if (maxN !== null && n > maxN) return false
        return true
      })
    }
    default:
      return true
  }
}

/**
 * Filtra las filas aplicando el buscador de texto y todos los filtros activos.
 * `searchQuery`/`searchAccessor` cubren el buscador superior; `filters`/`values`
 * cubren el panel lateral. Todo se combina con AND.
 */
export function applyFilters<T>(
  rows: T[],
  opts: {
    searchQuery?: string
    searchAccessor?: Accessor<T>
    filters?: FilterConfig<T>[]
    values?: FilterValues
  }
): T[] {
  const { searchQuery, searchAccessor, filters = [], values = {} } = opts
  const q = (searchQuery ?? '').toLowerCase().trim()

  return rows.filter((row) => {
    // Buscador de texto superior.
    if (q && searchAccessor) {
      const searchValues = accessorValues(row, searchAccessor)
      if (!searchValues.some((v) => v.includes(q))) return false
    }
    // Filtros del panel.
    for (const filter of filters) {
      if (!rowMatchesFilter(row, filter, values[filter.key] ?? null)) return false
    }
    return true
  })
}

/** Estado inicial de los filtros: cada uno a su valor "vacío" según tipo. */
export function emptyFilterValues(filters: FilterConfig[]): FilterValues {
  const out: FilterValues = {}
  for (const f of filters) {
    if (f.type === 'multiselect') out[f.key] = []
    else if (f.type === 'boolean') out[f.key] = null
    else if (f.type === 'daterange') out[f.key] = { from: '', to: '' }
    else if (f.type === 'numberrange') out[f.key] = { min: '', max: '' }
    else out[f.key] = ''
  }
  return out
}

/** Cuántos filtros están activos (para el badge del botón de filtros). */
export function countActiveFilters(filters: FilterConfig[], values: FilterValues): number {
  return filters.reduce((n, f) => (isFilterActive(values[f.key] ?? null) ? n + 1 : n), 0)
}
