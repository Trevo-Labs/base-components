<template>
  <div class="kanban-board">
    <div v-if="stats?.length" class="stats">
      <div
        v-for="stat in stats"
        :key="stat.label"
        :class="['stat', stat.variant ? `stat--${stat.variant}` : '']"
      >
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.value }}</span>
      </div>
    </div>

    <div class="board">
      <div
        v-for="col in columns"
        :key="col.key"
        :class="['col', col.variant ? `col--${col.variant}` : '']"
      >
        <div class="col-header">
          <span class="col-name">{{ col.label }}</span>
          <div class="col-header-end">
            <span class="col-count">{{ itemsByColumn[col.key]?.length ?? 0 }}</span>
            <button
              v-if="col.removable"
              type="button"
              class="col-hide"
              title="Ocultar columna"
              @click="emit('remove-column', col.key)"
            >
              <X :size="14" />
            </button>
          </div>
        </div>
        <div class="col-body" @dragover.prevent @drop="onDrop($event, col.key)">
          <div
            v-for="item in itemsByColumn[col.key] ?? []"
            :key="itemKey(item)"
            :class="['item', { 'item--card': card }]"
            draggable="true"
            @dragstart="onDragStart($event, itemKey(item))"
            @click="emit('item-click', item)"
          >
            <slot :item="item" />
            <div v-if="$slots.actions" class="item-actions" @click.stop>
              <slot name="actions" :item="item" />
            </div>
          </div>
          <div v-if="!itemsByColumn[col.key]?.length" class="col-empty">
            {{ emptyText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T, K extends string">
import './kanban-board.css'
import { computed, useSlots } from 'vue'
import { X } from 'lucide-vue-next'

export interface KanbanColumn<K extends string> {
  key: K
  label: string
  /** Pinta la columna como terminal (p. ej. cierre): éxito o peligro. */
  variant?: 'success' | 'danger'
  /** Muestra un botón para ocultar la columna del tablero (solo columnas terminales). */
  removable?: boolean
}

export interface KanbanStat {
  label: string
  value: string | number
  variant?: 'success' | 'danger'
}

const props = withDefaults(
  defineProps<{
    columns: KanbanColumn<K>[]
    items: T[]
    columnKey: (item: T) => K
    itemId: (item: T) => string
    emptyText?: string
    /** Aplica el estilo de tarjeta (borde, sombra, hover) a cada item. */
    card?: boolean
    /** Barra de métricas opcional encima del tablero. */
    stats?: KanbanStat[]
  }>(),
  {
    emptyText: 'Sin elementos',
    card: false,
    stats: undefined,
  }
)

const emit = defineEmits<{
  'move-item': [id: string, column: K]
  'item-click': [item: T]
  'remove-column': [column: K]
}>()

const $slots = useSlots()

const itemsByColumn = computed(() => {
  const map = {} as Record<K, T[]>
  for (const item of props.items) {
    const key = props.columnKey(item)
    ;(map[key] ??= []).push(item)
  }
  return map
})

function itemKey(item: T) {
  return props.itemId(item)
}

let draggingId = ''

function onDragStart(e: DragEvent, id: string) {
  draggingId = id
  e.dataTransfer?.setData('text/plain', id)
}

function onDrop(e: DragEvent, column: K) {
  e.preventDefault()
  const id = draggingId || e.dataTransfer?.getData('text/plain')
  if (!id) return
  emit('move-item', id, column)
}
</script>
