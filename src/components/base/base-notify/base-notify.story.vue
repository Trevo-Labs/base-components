<template>
  <Story title="Componentes base/BaseNotify" group="base" icon="carbon:notification">
    <Variant title="Playground">
      <template #default>
        <div class="story-row">
          <BaseButton size="sm" @click="lanzar">Lanzar notificación</BaseButton>
        </div>
        <BaseNotify />
      </template>

      <template #controls>
        <HstSelect
          v-model="state.type"
          title="Tipo"
          :options="['success', 'error', 'info', 'warning']"
        />
        <HstText v-model="state.message" title="Mensaje" />
        <HstText v-model="state.title" title="Título (opcional)" />
        <HstNumber v-model="state.duration" title="Duración (ms)" />
      </template>
    </Variant>

    <Variant title="Tipos">
      <div class="story-row">
        <BaseButton size="sm" @click="notify.success('Cliente guardado')">Success</BaseButton>
        <BaseButton size="sm" variant="danger" @click="notify.error('No se pudo guardar')">
          Error
        </BaseButton>
        <BaseButton size="sm" variant="secondary" @click="notify.info('Sincronizando...')">
          Info
        </BaseButton>
        <BaseButton size="sm" variant="ghost" @click="notify.warning('Revisa los campos')">
          Warning
        </BaseButton>
      </div>
      <BaseNotify />
    </Variant>

    <Variant title="Cómo se usa">
      <div class="story-panel">
        <p>
          Se monta
          <strong>una sola vez</strong>
          en la raíz de la app y se dispara desde cualquier sitio con el composable:
        </p>
        <pre><code>const notify = useNotify()

notify.success('Cliente guardado')
notify.error('No se pudo guardar', { title: 'Vaya' })
notify.info('Sincronizando…', { duration: 0 }) // 0 = no se cierra sola</code></pre>
      </div>
      <BaseNotify />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseNotify from './base-notify.vue'
import BaseButton from '../base-button/base-button.vue'
import { useNotify, type NotifyType } from '@/composables/use-notify'

const notify = useNotify()

const state = reactive({
  type: 'success' as NotifyType,
  message: 'Cliente guardado correctamente',
  title: '',
  duration: 4000,
})

function lanzar() {
  notify.notify(state.type, state.message, {
    title: state.title || undefined,
    duration: state.duration,
  })
}
</script>
