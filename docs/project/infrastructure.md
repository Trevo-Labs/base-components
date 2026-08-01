# Infraestructura

Documento de consulta. Este repo es una **plantilla**: no se despliega, no tiene backend
y no consume ningún servicio externo.

## Stack

| Pieza                   | Versión         | Por qué                                                                 |
| ----------------------- | --------------- | ----------------------------------------------------------------------- |
| Vue                     | `^3.5.32`       | Composition API con `<script setup>`.                                    |
| TypeScript              | `~6.0.2`        | —                                                                        |
| Vite                    | `^7.3.6`        | **No 8**: Histoire pide Vite `^7.3.0` como peer. Ver `decisions.md`.     |
| vue-router              | `^5.0.6`        | Lo necesitan `CellLink`, `BasePageHeader` y `BaseTabs`.                  |
| lucide-vue-next         | `^1.0.0`        | Iconos. **Deprecado** a favor de `@lucide/vue` — está en `TODO.md`.      |
| Histoire                | `1.0.0-beta.1`  | Catálogo de componentes. Alternativa a Storybook.                        |
| Vitest + Testing Library| `^4.1.9` / `^8.1.0` | Tests de componente por rol y texto, no por implementación.         |
| Prettier                | `^3.8.3`        | Sin punto y coma, comillas simples, 100 columnas.                        |
| Fuentes                 | Inter · JetBrains Mono | Vía `@fontsource-variable/*`, servidas desde el propio bundle.    |

No hay Pinia, ni cliente HTTP, ni librería de fechas. Es deliberado: cada proyecto elige
las suyas.

`flexsearch`, `vscode-oniguruma` y `vscode-textmate` están como devDeps porque Histoire
las pre-bundlea (buscador y resaltado de código). No se importan desde el código.

## Scripts

| Script                | Qué hace                                                    |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | App de ejemplo en `localhost:5173`.                          |
| `npm run build`       | `vue-tsc -b` (type-check) + `vite build`. **La verificación real.** |
| `npm run preview`     | Sirve el build.                                              |
| `npm run lint`        | `vue-tsc --noEmit`. Ojo: con `files: []` en el tsconfig raíz apenas comprueba nada — usa `npm run build`. |
| `npm run format`      | Prettier sobre `src/`.                                       |
| `npm run format:check`| Prettier en modo comprobación.                               |
| `npm test`            | Vitest, una pasada. **190 tests, 25 archivos.**              |
| `npm run test:watch`  | Vitest en watch.                                             |
| `npm run test:coverage`| Cobertura con v8.                                           |
| `npm run story:dev`   | Histoire en `localhost:6006`. **El catálogo.**               |
| `npm run story:build` | Build estático del catálogo en `.histoire/dist`.             |
| `npm run story:preview`| Sirve ese build.                                            |

## Entorno

- **Node 22.13.1** en la máquina de Jordi. Algún paquete de `@babel/*` pide `^22.18.0` y
  avisa al instalar (`EBADENGINE`); es solo un warning, nada rompe.
- **npm** como gestor. Hay `package-lock.json` versionado.
- **Sin variables de entorno.** No hay `.env` ni `.env.example`, y no hacen falta:
  no se habla con ningún servicio.

## Servicios externos

Ninguno en runtime. Dos matices:

- Los **iconos del árbol de Histoire** (`icon="carbon:…"`) se cargan desde Iconify por
  internet. Sin conexión el catálogo funciona igual, solo que sin esos iconos.
- Las **fuentes van en el bundle** (`@fontsource-variable`), no desde Google Fonts.

## Repositorio y despliegue

- Git inicializado el **1/8/2026**, rama `main`.
- **Va a un remoto** (GitLab o GitHub) para tenerlo versionado y accesible desde
  cualquier máquina. Está pendiente de crear: ver `TODO.md`.
- **Sin CI/CD y sin despliegue.** No hay nada que publicar: el repo se consume copiándolo.
  Si algún día se quisiera el catálogo online, sería subir `.histoire/dist` a Hostinger
  como sitio estático.

> **Pendiente de confirmar:** si el remoto va a GitLab (como el CRM) o a GitHub.
