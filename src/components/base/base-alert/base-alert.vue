<template>
  <div :class="['base-alert', `base-alert--${type}`]" role="alert">
    <component :is="icon" v-if="!hideIcon" :size="18" class="icon" />
    <div class="body">
      <p v-if="title" class="title">{{ title }}</p>
      <div class="content"><slot /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './base-alert.css'
import { computed } from 'vue'
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'warning' | 'error' | 'info'
    title?: string
    hideIcon?: boolean
  }>(),
  { type: 'info' }
)

const icon = computed(
  () =>
    ({
      success: CheckCircle2,
      warning: AlertTriangle,
      error: XCircle,
      info: Info,
    })[props.type]
)
</script>
