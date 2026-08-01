<template>
  <BaseDatePicker
    v-if="type === 'date' || type === 'datetime-local'"
    :model-value="modelValue == null ? '' : String(modelValue)"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :with-time="type === 'datetime-local'"
    :error="error"
    v-bind="$attrs"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <div
    v-else-if="type !== 'textarea' && (prefix || suffix)"
    class="input-affix"
    :class="{ 'input-affix--disabled': disabled }"
  >
    <span v-if="prefix" class="input-affix-text input-affix-text--prefix">{{ prefix }}</span>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :class="['base-input', { 'base-input--error': error, 'base-input--readonly': readonly }]"
      :style="affixStyle"
      v-bind="$attrs"
      @input="onInput"
    />
    <span v-if="suffix" class="input-affix-text input-affix-text--suffix">{{ suffix }}</span>
  </div>
  <input
    v-else-if="type !== 'textarea'"
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :class="['base-input', { 'base-input--error': error, 'base-input--readonly': readonly }]"
    v-bind="$attrs"
    @input="onInput"
  />
  <textarea
    v-else
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :rows="rows"
    :class="[
      'base-input',
      'base-input--textarea',
      { 'base-input--error': error, 'base-input--readonly': readonly },
    ]"
    v-bind="$attrs"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import './base-input.css'
import { computed, inject, useId } from 'vue'
import BaseDatePicker from '../base-date-picker/base-date-picker.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    error?: boolean
    rows?: number
    /** Afijo gris fijo dentro del input, a la izquierda (ej. '€', '$'). */
    prefix?: string
    /** Afijo gris fijo dentro del input, a la derecha (ej. '%', '€', 'kWh'). */
    suffix?: string
  }>(),
  {
    type: 'text',
    rows: 3,
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string | number | undefined] }>()
// Dentro de un BaseField adopta su id para que el <label for> apunte a este input.
const injectedId = inject<string | undefined>('baseFieldId', undefined)
const ownId = useId()
const id = injectedId ?? ownId

// Reserva espacio para el afijo dentro del input: ~9px por carácter + el
// padding base del input. Así el texto no se solapa con € / % / kWh…
const affixStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.prefix) style.paddingLeft = `${props.prefix.length * 9 + 14}px`
  if (props.suffix) style.paddingRight = `${props.suffix.length * 9 + 14}px`
  return style
})

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value
  if (props.type === 'number') {
    emit('update:modelValue', value === '' ? undefined : Number(value))
  } else {
    emit('update:modelValue', value)
  }
}
</script>
