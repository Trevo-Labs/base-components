# Histoire

El catálogo de componentes. Cada componente tiene su `.story.vue` al lado.

## Ejecutar

```bash
npm run story:dev       # http://localhost:6006
npm run story:build     # genera .histoire/dist
npm run story:preview   # sirve el build
```

## Configuración

- `histoire.config.ts` — plugin de Vue, tema, grupos del árbol y dónde busca las stories
  (`src/**/*.story.vue`).
- `src/histoire.setup.ts` — se ejecuta antes de cada story: carga el CSS global e instala un
  **router de pega**. Sin él, `CellLink`, `BasePageHeader` y `BaseTabs` fallarían al resolver
  `RouterLink`.
- `src/assets/css/histoire.css` — solo estilos del sandbox: aire alrededor de las variantes y
  las clases auxiliares `.story-row`, `.story-stack` y `.story-panel`.

## Escribir una story

```vue
<template>
  <Story title="Componentes base/BaseButton" group="base" icon="carbon:button-centered">
    <Variant title="Playground">
      <template #default>
        <BaseButton :variant="state.variant">{{ state.label }}</BaseButton>
      </template>

      <template #controls>
        <HstText v-model="state.label" title="Texto" />
        <HstSelect v-model="state.variant" title="Variante" :options="['primary', 'danger']" />
      </template>
    </Variant>

    <Variant title="Variantes">
      <div class="story-row">
        <BaseButton variant="primary">Primary</BaseButton>
        <BaseButton variant="danger">Danger</BaseButton>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseButton from './base-button.vue'

const state = reactive({
  label: 'Guardar',
  variant: 'primary' as 'primary' | 'danger',
})
</script>
```

Reglas que sigue el repo:

- **`title`**: `Componentes base/NombreDelComponente`. Los internos van en `Internos/…`.
- **`group`**: `base` o `internal`. Los grupos se declaran en `histoire.config.ts`.
- **Primera variante siempre "Playground"**, con controles para toquetear las props.
- Después, una variante por eje interesante: variantes visuales, tamaños, estados, casos límite
  (vacío, cargando, error).
- Los estados tipados con unión (`variant`, `size`) se declaran con `as 'a' | 'b'`, **no**
  con `as const`: si no, `v-model` de `HstSelect` no compila.

## Controles disponibles

`HstText` · `HstNumber` · `HstCheckbox` · `HstSelect` · `HstTextarea` · `HstSlider` ·
`HstColorShades` · `HstJson`. Todos llevan `v-model` y `title`.

## Detalles

- Los iconos (`icon="carbon:…"`) se cargan desde Iconify por internet. Sin conexión, el catálogo
  funciona igual pero sin iconos en el árbol.
- Histoire va por la `1.0.0-beta.1` y pide **Vite 7** como peer. Por eso este repo está en Vite 7
  y no en 8. Si algún día subes Vite, comprueba antes que Histoire lo soporta.
