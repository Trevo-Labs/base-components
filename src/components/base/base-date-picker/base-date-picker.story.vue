<template>
  <Story title="Componentes base/BaseDatePicker" group="base" icon="carbon:calendar">
    <Variant title="Playground">
      <template #default>
        <BaseDatePicker
          v-model="state.value"
          :with-time="state.withTime"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :error="state.error"
        />
        <p class="text-sm text-muted">Valor: {{ state.value || '(vacío)' }}</p>
      </template>

      <template #controls>
        <HstCheckbox v-model="state.withTime" title="Con hora" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>
    </Variant>

    <Variant title="Solo fecha">
      <BaseDatePicker v-model="state.fecha" />
    </Variant>

    <Variant title="Fecha y hora">
      <BaseDatePicker v-model="state.fechaHora" with-time />
    </Variant>

    <Variant title="Vacío">
      <BaseDatePicker model-value="" />
    </Variant>

    <Variant title="Estados">
      <div class="story-stack">
        <BaseDatePicker model-value="2026-08-01" error />
        <BaseDatePicker model-value="2026-08-01" readonly />
        <BaseDatePicker model-value="2026-08-01" disabled />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseDatePicker from './base-date-picker.vue'

const state = reactive({
  value: '2026-08-01',
  withTime: false,
  disabled: false,
  readonly: false,
  error: false,
  fecha: '2026-08-01',
  fechaHora: '2026-08-01T09:30',
})
</script>
