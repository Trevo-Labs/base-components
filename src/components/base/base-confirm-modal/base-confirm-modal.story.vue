<template>
  <Story title="Componentes base/BaseConfirmModal" group="base" icon="carbon:help">
    <Variant title="Playground">
      <template #default>
        <div class="story-stack">
          <BaseButton :variant="state.tone === 'danger' ? 'danger' : 'primary'" @click="preguntar">
            Lanzar confirmación
          </BaseButton>
          <p v-if="respuesta !== null" class="text-sm text-muted">
            Respuesta:
            <strong>{{ respuesta ? 'Confirmado' : 'Cancelado' }}</strong>
          </p>
        </div>
        <BaseConfirmModal />
      </template>

      <template #controls>
        <HstText v-model="state.title" title="Título" />
        <HstText v-model="state.message" title="Mensaje" />
        <HstText v-model="state.confirmText" title="Texto confirmar" />
        <HstText v-model="state.cancelText" title="Texto cancelar" />
        <HstSelect v-model="state.tone" title="Tono" :options="['primary', 'danger']" />
      </template>
    </Variant>

    <Variant title="Cómo se usa">
      <div class="story-panel">
        <p>
          El modal se monta
          <strong>una sola vez</strong>
          en la raíz de la app. Desde cualquier componente se pide una confirmación con el
          composable:
        </p>
        <pre><code>const { requestConfirm } = useConfirm()

const ok = await requestConfirm({
  title: 'Eliminar cliente',
  message: '¿Seguro? No se puede deshacer.',
  confirmText: 'Eliminar',
  tone: 'danger',
})</code></pre>
      </div>
      <BaseConfirmModal />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseConfirmModal from './base-confirm-modal.vue'
import BaseButton from '../base-button/base-button.vue'
import { useConfirm } from '@/composables/useConfirm'

const { requestConfirm } = useConfirm()
const respuesta = ref<boolean | null>(null)

const state = reactive({
  title: 'Eliminar cliente',
  message: '¿Seguro que quieres eliminarlo? No se puede deshacer.',
  confirmText: 'Eliminar',
  cancelText: 'Cancelar',
  tone: 'danger' as 'primary' | 'danger',
})

async function preguntar() {
  respuesta.value = await requestConfirm({ ...state })
}
</script>
