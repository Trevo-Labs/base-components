<template>
  <Story title="Componentes base/BaseInput" group="base" icon="carbon:text-input">
    <Variant title="Playground">
      <template #default>
        <BaseInput
          v-model="state.value"
          :type="state.type"
          :placeholder="state.placeholder"
          :prefix="state.prefix"
          :suffix="state.suffix"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :error="state.error"
        />
      </template>

      <template #controls>
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.type"
          title="Tipo"
          :options="['text', 'number', 'email', 'password', 'textarea', 'date', 'datetime-local']"
        />
        <HstText v-model="state.prefix" title="Prefijo" />
        <HstText v-model="state.suffix" title="Sufijo" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>
    </Variant>

    <Variant title="Tipos">
      <div class="story-stack">
        <BaseInput placeholder="Texto" />
        <BaseInput type="number" placeholder="Número" />
        <BaseInput type="email" placeholder="Email" />
        <BaseInput type="password" placeholder="Contraseña" />
        <BaseInput type="textarea" placeholder="Texto largo" :rows="3" />
      </div>
    </Variant>

    <Variant title="Con afijos">
      <div class="story-stack">
        <BaseInput type="number" model-value="1200" suffix="€" />
        <BaseInput type="number" model-value="21" suffix="%" />
        <BaseInput prefix="https://" placeholder="midominio.com" />
      </div>
    </Variant>

    <Variant title="Estados">
      <div class="story-stack">
        <BaseInput model-value="Normal" />
        <BaseInput model-value="Con error" error />
        <BaseInput model-value="Solo lectura" readonly />
        <BaseInput model-value="Deshabilitado" disabled />
      </div>
    </Variant>

    <Variant title="Fecha y fecha-hora">
      <div class="story-stack">
        <BaseInput type="date" v-model="state.date" />
        <BaseInput type="datetime-local" v-model="state.datetime" />
      </div>
      <p class="text-sm text-muted">
        Con
        <code>type="date"</code>
        delega en BaseDatePicker automáticamente.
      </p>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseInput from './base-input.vue'

const state = reactive({
  value: '',
  type: 'text',
  placeholder: 'Escribe algo',
  prefix: '',
  suffix: '',
  disabled: false,
  readonly: false,
  error: false,
  date: '2026-08-01',
  datetime: '2026-08-01T09:30',
})
</script>
