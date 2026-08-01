# Reglas del proyecto — BaseComponents

Trabaja **en castellano**. Stack: **Vue 3 Composition API + TypeScript + CSS con nesting + Vite 7**.

Esto es una **plantilla de componentes base**, no una app ni una librería npm. Se copia al
empezar un proyecto nuevo y desde ahí cada copia evoluciona sola. Consecuencia práctica:
`src/components/base` tiene que poder copiarse aparte y seguir funcionando.

## Documentación del proyecto

Antes de tocar código, lee:

- `docs/project/code-style-guide.md` — convenciones de código. **Mandan sobre este archivo.**
- `docs/project/architecture.md` — dónde va cada cosa.
- `docs/project/infrastructure.md` — dependencias, scripts, entorno.
- `docs/project/decisions.md` — por qué las cosas son como son.
- `docs/design/design-system.md` — tokens: color, tipografía, espaciado, z-index.
- `docs/TODO.md` — el único TODO, y es de Jordi: cuentas, claves, decisiones y cambios que
  hay que aprobar. Lo que puedas arreglar tú, arréglalo; no lo apuntes ahí. No crees ninguna
  otra lista de pendientes.

Índice completo en `docs/README.md`.

## Nomenclatura

**Todo en kebab-case en disco**, sin excepciones: carpetas, `.vue`, `.css`, `.ts`,
`.spec.ts`, `.story.vue`. También los composables: `use-notify.ts`, no `useNotify.ts`.

```
src/components/base/base-button/
  base-button.vue
  base-button.css
  base-button.spec.ts
  base-button.story.vue
```

Al importar sí va PascalCase, que es lo que Vue espera en el template:

```ts
import BaseButton from '../base-button/base-button.vue'
```

- Variables y funciones: `camelCase`, empezando por verbo.
- Booleanos: `is`, `has`, `should`, `can`.
- Tipos e interfaces: `PascalCase`.
- Constantes de módulo: `SCREAMING_SNAKE_CASE`.
- Clases CSS: `kebab-case` y **en inglés**.
- Composables: archivo `use-algo.ts` exportando `useAlgo()`.

Código y clases en inglés; comentarios, interfaz y documentación en castellano.

## Estructura

```
src/
  app/                 shell de la app de ejemplo
  assets/css/          variables (tokens), reset, utilities, main, histoire
  components/base/     los componentes, uno por carpeta
    internal/          piezas que solo usa otro componente base
  composables/         use-notify.ts, use-confirm.ts
  router/              router mínimo
  views/home-view/     vista de arranque — se borra en un proyecto real
```

Un componente entra en `base/` solo si: no sabe nada del negocio, lo usarías igual en tres
proyectos distintos, y no arrastra dependencias nuevas. Si falla alguna, no es base.

**No se añaden componentes nuevos a la ligera.** Esta plantilla se mantiene pequeña a propósito.

## Componentes Vue

- `<script setup lang="ts">` siempre.
- Orden: `<template>` primero, `<script setup>` después. **Sin bloque `<style>`.**
- Props con `defineProps<{…}>()` tipadas; `withDefaults` para los defaults.
- Emits tipados: `defineEmits<{ 'update:modelValue': [value: string] }>()`.
- Nada de `any`.
- Lógica de negocio fuera del componente: a `composables/`.

## CSS

- Un `.css` por componente, importado como primera línea del script:
  `import './base-button.css'`. **Nunca `<style scoped>`.**
- **Una clase raíz** por componente y todo colgando con **nesting nativo**.
- **Sin prefijos repetidos**: dentro de `.base-box` va `.header`, no `.box-header`.
  Dos excepciones, porque no cuelgan de la raíz: lo teleportado a `<body>` lleva nombre único
  (`.base-select-panel`), y las clases que escribe el consumidor en un slot son API pública
  (`.dropdown-item`, `.kanban-btn`).
- **Los modificadores de la raíz sí llevan el nombre completo** (`.base-badge--success`);
  los de un hijo, no (`.body--flush`).
- **Todos los valores desde los tokens** de `variables.css`. Un color suelto es deuda.
- **Nada de `margin` para layout**: `flex`/`grid` + `gap` + `padding`. Excepciones: resets,
  `margin-inline: auto` y ajustes ópticos de 1-2 px con comentario.
- **Nunca un `z-index` numérico**: usa `--z-sticky`, `--z-aside`, `--z-overlay`,
  `--z-popover`, `--z-menu`, `--z-toast`.

## Imports

- Entre componentes base, **rutas relativas** (`../base-button/base-button.vue`).
- El alias `@/` solo para salir de `components/base` (hoy: los composables).
- Fuera de `components/base`, alias `@/` siempre. Nunca `../../../`.

## Tests y stories

- Cada componente lleva su `.spec.ts` y su `.story.vue` al lado.
- Vitest + Testing Library: se prueba lo que ve el usuario (roles, textos, eventos), no la
  implementación.
- Toda story empieza por una variante **Playground** con controles.
- Si añades o cambias un componente, actualiza su story. Un catálogo desactualizado engaña.

## Verificación

```bash
npm run build   # vue-tsc -b + vite build — la verificación real
npm test        # 190 tests
npm run story:dev
```

`npm run lint` apenas comprueba nada (tsconfig raíz con `files: []`): usa `npm run build`.

## Cómo trabajar

- Cambios pequeños y seguros, por fases.
- **Priorizar eliminar y simplificar** sobre añadir.
- No meter dependencias nuevas sin preguntar.
- No crear ramas ni hacer push salvo que se pida. Commits en la rama actual.
- Los `.md` van en `docs/`, nunca en la raíz (excepción: `README.md`). Dentro, por área
  (`project/`, `design/`, `guides/`, `goals/`) y en kebab-case, salvo `README.md` y `TODO.md`.
