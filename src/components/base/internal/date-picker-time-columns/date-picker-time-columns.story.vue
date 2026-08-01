<template>
  <Story title="Internos/DatePickerTimeColumns" group="internal" icon="carbon:time">
    <Variant title="Columnas de hora y minuto">
      <div class="story-panel" style="max-width: 160px">
        <DatePickerTimeColumns
          :selected-hour="hora"
          :selected-minute="minuto"
          @choose-hour="(h) => (hora = h)"
          @choose-minute="(m) => (minuto = m)"
        />
      </div>
      <p class="text-sm text-muted">
        Seleccionado: {{ String(hora).padStart(2, '0') }}:{{ String(minuto).padStart(2, '0') }}
      </p>
    </Variant>

    <Variant title="Sin selección">
      <div class="story-panel" style="max-width: 160px">
        <DatePickerTimeColumns :selected-hour="null" :selected-minute="null" />
      </div>
    </Variant>

    <Variant title="Nota">
      <div class="story-panel">
        <p>
          Componente
          <strong>interno</strong>
          de BaseDatePicker: aparece en el panel cuando se usa con
          <code>with-time</code>
          . Los minutos van de 5 en 5.
        </p>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DatePickerTimeColumns from './date-picker-time-columns.vue'

const hora = ref(9)
const minuto = ref(30)
</script>
