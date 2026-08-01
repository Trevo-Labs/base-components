<template>
  <label :class="['base-checkbox', { 'base-checkbox--label': $slots.default }]">
    <input
      ref="input"
      type="checkbox"
      class="checkbox-input"
      :checked="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span v-if="$slots.default" class="checkbox-text"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import './base-checkbox.css'
import { ref, watchEffect } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  modelValue?: boolean
  disabled?: boolean
  /** Estado tri-estado "ni todo ni nada" (típico del checkbox de cabecera). */
  indeterminate?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

// `indeterminate` es una propiedad del DOM, no un atributo: se fija vía JS.
const input = ref<HTMLInputElement | null>(null)
watchEffect(() => {
  if (input.value) input.value.indeterminate = !!props.indeterminate
})
</script>
