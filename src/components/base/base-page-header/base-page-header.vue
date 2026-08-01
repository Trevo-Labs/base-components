<template>
  <div class="page-header-wrapper">
    <nav v-if="back" class="page-breadcrumb" aria-label="Ruta de navegación">
      <RouterLink :to="back.to" class="page-breadcrumb-link">{{ back.label }}</RouterLink>
      <ChevronRight :size="14" class="page-breadcrumb-sep" aria-hidden="true" />
      <span class="page-breadcrumb-current" aria-current="page">{{ title }}</span>
    </nav>
    <div class="page-header">
      <div class="page-header-left">
        <h2 class="page-title">{{ title }}</h2>
        <slot name="badges" />
      </div>
      <div v-if="$slots.actions" class="page-header-actions">
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
