# PwaUpdateBanner

Banner fijo que avisa de que hay una versión nueva desplegada y ofrece recargar.

Es **presentacional**: no toca el service worker. Se controla con `model-value` y
emite `update` al pulsar el botón. Así el repo no arrastra `vite-plugin-pwa` y el
banner sirve igual para avisar de cualquier otra cosa.

## Props

| Prop         | Tipo      | Por defecto                              |
| ------------ | --------- | ---------------------------------------- |
| `modelValue` | `boolean` | `false`                                  |
| `title`      | `string`  | `'Nueva versión disponible'`             |
| `message`    | `string`  | `'Actualiza para usar los últimos cambios.'` |
| `actionText` | `string`  | `'Actualizar'`                           |

## Eventos

| Evento   | Cuándo                        |
| -------- | ----------------------------- |
| `update` | El usuario pulsa el botón     |

## Conectarlo con vite-plugin-pwa

En el proyecto destino, instala `vite-plugin-pwa`, añade `VitePWA({ registerType: 'prompt' })`
a `vite.config.ts` y crea este composable:

```ts
// src/composables/usePwaUpdate.ts
import { ref } from 'vue'
import { registerSW } from 'virtual:pwa-register'

const needRefresh = ref(false)
let updateSW: ((reload?: boolean) => Promise<void>) | undefined

// Llámalo una sola vez desde main.ts.
export function setupPwaUpdate() {
  updateSW = registerSW({ onNeedRefresh: () => (needRefresh.value = true) })
}

export function usePwaUpdate() {
  return {
    needRefresh,
    applyUpdate: () => {
      needRefresh.value = false
      void updateSW?.(true)
    },
  }
}
```

Y en `app.vue`:

```vue
<PwaUpdateBanner :model-value="needRefresh" @update="applyUpdate" />
```
