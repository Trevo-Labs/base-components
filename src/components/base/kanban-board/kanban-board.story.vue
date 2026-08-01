<template>
  <Story title="Componentes base/KanbanBoard" group="base" icon="carbon:web-services-container">
    <Variant title="Playground">
      <template #default>
        <KanbanBoard
          :columns="columns"
          :items="items"
          :column-key="(item: Trato) => item.estado"
          :item-id="(item: Trato) => item.id"
          :card="state.card"
          :stats="state.conStats ? stats : undefined"
          :empty-text="state.emptyText"
          @move-item="mover"
          @remove-column="ocultarColumna"
        >
          <template #default="{ item }">
            <span class="font-medium">{{ item.nombre }}</span>
            <span class="text-sm text-muted">{{ item.importe }} €</span>
          </template>
        </KanbanBoard>
      </template>

      <template #controls>
        <HstCheckbox v-model="state.card" title="Estilo tarjeta" />
        <HstCheckbox v-model="state.conStats" title="Con métricas" />
        <HstText v-model="state.emptyText" title="Texto de columna vacía" />
      </template>
    </Variant>

    <Variant title="Con acciones por tarjeta">
      <KanbanBoard
        :columns="columns"
        :items="items"
        :column-key="(item: Trato) => item.estado"
        :item-id="(item: Trato) => item.id"
        card
        @move-item="mover"
      >
        <template #default="{ item }">
          <span class="font-medium">{{ item.nombre }}</span>
        </template>
        <template #actions="{ item }">
          <button class="kanban-btn kanban-btn--success" @click="mover(item.id, 'ganado')">
            Ganar
          </button>
          <button class="kanban-btn kanban-btn--danger" @click="mover(item.id, 'perdido')">
            Perder
          </button>
        </template>
      </KanbanBoard>
    </Variant>

    <Variant title="Vacío">
      <KanbanBoard
        :columns="columns"
        :items="[]"
        :column-key="(item: Trato) => item.estado"
        :item-id="(item: Trato) => item.id"
        empty-text="Nada por aquí"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import KanbanBoard, { type KanbanColumn, type KanbanStat } from './kanban-board.vue'

type Estado = 'nuevo' | 'contactado' | 'propuesta' | 'ganado' | 'perdido'

interface Trato {
  id: string
  nombre: string
  importe: number
  estado: Estado
}

const state = reactive({ card: true, conStats: true, emptyText: 'Sin elementos' })

const columns = ref<KanbanColumn<Estado>[]>([
  { key: 'nuevo', label: 'Nuevo' },
  { key: 'contactado', label: 'Contactado' },
  { key: 'propuesta', label: 'Propuesta' },
  { key: 'ganado', label: 'Ganado', variant: 'success', removable: true },
  { key: 'perdido', label: 'Perdido', variant: 'danger', removable: true },
])

const items = ref<Trato[]>([
  { id: '1', nombre: 'Reforma oficina', importe: 12000, estado: 'nuevo' },
  { id: '2', nombre: 'Mantenimiento anual', importe: 4800, estado: 'contactado' },
  { id: '3', nombre: 'Instalación clima', importe: 9500, estado: 'propuesta' },
  { id: '4', nombre: 'Revisión eléctrica', importe: 1200, estado: 'ganado' },
])

const stats: KanbanStat[] = [
  { label: 'En curso', value: 3 },
  { label: 'Ganado', value: '1.200 €', variant: 'success' },
  { label: 'Perdido', value: '0 €', variant: 'danger' },
]

function mover(id: string, estado: Estado) {
  const trato = items.value.find((t) => t.id === id)
  if (trato) trato.estado = estado
}

function ocultarColumna(key: Estado) {
  columns.value = columns.value.filter((c) => c.key !== key)
}
</script>
