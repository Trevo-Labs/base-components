<template>
  <Story title="Componentes base/BaseAlert" group="base" icon="carbon:warning-alt">
    <Variant title="Playground">
      <template #default>
        <BaseAlert :type="state.type" :title="state.title" :hide-icon="state.hideIcon">
          {{ state.message }}
        </BaseAlert>
      </template>

      <template #controls>
        <HstSelect
          v-model="state.type"
          title="Tipo"
          :options="['success', 'warning', 'error', 'info']"
        />
        <HstText v-model="state.title" title="Título" />
        <HstText v-model="state.message" title="Mensaje" />
        <HstCheckbox v-model="state.hideIcon" title="Sin icono" />
      </template>
    </Variant>

    <Variant title="Tipos">
      <div class="story-stack">
        <BaseAlert type="success" title="Guardado">Los cambios se han guardado.</BaseAlert>
        <BaseAlert type="warning" title="Atención">Revisa los campos marcados.</BaseAlert>
        <BaseAlert type="error" title="Error">No se ha podido conectar con el servidor.</BaseAlert>
        <BaseAlert type="info" title="Información">Esta acción no se puede deshacer.</BaseAlert>
      </div>
    </Variant>

    <Variant title="Sin título">
      <BaseAlert type="info">Solo el mensaje, sin cabecera.</BaseAlert>
    </Variant>

    <Variant title="Sin icono">
      <BaseAlert type="warning" title="Atención" hide-icon>Alerta sin icono.</BaseAlert>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseAlert from './base-alert.vue'

const state = reactive({
  type: 'info' as 'success' | 'warning' | 'error' | 'info',
  title: 'Información',
  message: 'Esta acción no se puede deshacer.',
  hideIcon: false,
})
</script>
