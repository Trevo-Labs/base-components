# Arquitectura

## Qué es este repo

Una **plantilla**, no una librería. No se publica en npm, no se instala como paquete y no hay
versionado entre proyectos. Al empezar un proyecto nuevo se copia lo que haga falta y desde ahí
cada copia vive su vida.

La consecuencia práctica: **la carpeta `src/components/base` tiene que poder copiarse sola y
funcionar**. Por eso los componentes se importan entre ellos con rutas relativas y no con el
alias `@`. La única excepción son los dos que dependen de un composable
(`base-notify` → `useNotify`, `base-confirm-modal` → `useConfirm`), que sí usan `@/composables/…`;
si copias la carpeta base, llévate también `src/composables`.

## Origen

Migrado desde `GestiTec/CRM/frontend/src/components/base`. El detalle de qué se trajo y qué se
quedó fuera está en [goal-migracion-crm-implementacion.md](../goals/goal-migracion-crm-implementacion.md).

## Estructura

```
src/
├─ app/app.vue              shell: RouterView + los dos singletons globales
├─ assets/css/
│  ├─ variables.css         tokens — la fuente de verdad del diseño
│  ├─ reset.css             reset
│  ├─ utilities.css         utilidades y clases compartidas
│  ├─ main.css              entrada: importa fuentes + los tres anteriores
│  └─ histoire.css          ajustes solo para el sandbox de Histoire
├─ components/base/         un componente por carpeta
│  └─ internal/             piezas internas de otros componentes
├─ composables/             useNotify, useConfirm
├─ router/index.ts          router mínimo
├─ views/home-view/         vista de arranque (bórrala en un proyecto real)
├─ histoire.setup.ts        setup de Histoire (instala el router de pega)
├─ main.ts
└─ setupTests.ts
```

## Anatomía de un componente

Cada componente vive en su carpeta y todos los archivos comparten nombre en kebab-case:

```
base-button/
├─ base-button.vue          template + script setup
├─ base-button.css          estilos, importados desde el script
├─ base-button.spec.ts      test (Vitest + Testing Library)
└─ base-button.story.vue    story de Histoire
```

`base-data-grid` añade `datagrid.filters.ts` (tipos y utilidades de filtrado) y
`base-data-grid.md` (documentación larga del componente). `pwa-update-banner` añade su `.md`
con las instrucciones para conectarlo a un service worker.

## Piezas globales

Tres componentes se montan **una sola vez** en la raíz de la app (`app/app.vue`) y se controlan
desde cualquier sitio con su composable:

| Componente          | Composable   | Uso                                    |
| ------------------- | ------------ | -------------------------------------- |
| `base-notify`       | `useNotify`  | `notify.success('Guardado')`           |
| `base-confirm-modal`| `useConfirm` | `await requestConfirm({ title: … })`   |

Los dos composables guardan su estado **fuera** de la función, así que son singletons de verdad:
todos los componentes comparten la misma pila de notificaciones y la misma cola de confirmación.

## Dependencias externas

| Paquete                        | Para qué                                    |
| ------------------------------ | ------------------------------------------- |
| `vue`                          | —                                           |
| `vue-router`                   | `CellLink`, `BasePageHeader`, `BaseTabs`    |
| `lucide-vue-next`              | iconos                                      |
| `@fontsource-variable/inter`   | tipografía principal                        |
| `@fontsource-variable/jetbrains-mono` | tipografía monoespaciada             |

Nada más. No hay Pinia, ni cliente HTTP, ni librería de fechas.
