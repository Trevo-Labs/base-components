<template>
  <RouterView />

  <!-- Singletons: se montan una sola vez en la raíz de la app. -->
  <BaseConfirmModal />
  <BaseNotify />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseConfirmModal from '@/components/base/base-confirm-modal/base-confirm-modal.vue'
import BaseNotify from '@/components/base/base-notify/base-notify.vue'
</script>
