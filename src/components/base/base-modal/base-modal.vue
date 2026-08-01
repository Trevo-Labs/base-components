<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="base-modal-overlay"
        @click.self="closeOnBackdrop && emit('update:modelValue', false)"
      >
        <div :class="['modal', `modal--${size}`]" role="dialog" aria-modal="true">
          <div class="header">
            <h2 class="title">{{ title }}</h2>
            <button class="close" aria-label="Cerrar" @click="emit('update:modelValue', false)">
              <X :size="18" />
            </button>
          </div>
          <div class="body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import './base-modal.css'
import { X } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    size?: 'sm' | 'md' | 'lg'
    closeOnBackdrop?: boolean
  }>(),
  {
    size: 'md',
    closeOnBackdrop: true,
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
