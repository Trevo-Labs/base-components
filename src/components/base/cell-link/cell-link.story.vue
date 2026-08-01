<template>
  <Story title="Componentes base/CellLink" group="base" icon="carbon:link">
    <Variant title="Playground">
      <template #default>
        <CellLink :to="state.conEnlace ? '/' : null" :label="state.label" />
      </template>

      <template #controls>
        <HstText v-model="state.label" title="Etiqueta" />
        <HstCheckbox v-model="state.conEnlace" title="Con enlace" />
      </template>
    </Variant>

    <Variant title="Con y sin enlace">
      <div class="story-stack">
        <CellLink to="/" label="Marta Ruiz" />
        <CellLink :to="null" label="Sin ficha vinculada" />
        <CellLink :to="null" />
      </div>
      <p class="text-sm text-muted">
        Sin
        <code>to</code>
        ni contenido pinta un guion.
      </p>
    </Variant>

    <Variant title="Con slot">
      <CellLink to="/">
        <strong>Contenido libre</strong>
      </CellLink>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CellLink from './cell-link.vue'

const state = reactive({ label: 'Marta Ruiz', conEnlace: true })
</script>
