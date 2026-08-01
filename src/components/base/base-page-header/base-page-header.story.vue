<template>
  <Story title="Componentes base/BasePageHeader" group="base" icon="carbon:page-first">
    <Variant title="Playground">
      <template #default>
        <BasePageHeader :title="state.title" :back="state.conVuelta ? back : undefined">
          <template v-if="state.conBadges" #badges>
            <BaseBadge variant="success">Activo</BaseBadge>
          </template>
          <template v-if="state.conAcciones" #actions>
            <BaseButton variant="secondary" size="sm">Exportar</BaseButton>
            <BaseButton size="sm">Nuevo</BaseButton>
          </template>
        </BasePageHeader>
      </template>

      <template #controls>
        <HstText v-model="state.title" title="Título" />
        <HstCheckbox v-model="state.conVuelta" title="Con migas de pan" />
        <HstCheckbox v-model="state.conBadges" title="Con badges" />
        <HstCheckbox v-model="state.conAcciones" title="Con acciones" />
      </template>
    </Variant>

    <Variant title="Solo título">
      <BasePageHeader title="Clientes" />
    </Variant>

    <Variant title="Con acciones">
      <BasePageHeader title="Clientes">
        <template #actions>
          <BaseButton variant="secondary" size="sm">Exportar</BaseButton>
          <BaseButton size="sm">Nuevo cliente</BaseButton>
        </template>
      </BasePageHeader>
    </Variant>

    <Variant title="Detalle con vuelta atrás">
      <BasePageHeader title="Marta Ruiz" :back="{ to: '/', label: 'Clientes' }">
        <template #badges>
          <BaseBadge variant="success">Activo</BaseBadge>
          <BaseBadge variant="muted">Cliente desde 2024</BaseBadge>
        </template>
        <template #actions>
          <BaseButton variant="danger" size="sm">Eliminar</BaseButton>
        </template>
      </BasePageHeader>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BasePageHeader from './base-page-header.vue'
import BaseBadge from '../base-badge/base-badge.vue'
import BaseButton from '../base-button/base-button.vue'

const back = { to: '/', label: 'Clientes' }

const state = reactive({
  title: 'Marta Ruiz',
  conVuelta: true,
  conBadges: true,
  conAcciones: true,
})
</script>
