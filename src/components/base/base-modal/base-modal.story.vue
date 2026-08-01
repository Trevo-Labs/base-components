<template>
  <Story title="Componentes base/BaseModal" group="base" icon="carbon:popup">
    <Variant title="Playground">
      <template #default>
        <BaseButton @click="state.open = true">Abrir modal</BaseButton>
        <BaseModal
          v-model="state.open"
          :title="state.title"
          :size="state.size"
          :close-on-backdrop="state.closeOnBackdrop"
        >
          <p>{{ state.content }}</p>
          <template #footer>
            <BaseButton variant="secondary" @click="state.open = false">Cancelar</BaseButton>
            <BaseButton @click="state.open = false">Guardar</BaseButton>
          </template>
        </BaseModal>
      </template>

      <template #controls>
        <HstText v-model="state.title" title="Título" />
        <HstText v-model="state.content" title="Contenido" />
        <HstSelect v-model="state.size" title="Tamaño" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.closeOnBackdrop" title="Cerrar al pulsar fuera" />
        <HstCheckbox v-model="state.open" title="Abierto" />
      </template>
    </Variant>

    <Variant title="Tamaños">
      <div class="story-row">
        <BaseButton size="sm" @click="abrir('sm')">sm</BaseButton>
        <BaseButton size="sm" @click="abrir('md')">md</BaseButton>
        <BaseButton size="sm" @click="abrir('lg')">lg</BaseButton>
      </div>
      <BaseModal v-model="sizes.open" :title="`Modal ${sizes.size}`" :size="sizes.size">
        <p>Modal de tamaño {{ sizes.size }}.</p>
      </BaseModal>
    </Variant>

    <Variant title="Sin footer">
      <BaseButton @click="simple = true">Abrir</BaseButton>
      <BaseModal v-model="simple" title="Solo contenido">
        <p>Sin slot de footer no se renderiza el pie.</p>
      </BaseModal>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseModal from './base-modal.vue'
import BaseButton from '../base-button/base-button.vue'

type Size = 'sm' | 'md' | 'lg'

const state = reactive({
  open: false,
  title: 'Editar cliente',
  content: 'Contenido del modal.',
  size: 'md' as Size,
  closeOnBackdrop: true,
})

const sizes = reactive({ open: false, size: 'md' as Size })
const simple = ref(false)

function abrir(size: Size) {
  sizes.size = size
  sizes.open = true
}
</script>
