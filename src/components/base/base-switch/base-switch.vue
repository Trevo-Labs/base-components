<template>
  <label
    :class="[
      'base-switch',
      { 'base-switch--label': $slots.default, 'base-switch--disabled': disabled },
    ]"
  >
    <span class="switch-control">
      <input
        type="checkbox"
        class="switch-input"
        role="switch"
        :checked="modelValue"
        :disabled="disabled"
        v-bind="$attrs"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="switch-track">
        <span class="switch-thumb" />
      </span>
    </span>
    <span v-if="$slots.default" class="switch-text"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import './base-switch.css'
defineOptions({ inheritAttrs: false })

defineProps<{
  modelValue?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
