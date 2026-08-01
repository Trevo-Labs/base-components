<template>
  <div class="base-dropdown" @click.stop>
    <button
      ref="trigger"
      type="button"
      class="dropdown-trigger"
      :class="{ 'dropdown-trigger--open': open }"
      :aria-label="label"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="toggle"
    >
      <slot name="trigger">
        <MoreVertical :size="18" />
      </slot>
    </button>

    <Teleport to="body">
      <Transition name="dropdown">
        <div v-if="open" ref="panel" class="dropdown-menu" role="menu" :style="panelStyle">
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import './base-dropdown.css'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { MoreVertical } from 'lucide-vue-next'
import { useFloatingPanel } from '@/composables/use-floating-panel'

withDefaults(defineProps<{ label?: string }>(), { label: 'Acciones' })

const MENU_WIDTH = 200
const GAP = 4
// Altura estimada del menú: por debajo de esto no cabe abajo y se abre hacia arriba.
const MENU_HEIGHT = 240

const { open, panelStyle, close, toggle } = useFloatingPanel({
  triggerEl: useTemplateRef<HTMLElement>('trigger'),
  panelEl: useTemplateRef<HTMLElement>('panel'),
  // Alineado a la derecha del trigger; se abre hacia arriba si no cabe abajo.
  position: (r): Record<string, string> => {
    const left = Math.max(GAP, r.right - MENU_WIDTH)
    const opensUp = r.bottom + MENU_HEIGHT > window.innerHeight && r.top > MENU_HEIGHT
    return opensUp
      ? { left: `${left}px`, bottom: `${window.innerHeight - r.top + GAP}px` }
      : { left: `${left}px`, top: `${r.bottom + GAP}px` }
  },
  // El menú es corto: al hacer scroll se cierra en vez de perseguir al trigger.
  onScroll: 'close',
  // El root del componente frena el click, así que hay que escuchar en captura.
  outsideClickCapture: true,
})

function onKeydown(e: KeyboardEvent) {
  if (open.value && e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>
