<template>
  <Story title="Componentes base/BaseDropdown" group="base" icon="carbon:overflow-menu-vertical">
    <Variant title="Playground">
      <template #default>
        <BaseDropdown :label="state.label">
          <template #default="{ close }">
            <button class="dropdown-item" @click="close()">Ver detalle</button>
            <button class="dropdown-item" @click="close()">Editar</button>
            <button class="dropdown-item dropdown-item--danger" @click="close()">Eliminar</button>
          </template>
        </BaseDropdown>
      </template>

      <template #controls>
        <HstText v-model="state.label" title="aria-label" />
      </template>
    </Variant>

    <Variant title="Trigger personalizado">
      <BaseDropdown>
        <template #trigger>
          <span class="story-trigger">Acciones</span>
        </template>
        <template #default="{ close }">
          <button class="dropdown-item" @click="close()">Duplicar</button>
          <button class="dropdown-item" @click="close()">Exportar</button>
        </template>
      </BaseDropdown>
    </Variant>

    <Variant title="En una fila de tabla">
      <div class="story-panel story-row" style="justify-content: space-between">
        <span>Marta Ruiz</span>
        <BaseDropdown>
          <template #default="{ close }">
            <button class="dropdown-item" @click="close()">Ver ficha</button>
            <button class="dropdown-item dropdown-item--danger" @click="close()">Eliminar</button>
          </template>
        </BaseDropdown>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseDropdown from './base-dropdown.vue'

const state = reactive({ label: 'Acciones' })
</script>

<style scoped>
.story-trigger {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-primary);
}
</style>
