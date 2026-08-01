<template>
  <div class="grid-wrapper">
    <!-- Toolbar superior: buscador + botón de filtros. Actúa como un grid-head
         por encima del de columnas. Solo aparece si hay búsqueda o filtros. -->
    <div v-if="searchable || filters.length" class="grid-toolbar">
      <div v-if="searchable" class="grid-search">
        <Search :size="16" class="grid-search-icon" />
        <input
          v-model="searchQuery"
          class="grid-search-input"
          type="search"
          :placeholder="searchPlaceholder"
        />
      </div>
      <button
        v-if="filters.length"
        type="button"
        class="grid-filter-btn"
        :class="{ 'grid-filter-btn--active': activeCount > 0 }"
        @click="showFilters = true"
      >
        <SlidersHorizontal :size="16" />
        Filtros
        <span v-if="activeCount" class="grid-filter-badge">{{ activeCount }}</span>
      </button>
    </div>

    <div v-if="loading" class="grid-loading">
      <span class="grid-spinner" />
      <span>Cargando...</span>
    </div>

    <div v-else-if="error" class="grid-error" role="alert">
      <p class="grid-error-msg">{{ error }}</p>
      <button type="button" class="grid-error-retry" @click="emit('retry')">Reintentar</button>
    </div>

    <BaseEmptyState v-else-if="!visibleRows.length">
      <slot name="empty">
        <p>No hay datos para mostrar.</p>
      </slot>
    </BaseEmptyState>

    <div v-else class="grid" role="table">
      <!-- Barra de acciones masivas: sustituye a la cabecera cuando hay selección. -->
      <div v-if="selectable && selectedCount" class="grid-bulk-bar" role="row">
        <BaseCheckbox
          :model-value="allSelected"
          :indeterminate="someSelected"
          @update:model-value="toggleAll"
        />
        <span class="grid-bulk-count">
          {{ selectedCount }} seleccionada{{ selectedCount === 1 ? '' : 's' }}
        </span>
        <div class="grid-bulk-actions">
          <slot name="bulk-actions" :rows="selectedRows" :clear="clearSelection" />
        </div>
        <button
          type="button"
          class="grid-bulk-clear"
          aria-label="Deseleccionar"
          @click="clearSelection"
        >
          <X :size="16" />
        </button>
      </div>

      <div v-else class="grid-head" role="row" :style="gridStyle">
        <div v-if="selectable" class="grid-th grid-th--check" role="columnheader">
          <BaseCheckbox
            :model-value="allSelected"
            :indeterminate="someSelected"
            @update:model-value="toggleAll"
          />
        </div>
        <div
          v-for="col in columns"
          :key="col.key"
          class="grid-th"
          :class="[alignClass(col), { 'grid-th--sortable': isSortable(col) }]"
          :style="col.maxWidth ? { maxWidth: col.maxWidth } : undefined"
          role="columnheader"
          :aria-sort="ariaSort(col)"
          :tabindex="isSortable(col) ? 0 : undefined"
          @click="isSortable(col) && toggleSort(col)"
          @keydown.enter.prevent="isSortable(col) && toggleSort(col)"
          @keydown.space.prevent="isSortable(col) && toggleSort(col)"
        >
          <span v-ellipsis class="grid-th-label">{{ col.label }}</span>
          <span v-if="isSortable(col)" class="grid-th-sort" aria-hidden="true">
            <ChevronUp
              v-if="sortState.key === col.key && sortState.dir === 'asc'"
              :size="14"
              class="grid-th-sort-icon grid-th-sort-icon--active"
            />
            <ChevronDown
              v-else-if="sortState.key === col.key && sortState.dir === 'desc'"
              :size="14"
              class="grid-th-sort-icon grid-th-sort-icon--active"
            />
            <ChevronsUpDown v-else :size="14" class="grid-th-sort-icon" />
          </span>
        </div>
        <div v-if="$slots.actions" class="grid-th grid-th--actions" role="columnheader">
          Acciones
        </div>
      </div>

      <div
        v-for="(row, i) in visibleRows"
        :key="rowKey ? ((row as Record<string, unknown>)[rowKey] as string) : i"
        :class="[
          'grid-row',
          { 'grid-row--clickable': hasRowClick, 'grid-row--selected': isSelected(row) },
        ]"
        :style="gridStyle"
        role="row"
        @click="emit('row-click', row)"
      >
        <div v-if="selectable" class="grid-td grid-td--check" role="cell" @click.stop>
          <BaseCheckbox :model-value="isSelected(row)" @update:model-value="toggleRow(row)" />
        </div>
        <div
          v-for="col in columns"
          :key="col.key"
          class="grid-td"
          :class="alignClass(col)"
          :style="col.maxWidth ? { maxWidth: col.maxWidth } : undefined"
          role="cell"
        >
          <template v-if="$slots[`cell-${col.key}`]">
            <slot :name="`cell-${col.key}`" :row="row" :value="cellValue(row, col.key)" />
          </template>
          <span v-else v-ellipsis class="grid-td-text">{{ cellValue(row, col.key) ?? '—' }}</span>
        </div>
        <div v-if="$slots.actions" class="grid-td grid-td--actions" role="cell" @click.stop>
          <slot name="actions" :row="row" />
        </div>
      </div>
    </div>

    <!-- Pie de paginación: selector de tamaño + navegación. Solo si hay paginación
         activa y suficientes filas como para que tenga sentido mostrarlo. -->
    <div v-if="showPagination" class="grid-pagination">
      <div class="grid-pagination-size">
        <label :for="pageSizeId">Filas por página</label>
        <select :id="pageSizeId" v-model.number="pageSize" class="grid-pagination-select">
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
      <div class="grid-pagination-nav">
        <span class="grid-pagination-range">
          {{ rangeStart }}–{{ rangeEnd }} de {{ sortedRows.length }}
        </span>
        <button
          type="button"
          class="grid-pagination-btn"
          :disabled="currentPage <= 1"
          aria-label="Página anterior"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft :size="16" />
        </button>
        <span class="grid-pagination-page">{{ currentPage }} / {{ totalPages }}</span>
        <button
          type="button"
          class="grid-pagination-btn"
          :disabled="currentPage >= totalPages"
          aria-label="Página siguiente"
          @click="goToPage(currentPage + 1)"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <AsideFilters
      v-if="filters.length"
      v-model="showFilters"
      :filters="filtersBase"
      :values="filterValues"
      @apply="onApplyFilters"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import './base-data-grid.css'
import { computed, getCurrentInstance, ref, useSlots } from 'vue'
import type { Directive } from 'vue'
import {
  X,
  Search,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import BaseEmptyState from '../base-empty-state/base-empty-state.vue'
import AsideFilters from '../aside-filters/aside-filters.vue'
import {
  applyFilters,
  emptyFilterValues,
  countActiveFilters,
  type FilterConfig,
  type FilterValues,
  type Accessor,
} from './datagrid-filters'
import BaseCheckbox from '../base-checkbox/base-checkbox.vue'
import { useGridSort } from './use-grid-sort'
import { useGridPagination } from './use-grid-pagination'

defineOptions({ inheritAttrs: false })

interface Column {
  key: string
  label: string
  /** Proporción de reparto del espacio libre (flex-grow). Por defecto 1. */
  flex?: number
  /**
   * Ancho de la columna. Un número plano (ej. '1', '3') se interpreta como
   * proporción flex, igual que `flex`. Un valor con unidad (ej. '120px', '8rem')
   * se usa como ancho fijo y tiene prioridad sobre `flex`.
   */
  width?: string
  /** Tope de ancho para una columna flexible (ej. '320px'); evita que domine en tablas anchas. */
  maxWidth?: string
  /** Alineación del contenido. Por defecto 'left'. */
  align?: 'left' | 'center' | 'right'
  /**
   * Permite ordenar por esta columna al clicar la cabecera. Si es una función,
   * se usa como valor de comparación; si no, se ordena por el campo `key` de la fila.
   * El parámetro es `any` a propósito: cada vista tipa su accessor con su propia
   * fila (p.ej. `(t: Tarea) => ...`), y un parámetro `unknown` rompería esa
   * asignación por contravarianza. El grid siempre le pasa la fila completa.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortable?: boolean | ((row: any) => unknown)
}

// Pone `title` con el texto solo cuando el contenido está truncado por overflow,
// para que el tooltip nativo aparezca únicamente si de verdad hay ellipsis.
const vEllipsis: Directive<HTMLElement> = {
  mounted: setTitleIfOverflow,
  updated: setTitleIfOverflow,
}

function setTitleIfOverflow(el: HTMLElement) {
  const overflows = el.scrollWidth > el.clientWidth
  if (overflows) el.setAttribute('title', el.textContent?.trim() ?? '')
  else el.removeAttribute('title')
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    rows: T[]
    rowKey?: string
    loading?: boolean
    /** Mensaje de error de carga. Si se pasa, el grid muestra el estado de error con reintento. */
    error?: string | null
    actionsWidth?: string
    /** Activa la columna de selección múltiple y la barra de acciones masivas. */
    selectable?: boolean
    /** Muestra el buscador de texto en la toolbar superior. */
    searchable?: boolean
    /** Placeholder del buscador. */
    searchPlaceholder?: string
    /** Campo(s) sobre los que busca el buscador de texto. */
    searchAccessor?: Accessor<T>
    /** Filtros del panel lateral. Si se pasan, aparece el botón "Filtros". */
    filters?: FilterConfig<T>[]
    /** Tamaño de página inicial. Debe estar en `pageSizeOptions`. Por defecto 25. */
    pageSize?: number
    /** Opciones del selector de tamaño de página. */
    pageSizeOptions?: number[]
  }>(),
  {
    actionsWidth: '110px',
    searchPlaceholder: 'Buscar...',
    filters: () => [],
    pageSize: 25,
    pageSizeOptions: () => [25, 50, 100, 150, 200],
  }
)

const emit = defineEmits<{ 'row-click': [row: T]; retry: [] }>()

// Filas seleccionadas (v-model:selected). La vista decide qué hacer con ellas.
const selected = defineModel<T[]>('selected', { default: () => [] })

const slots = useSlots()

// ── Búsqueda y filtros ──────────────────────────────────────────────────────
// El grid es genérico en T, pero AsideFilters y las utilidades tratan la fila
// como un registro plano. Exponemos los filtros como `FilterConfig` sin genérico
// para casar los tipos sin propagar T a todo el subsistema de filtros.
const filtersBase = computed(() => props.filters as FilterConfig[])

const searchQuery = ref('')
const showFilters = ref(false)
const filterValues = ref<FilterValues>(emptyFilterValues(filtersBase.value))

const activeCount = computed(() => countActiveFilters(filtersBase.value, filterValues.value))

function onApplyFilters(values: FilterValues) {
  filterValues.value = values
}

/** Filas ya filtradas por buscador + panel (sin ordenar ni paginar todavía). */
const filteredRows = computed(() =>
  applyFilters(props.rows, {
    searchQuery: props.searchable ? searchQuery.value : '',
    searchAccessor: props.searchAccessor,
    filters: props.filters,
    values: filterValues.value,
  })
)

// ── Ordenación por columna ──────────────────────────────────────────────────
const { sortState, sortedRows, isSortable, toggleSort, ariaSort } = useGridSort<T>(
  filteredRows,
  () => props.columns
)

// ── Paginación ──────────────────────────────────────────────────────────────
const {
  pageSizeId,
  pageSize,
  currentPage,
  totalPages,
  showPagination,
  visibleRows,
  rangeStart,
  rangeEnd,
  goToPage,
} = useGridPagination<T>(sortedRows, {
  pageSize: props.pageSize,
  pageSizeOptions: () => props.pageSizeOptions,
})

// ── Selección múltiple ─────────────────────────────────────────────────────
function keyOf(row: T): unknown {
  return props.rowKey ? (row as Record<string, unknown>)[props.rowKey] : row
}
const selectedKeys = computed(() => new Set(selected.value.map(keyOf)))
function isSelected(row: T): boolean {
  return selectedKeys.value.has(keyOf(row))
}
const selectedRows = computed(() => selected.value)
const selectedCount = computed(() => selected.value.length)
const allSelected = computed(
  () => visibleRows.value.length > 0 && selectedCount.value === visibleRows.value.length
)
const someSelected = computed(() => selectedCount.value > 0 && !allSelected.value)

function toggleRow(row: T) {
  selected.value = isSelected(row)
    ? selected.value.filter((r) => keyOf(r) !== keyOf(row))
    : [...selected.value, row]
}
function toggleAll() {
  selected.value = allSelected.value ? [] : [...visibleRows.value]
}
function clearSelection() {
  selected.value = []
}

// `row-click` está declarado como emit, así que Vue lo consume y no aparece en
// `attrs`. Lo detectamos en los props crudos del vnode (donde sí figura como
// `onRowClick`) para saber si las filas son clicables.
const instance = getCurrentInstance()
const hasRowClick = computed(() => !!instance?.vnode.props?.onRowClick)

// Acceso genérico al valor de una celda. En una función (no en el template)
// para no meter casts con `<...>` dentro de interpolaciones {{ }}, que rompen
// el parser HTML de Prettier.
function cellValue(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

// Resuelve el track de una columna. `width` con unidad (ej. '120px') → track fijo.
// `width` numérico plano (ej. '3') o `flex` → reparto proporcional con
// `minmax(0, Nfr)`: el `0` permite encoger por debajo del contenido, lo que activa
// el ellipsis y evita cualquier desbordamiento horizontal.
function trackOf(c: Column): string {
  const flexFromWidth = c.width && /^\d+(\.\d+)?$/.test(c.width.trim()) ? Number(c.width) : null
  if (c.width && flexFromWidth === null) return c.width
  const fr = flexFromWidth ?? c.flex ?? 1
  return `minmax(0, ${fr}fr)`
}

const gridStyle = computed(() => {
  const cols = props.columns.map(trackOf)
  if (props.selectable) cols.unshift('44px')
  if (slots.actions) cols.push(props.actionsWidth)
  return { gridTemplateColumns: cols.join(' ') }
})

function alignClass(col: Column) {
  return col.align && col.align !== 'left' ? `grid-align-${col.align}` : ''
}
</script>
