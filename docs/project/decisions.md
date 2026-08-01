# Decisiones

Por qué las cosas son como son. Solo se **añade**; no se reescribe ni se borra.

Formato: fecha, qué se decidió, qué alternativas había, por qué esta.

---

## 2026-08-01 · Plantilla que se copia, no librería npm

**Decidido:** BaseComponents es un repo que se copia al empezar un proyecto. No se publica
en npm, no se instala como paquete, no hay versionado entre proyectos.

**Alternativas:** paquete npm privado, o monorepo con workspaces.

**Por qué:** Jordi trabaja solo. Un paquete compartido obliga a mantener retrocompatibilidad
entre proyectos que no la necesitan, y cada cambio en un componente se convierte en una
release y N actualizaciones. Copiando, cada proyecto evoluciona libre y el coste es que las
mejoras no vuelven solas — asumido a propósito.

---

## 2026-08-01 · Origen: los base del CRM, sin reinventar

**Decidido:** el punto de partida es `GestiTec/CRM/frontend/src/components/base` tal cual,
respetando estructura, nombres y estilos.

**Alternativas:** rehacer los componentes desde cero con las lecciones aprendidas.

**Por qué:** son componentes ya rodados en producción, con tests. Rehacerlos habría costado
semanas para acabar en algo parecido pero sin probar. El detalle de la migración está en
[../goals/goal-migracion-crm-implementacion.md](../goals/goal-migracion-crm-implementacion.md).

---

## 2026-08-01 · Histoire en vez de Storybook

**Decidido:** el catálogo de componentes es Histoire.

**Alternativas:** Storybook, o una app de playground casera.

**Por qué:** Storybook es pesado y su integración con Vue+Vite arrastra config. Histoire es
nativo de Vite, las stories son `.vue` normales y el `Playground` con controles sale casi
gratis. Contrapartida: está en beta y con poco mantenimiento — riesgo asumido y anotado en
`TODO.md`.

---

## 2026-08-01 · Vite 7, no Vite 8

**Decidido:** fijar Vite `^7.3.6` aunque el CRM ya vaya por Vite 8.

**Alternativas:** Vite 8 forzando la instalación con `--legacy-peer-deps`.

**Por qué:** Histoire `1.0.0-beta.1` declara `vite: ^7.3.0` como peer. Forzarlo instala pero
puede petar en runtime, y depurar eso no aporta nada. Como los repos son independientes, no
hay ninguna razón para que las versiones coincidan.

---

## 2026-08-01 · `PwaUpdateBanner` presentacional

**Decidido:** el banner recibe `model-value` y emite `update`. No sabe nada del service worker.

**Alternativas:** traerlo del CRM tal cual, con `vite-plugin-pwa` y el composable
`usePwaUpdate` que importa `virtual:pwa-register`.

**Por qué:** ese import solo resuelve si el plugin está en `vite.config.ts`. Meterlo obligaría
a todos los proyectos que copien la base a arrastrar PWA, la usen o no. Presentacional, el
componente sirve igual y reconectarlo son cuatro líneas documentadas en su `.md`.

---

## 2026-08-01 · `entity-notes` fuera

**Decidido:** no migrar `entity-notes`.

**Alternativas:** reescribirlo presentacional (props + emits).

**Por qué:** era dominio CRM disfrazado de componente base — llamaba a `/notas` y
`/files/upload`, comprobaba permisos contra el store de auth y usaba el tipo `Nota`.
Reescribirlo habría sido escribir un componente nuevo, y el encargo era migrar, no inventar.

---

## 2026-08-01 · Los tests viven junto al componente

**Decidido:** `base-button/base-button.spec.ts`, no un `__tests__/` ni la raíz de `base/`.

**Alternativas:** dejarlos como en el CRM (sueltos en `base/`, en PascalCase).

**Por qué:** en el CRM rompían el criterio kebab-case del resto y obligaban a saltar de
carpeta para leer el test de un componente. Al lado, la carpeta del componente es
autocontenida: `.vue` + `.css` + `.spec.ts` + `.story.vue`.

---

## 2026-08-01 · Convenciones globales por encima de la herencia del CRM

**Decidido:** en los choques entre las reglas globales de Jordi y lo que hacía el CRM, mandan
las globales. En concreto: composables en kebab-case (`use-notify.ts`) y CSS anidado **sin
prefijos repetidos** (`.base-box > .header`, no `.box-header`).

**Alternativas:** mantener la paridad con el CRM para que copiar cambios entre repos siguiera
siendo trivial.

**Por qué:** esta es la plantilla de la que nacen los proyectos siguientes; si arranca ya
desviada de la norma, propaga la desviación a todos. La paridad con el CRM se pierde, pero el
CRM es un proyecto cerrado y esto es la base del futuro.

Los composables ya están renombrados. El CSS **todavía no**: la norma está escrita en
`code-style-guide.md` y el código aún prefija. Se propaga con `/neo fix-css`.
