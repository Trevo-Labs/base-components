<template>
  <div class="date-calendar">
    <div class="date-head">
      <button type="button" class="date-nav" title="Mes anterior" @click="emit('prev-month')">
        <ChevronLeft :size="16" />
      </button>
      <span class="date-title">{{ monthLabel }}</span>
      <button type="button" class="date-nav" title="Mes siguiente" @click="emit('next-month')">
        <ChevronRight :size="16" />
      </button>
    </div>

    <div class="date-grid date-weekdays">
      <span v-for="d in weekdays" :key="d" class="date-weekday">{{ d }}</span>
    </div>

    <div class="date-grid">
      <button
        v-for="cell in cells"
        :key="cell.iso"
        type="button"
        :class="[
          'date-day',
          {
            'date-day--muted': !cell.inMonth,
            'date-day--today': cell.isToday,
            'date-day--selected': cell.iso === selectedDate,
          },
        ]"
        @click="emit('choose-day', cell.iso)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import './date-picker-calendar.css'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

export interface DateCell {
  iso: string
  day: number
  inMonth: boolean
  isToday: boolean
}

defineProps<{
  monthLabel: string
  weekdays: string[]
  cells: DateCell[]
  selectedDate: string
}>()

const emit = defineEmits<{
  'prev-month': []
  'next-month': []
  'choose-day': [iso: string]
}>()
</script>
