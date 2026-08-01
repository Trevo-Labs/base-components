<template>
  <Story title="Componentes base/BaseCheckbox" group="base" icon="carbon:checkbox-checked">
    <Variant title="Playground">
      <template #default>
        <BaseCheckbox
          v-model="state.checked"
          :disabled="state.disabled"
          :indeterminate="state.indeterminate"
        >
          {{ state.label }}
        </BaseCheckbox>
      </template>

      <template #controls>
        <HstText v-model="state.label" title="Etiqueta" />
        <HstCheckbox v-model="state.checked" title="Marcado" />
        <HstCheckbox v-model="state.indeterminate" title="Indeterminado" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Estados">
      <div class="story-stack">
        <BaseCheckbox :model-value="false">Sin marcar</BaseCheckbox>
        <BaseCheckbox :model-value="true">Marcado</BaseCheckbox>
        <BaseCheckbox :model-value="false" indeterminate>Indeterminado</BaseCheckbox>
        <BaseCheckbox :model-value="true" disabled>Marcado y deshabilitado</BaseCheckbox>
      </div>
    </Variant>

    <Variant title="Sin etiqueta">
      <BaseCheckbox v-model="state.checked" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseCheckbox from './base-checkbox.vue'

const state = reactive({
  label: 'Acepto los términos',
  checked: true,
  indeterminate: false,
  disabled: false,
})
</script>
