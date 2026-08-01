<template>
  <Story title="Componentes base/PwaUpdateBanner" group="base" icon="carbon:update-now">
    <Variant title="Playground">
      <template #default>
        <PwaUpdateBanner
          :model-value="state.visible"
          :title="state.title"
          :message="state.message"
          :action-text="state.actionText"
          @update="state.visible = false"
        />
        <p v-if="!state.visible" class="text-sm text-muted">
          Banner oculto — actívalo desde los controles.
        </p>
      </template>

      <template #controls>
        <HstCheckbox v-model="state.visible" title="Visible" />
        <HstText v-model="state.title" title="Título" />
        <HstText v-model="state.message" title="Mensaje" />
        <HstText v-model="state.actionText" title="Texto del botón" />
      </template>
    </Variant>

    <Variant title="Textos por defecto">
      <PwaUpdateBanner :model-value="true" />
    </Variant>

    <Variant title="Cómo se conecta">
      <div class="story-panel">
        <p>
          El banner es presentacional: no toca el service worker. Se conecta al estado de
          <code>vite-plugin-pwa</code>
          desde el proyecto que lo use.
        </p>
        <pre><code>&lt;PwaUpdateBanner :model-value="needRefresh" @update="applyUpdate" /&gt;</code></pre>
        <p class="text-sm text-muted">Los detalles están en pwa-update-banner.md.</p>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PwaUpdateBanner from './pwa-update-banner.vue'

const state = reactive({
  visible: true,
  title: 'Nueva versión disponible',
  message: 'Actualiza para usar los últimos cambios.',
  actionText: 'Actualizar',
})
</script>
