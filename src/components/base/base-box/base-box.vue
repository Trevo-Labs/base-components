<template>
  <div class="base-box">
    <div v-if="title || $slots.header" class="box-header">
      <slot name="header">
        <span class="box-title">{{ title }}</span>
      </slot>
    </div>
    <div v-if="$slots.default" :class="['box-body', { 'box-body--flush': flush }]">
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
