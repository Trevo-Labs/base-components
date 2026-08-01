import { computed, ref, type ComputedRef, type Ref } from 'vue'

export type SortDir = 'asc' | 'desc'

export interface SortState {
  key: string | null
  dir: SortDir
}

/** Lo mínimo que el ordenador necesita saber de una columna. */
export interface SortableColumn {
  key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortable?: boolean | ((row: any) => unknown)
}

/** Compara dos valores: numérico si ambos lo son, si no localeCompare por string. */
function compareValues(a: unknown, b: unknown): number {
  const aNil = a === null || a === undefined
  const bNil = b === null || b === undefined
  if (aNil && bNil) return 0
  if (aNil) return 1 // nulos al final
  if (bNil) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' })
}

/**
 * Ordenación por columna del BaseDataGrid: estado, ciclo asc → desc → sin orden
 * y las filas ya ordenadas.
 */
export function useGridSort<T>(rows: ComputedRef<T[]> | Ref<T[]>, columns: () => SortableColumn[]) {
  const sortState = ref<SortState>({ key: null, dir: 'asc' })

  function isSortable(col: SortableColumn): boolean {
    return !!col.sortable
  }

  /** Clic en cabecera: cicla asc → desc → sin orden para esa columna. */
  function toggleSort(col: SortableColumn) {
    if (sortState.value.key !== col.key) {
      sortState.value = { key: col.key, dir: 'asc' }
    } else if (sortState.value.dir === 'asc') {
      sortState.value = { key: col.key, dir: 'desc' }
    } else {
      sortState.value = { key: null, dir: 'asc' }
    }
  }

  function ariaSort(col: SortableColumn): 'ascending' | 'descending' | 'none' | undefined {
    if (!isSortable(col)) return undefined
    if (sortState.value.key !== col.key) return 'none'
    return sortState.value.dir === 'asc' ? 'ascending' : 'descending'
  }

  /** Valor por el que se compara una fila en la columna activa. */
  function sortValue(row: T, col: SortableColumn): unknown {
    return typeof col.sortable === 'function'
      ? col.sortable(row)
      : (row as Record<string, unknown>)[col.key]
  }

  /** Filas ordenadas si hay columna activa; si no, las de entrada tal cual. */
  const sortedRows = computed(() => {
    const { key, dir } = sortState.value
    if (!key) return rows.value
    const col = columns().find((c) => c.key === key)
    if (!col) return rows.value
    const factor = dir === 'asc' ? 1 : -1
    return [...rows.value].sort(
      (a, b) => compareValues(sortValue(a, col), sortValue(b, col)) * factor
    )
  })

  return { sortState, sortedRows, isSortable, toggleSort, ariaSort }
}
