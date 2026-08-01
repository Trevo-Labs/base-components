<template>
  <span :class="['base-badge', `base-badge--${variant}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
import './base-badge.css'
withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'muted'
  }>(),
  {
    variant: 'default',
  }
)
</script>
