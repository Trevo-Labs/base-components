<template>
  <Story title="Componentes base/BaseBox" group="base" icon="carbon:container-services">
    <Variant title="Playground">
      <template #default>
        <BaseBox :title="state.title" :flush="state.flush">
          <p>{{ state.content }}</p>
        </BaseBox>
      </template>

      <template #controls>
        <HstText v-model="state.title" title="Título" />
        <HstText v-model="state.content" title="Contenido" />
        <HstCheckbox v-model="state.flush" title="Flush (sin padding)" />
      </template>
    </Variant>

    <Variant title="Con título">
      <BaseBox title="Datos del cliente">
        <p>Contenido de la caja.</p>
      </BaseBox>
    </Variant>

    <Variant title="Cabecera personalizada">
      <BaseBox>
        <template #header>
          <span class="title">Facturas</span>
          <BaseBadge variant="warning">3 pendientes</BaseBadge>
        </template>
        <p>La cabecera admite cualquier contenido vía slot.</p>
      </BaseBox>
    </Variant>

    <Variant title="Sin cabecera">
      <BaseBox>
        <p>Caja sin título ni slot de cabecera.</p>
      </BaseBox>
    </Variant>

    <Variant title="Flush">
      <BaseBox title="Contenido a sangre" flush>
        <div style="padding: 24px; background: var(--color-surface-2)">
          Sin padding en el body: útil para tablas.
        </div>
      </BaseBox>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseBox from './base-box.vue'
import BaseBadge from '../base-badge/base-badge.vue'

const state = reactive({
  title: 'Datos del cliente',
  content: 'Contenido de la caja.',
  flush: false,
})
</script>
