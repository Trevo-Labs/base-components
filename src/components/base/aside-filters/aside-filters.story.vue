<template>
  <Story title="Componentes base/AsideFilters" group="base" icon="carbon:filter">
    <Variant title="Playground">
      <template #default>
        <div class="story-stack">
          <BaseButton size="sm" @click="state.open = true">Abrir filtros</BaseButton>
          <div class="story-panel">
            <p class="text-sm font-semibold">Valores aplicados</p>
            <pre class="text-xs">{{ values }}</pre>
          </div>
        </div>
        <AsideFilters v-model="state.open" :filters="filters" :values="values" @apply="onApply" />
      </template>

      <template #controls>
        <HstCheckbox v-model="state.open" title="Abierto" />
      </template>
    </Variant>

    <Variant title="Todos los tipos de filtro">
      <BaseButton size="sm" @click="demo.open = true">Abrir</BaseButton>
      <AsideFilters
        v-model="demo.open"
        :filters="filters"
        :values="demo.values"
        @apply="(v) => (demo.values = v)"
      />
      <p class="text-sm text-muted">
        text · select · multiselect · boolean · daterange · numberrange
      </p>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AsideFilters from './aside-filters.vue'
import BaseButton from '../base-button/base-button.vue'
import {
  emptyFilterValues,
  type FilterConfig,
  type FilterValues,
} from '../base-data-grid/datagrid.filters'

const filters: FilterConfig[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', accessor: 'nombre' },
  {
    key: 'estado',
    label: 'Estado',
    type: 'select',
    accessor: 'estado',
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
    ],
  },
  {
    key: 'etiquetas',
    label: 'Etiquetas',
    type: 'multiselect',
    accessor: 'etiquetas',
    options: [
      { value: 'vip', label: 'VIP' },
      { value: 'moroso', label: 'Moroso' },
      { value: 'nuevo', label: 'Nuevo' },
    ],
  },
  {
    key: 'facturable',
    label: 'Facturable',
    type: 'boolean',
    accessor: 'facturable',
    trueLabel: 'Sí',
    falseLabel: 'No',
  },
  { key: 'alta', label: 'Fecha de alta', type: 'daterange', accessor: 'alta' },
  { key: 'importe', label: 'Importe', type: 'numberrange', accessor: 'importe' },
]

const state = reactive({ open: false })
const values = ref<FilterValues>(emptyFilterValues(filters))

function onApply(nuevos: FilterValues) {
  values.value = nuevos
}

const demo = reactive({ open: false, values: emptyFilterValues(filters) })
</script>
