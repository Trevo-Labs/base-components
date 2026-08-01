<template>
  <Story title="Componentes base/BaseDataGrid" group="base" icon="carbon:table">
    <Variant title="Playground">
      <template #default>
        <BaseDataGrid
          :columns="columns"
          :rows="rows"
          row-key="id"
          :loading="state.loading"
          :error="state.error || null"
          :selectable="state.selectable"
          :searchable="state.searchable"
          :search-accessor="['nombre', 'email']"
          :filters="state.conFiltros ? filters : []"
          :page-size="state.pageSize"
          @row-click="onRowClick"
          @retry="state.error = ''"
        >
          <template #cell-nombre="{ row }">
            <CellLink to="/" :label="row.nombre" />
          </template>
          <template #cell-estado="{ row }">
            <BaseBadge :variant="row.estado === 'Activo' ? 'success' : 'muted'">
              {{ row.estado }}
            </BaseBadge>
          </template>
        </BaseDataGrid>
        <p v-if="ultimaFila" class="text-sm text-muted">Última fila pulsada: {{ ultimaFila }}</p>
      </template>

      <template #controls>
        <HstCheckbox v-model="state.searchable" title="Buscador" />
        <HstCheckbox v-model="state.conFiltros" title="Filtros" />
        <HstCheckbox v-model="state.selectable" title="Selección múltiple" />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstText v-model="state.error" title="Mensaje de error" />
        <HstSelect v-model="state.pageSize" title="Filas por página" :options="[25, 50, 100]" />
      </template>
    </Variant>

    <Variant title="Básico">
      <BaseDataGrid :columns="columns" :rows="rows" row-key="id" />
    </Variant>

    <Variant title="Con acciones por fila">
      <BaseDataGrid :columns="columns" :rows="rows" row-key="id">
        <template #actions="{ row }">
          <BaseDropdown>
            <template #default="{ close }">
              <button class="dropdown-item" @click="close()">Ver {{ row.nombre }}</button>
              <button class="dropdown-item dropdown-item--danger" @click="close()">Eliminar</button>
            </template>
          </BaseDropdown>
        </template>
      </BaseDataGrid>
    </Variant>

    <Variant title="Cargando">
      <BaseDataGrid :columns="columns" :rows="[]" loading />
    </Variant>

    <Variant title="Error">
      <BaseDataGrid :columns="columns" :rows="[]" error="No se han podido cargar los datos." />
    </Variant>

    <Variant title="Vacío">
      <BaseDataGrid :columns="columns" :rows="[]" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseDataGrid from './base-data-grid.vue'
import type { FilterConfig } from './datagrid.filters'
import BaseBadge from '../base-badge/base-badge.vue'
import BaseDropdown from '../base-dropdown/base-dropdown.vue'
import CellLink from '../cell-link/cell-link.vue'

interface Cliente extends Record<string, unknown> {
  id: string
  nombre: string
  email: string
  estado: string
  facturado: number
  alta: string
}

const state = reactive({
  searchable: true,
  conFiltros: true,
  selectable: false,
  loading: false,
  error: '',
  pageSize: 25,
})

const ultimaFila = ref('')

const columns = [
  { key: 'nombre', label: 'Nombre', flex: 2, sortable: true },
  { key: 'email', label: 'Email', flex: 2 },
  { key: 'estado', label: 'Estado', width: '120px', align: 'center' as const },
  { key: 'facturado', label: 'Facturado', width: '120px', align: 'right' as const, sortable: true },
  { key: 'alta', label: 'Alta', width: '110px', sortable: true },
]

const rows: Cliente[] = [
  {
    id: '1',
    nombre: 'Marta Ruiz',
    email: 'marta@ejemplo.com',
    estado: 'Activo',
    facturado: 12400,
    alta: '2024-03-12',
  },
  {
    id: '2',
    nombre: 'Luis Ferrer',
    email: 'luis@ejemplo.com',
    estado: 'Activo',
    facturado: 8300,
    alta: '2024-07-04',
  },
  {
    id: '3',
    nombre: 'Ana Soler',
    email: 'ana@ejemplo.com',
    estado: 'Inactivo',
    facturado: 1500,
    alta: '2025-01-22',
  },
  {
    id: '4',
    nombre: 'Jorge Marín',
    email: 'jorge@ejemplo.com',
    estado: 'Activo',
    facturado: 22100,
    alta: '2025-05-30',
  },
]

const filters: FilterConfig<Cliente>[] = [
  {
    key: 'estado',
    label: 'Estado',
    type: 'select',
    accessor: 'estado',
    options: [
      { value: 'Activo', label: 'Activo' },
      { value: 'Inactivo', label: 'Inactivo' },
    ],
  },
  { key: 'alta', label: 'Fecha de alta', type: 'daterange', accessor: 'alta' },
  { key: 'facturado', label: 'Facturado', type: 'numberrange', accessor: 'facturado' },
]

function onRowClick(row: Cliente) {
  ultimaFila.value = row.nombre
}
</script>
