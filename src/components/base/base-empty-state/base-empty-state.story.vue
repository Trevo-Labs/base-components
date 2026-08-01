<template>
  <Story title="Componentes base/BaseEmptyState" group="base" icon="carbon:document-blank">
    <Variant title="Playground">
      <template #default>
        <BaseEmptyState :text="state.text" :compact="state.compact" :panel="state.panel" />
      </template>

      <template #controls>
        <HstText v-model="state.text" title="Texto" />
        <HstCheckbox v-model="state.compact" title="Compacto" />
        <HstCheckbox v-model="state.panel" title="Panel" />
      </template>
    </Variant>

    <Variant title="Por defecto">
      <BaseEmptyState text="No hay resultados." />
    </Variant>

    <Variant title="Compacto">
      <BaseEmptyState text="No hay notas." compact />
    </Variant>

    <Variant title="Panel">
      <BaseEmptyState text="Todavía no hay nada aquí." panel />
    </Variant>

    <Variant title="Con icono y acción">
      <BaseEmptyState text="No hay clientes que mostrar.">
        <template #icon>
          <Users :size="32" />
        </template>
        <BaseButton size="sm">Crear cliente</BaseButton>
      </BaseEmptyState>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Users } from 'lucide-vue-next'
import BaseEmptyState from './base-empty-state.vue'
import BaseButton from '../base-button/base-button.vue'

const state = reactive({
  text: 'No hay resultados.',
  compact: false,
  panel: false,
})
</script>
