# Documentación

## Por dónde empezar

¿Vas a **tocar código** de este repo? → [project/code-style-guide.md](project/code-style-guide.md)
y [project/architecture.md](project/architecture.md), en ese orden.

¿Vas a **arrancar un proyecto nuevo** con esta base? → [guides/uso-en-proyecto-nuevo.md](guides/uso-en-proyecto-nuevo.md).

## Índice

| Documento                                                                          | Para qué                                                                 |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [TODO.md](TODO.md)                                                                 | El único TODO, y es de Jordi: decisiones, accesos y cambios que aprobar. |
| **project/**                                                                       |                                                                          |
| [architecture.md](project/architecture.md)                                         | El mapa. Responde "tengo que añadir X, ¿dónde lo pongo?".                |
| [code-style-guide.md](project/code-style-guide.md)                                 | Convenciones de código y CSS. Mandan sobre cualquier default.            |
| [infrastructure.md](project/infrastructure.md)                                     | Stack con versiones, scripts, entorno, repositorio.                      |
| [decisions.md](project/decisions.md)                                               | Por qué las cosas son como son. Solo se añade.                           |
| [refactors/2026-08-01-frontend.md](project/refactors/2026-08-01-frontend.md)       | Qué hizo la pasada de refactor del frontend.                             |
| [refactors/2026-08-01-css.md](project/refactors/2026-08-01-css.md)                 | Qué hizo la pasada de CSS: renombrado de clases de los 25 componentes.   |
| **design/**                                                                        |                                                                          |
| [design-system.md](design/design-system.md)                                        | Tokens: color, espaciado, tipografía, sombras, z-index.                  |
| **guides/**                                                                        |                                                                          |
| [uso-en-proyecto-nuevo.md](guides/uso-en-proyecto-nuevo.md)                        | Cómo arrancar un proyecto desde esta base.                               |
| [histoire-guide.md](guides/histoire-guide.md)                                      | Cómo escribir y ejecutar las stories.                                    |
| [neo-guide.md](guides/neo-guide.md)                                                | La skill de refactor: comandos y cómo trabaja.                           |
| **goals/**                                                                         |                                                                          |
| [goal-migracion-crm-implementacion.md](goals/goal-migracion-crm-implementacion.md) | La migración desde el CRM: qué se trajo, qué se dejó y por qué.          |

## Reglas de esta carpeta

- Todos los `.md` viven aquí, **nunca en la raíz**. Única excepción: el `README.md` del repo.
- **Kebab-case** siempre, salvo `README.md` y `TODO.md`.
- Se agrupa **por área, no por herramienta**: la carpeta dice de qué habla el documento, no
  quién lo escribió. Por eso `neo-guide.md` está en `guides/` y no en una carpeta `neo/`.
- **Un solo TODO**: `TODO.md`. Nada de listas paralelas.
