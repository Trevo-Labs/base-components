<template>
  <button
    type="button"
    class="copyable-text"
    :class="{ 'copyable-text--copied': copied }"
    @click="copy"
  >
    <span class="selectable copyable__text">{{ text }}</span>
    <component :is="copied ? Check : CopyIcon" :size="14" class="copyable__icon" />
  </button>
</template>

<script setup lang="ts">
import './copyable-text.css'
import { ref } from 'vue'
import { Check, Copy as CopyIcon } from 'lucide-vue-next'

const props = defineProps<{ text: string }>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>
