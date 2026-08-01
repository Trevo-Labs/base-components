<template>
  <div ref="root" class="date-picker-time-columns">
    <div class="col">
      <button
        v-for="h in hours"
        :key="h"
        type="button"
        :class="['cell', { 'cell--selected': h === selectedHour }]"
        @click="emit('choose-hour', h)"
      >
        {{ pad(h) }}
      </button>
    </div>
    <div class="col">
      <button
        v-for="m in minutes"
        :key="m"
        type="button"
        :class="['cell', { 'cell--selected': m === selectedMinute }]"
        @click="emit('choose-minute', m)"
      >
        {{ pad(m) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import './date-picker-time-columns.css'
import { ref, nextTick } from 'vue'

defineProps<{
  selectedHour: number | null
  selectedMinute: number | null
}>()

const emit = defineEmits<{
  'choose-hour': [hour: number]
  'choose-minute': [minute: number]
}>()

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 12 }, (_, i) => i * 5) // 0,5,...,55

const root = ref<HTMLElement | null>(null)

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// Centra la hora/minuto seleccionados en sus columnas al abrir.
function scrollSelectedIntoView() {
  nextTick(() => {
    root.value
      ?.querySelectorAll('.cell--selected')
      .forEach((el) => el.scrollIntoView?.({ block: 'center' }))
  })
}

defineExpose({ scrollSelectedIntoView })
</script>
