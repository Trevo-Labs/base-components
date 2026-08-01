<template>
  <div class="base-tabs" role="tablist">
    <template v-for="tab in visibleTabs" :key="tab.key">
      <RouterLink v-if="tab.to" :to="tab.to" custom v-slot="{ href, navigate, isActive }">
        <a
          :href="href"
          role="tab"
          :aria-selected="isActive"
          :class="['tab-btn', { 'tab-btn--active': isActive }]"
          @click="navigate"
        >
          {{ tab.label }}
        </a>
      </RouterLink>
      <button
        v-else
        type="button"
        role="tab"
        :aria-selected="modelValue === tab.key"
        :class="['tab-btn', { 'tab-btn--active': modelValue === tab.key }]"
        @click="emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import './base-tabs.css'
import { computed } from 'vue'

export interface Tab {
  key: string
  label: string
  // Si se indica, el tab navega a esta ruta (RouterLink) en vez de emitir update:modelValue.
  to?: string
  hidden?: boolean
}

const props = defineProps<{
  tabs: Tab[]
  modelValue?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const visibleTabs = computed(() => props.tabs.filter((tab) => !tab.hidden))
</script>
