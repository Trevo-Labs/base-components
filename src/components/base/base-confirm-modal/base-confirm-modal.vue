<template>
  <BaseModal
    :model-value="!!current"
    :title="current?.title ?? ''"
    size="sm"
    :close-on-backdrop="false"
    @update:model-value="handleModelValue"
  >
    <p v-if="current?.message" class="confirm-message">{{ current.message }}</p>
    <template #footer>
      <BaseButton variant="secondary" @click="resolveConfirm(false)">
        {{ current?.cancelText ?? 'Cancelar' }}
      </BaseButton>
      <BaseButton
        :variant="current?.tone === 'danger' ? 'danger' : 'primary'"
        @click="resolveConfirm(true)"
      >
        {{ current?.confirmText ?? 'Confirmar' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import './base-confirm-modal.css'
import BaseButton from '../base-button/base-button.vue'
import BaseModal from '../base-modal/base-modal.vue'
import { useConfirm } from '@/composables/useConfirm'

const { current, resolveConfirm } = useConfirm()

function handleModelValue(value: boolean) {
  if (!value) resolveConfirm(false)
}
</script>
