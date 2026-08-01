# Convenciones de código

Heredadas del CRM. Si algo no está aquí, mira cómo lo hace el componente de al lado.

## Nombres

- **Archivos y carpetas en kebab-case**, siempre: `base-button/base-button.vue`.
  El `.css`, el `.spec.ts` y el `.story.vue` repiten el mismo nombre.
- **En el código, PascalCase**: `import BaseButton from './base-button.vue'`.
- Los tests describen con el nombre en PascalCase: `describe('BaseButton', …)`.

## Vue

- `<script setup lang="ts">` siempre.
- Props con `defineProps<{…}>()` y tipos explícitos; `withDefaults` cuando haya valores por defecto.
- Emits tipados: `defineEmits<{ 'update:modelValue': [value: string] }>()`.
- Orden dentro del componente: `<template>` primero, `<script setup>` después. Sin `<style>`.
- Comentarios en castellano y solo donde aportan: explican el **porqué**, no lo que ya dice el código.

## CSS

- Un `.css` por componente, importado como primera línea del script:
  ```ts
  import './base-button.css'
  ```
  No se usa `<style scoped>`: el CSS es global y se acota anidando bajo la clase raíz del
  componente.
- **Nesting nativo**, sin preprocesador:
  ```css
  .base-box {
    …
    .box-header {
      …
    }
  }
  ```
- **Todos los valores salen de los tokens** de `variables.css`: `var(--space-4)`,
  `var(--color-text-muted)`, `var(--radius-md)`…
- **Nunca un `z-index` numérico.** Usa la capa semántica que toque:
  `--z-sticky`, `--z-aside`, `--z-overlay`, `--z-popover`, `--z-menu`, `--z-toast`.

## Tests

- Vitest + `@testing-library/vue`. Se prueba lo que ve el usuario, no la implementación:
  roles, textos y eventos, no estado interno.
- El archivo va al lado del componente: `base-button/base-button.spec.ts`.

## Formato

Prettier con la config del repo: sin punto y coma, comillas simples, 100 columnas.

```bash
npm run format
```
