<template>
  <Story title="Componentes base/BaseSwitch" group="base" icon="carbon:toggle-right">
    <Variant title="Playground">
      <template #default>
        <BaseSwitch v-model="state.value" :disabled="state.disabled">
          {{ state.label }}
        </BaseSwitch>
      </template>

      <template #controls>
        <HstText v-model="state.label" title="Etiqueta" />
        <HstCheckbox v-model="state.value" title="Activo" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Estados">
      <div class="story-stack">
        <BaseSwitch :model-value="false">Desactivado</BaseSwitch>
        <BaseSwitch :model-value="true">Activado</BaseSwitch>
        <BaseSwitch :model-value="false" disabled>Deshabilitado</BaseSwitch>
        <BaseSwitch :model-value="true" disabled>Activado y deshabilitado</BaseSwitch>
      </div>
    </Variant>

    <Variant title="Sin etiqueta">
      <BaseSwitch v-model="state.value" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseSwitch from './base-switch.vue'

const state = reactive({
  label: 'Recibir notificaciones',
  value: true,
  disabled: false,
})
</script>
