<template>
  <div class="base-box">
    <div v-if="title || $slots.header" class="header">
      <slot name="header">
        <span class="title">{{ title }}</span>
      </slot>
    </div>
    <div v-if="$slots.default" :class="['body', { 'body--flush': flush }]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import './base-box.css'
defineProps<{
  /** Título opcional; renderiza la cabecera con estilo estándar. */
  title?: string
  /** Sin padding en el body (para tablas u otros contenidos a sangre). */
  flush?: boolean
}>()
</script>
