<template>
  <Story title="Componentes base/CopyableText" group="base" icon="carbon:copy">
    <Variant title="Playground">
      <template #default>
        <CopyableText :text="state.text" />
      </template>

      <template #controls>
        <HstText v-model="state.text" title="Texto" />
      </template>
    </Variant>

    <Variant title="Ejemplos">
      <div class="story-stack">
        <CopyableText text="hola@ejemplo.com" />
        <CopyableText text="+34 600 123 456" />
        <CopyableText text="ES91 2100 0418 4502 0005 1332" />
      </div>
      <p class="text-sm text-muted">Al pulsar copia al portapapeles y el icono cambia 1,5 s.</p>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CopyableText from './copyable-text.vue'

const state = reactive({ text: 'hola@ejemplo.com' })
</script>
