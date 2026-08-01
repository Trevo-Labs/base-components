<template>
  <Story title="Componentes base/BaseBadge" group="base" icon="carbon:tag">
    <Variant title="Playground">
      <template #default>
        <BaseBadge :variant="state.variant">{{ state.label }}</BaseBadge>
      </template>

      <template #controls>
        <HstText v-model="state.label" title="Texto" />
        <HstSelect
          v-model="state.variant"
          title="Variante"
          :options="['default', 'primary', 'success', 'danger', 'warning', 'info', 'muted']"
        />
      </template>
    </Variant>

    <Variant title="Variantes">
      <div class="story-row">
        <BaseBadge variant="default">Default</BaseBadge>
        <BaseBadge variant="primary">Primary</BaseBadge>
        <BaseBadge variant="success">Activo</BaseBadge>
        <BaseBadge variant="danger">Cancelado</BaseBadge>
        <BaseBadge variant="warning">Pendiente</BaseBadge>
        <BaseBadge variant="info">Nuevo</BaseBadge>
        <BaseBadge variant="muted">Archivado</BaseBadge>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseBadge from './base-badge.vue'

const state = reactive({
  label: 'Activo',
  variant: 'success' as 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'muted',
})
</script>
