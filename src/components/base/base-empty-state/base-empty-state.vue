<template>
  <div :class="['empty-state', { 'empty-state--compact': compact, 'empty-state--panel': panel }]">
    <slot name="icon" />
    <p v-if="text">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import './base-empty-state.css'
defineProps<{
  text?: string
  compact?: boolean
  panel?: boolean
}>()
</script>
