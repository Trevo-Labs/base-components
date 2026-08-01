<template>
  <div class="field-group">
    <label v-if="label" class="field-label" :for="fieldId">
      {{ label }}
      <span v-if="required" class="field-required">*</span>
    </label>
    <slot />
    <span v-if="error" class="field-error">{{ error }}</span>
    <span v-else-if="hint" class="field-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import './base-field.css'
import { provide, useId } from 'vue'

defineProps<{
  label?: string
  hint?: string
  error?: string
  required?: boolean
}>()

// Asocia el <label> con el control del slot: genera un id y lo comparte por
// inject. Los controles base (BaseInput/BaseSelect/BaseDatePicker) lo adoptan,
// así el `for`/`id` queda enlazado sin tocar cada formulario.
const fieldId = useId()
provide('baseFieldId', fieldId)
</script>
