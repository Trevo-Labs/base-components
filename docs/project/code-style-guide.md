# Convenciones de código

Las reglas que se aplican en este repo. Mandan sobre cualquier valor por defecto de una skill.
Si algo no está aquí, mira cómo lo hace el componente de al lado.

## Nombres

**Todo en kebab-case en disco**: carpetas, `.vue`, `.css`, `.ts`, `.spec.ts`, `.story.vue`.
Sin excepciones — tampoco los composables (`use-notify.ts`, no `useNotify.ts`).

Kebab en disco evita sustos de mayúsculas: Windows no distingue `BaseButton` de `basebutton`,
un servidor Linux sí. Un rename que funciona en local y da 404 en producción sale de ahí.

Los archivos de un componente comparten nombre:

```
base-button/
  base-button.vue
  base-button.css
  base-button.spec.ts
  base-button.story.vue
```

En el código:

- **Componentes en PascalCase** al importar: `import BaseButton from './base-button.vue'`.
- **Variables y funciones en camelCase**; las funciones empiezan por verbo.
- **Booleanos** con `is`, `has`, `should`, `can`.
- **Tipos e interfaces en PascalCase**.
- **Constantes de módulo en SCREAMING_SNAKE_CASE**.
- **Clases CSS en kebab-case y en inglés**, siempre.
- **Composables**: archivo `use-algo.ts` exportando `useAlgo()`.
- Los tests describen con el nombre del componente en PascalCase: `describe('BaseButton', …)`.

Nombres que dicen qué son. Nada de `data`, `item`, `temp`, `handleClick`, `doStuff`.

**Idioma:** código y clases CSS en inglés; comentarios, textos de interfaz y documentación
en castellano.

## Vue

- `<script setup lang="ts">` siempre.
- Orden: `<template>` primero, `<script setup>` después. **Sin bloque `<style>`.**
- Props con `defineProps<{…}>()` y tipos explícitos; `withDefaults` cuando haya defaults.
- Emits tipados: `defineEmits<{ 'update:modelValue': [value: string] }>()`.
- Si una parte del template pasa de ~40 líneas o tiene lógica propia, es un componente.
- Lógica de negocio fuera del componente: a `composables/`.
- Comentarios en castellano y solo donde aportan: explican el **porqué**, no lo que ya dice
  el código.

## CSS

Un `.css` por componente, importado como primera línea del script:

```ts
import './base-button.css'
```

No se usa `<style scoped>`: `scoped` genera atributos por elemento y complica sobreescribir
desde el padre. El aislamiento se consigue con la clase raíz única.

**Una clase raíz por componente**, con su nombre (`.base-button`, `.base-box`), y todo lo
demás colgando de ella con **nesting nativo** (sin preprocesador):

```css
.base-box {
  .header {
    .title {
    }
  }
  .body {
    &.body--flush {
    }
  }
}
```

**Sin prefijos repetidos.** Dentro de `.base-box` va `.header`, no `.box-header`: la raíz ya
da el contexto y el prefijo solo alarga el selector.

Dos excepciones, y por el mismo motivo — que ese elemento **no cuelga de la raíz**:

- **Lo teleportado a `<body>`** lleva nombre único: `.base-select-panel`, `.base-modal-overlay`,
  `.base-dropdown-menu`, `.base-notify-stack`, `.aside-filters-overlay`. Sus hijos sí van sin
  prefijo, porque ya cuelgan de ese nombre único.
- **Las clases que escribe el consumidor dentro de un slot** son API pública y se quedan
  explícitas: `.dropdown-item`, `.dropdown-divider`, `.dropdown-label`, `.kanban-btn`.

Los **modificadores de la raíz sí llevan el nombre completo**, porque son la misma clase:
`class="base-badge base-badge--success"`. Los de un hijo pierden el prefijo igual que el hijo:
`.body--flush`.

Más reglas:

- **Todos los valores salen de los tokens** de `variables.css`: `var(--space-4)`,
  `var(--color-text-muted)`, `var(--radius-md)`. Un color suelto en un componente es deuda:
  cuando cambie la marca, no aparece.
- **Nada de `margin` para layout.** `flex`/`grid` + `gap` + `padding`. Excepciones legítimas:
  resets (`margin: 0`), centrado (`margin-inline: auto`), y ajustes ópticos de 1-2 px con
  comentario.
- **Nunca un `z-index` numérico.** Usa la capa semántica: `--z-sticky`, `--z-aside`,
  `--z-overlay`, `--z-popover`, `--z-menu`, `--z-toast`.
- `!important` solo contra CSS de terceros, y con comentario.

## TypeScript

- Nada de `any`, ni explícito ni implícito.
- Props y emits siempre tipados.
- Los tipos que se comparten entre componentes viven en el módulo que los origina y se
  exportan desde ahí (`datagrid-filters.ts` exporta `FilterConfig`).
- Evita `as`: normalmente significa que el tipo de origen está mal definido.

## Imports

- **Entre componentes base, rutas relativas** (`../base-button/base-button.vue`), no el alias.
  La carpeta `components/base` tiene que poder copiarse sola a otro proyecto y funcionar.
- **El alias `@/` solo para salir de `components/base`**: hoy son los dos componentes que
  llaman a un composable (`base-notify`, `base-confirm-modal`).
- Fuera de `components/base` (app, views, router), alias `@/` siempre. Nada de `../../../`.

## Tests

- Vitest + `@testing-library/vue`. Se prueba **lo que ve el usuario**: roles, textos y
  eventos. No estado interno ni detalles de implementación.
- El archivo va al lado del componente.
- Un componente sin test es aceptable si es puramente presentacional y trivial; uno con
  lógica, no.

## Formato

Prettier con la config del repo: sin punto y coma, comillas simples, 100 columnas.

```bash
npm run format
```

## Verificación

`npm run build` es la verificación real (hace `vue-tsc -b` + `vite build`). `npm run lint`
usa `vue-tsc --noEmit` sobre un tsconfig con `files: []` y apenas comprueba nada.
