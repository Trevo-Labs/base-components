<template>
  <div class="date-picker-calendar">
    <div class="head">
      <button type="button" class="nav" title="Mes anterior" @click="emit('prev-month')">
        <ChevronLeft :size="16" />
      </button>
      <span class="title">{{ monthLabel }}</span>
      <button type="button" class="nav" title="Mes siguiente" @click="emit('next-month')">
        <ChevronRight :size="16" />
      </button>
    </div>

    <div class="days weekdays">
      <span v-for="d in weekdays" :key="d" class="weekday">{{ d }}</span>
    </div>

    <div class="days">
      <button
        v-for="cell in cells"
        :key="cell.iso"
        type="button"
        :class="[
          'day',
          {
            'day--muted': !cell.inMonth,
            'day--today': cell.isToday,
            'day--selected': cell.iso === selectedDate,
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
