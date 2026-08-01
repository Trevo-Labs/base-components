<template>
  <Story title="Componentes base/BaseButton" group="base" icon="carbon:button-centered">
    <Variant title="Playground">
      <template #default>
        <BaseButton
          :variant="state.variant"
          :size="state.size"
          :loading="state.loading"
          :disabled="state.disabled"
        >
          {{ state.label }}
        </BaseButton>
      </template>

      <template #controls>
        <HstText v-model="state.label" title="Texto" />
        <HstSelect
          v-model="state.variant"
          title="Variante"
          :options="['primary', 'secondary', 'danger', 'ghost']"
        />
        <HstSelect v-model="state.size" title="Tamaño" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Variantes">
      <div class="story-row">
        <BaseButton variant="primary">Primary</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="danger">Danger</BaseButton>
        <BaseButton variant="ghost">Ghost</BaseButton>
      </div>
    </Variant>

    <Variant title="Tamaños">
      <div class="story-row">
        <BaseButton size="sm">Small</BaseButton>
        <BaseButton size="md">Medium</BaseButton>
        <BaseButton size="lg">Large</BaseButton>
      </div>
    </Variant>

    <Variant title="Estados">
      <div class="story-row">
        <BaseButton loading>Cargando</BaseButton>
        <BaseButton disabled>Deshabilitado</BaseButton>
        <BaseButton variant="danger" loading>Borrando</BaseButton>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseButton from './base-button.vue'

const state = reactive({
  label: 'Guardar',
  variant: 'primary' as 'primary' | 'secondary' | 'danger' | 'ghost',
  size: 'md' as 'sm' | 'md' | 'lg',
  loading: false,
  disabled: false,
})
</script>
