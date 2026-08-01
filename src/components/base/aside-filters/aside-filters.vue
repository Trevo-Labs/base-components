<template>
  <Teleport to="body">
    <Transition name="aside">
      <div v-if="modelValue" class="aside-overlay" @click.self="emit('update:modelValue', false)">
        <aside class="aside-panel" role="dialog" aria-modal="true" aria-label="Filtros">
          <header class="aside-header">
            <h2 class="aside-title">
              <SlidersHorizontal :size="18" />
              Filtros
            </h2>
            <button
              class="aside-close"
              aria-label="Cerrar"
              @click="emit('update:modelValue', false)"
            >
              <X :size="18" />
            </button>
          </header>

          <div class="aside-body">
            <BaseField v-for="filter in filters" :key="filter.key" :label="filter.label">
              <!-- text -->
              <BaseInput
                v-if="filter.type === 'text'"
                v-model="draft[filter.key] as string"
                :placeholder="`Filtrar por ${filter.label.toLowerCase()}...`"
              />

              <!-- select -->
              <BaseSelect
                v-else-if="filter.type === 'select'"
                v-model="draft[filter.key] as string"
              >
                <option value="">Todos</option>
                <option v-for="opt in resolveOptions(filter)" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </BaseSelect>

              <!-- boolean (select tri-estado: todos / sí / no) -->
              <BaseSelect
                v-else-if="filter.type === 'boolean'"
                :model-value="boolToStr(draft[filter.key])"
                @update:model-value="(v) => (draft[filter.key] = strToBool(v))"
              >
                <option value="">Todos</option>
                <option value="true">{{ filter.trueLabel ?? 'Sí' }}</option>
                <option value="false">{{ filter.falseLabel ?? 'No' }}</option>
              </BaseSelect>

              <!-- daterange (desde / hasta) -->
              <div v-else-if="filter.type === 'daterange'" class="aside-daterange">
                <BaseInput
                  :model-value="(draft[filter.key] as DateRange).from"
                  type="date"
                  aria-label="Desde"
                  @update:model-value="(v) => setRange(filter.key, 'from', v as string)"
                />
                <span class="aside-daterange-sep">—</span>
                <BaseInput
                  :model-value="(draft[filter.key] as DateRange).to"
                  type="date"
                  aria-label="Hasta"
                  @update:model-value="(v) => setRange(filter.key, 'to', v as string)"
                />
              </div>

              <!-- numberrange (mín / máx) -->
              <div v-else-if="filter.type === 'numberrange'" class="aside-daterange">
                <BaseInput
                  :model-value="(draft[filter.key] as NumberRange).min"
                  type="number"
                  placeholder="Mín"
                  aria-label="Mínimo"
                  @update:model-value="(v) => setNumberRange(filter.key, 'min', v as string)"
                />
                <span class="aside-daterange-sep">—</span>
                <BaseInput
                  :model-value="(draft[filter.key] as NumberRange).max"
                  type="number"
                  placeholder="Máx"
                  aria-label="Máximo"
                  @update:model-value="(v) => setNumberRange(filter.key, 'max', v as string)"
                />
              </div>

              <!-- multiselect (lista de checkboxes) -->
              <div v-else-if="filter.type === 'multiselect'" class="aside-checks">
                <BaseCheckbox
                  v-for="opt in resolveOptions(filter)"
                  :key="opt.value"
                  :model-value="(draft[filter.key] as string[]).includes(opt.value)"
                  @update:model-value="(checked) => toggleMulti(filter.key, opt.value, checked)"
                >
                  {{ opt.label }}
                </BaseCheckbox>
              </div>
            </BaseField>

            <p v-if="!filters.length" class="aside-empty">No hay filtros disponibles.</p>
          </div>

          <footer class="aside-footer">
            <BaseButton variant="ghost" @click="limpiar">Limpiar</BaseButton>
            <div class="aside-footer-right">
              <BaseButton variant="secondary" @click="emit('update:modelValue', false)">
                Cancelar
              </BaseButton>
              <BaseButton @click="aplicar">Filtrar</BaseButton>
            </div>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import './aside-filters.css'
import { ref, watch } from 'vue'
import { SlidersHorizontal, X } from 'lucide-vue-next'
import BaseField from '../base-field/base-field.vue'
import BaseInput from '../base-input/base-input.vue'
import BaseSelect from '../base-select/base-select.vue'
import BaseCheckbox from '../base-checkbox/base-checkbox.vue'
import BaseButton from '../base-button/base-button.vue'
import {
  resolveOptions,
  emptyFilterValues,
  isDateRange,
  isNumberRange,
  type FilterConfig,
  type FilterValues,
  type FilterValue,
  type DateRange,
  type NumberRange,
} from '../base-data-grid/datagrid.filters'

const props = defineProps<{
  modelValue: boolean
  filters: FilterConfig[]
  /** Valores actualmente aplicados (fuente de verdad de la vista). */
  values: FilterValues
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  /** Se emite al pulsar Filtrar, con los nuevos valores. */
  apply: [values: FilterValues]
}>()

// `draft` es una copia editable; solo se propaga al pulsar Filtrar.
const draft = ref<FilterValues>({ ...props.values })

// Al abrir, sincroniza el borrador con los valores aplicados.
watch(
  () => props.modelValue,
  (open) => {
    if (open) draft.value = clone(props.values)
  }
)

function clone(values: FilterValues): FilterValues {
  const out: FilterValues = {}
  for (const [k, v] of Object.entries(values)) {
    if (Array.isArray(v)) out[k] = [...v]
    else if (isDateRange(v) || isNumberRange(v)) out[k] = { ...v }
    else out[k] = v
  }
  return out
}

function boolToStr(v: FilterValue): string {
  if (v === true) return 'true'
  if (v === false) return 'false'
  return ''
}
function strToBool(v: string): FilterValue {
  if (v === 'true') return true
  if (v === 'false') return false
  return null
}

function toggleMulti(key: string, value: string, checked: boolean) {
  const arr = (draft.value[key] as string[]) ?? []
  draft.value[key] = checked ? [...arr, value] : arr.filter((v) => v !== value)
}

function setRange(key: string, side: 'from' | 'to', value: string) {
  const current = (draft.value[key] as DateRange) ?? { from: '', to: '' }
  draft.value[key] = { ...current, [side]: value }
}

function setNumberRange(key: string, side: 'min' | 'max', value: string) {
  const current = (draft.value[key] as NumberRange) ?? { min: '', max: '' }
  draft.value[key] = { ...current, [side]: value }
}

function aplicar() {
  emit('apply', clone(draft.value))
  emit('update:modelValue', false)
}

function limpiar() {
  draft.value = emptyFilterValues(props.filters)
}
</script>
