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
├─ composables/             use-notify.ts, use-confirm.ts
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

`base-data-grid` añade `datagrid-filters.ts` (tipos y utilidades de filtrado) y
`base-data-grid.md` (documentación larga del componente). `pwa-update-banner` añade su `.md`
con las instrucciones para conectarlo a un service worker.

## Piezas globales

Dos componentes se montan **una sola vez** en la raíz de la app (`app/app.vue`) y se controlan
desde cualquier sitio con su composable:

| Componente           | Composable                      | Uso                                  |
| -------------------- | ------------------------------- | ------------------------------------ |
| `base-notify`        | `useNotify` (`use-notify.ts`)   | `notify.success('Guardado')`         |
| `base-confirm-modal` | `useConfirm` (`use-confirm.ts`) | `await requestConfirm({ title: … })` |

Los dos composables guardan su estado **fuera** de la función, así que son singletons de verdad:
todos los componentes comparten la misma pila de notificaciones y la misma cola de confirmación.

## Dependencias externas

| Paquete                               | Para qué                                 |
| ------------------------------------- | ---------------------------------------- |
| `vue`                                 | —                                        |
| `vue-router`                          | `CellLink`, `BasePageHeader`, `BaseTabs` |
| `lucide-vue-next`                     | iconos                                   |
| `@fontsource-variable/inter`          | tipografía principal                     |
| `@fontsource-variable/jetbrains-mono` | tipografía monoespaciada                 |

Nada más. No hay Pinia, ni cliente HTTP, ni librería de fechas.

## Tengo que añadir X, ¿dónde lo pongo?

| Qué                                              | Dónde                                              |
| ------------------------------------------------ | -------------------------------------------------- |
| Un componente reutilizable en cualquier proyecto | `src/components/base/<nombre>/` con sus 4 archivos |
| Una pieza que solo usa otro componente base      | `src/components/base/internal/<nombre>/`           |
| Lógica con estado compartida entre componentes   | `src/composables/use-<algo>.ts`                    |
| Un token nuevo (color, espaciado, radio)         | `src/assets/css/variables.css`                     |
| Una utilidad CSS que usan varios componentes     | `src/assets/css/utilities.css`                     |
| Tipos que necesita más de un componente          | El módulo que los origina los exporta              |
| Documentación larga de un componente             | Un `.md` en la carpeta del componente              |

Y lo que **no** va aquí:

- **Layout de app** (sidebar, header): cada proyecto se monta el suyo. Esta plantilla no lo trae.
- **Componentes de dominio** (algo que sabe de clientes, facturas o tratos): no son base.
  Por eso `entity-notes` se quedó en el CRM.
- **Vistas**: `src/views/home-view/` existe solo como arranque de la app de ejemplo y se borra
  al empezar un proyecto real.

### La prueba del algodón

Un componente entra en `base/` si pasa las tres:

1. **No sabe nada del negocio.** Ni entidades, ni endpoints, ni permisos.
2. **Lo usarías igual en tres proyectos distintos** sin tocarlo.
3. **No arrastra dependencias nuevas** más allá de las cinco de la tabla de arriba.

Si falla alguna, no es base: es un componente del proyecto que lo necesita.
