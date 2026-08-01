<template>
  <div class="home">
    <BasePageHeader title="BaseComponents" subtitle="Plantilla de componentes base" />

    <BaseBox title="Catálogo">
      <p>
        Los componentes se navegan con Histoire:
        <code>npm run story:dev</code>
      </p>
      <p class="text-sm text-muted">
        Esta vista es solo el arranque de la app. Bórrala al empezar un proyecto nuevo.
      </p>
    </BaseBox>
  </div>
</template>

<script setup lang="ts">
import './home-view.css'
import BaseBox from '@/components/base/base-box/base-box.vue'
import BasePageHeader from '@/components/base/base-page-header/base-page-header.vue'
</script>
