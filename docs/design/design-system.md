# Design system

Todo vive en `src/assets/css/variables.css`. Cambiar el aspecto de un proyecto entero es
tocar ese archivo, no los componentes.

## Colores

| Token                   | Valor     | Uso                        |
| ----------------------- | --------- | -------------------------- |
| `--color-primary`       | `#3f63bf` | acción principal, enlaces  |
| `--color-primary-dark`  | `#314e99` | hover del primario         |
| `--color-primary-light` | `#e0e7f6` | fondos suaves del primario |
| `--color-danger`        | `#cc4747` | destructivo, errores       |
| `--color-success`       | `#37936a` | confirmaciones             |
| `--color-warning`       | `#cc8a2f` | avisos                     |
| `--color-info`          | `#3792a3` | informativo                |

Cada uno tiene su pareja `--color-*-light` para fondos.

**Neutros**: `--color-bg` (fondo de app), `--color-surface` (tarjetas), `--color-surface-2` y
`--color-surface-3` (fondos secundarios), `--color-text`, `--color-text-muted`,
`--color-text-disabled`, `--color-border`, `--color-border-focus`.

**Paleta categórica** para gráficos: `--color-cat-1` … `--color-cat-8` más `--color-cat-otros`.
Renómbralas en cada proyecto según sus categorías reales.

## Espaciado

Escala de 4 px: `--space-1` (4px) · `--space-2` (8) · `--space-3` (12) · `--space-4` (16) ·
`--space-5` (20) · `--space-6` (24) · `--space-8` (32) · `--space-10` (40) · `--space-12` (48).

## Bordes

Casi cuadrados a propósito: `--radius-sm` (0) · `--radius` (2px) · `--radius-md` (4px) ·
`--radius-lg` (6px) · `--radius-full` (pill).

## Sombras

`--shadow-sm` · `--shadow` · `--shadow-md` · `--shadow-lg`.

## Tipografía

- `--font-sans`: Inter Variable
- `--font-mono`: JetBrains Mono Variable
- Tamaños: `--text-2xs` (10px, solo badges) · `--text-xs` (12) · `--text-sm` (14) ·
  `--text-base` (16) · `--text-lg` (18) · `--text-xl` (20) · `--text-2xl` (24) · `--text-3xl` (30)

## Z-index

Capas semánticas, de menor a mayor. **Nunca uses un número suelto**: elige la capa.

| Token         | Para                                            |
| ------------- | ----------------------------------------------- |
| `--z-sticky`  | header, sidebar                                 |
| `--z-aside`   | panel de filtros                                |
| `--z-overlay` | modales y sus fondos                            |
| `--z-popover` | paneles flotantes teleportados (select, fechas) |
| `--z-menu`    | menú del dropdown                               |
| `--z-toast`   | notificaciones — siempre lo más alto            |

## Transiciones

`--transition`: `150ms ease`. Una sola duración para todo, para que la interfaz se sienta
coherente.

## Layout

`--sidebar-width` (240px), `--sidebar-width-collapsed` (64px), `--header-height` (56px).
Están aquí porque casi todos los proyectos acaban con un layout de sidebar + header, aunque el
layout en sí no forma parte de esta plantilla.
