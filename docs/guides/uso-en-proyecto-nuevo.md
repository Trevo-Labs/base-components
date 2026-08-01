# Arrancar un proyecto desde esta base

Dos formas, según lo que necesites.

## A) Copiar el repo entero

Para un proyecto nuevo desde cero:

1. Copia la carpeta completa y borra `.git` si lo hubiera.
2. Cambia `name` en `package.json` y el `<title>` de `index.html`.
3. Borra `src/views/home-view/` y ajusta `src/router/index.ts` con tus rutas.
4. Ajusta los tokens de `src/assets/css/variables.css` al color de marca del proyecto.
5. `npm install` y a trabajar.

Te llevas gratis: Histoire configurado, tests, Prettier, tsconfigs y el CSS base.

## B) Copiar solo los componentes

Para meterlos en un proyecto que ya existe, copia estas tres carpetas:

```
src/components/base/
src/composables/
src/assets/css/
```

Luego:

1. Importa el CSS en tu `main.ts`:
   ```ts
   import './assets/css/main.css'
   ```
2. Asegúrate de tener el alias `@` apuntando a `src/` (lo usan `base-notify` y
   `base-confirm-modal` para llegar a los composables). En `vite.config.ts`:
   ```ts
   resolve: {
     alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
   }
   ```
   Y el `paths` equivalente en `tsconfig.app.json`.
3. Instala las dependencias:
   ```bash
   npm i vue-router lucide-vue-next @fontsource-variable/inter @fontsource-variable/jetbrains-mono
   ```
   Las dos fuentes solo si quieres la tipografía; si no, quita esas dos líneas de `main.css`
   y cambia `--font-sans` / `--font-mono`.
4. Monta los dos singletons en tu componente raíz:
   ```vue
   <BaseConfirmModal />
   <BaseNotify />
   ```

## Qué NO se lleva

- No hay layout (sidebar, header). Cada proyecto se monta el suyo.
- No hay cliente HTTP, ni store, ni auth.
- No hay PWA: `PwaUpdateBanner` es presentacional y se conecta desde el proyecto
  (ver `src/components/base/pwa-update-banner/pwa-update-banner.md`).

## Lo primero que querrás tocar

`src/assets/css/variables.css`. Con cambiar `--color-primary` y sus derivados el proyecto ya
tiene otra cara. Los radios (`--radius-*`) están casi a cero a propósito; súbelos si el proyecto
pide un aire más blando.
