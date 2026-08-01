<template>
  <RouterLink v-if="to" :to="to" class="cell-link" @click.stop>
    <slot>{{ label }}</slot>
  </RouterLink>
  <span v-else>
    <slot>{{ label ?? '—' }}</slot>
  </span>
</template>

<script setup lang="ts">
import './cell-link.css'
import type { RouteLocationRaw } from 'vue-router'

// Celda-enlace genérica para BaseDataGrid: convierte el contenido en un enlace
// azul (subrayado al hover) hacia un detalle, y frena la propagación para no
// disparar el @row-click de la fila. Reutilizable para cliente, organización,
// trato, proyecto… cualquier columna que enlace a otra vista.
defineProps<{
  to?: RouteLocationRaw | null
  label?: string | null
}>()
</script>
