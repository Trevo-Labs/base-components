# Migración de los BaseComponents desde el CRM

**Fecha:** 1 de agosto de 2026
**Origen:** `~/Proyectos/GestiTec/CRM/frontend/src/components/base`
**Estado:** cerrado

## Objetivo

Desacoplar los componentes base del CRM y convertirlos en una plantilla reutilizable e
independiente, con Histoire como catálogo. Sin perder funcionalidad y sin componentes nuevos.

## Qué se migró

23 componentes + 2 internos, con su CSS, sus tests y la estructura de carpetas del CRM intacta:

`aside-filters` · `base-alert` · `base-badge` · `base-box` · `base-button` · `base-checkbox` ·
`base-confirm-modal` · `base-data-grid` · `base-date-picker` · `base-dropdown` ·
`base-empty-state` · `base-field` · `base-input` · `base-modal` · `base-notify` ·
`base-page-header` · `base-select` · `base-switch` · `base-tabs` · `cell-link` ·
`copyable-text` · `kanban-board` · `pwa-update-banner` ·
`internal/date-picker-calendar` · `internal/date-picker-time-columns`

Además: `useNotify` y `useConfirm` (con sus tests), y los cuatro CSS de `assets/css`.

> Los nombres de archivo de esta tabla son los que tenían **en el CRM**. En este repo los
> composables pasaron a kebab-case (`use-notify.ts`, `use-confirm.ts`) al fijar las
> convenciones con `/neo init` el 1/8/2026.

## Dependencias del CRM que se encontraron y cómo se resolvieron

| Qué                                                   | Dónde                                        | Solución                                                                                 |
| ----------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `@/composables/useNotify`                             | `base-notify`                                | El composable es genérico (estado con `ref`, cero negocio). Se copió tal cual.           |
| `@/composables/useConfirm`                            | `base-confirm-modal`                         | Igual: genérico, se copió tal cual.                                                      |
| `@/components/base/…` (alias)                         | `base-confirm-modal`                         | Pasado a rutas relativas, como el resto de componentes.                                  |
| `@/composables/usePwaUpdate` → `virtual:pwa-register` | `pwa-update-banner`                          | El banner se reescribió como presentacional. Ver más abajo.                              |
| `@/services/api`, `@/stores/auth`, `@/types`          | `entity-notes`                               | No es un componente base. Se dejó fuera.                                                 |
| `vue-router`                                          | `cell-link`, `base-page-header`, `base-tabs` | Dependencia legítima: se instala `vue-router` y punto.                                   |
| Variables CSS del CRM                                 | `variables.css`                              | Se quitaron las categorías de gasto y los estados de cita.                               |
| Clases CSS del CRM                                    | `utilities.css`, `main.css`                  | Se quitaron `.login-*` y el layout de app (`.app-layout`, `.app-main`, `.page-content`). |

Nada más. El resto de la carpeta ya era independiente: solo `vue` y `lucide-vue-next`.

## Decisiones

**`entity-notes` fuera.** Era dominio CRM disfrazado de componente base: llamaba a `/notas` y
`/files/upload`, comprobaba permisos contra el store de auth y usaba el tipo `Nota`. Si algún día
hace falta un componente de notas genérico, se reescribe presentacional (props + emits), no se
migra este.

**`pwa-update-banner` desacoplado.** Se reescribió como componente presentacional: recibe
`model-value` y emite `update`. Así el repo no arrastra `vite-plugin-pwa`. Las cuatro líneas para
reconectarlo a un service worker están en `pwa-update-banner.md`, al lado del componente. Su test
se reescribió acorde.

**Vite 7, no 8.** El CRM va por Vite 8, pero Histoire `1.0.0-beta.1` pide Vite `^7.3.0` como peer.
Como los repos son independientes, aquí se fija Vite 7.3.6 y todo instala limpio sin flags.

**Reorganización aprobada** (el resto de la estructura se respetó tal cual):

- Los `.spec.ts` estaban sueltos en la raíz de `base/` y en PascalCase. Ahora cada uno vive en la
  carpeta de su componente y en kebab-case: `base-button/base-button.spec.ts`.
- `datagrid-filters.ts` y su spec pasaron a `base-data-grid/`.
- `BaseDataGrid.md` pasó a `base-data-grid/base-data-grid.md`.

Efecto lateral: `aside-filters` importa los tipos de filtros desde `../base-data-grid/datagrid-filters`.
Es un import cruzado entre carpetas, pero `aside-filters` ya era un satélite del grid (el grid lo
importa a él), así que se asume.

**Paleta categórica renombrada.** `--color-cat-alquiler`, `--color-cat-software`… pasaron a
`--color-cat-1` … `--color-cat-8`. Los nombres del CRM no significan nada en otro proyecto.

## Histoire

- `histoire` + `@histoire/plugin-vue` `1.0.0-beta.1`.
- `histoire.config.ts` con dos grupos: _Componentes base_ e _Internos_.
- `src/histoire.setup.ts` instala un router de memoria: sin él, los tres componentes que usan
  `RouterLink` fallarían al renderizar en el sandbox.
- **25 stories, 87 variantes.** Una por componente, con "Playground" (controles interactivos)
  como primera variante.
- Se añadieron `flexsearch`, `vscode-oniguruma` y `vscode-textmate` como devDeps: Histoire las
  pre-bundlea y sin ellas avisaba al arrancar (buscador y resaltado de código).

## Cómo probarlo

```bash
npm install
npm test          # 25 archivos, 190 tests
npm run build     # vue-tsc -b + vite build
npm run story:dev # http://localhost:6006
```

Verificado el 1/8/2026: los 190 tests pasan, el build compila y `story:dev` levanta con las 25
stories recopiladas.

## Pendiente (para Jordi)

Está en [../TODO.md](../TODO.md): `lucide-vue-next` está deprecado a favor de `@lucide/vue`.
