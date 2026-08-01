# BaseComponents

Repositorio maestro de componentes base. **No es una librería npm ni un paquete compartido**:
al empezar un proyecto nuevo se copia este repo (o la parte que haga falta) y a partir de ahí
cada proyecto evoluciona por su cuenta. No hay versionado entre proyectos.

Stack: Vue 3 · TypeScript · Vite 7 · CSS con nesting · Histoire.

## Arrancar

```bash
npm install
npm run story:dev   # catálogo de componentes (Histoire) → http://localhost:6006
npm run dev         # app de ejemplo
npm test            # tests (Vitest + Testing Library)
npm run build       # type-check + build
```

## Estructura

```
src/
├─ app/                     shell de la app de ejemplo
├─ assets/css/              variables (tokens), reset, utilidades, main
├─ components/base/         los componentes — uno por carpeta, en kebab-case
│  ├─ base-button/
│  │  ├─ base-button.vue
│  │  ├─ base-button.css
│  │  ├─ base-button.spec.ts
│  │  └─ base-button.story.vue
│  └─ internal/             piezas internas de otros componentes (no se usan sueltas)
├─ composables/             useNotify, useConfirm
├─ router/                  router mínimo (RouterLink lo necesitan CellLink y BasePageHeader)
└─ views/home-view/         vista de arranque, se borra al empezar un proyecto
```

Convenciones:

- **Todo en kebab-case**: carpeta, `.vue`, `.css`, `.spec.ts` y `.story.vue` comparten nombre.
- **El CSS va en un `.css` al lado**, importado desde el `<script setup>`. Nada de `<style scoped>`.
- **Los tokens mandan**: colores, espaciado, radios, sombras y z-index salen de `variables.css`.
  Nunca valores sueltos, y menos aún `z-index` numéricos.

## Componentes

| Componente           | Para qué                                                   |
| -------------------- | ---------------------------------------------------------- |
| `base-alert`         | Aviso en línea (success / warning / error / info)          |
| `base-badge`         | Etiqueta de estado                                         |
| `base-box`           | Tarjeta con cabecera opcional                              |
| `base-button`        | Botón con variantes, tamaños y estado de carga             |
| `base-checkbox`      | Checkbox con soporte de estado indeterminado               |
| `base-confirm-modal` | Modal de confirmación global (va con `useConfirm`)         |
| `base-data-grid`     | Tabla con orden, búsqueda, filtros, selección y paginación |
| `base-date-picker`   | Selector de fecha y fecha-hora                             |
| `base-dropdown`      | Menú flotante de acciones                                  |
| `base-empty-state`   | Estado vacío                                               |
| `base-field`         | Envoltorio de campo: label, hint y error                   |
| `base-input`         | Input, textarea y afijos; delega en el date-picker si toca |
| `base-modal`         | Modal con cabecera, cuerpo y pie                           |
| `base-notify`        | Pila de notificaciones global (va con `useNotify`)         |
| `base-page-header`   | Cabecera de página con migas, badges y acciones            |
| `base-select`        | Select accesible con panel propio                          |
| `base-switch`        | Interruptor on/off                                         |
| `base-tabs`          | Pestañas por estado o por ruta                             |
| `aside-filters`      | Panel lateral de filtros del data grid                     |
| `cell-link`          | Celda-enlace para el data grid                             |
| `copyable-text`      | Texto con botón de copiar                                  |
| `kanban-board`       | Tablero kanban con drag & drop                             |
| `pwa-update-banner`  | Banner de "hay versión nueva" (presentacional)             |

## Usarlo en un proyecto nuevo

Copia `src/components/base`, `src/composables` y `src/assets/css`. Con eso funciona todo.
Requisitos en el `package.json` del destino: `vue`, `vue-router` y `lucide-vue-next`,
más `@fontsource-variable/inter` y `@fontsource-variable/jetbrains-mono` si quieres las fuentes.

Detalle en [docs/guides/uso-en-proyecto-nuevo.md](docs/guides/uso-en-proyecto-nuevo.md).
