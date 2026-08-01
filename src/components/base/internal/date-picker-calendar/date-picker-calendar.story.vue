<template>
  <Story title="Internos/DatePickerCalendar" group="internal" icon="carbon:calendar-heat-map">
    <Variant title="Rejilla del mes">
      <div class="story-panel" style="max-width: 280px">
        <DatePickerCalendar
          :month-label="monthLabel"
          :weekdays="weekdays"
          :cells="cells"
          :selected-date="selected"
          @prev-month="mes--"
          @next-month="mes++"
          @choose-day="(iso) => (selected = iso)"
        />
      </div>
      <p class="text-sm text-muted">Seleccionado: {{ selected }}</p>
    </Variant>

    <Variant title="Nota">
      <div class="story-panel">
        <p>
          Componente
          <strong>interno</strong>
          de BaseDatePicker: no se usa suelto. Recibe las celdas ya calculadas y solo se encarga de
          pintarlas.
        </p>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DatePickerCalendar, { type DateCell } from './date-picker-calendar.vue'

const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const mes = ref(7) // agosto (0-indexado)
const anyo = 2026
const selected = ref('2026-08-01')

const monthLabel = computed(() =>
  new Date(anyo, mes.value, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
)

// Rejilla de 6 semanas empezando en lunes, igual que la que arma BaseDatePicker.
const cells = computed<DateCell[]>(() => {
  const primero = new Date(anyo, mes.value, 1)
  const offset = (primero.getDay() + 6) % 7
  const inicio = new Date(anyo, mes.value, 1 - offset)
  const hoy = new Date().toISOString().slice(0, 10)

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`
    return { iso, day: d.getDate(), inMonth: d.getMonth() === mes.value, isToday: iso === hoy }
  })
})
</script>
