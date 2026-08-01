# BaseDataGrid

Tabla de datos genérica. Renderiza filas a partir de un array de columnas y un array de
filas, con soporte para celdas personalizadas (slots), acciones de fila, selección
múltiple, ordenación, paginación y **búsqueda y filtros integrados** mediante un panel
lateral (`AsideFilters`).

Ficheros relacionados:

- `base-data-grid.vue` — el componente.
- `datagrid-filters.ts` — tipos (`FilterConfig`, `FilterOption`) y lógica de filtrado.
- `../aside-filters/aside-filters.vue` — panel lateral deslizante con los controles de filtro.

---

## Uso básico

```vue
<BaseDataGrid
  :columns="columns"
  :rows="store.items"
  row-key="id"
  :loading="store.loading"
  @row-click="(item) => router.push(`/ruta/${item.id}`)"
>
  <template #cell-estado="{ row }">
    <BaseBadge :variant="badge(row.estado)">{{ row.estado }}</BaseBadge>
  </template>
  <template #actions="{ row }">…</template>
  <template #empty><p>No hay datos.</p></template>
</BaseDataGrid>
```

### Columnas

```ts
const columns = [
  { key: 'nombre', label: 'Nombre', width: '3' },      // flex 3 (más ancha)
  { key: 'estado', label: 'Estado', width: '1' },      // flex 1
  { key: 'icono', label: '', width: '44px' },          // ancho fijo (con unidad)
  { key: 'total', label: 'Total', align: 'right' },    // sin width → flex 1
]
```

`width` sirve tanto para el reparto flexible como para anchos fijos, según cómo lo escribas:

- **Número plano** (`'1'`, `'3'`, `'4'`) → proporción de reparto del espacio (flex). Es lo habitual.
- **Valor con unidad** (`'44px'`, `'8rem'`) → ancho fijo; tiene prioridad y no se reparte.

| Campo      | Tipo                          | Descripción                                                       |
| ---------- | ----------------------------- | ---------------------------------------------------------------- |
| `key`      | `string`                      | Clave del campo en la fila y del slot `#cell-<key>`.             |
| `label`    | `string`                      | Cabecera de columna.                                             |
| `width`    | `string`                      | Número plano (`'3'`) = proporción flex; con unidad (`'120px'`) = ancho fijo. Por defecto flex 1. |
| `flex`     | `number`                      | Alternativa numérica a `width` para el reparto flexible. Por defecto 1. |
| `maxWidth` | `string`                      | Tope de ancho para columnas flexibles (evita que dominen).      |
| `align`    | `'left' \| 'center' \| 'right'` | Alineación del contenido. Por defecto `left`.                  |
| `sortable` | `boolean \| (row) => unknown` | Hace la columna ordenable. Ver [Ordenación](#ordenación).        |

### Slots

- `#cell-<key>="{ row, value }"` — celda personalizada de la columna `<key>`.
- `#actions="{ row }"` — columna de acciones a la derecha (dropdown, botones…).
- `#empty` — contenido cuando no hay filas (tras filtrar incluido).
- `#bulk-actions="{ rows, clear }"` — acciones sobre la selección (requiere `selectable`).

---

## Búsqueda y filtros

El grid puede filtrar sus filas **en cliente** sin que la vista tenga que mantener
refs de búsqueda ni computeds de filtrado. Se declara con props y el grid hace el
resto: pasa la lista COMPLETA en `:rows` y el grid muestra solo las que pasan los
filtros activos.

```vue
<BaseDataGrid
  :columns="columns"
  :rows="store.items"          <!-- lista completa, SIN filtrar -->
  row-key="id"
  searchable
  search-placeholder="Buscar por concepto o cliente..."
  :search-accessor="buscarItem"
  :filters="filters"
  @row-click="…"
>
```

### Buscador de texto (toolbar superior)

Aparece una barra encima de la cabecera de columnas con un input de búsqueda a la
izquierda y (si hay filtros) un botón **Filtros** a la derecha.

| Prop                 | Tipo                                            | Descripción                                              |
| -------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| `searchable`         | `boolean`                                       | Muestra el buscador de texto.                            |
| `searchPlaceholder`  | `string`                                        | Placeholder del input. Por defecto `"Buscar..."`.       |
| `searchAccessor`     | `string \| string[] \| (row) => unknown`        | Campo(s) donde busca el texto.                           |

El `searchAccessor` acepta tres formas:

```ts
search-accessor="asunto"                              // un campo
:search-accessor="['nombre','apellidos','email']"     // varios campos (OR)
:search-accessor="buscarItem"                         // función: devuelve el string a buscar
```

Usa la **función** cuando el texto a buscar no está directo en la fila (p. ej. el
nombre del cliente hay que resolverlo desde otro store):

```ts
function buscarItem(c: Cobro) {
  return `${c.concepto} ${nombreCliente(c.clienteId)}`
}
```

### Panel de filtros (`:filters`)

Cada filtro es un objeto `FilterConfig<TipoFila>`. **Tipa siempre el array con el tipo
de la fila** para que los slots `#cell-*` conserven el tipado de `row`:

```ts
import type { FilterConfig } from '@/components/base/base-data-grid/datagrid-filters'
import type { Cobro } from '@/types'   // el tipo de tu fila

const filters: FilterConfig<Cobro>[] = [
  {
    key: 'estado',
    label: 'Estado',
    type: 'select',
    accessor: 'estado',
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'cobrado', label: 'Cobrado' },
    ],
  },
]
```

#### Campos de `FilterConfig`

| Campo        | Tipo                                          | Descripción                                                            |
| ------------ | --------------------------------------------- | --------------------------------------------------------------------- |
| `key`        | `string`                                      | Identificador único (clave en el estado interno de valores).          |
| `label`      | `string`                                      | Nombre mostrado en el panel.                                          |
| `type`       | `'text' \| 'select' \| 'multiselect' \| 'boolean' \| 'daterange' \| 'numberrange'` | Control que muestra el aside.             |
| `accessor`   | `string \| string[] \| (row) => unknown`      | De dónde sale el valor a comparar en cada fila.                       |
| `options`    | `FilterOption[] \| () => FilterOption[]`      | Opciones para `select`/`multiselect`. Array o getter (dinámicas).     |
| `trueLabel`  | `string`                                      | Etiqueta del `true` en `boolean` (por defecto "Sí").                 |
| `falseLabel` | `string`                                      | Etiqueta del `false` en `boolean` (por defecto "No").                |

#### Tipos de filtro

- **`select`** — dropdown de opción única. La opción vacía ("Todos") se añade sola.
  El `accessor` suele ser un solo campo (`accessor: 'estado'`). Requiere `options`.

- **`boolean`** — select tri-estado (Todos / trueLabel / falseLabel). El `accessor`
  debe apuntar a un campo booleano de la fila. Ideal para "Completadas/Pendientes",
  "Activos/Pausados", etc.:

  ```ts
  { key: 'completada', label: 'Estado', type: 'boolean',
    accessor: 'completada', trueLabel: 'Completadas', falseLabel: 'Pendientes' }
  ```

- **`multiselect`** — lista de checkboxes; la fila pasa si su valor está en la
  selección. Requiere `options`.

- **`text`** — input de texto dentro del panel (búsqueda parcial por `includes`).
  Normalmente no hace falta porque el buscador superior ya cubre la búsqueda libre.

- **`daterange`** — dos inputs de fecha (desde / hasta). El `accessor` apunta a un
  campo fecha ISO (`YYYY-MM-DD` o con hora; se compara por la parte de fecha). Cada
  extremo es opcional: vacío = sin límite por ese lado. Las filas **sin fecha** se
  ocultan cuando el rango está activo. El valor en el estado es `{ from, to }`:

  ```ts
  { key: 'creadoEn', label: 'Fecha de alta', type: 'daterange', accessor: 'creadoEn' }
  ```

- **`numberrange`** — dos inputs numéricos (mínimo / máximo). Cada extremo es opcional.
  El valor en el estado es `{ min, max }` (cadenas vacías = sin límite):

  ```ts
  { key: 'total', label: 'Importe', type: 'numberrange', accessor: 'total' }
  ```

#### Opciones dinámicas

`options` puede ser un getter que se evalúa al abrir el panel — útil cuando dependen
de datos cargados (categorías existentes, lista de clientes…):

```ts
{
  key: 'clienteId',
  label: 'Cliente',
  type: 'select',
  accessor: 'clienteId',
  options: () =>
    clientesStore.clientes.map((c) => ({ value: c.id, label: `${c.nombre} ${c.apellidos}` })),
}
```

### Cómo funciona el filtrado

- Todos los filtros activos se combinan con **AND**, junto con el buscador de texto.
- Un filtro sin valor (`''`, `[]`, `null`) no filtra.
- El botón **Filtros** muestra un badge con el número de filtros activos.
- El panel `AsideFilters` edita un borrador y solo aplica al pulsar **Filtrar**
  (Cancelar descarta; Limpiar vacía todos los filtros del borrador).
- El filtrado es **client-side**: pasa siempre la lista completa en `:rows`. Para
  volúmenes normales (cientos de filas) va sobrado; si una tabla creciera a miles de
  filas, habría que pasar a filtrado server-side (emitir el estado y que la vista haga
  `fetchAll(params)`).

---

## Ordenación

La ordenación se activa **por columna**: marca con `sortable` las que quieras ordenables.
No hay prop en el grid. Al clicar la cabecera, el orden cicla **asc → desc → sin orden**,
con un chevron que indica el estado (doble chevron tenue cuando no está ordenada, flecha
arriba/abajo resaltada cuando sí).

```ts
const columns = [
  { key: 'concepto', label: 'Concepto', sortable: true },
  { key: 'total', label: 'Total', align: 'right', sortable: (c: Cobro) => c.total },
  { key: 'estado', label: 'Estado' }, // sin sortable → no ordenable
]
```

- `sortable: true` → ordena por el campo `key` de la fila.
- `sortable: (row) => valor` → ordena por el valor que devuelva la función. Úsalo
  cuando el criterio no es el campo directo (un total numérico, un nombre resuelto
  desde otro store, una fecha derivada…).
- La comparación es **numérica** si ambos valores son números (o booleanos), y por
  texto (`localeCompare` en español, `numeric`) en el resto. Los valores nulos van
  al final. La ordenación se aplica **sobre las filas ya filtradas**.
- Es accesible: la cabecera ordenable es enfocable (Tab), responde a Enter/Espacio y
  expone `aria-sort` (`none`/`ascending`/`descending`).

La ordenación es **client-side**, igual que los filtros. Si una vista necesita un
orden inicial fijo distinto del de `:rows`, ordénalas en un `computed` antes de pasarlas.

---

## Paginación

Es **automática**: el grid pagina en cliente y muestra un pie con el selector de tamaño
de página y la navegación anterior/siguiente en cuanto hay filas de sobra. No hay que
activarla.

```vue
<BaseDataGrid :columns="columns" :rows="store.items" :page-size="50" row-key="id" />
```

| Prop              | Tipo       | Default                   | Descripción                                      |
| ----------------- | ---------- | ------------------------- | ------------------------------------------------ |
| `pageSize`        | `number`   | `25`                      | Tamaño de página inicial (debe estar en las opciones). |
| `pageSizeOptions` | `number[]` | `[25, 50, 100, 150, 200]` | Opciones del selector de tamaño.                 |

- El pie **solo aparece** si hay más filas que el tamaño mínimo de `pageSizeOptions`
  (con los defaults, más de 25). Con pocas filas no molesta.
- La paginación se aplica **después** de filtrar y ordenar. Al cambiar filtros, orden
  o tamaño de página, si la página actual se queda fuera de rango se reencuadra sola.
- Con `selectable`, "seleccionar todo" opera sobre las filas **de la página visible**.

---

## Selección múltiple

```vue
<BaseDataGrid selectable v-model:selected="seleccionadas" …>
  <template #bulk-actions="{ rows, clear }">
    <BaseButton @click="borrar(rows); clear()">Eliminar</BaseButton>
  </template>
</BaseDataGrid>
```

`selectable` añade una columna de checkboxes y una barra de acciones masivas que
sustituye la cabecera cuando hay filas marcadas. "Seleccionar todo" opera sobre las
filas **visibles** (ya filtradas).

---

## Props (referencia completa)

| Prop                | Tipo                     | Default        | Descripción                                        |
| ------------------- | ------------------------ | -------------- | -------------------------------------------------- |
| `columns`           | `Column[]`               | —              | Definición de columnas.                            |
| `rows`              | `T[]`                    | —              | Filas completas (el grid las filtra si procede).   |
| `rowKey`            | `string`                 | —              | Campo clave para el `:key` y la selección.         |
| `loading`           | `boolean`                | `false`        | Muestra el estado de carga.                        |
| `error`             | `string \| null`         | —              | Si se pasa, muestra el estado de error con botón de reintento. |
| `actionsWidth`      | `string`                 | `'110px'`      | Ancho de la columna de acciones.                   |
| `selectable`        | `boolean`                | `false`        | Activa selección múltiple.                         |
| `searchable`        | `boolean`                | `false`        | Muestra el buscador de texto.                      |
| `searchPlaceholder` | `string`                 | `'Buscar...'`  | Placeholder del buscador.                          |
| `searchAccessor`    | `Accessor<T>`            | —              | Campo(s)/función donde busca el texto.             |
| `filters`           | `FilterConfig<T>[]`      | `[]`           | Filtros del panel lateral.                         |
| `pageSize`          | `number`                 | `25`           | Tamaño de página inicial.                          |
| `pageSizeOptions`   | `number[]`               | `[25,50,100,150,200]` | Opciones del selector de tamaño de página.  |

La ordenación y la paginación no tienen prop de activación: la primera depende de que las
columnas lleven `sortable`, la segunda aparece sola cuando hay filas de sobra.

## Eventos

- `@row-click="(row) => …"` — clic en una fila.
- `@retry` — clic en "Reintentar" del estado de error.
- `v-model:selected` — filas seleccionadas (con `selectable`).
