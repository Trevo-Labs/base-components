<template>
  <Story title="Componentes base/BaseField" group="base" icon="carbon:text-annotation-toggle">
    <Variant title="Playground">
      <template #default>
        <BaseField
          :label="state.label"
          :hint="state.hint"
          :error="state.error"
          :required="state.required"
        >
          <BaseInput v-model="state.value" placeholder="Escribe algo" :error="!!state.error" />
        </BaseField>
      </template>

      <template #controls>
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.required" title="Obligatorio" />
      </template>
    </Variant>

    <Variant title="Con hint">
      <BaseField label="Email" hint="Lo usaremos para avisarte de los cambios.">
        <BaseInput model-value="hola@ejemplo.com" />
      </BaseField>
    </Variant>

    <Variant title="Con error">
      <BaseField label="Email" error="El email no es válido">
        <BaseInput model-value="hola@" error />
      </BaseField>
    </Variant>

    <Variant title="Obligatorio">
      <BaseField label="Nombre" required>
        <BaseInput placeholder="Nombre y apellidos" />
      </BaseField>
    </Variant>

    <Variant title="Con select">
      <BaseField label="Estado" hint="El label queda enlazado con el control del slot.">
        <BaseSelect model-value="activo">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </BaseSelect>
      </BaseField>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseField from './base-field.vue'
import BaseInput from '../base-input/base-input.vue'
import BaseSelect from '../base-select/base-select.vue'

const state = reactive({
  label: 'Nombre',
  hint: 'Como aparecerá en las facturas.',
  error: '',
  required: false,
  value: '',
})
</script>
