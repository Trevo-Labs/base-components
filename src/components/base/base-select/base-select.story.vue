<template>
  <Story title="Componentes base/BaseSelect" group="base" icon="carbon:list-dropdown">
    <Variant title="Playground">
      <template #default>
        <BaseSelect
          v-model="state.value"
          :placeholder="state.placeholder"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :error="state.error"
        >
          <option value="">Sin asignar</option>
          <option value="activo">Activo</option>
          <option value="pausado">Pausado</option>
          <option value="cancelado">Cancelado</option>
        </BaseSelect>
      </template>

      <template #controls>
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>
    </Variant>

    <Variant title="Opciones desde v-for">
      <BaseSelect v-model="state.pais" placeholder="Elige un país">
        <option v-for="p in paises" :key="p.value" :value="p.value">{{ p.label }}</option>
      </BaseSelect>
    </Variant>

    <Variant title="Estados">
      <div class="story-stack">
        <BaseSelect model-value="activo">
          <option value="activo">Activo</option>
        </BaseSelect>
        <BaseSelect model-value="activo" error>
          <option value="activo">Activo</option>
        </BaseSelect>
        <BaseSelect model-value="activo" readonly>
          <option value="activo">Activo</option>
        </BaseSelect>
        <BaseSelect model-value="activo" disabled>
          <option value="activo">Activo</option>
        </BaseSelect>
      </div>
    </Variant>

    <Variant title="Con muchas opciones">
      <BaseSelect v-model="state.hora" placeholder="Elige una hora">
        <option v-for="h in horas" :key="h" :value="h">{{ h }}</option>
      </BaseSelect>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseSelect from './base-select.vue'

const state = reactive({
  value: 'activo',
  placeholder: 'Elige una opción',
  disabled: false,
  readonly: false,
  error: false,
  pais: '',
  hora: '',
})

const paises = [
  { value: 'es', label: 'España' },
  { value: 'fr', label: 'Francia' },
  { value: 'pt', label: 'Portugal' },
  { value: 'it', label: 'Italia' },
]

const horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
</script>
