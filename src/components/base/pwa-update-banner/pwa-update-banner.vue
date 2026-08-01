<template>
  <Transition name="pwa-update-banner">
    <div v-if="modelValue" class="pwa-update-banner" role="alert">
      <div class="text">
        <span class="title">{{ title }}</span>
        <span class="sub">{{ message }}</span>
      </div>
      <div class="actions">
        <button class="button" @click="emit('update')">{{ actionText }}</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import './pwa-update-banner.css'

// Banner presentacional: no sabe nada del service worker. El proyecto que lo use
// engancha `model-value` a su señal de "hay versión nueva" y `@update` a la acción
// que recarga. Con vite-plugin-pwa son cuatro líneas: ver pwa-update-banner.md.
withDefaults(
  defineProps<{
    /** Muestra u oculta el banner. */
    modelValue?: boolean
    title?: string
    message?: string
    actionText?: string
  }>(),
  {
    modelValue: false,
    title: 'Nueva versión disponible',
    message: 'Actualiza para usar los últimos cambios.',
    actionText: 'Actualizar',
  }
)

const emit = defineEmits<{
  /** El usuario ha pulsado el botón: aplica la actualización y recarga. */
  update: []
}>()
</script>
