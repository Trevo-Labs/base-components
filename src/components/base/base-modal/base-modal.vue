<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="closeOnBackdrop && emit('update:modelValue', false)"
      >
        <div :class="['modal', `modal--${size}`]" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button
              class="modal-close"
              aria-label="Cerrar"
              @click="emit('update:modelValue', false)"
            >
              <X :size="18" />
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
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
