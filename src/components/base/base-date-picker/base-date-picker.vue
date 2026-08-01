<template>
  <div ref="root" class="date-wrapper" :class="attrsClass" :style="attrsStyle">
    <button
      :id="id"
      type="button"
      :class="[
        'date-trigger',
        {
          'date-trigger--open': open,
          'date-trigger--error': error,
          'date-trigger--readonly': readonly,
        },
      ]"
      :disabled="disabled"
      :aria-disabled="readonly || disabled"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span :class="['date-value', { 'date-value--placeholder': !modelValue }]">
        {{ modelValue ? formatDisplay(modelValue) : placeholder || placeholderText }}
      </span>
      <component
        v-if="!readonly"
        :is="withTime ? CalendarClock : CalendarDays"
        :size="16"
        class="date-icon"
      />
    </button>

    <Teleport to="body">
      <Transition name="date-pop">
        <div v-if="open" ref="panel" class="date-panel" role="dialog" :style="panelStyle">
          <div class="date-body">
            <DatePickerCalendar
              :month-label="monthLabel"
              :weekdays="weekdays"
              :cells="cells"
              :selected-date="selectedDate"
              @prev-month="prevMonth"
              @next-month="nextMonth"
              @choose-day="chooseDay"
            />

            <DatePickerTimeColumns
              v-if="withTime"
              ref="timeColumns"
              :selected-hour="selectedHour"
              :selected-minute="selectedMinute"
              @choose-hour="chooseHour"
              @choose-minute="chooseMinute"
            />
          </div>

          <div class="date-foot">
            <button type="button" class="date-action" @click="clear">Borrar</button>
            <button type="button" class="date-action date-action--primary" @click="chooseNow">
              {{ withTime ? 'Ahora' : 'Hoy' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import './base-date-picker.css'
import { ref, computed, inject, useAttrs, useId, useTemplateRef } from 'vue'
import { CalendarDays, CalendarClock } from 'lucide-vue-next'
import DatePickerCalendar, {
  type DateCell,
} from '../internal/date-picker-calendar/date-picker-calendar.vue'
import DatePickerTimeColumns from '../internal/date-picker-time-columns/date-picker-time-columns.vue'
import { useFloatingPanel } from '@/composables/use-floating-panel'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    // ISO 'YYYY-MM-DD' o, con withTime, 'YYYY-MM-DDTHH:mm'
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    withTime?: boolean
    error?: boolean
  }>(),
  {}
)

const placeholderText = computed(() => (props.withTime ? 'dd/mm/aaaa --:--' : 'dd/mm/aaaa'))

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const attrs = useAttrs()
const attrsClass = computed(() => attrs.class)
const attrsStyle = computed(() => attrs.style)

// Dentro de un BaseField adopta su id para enlazar el <label for> con el trigger.
const injectedId = inject<string | undefined>('baseFieldId', undefined)
const ownId = useId()
const id = injectedId ?? ownId

const timeColumns = ref<InstanceType<typeof DatePickerTimeColumns> | null>(null)

const GAP = 4

const { open, panelStyle, openPanel, close } = useFloatingPanel({
  triggerEl: useTemplateRef<HTMLElement>('root'),
  panelEl: useTemplateRef<HTMLElement>('panel'),
  // Se abre hacia arriba si no cabe abajo, y se ajusta a la izquierda si se
  // saldría por el borde derecho.
  position: (r, el): Record<string, string> => {
    const h = el.offsetHeight
    const w = el.offsetWidth
    const opensUp = r.bottom + h + GAP > window.innerHeight && r.top - h - GAP > 0
    const left = Math.max(GAP, Math.min(r.left, window.innerWidth - w - GAP))
    return {
      left: `${left}px`,
      ...(opensUp
        ? { bottom: `${window.innerHeight - r.top + GAP}px` }
        : { top: `${r.bottom + GAP}px` }),
    }
  },
  // Recolocamos al hacer scroll (p.ej. dentro de un modal) en vez de cerrar.
  onScroll: 'reposition',
})

// Mes que se está mostrando (primer día del mes visible).
const viewDate = ref(startOfMonth(props.modelValue ? parseISO(props.modelValue) : new Date()))

const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const selectedDate = computed(() => (props.modelValue ? props.modelValue.split('T')[0] : ''))
const timePart = computed(() => props.modelValue?.split('T')[1] ?? '')
const selectedHour = computed(() => {
  const h = parseInt(timePart.value.split(':')[0] ?? '', 10)
  return Number.isNaN(h) ? null : h
})
const selectedMinute = computed(() => {
  const m = parseInt(timePart.value.split(':')[1] ?? '', 10)
  return Number.isNaN(m) ? null : m
})

const monthLabel = computed(() =>
  viewDate.value
    .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase())
)

const cells = computed<DateCell[]>(() => {
  const first = startOfMonth(viewDate.value)
  // getDay(): 0=domingo. Queremos lunes primero.
  const offset = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - offset)

  const todayIso = toISO(new Date())
  const month = viewDate.value.getMonth()
  const out: DateCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = toISO(d)
    out.push({
      iso,
      day: d.getDate(),
      inMonth: d.getMonth() === month,
      isToday: iso === todayIso,
    })
  }
  return out
})

async function toggle() {
  if (props.disabled || props.readonly) return
  if (open.value) {
    close()
    return
  }
  // Al abrir, muestra el mes del valor seleccionado (o el actual).
  viewDate.value = startOfMonth(props.modelValue ? parseISO(props.modelValue) : new Date())
  await openPanel()
  if (props.withTime) scrollTimeIntoView()
}

function prevMonth() {
  viewDate.value = addMonths(viewDate.value, -1)
}
function nextMonth() {
  viewDate.value = addMonths(viewDate.value, 1)
}

// Recompone el valor emitido a partir de fecha + hora. Con withTime, si aún no
// hay hora elegida usa 00:00 como base.
function emitValue(date: string, hour: number | null, minute: number | null) {
  if (!props.withTime) {
    emit('update:modelValue', date)
    return
  }
  const h = hour ?? 0
  const m = minute ?? 0
  emit('update:modelValue', `${date}T${pad(h)}:${pad(m)}`)
}

function chooseDay(date: string) {
  emitValue(date, selectedHour.value, selectedMinute.value)
  // Con hora: no cerramos, el usuario aún ajusta la hora. Sin hora: cerramos.
  if (!props.withTime) close()
}

function chooseHour(h: number) {
  const date = selectedDate.value || toISO(new Date())
  emitValue(date, h, selectedMinute.value ?? 0)
}

function chooseMinute(m: number) {
  const date = selectedDate.value || toISO(new Date())
  emitValue(date, selectedHour.value ?? 0, m)
}

function chooseNow() {
  const now = new Date()
  if (props.withTime) {
    // Redondea minutos al múltiplo de 5 más cercano para casar con la lista.
    const m = Math.round(now.getMinutes() / 5) * 5
    emitValue(toISO(now), now.getHours(), m % 60)
    scrollTimeIntoView()
  } else {
    emitValue(toISO(now), null, null)
    close()
  }
}

function clear() {
  emit('update:modelValue', '')
  close()
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function scrollTimeIntoView() {
  timeColumns.value?.scrollSelectedIntoView()
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (props.readonly) return
  if (e.key === 'Escape') close()
  else if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') && !open.value) {
    e.preventDefault()
    toggle()
  }
}

// Helpers de fecha en local, sin desfase de zona horaria.
function parseISO(iso: string): Date {
  // Ignora la parte de hora si la hay (withTime).
  const [y, m, d] = iso.split('T')[0].split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}
function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}
function formatDisplay(iso: string): string {
  const fecha = parseISO(iso).toLocaleDateString('es-ES')
  const time = iso.split('T')[1]
  return props.withTime && time ? `${fecha} ${time}` : fecha
}
</script>
