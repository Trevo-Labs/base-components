# Neo

Skill de refactor de código. Mejora el código **sin cambiar lo que hace**: limpia, simplifica, ordena, componentiza, quita duplicación y código muerto, arregla nomenclaturas y optimiza. Frontend y backend.

Vive en `~/.claude/skills/neo`, así que está disponible en todos los proyectos.

## Comandos

`/neo` a secas **no refactoriza**: te imprime esta lista y para.

**Refactor**

| Comando | Qué hace |
|---|---|
| `/neo refactor` | Pasada completa sobre lo que esté sucio en git |
| `/neo refactor <ruta>` | Pasada completa sobre esa carpeta o archivo |
| `/neo refactor-frontend` | Toda la capa cliente, pasando las 9 fases seguidas |
| `/neo refactor-backend` | Solo la capa servidor: Node/Express, Supabase |

`/neo <ruta>` sin la palabra `refactor` también vale: si parece una ruta que
existe, se entiende.

`refactor-frontend` es la pasada exhaustiva: encadena todos los focalizados
sobre `src/` en este orden, y ninguno se salta.

1. código muerto → 2. tipado → 3. complejidad → 4. duplicación → 5. CSS →
6. rendimiento → 7. estructura → 8. nomenclatura → 9. dependencias

El orden no es capricho: primero se tira lo que sobra, luego se simplifica, y
lo que mueve o renombra archivos va al final, con el contenido ya estable. Se
aplica y verifica fase a fase, con un commit propuesto por fase.

**Arranque y documentación**

| Comando | Qué hace |
|---|---|
| `/neo init` | Entrevista el proyecto y genera los docs de base en `docs/` |
| `/neo sync-docs` | Reescanea y actualiza esos docs |

**Diagnóstico**

| Comando | Qué hace |
|---|---|
| `/neo scan-only` | Solo analiza y reporta, no toca nada |

**Focalizados** — una categoría cada uno

| Comando | Qué hace |
|---|---|
| `/neo clean-dead-code` | Código muerto |
| `/neo extract-duplication` | Duplicación → componentes, composables, tokens |
| `/neo fix-naming` | Nomenclatura |
| `/neo fix-structure` | Estructura de carpetas y componentización |
| `/neo fix-css` | CSS: tokens, nesting, clase raíz, layout |
| `/neo fix-types` | Tipado TypeScript |
| `/neo improve-performance` | Rendimiento |
| `/neo prune-dependencies` | Dependencias sin usar, duplicadas o pesadas |

Los modos focalizados dan diffs de una sola intención, mucho más fáciles de revisar que una pasada completa. Para una zona grande, mejor encadenarlos que un `/neo refactor` gigante — que es exactamente lo que hace `refactor-frontend` por ti.

No hace falta clavar el nombre. Si escribes uno antiguo (`dead`, `dupe`, `perf`...) o directamente en español (`limpia`, `duplicados`), Neo te dice qué ha entendido y sigue.

## Cómo trabaja

1. Fija el alcance (lo sucio en git, o lo que le digas).
2. Lee las convenciones: `project/code-style-guide.md` y `project/architecture.md` primero, luego `CLAUDE.md`, luego el código real.
3. Analiza.
4. **Te enseña el plan agrupado por riesgo** 🟢 seguro / 🟡 medio / 🔴 estructural, más lo que ve pero no toca.
5. Espera tu OK. Puedes decir "solo lo verde".
6. Aplica por tipos, renombres al final, actualizando todos los imports.
7. Verifica (typecheck, tests, build) y reporta.
8. Propone el commit. **No commitea.**

## Qué no hace

- **Diseño visual y UX** → `impeccable`.
- **Cazar bugs** → `/code-review`. Si se cruza uno lo reporta y sigue.
- **Features nuevas** → las propone, no las hace.
- **Meter dependencias** → nunca sin preguntar.
- **Migraciones de patrón** (Options API → Composition, CSS → Tailwind) → se planifican aparte.

## Documentos de este proyecto

En `docs/project/`, que es donde Neo lee y escribe:

| Archivo | Para qué |
|---|---|
| `code-style-guide.md` | Convenciones de código. Neo las aplica. |
| `architecture.md` | Dónde va cada cosa. Responde "tengo que añadir X, ¿dónde?" |
| `infrastructure.md` | Dependencias, servicios externos, entorno, despliegue. |
| `decisions.md` | Decisiones técnicas y por qué. Solo se añade, no se reescribe. |
| `refactors/<fecha>-<capa>.md` | Qué hizo cada pasada grande. |

Si cambias las convenciones, edita `code-style-guide.md`: manda sobre los valores por defecto de la skill.

## Pendientes

Solo hay una lista: `docs/TODO.md`, y es tuya.

Lo que Neo puede arreglar, lo arregla — no lo apunta. En el TODO solo escribe lo
que te necesita: una clave, un acceso, una decisión, un cambio de comportamiento
que hay que aprobar, un bug que es de `/code-review`, o lo que dejaste fuera tú
al aprobar el plan. Cada entrada dice qué espera de ti, no solo qué vio.

Lo que resuelvas se borra, no se tacha. Y no hay listas paralelas: dos TODO
significan que uno está desactualizado y nadie sabe cuál.
