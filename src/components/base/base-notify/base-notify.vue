<template>
  <Teleport to="body">
    <TransitionGroup tag="div" name="notify" class="notify-stack">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="notify"
        :class="`notify--${n.type}`"
        role="alert"
      >
        <span class="notify-icon">
          <component :is="iconFor(n.type)" :size="18" />
        </span>
        <div class="notify-body">
          <span class="notify-title">{{ n.title ?? titleFor(n.type) }}</span>
          <span class="notify-message">{{ n.message }}</span>
        </div>
        <button class="notify-close" aria-label="Cerrar" @click="dismiss(n.id)">
          <X :size="15" />
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import './base-notify.css'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-vue-next'
import { useNotify, type NotifyType } from '@/composables/useNotify'

const { notifications, dismiss } = useNotify()

function iconFor(type: NotifyType) {
  return {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }[type]
}

function titleFor(type: NotifyType) {
  return {
    success: 'Hecho',
    error: 'Error',
    info: 'Información',
    warning: 'Atención',
  }[type]
}
</script>
