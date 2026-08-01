<template>
  <Story title="Componentes base/BaseTabs" group="base" icon="carbon:tab">
    <Variant title="Playground">
      <template #default>
        <BaseTabs v-model="state.active" :tabs="tabs" />
        <p class="text-sm text-muted">Tab activo: {{ state.active }}</p>
      </template>

      <template #controls>
        <HstCheckbox v-model="state.ocultarUltimo" title="Ocultar el último tab" />
      </template>
    </Variant>

    <Variant title="Por estado (v-model)">
      <BaseTabs v-model="simple" :tabs="tabsSimples" />
      <div class="story-panel" style="margin-top: 12px">Contenido de: {{ simple }}</div>
    </Variant>

    <Variant title="Con rutas">
      <BaseTabs
        :tabs="[
          { key: 'general', label: 'General', to: '/' },
          { key: 'ajustes', label: 'Ajustes', to: '/ajustes' },
        ]"
      />
      <p class="text-sm text-muted">
        Con
        <code>to</code>
        cada tab navega con RouterLink y se marca activo por la ruta.
      </p>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseTabs, { type Tab } from './base-tabs.vue'

const state = reactive({ active: 'datos', ocultarUltimo: false })

const tabs = computed<Tab[]>(() => [
  { key: 'datos', label: 'Datos' },
  { key: 'citas', label: 'Citas' },
  { key: 'facturas', label: 'Facturas' },
  { key: 'historial', label: 'Historial', hidden: state.ocultarUltimo },
])

const simple = ref('resumen')
const tabsSimples: Tab[] = [
  { key: 'resumen', label: 'Resumen' },
  { key: 'detalle', label: 'Detalle' },
]
</script>
