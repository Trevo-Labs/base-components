import { computed, ref, useId, watch, type ComputedRef, type Ref } from 'vue'

/**
 * Paginación en cliente del BaseDataGrid. Se aplica **después** de filtrar y
 * ordenar: recibe las filas ya procesadas.
 */
export function useGridPagination<T>(
  rows: ComputedRef<T[]> | Ref<T[]>,
  options: { pageSize: number; pageSizeOptions: () => number[] }
) {
  const pageSizeId = useId()
  const pageSize = ref(options.pageSize)
  const currentPage = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / pageSize.value)))

  // El pie solo aparece si hay filas de sobra para justificar más de una página
  // en el tamaño más pequeño disponible.
  const showPagination = computed(() => rows.value.length > Math.min(...options.pageSizeOptions()))

  /** Filas realmente renderizadas: solo la página actual. */
  const visibleRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return rows.value.slice(start, start + pageSize.value)
  })

  const rangeStart = computed(() =>
    rows.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
  )
  const rangeEnd = computed(() => Math.min(currentPage.value * pageSize.value, rows.value.length))

  function goToPage(page: number) {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value)
  }

  // Si cambian el tamaño de página, el filtrado o el orden reducen el total por
  // debajo de la página actual, reencuadra a la última página válida (o a la 1).
  watch([pageSize, () => rows.value.length], () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  })

  return {
    pageSizeId,
    pageSize,
    currentPage,
    totalPages,
    showPagination,
    visibleRows,
    rangeStart,
    rangeEnd,
    goToPage,
  }
}
