<template>
  <div class="base-page-header">
    <nav v-if="back" class="breadcrumb" aria-label="Ruta de navegación">
      <RouterLink :to="back.to" class="breadcrumb-link">{{ back.label }}</RouterLink>
      <ChevronRight :size="14" class="breadcrumb-sep" aria-hidden="true" />
      <span class="breadcrumb-current" aria-current="page">{{ title }}</span>
    </nav>
    <div class="header">
      <div class="header-left">
        <h2 class="title">{{ title }}</h2>
        <slot name="badges" />
      </div>
      <div v-if="$slots.actions" class="header-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './base-page-header.css'
import { ChevronRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  back?: { to: RouteLocationRaw; label: string }
}>()
</script>
