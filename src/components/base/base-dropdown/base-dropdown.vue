<template>
  <div class="base-dropdown" @click.stop>
    <button
      ref="triggerEl"
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
        <div v-if="open" ref="menuEl" class="dropdown-menu" role="menu" :style="menuStyle">
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import './base-dropdown.css'
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { MoreVertical } from 'lucide-vue-next'

withDefaults(defineProps<{ label?: string }>(), { label: 'Acciones' })

const open = ref(false)
const triggerEl = ref<HTMLElement | null>(null)
const menuEl = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})

const MENU_WIDTH = 200
const GAP = 4

function position() {
  const trigger = triggerEl.value
  if (!trigger) return
  const r = trigger.getBoundingClientRect()
  // Alineado a la derecha del trigger; se abre hacia arriba si no cabe abajo.
  const left = Math.max(GAP, r.right - MENU_WIDTH)
  const opensUp = r.bottom + 240 > window.innerHeight && r.top > 240
  menuStyle.value = opensUp
    ? { left: `${left}px`, bottom: `${window.innerHeight - r.top + GAP}px` }
    : { left: `${left}px`, top: `${r.bottom + GAP}px` }
}

async function toggle() {
  if (open.value) return close()
  open.value = true
  await nextTick()
  position()
  window.addEventListener('scroll', close, true)
  window.addEventListener('resize', close)
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKeydown)
}

function close() {
  if (!open.value) return
  open.value = false
  window.removeEventListener('scroll', close, true)
  window.removeEventListener('resize', close)
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKeydown)
}

function onDocClick(e: MouseEvent) {
  const target = e.target as Node
  if (menuEl.value?.contains(target) || triggerEl.value?.contains(target)) return
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onBeforeUnmount(close)
</script>
