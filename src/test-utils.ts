/**
 * Utilidades para los tests. No forma parte del bundle de la app: solo lo
 * importan los `.spec.ts`.
 */

/**
 * Primer argumento del primer evento `name` emitido, ya tipado.
 *
 * `emitted()` de Testing Library devuelve `Record<string, unknown[]>`, así que
 * cada evento es `unknown` y no se puede indexar sin castear. Centralizamos aquí
 * ese cast en vez de repartirlo por cada aserción.
 */
export function firstPayload<T>(emitted: Record<string, unknown[]>, name: string): T {
  const events = emitted[name]
  if (!events?.length) throw new Error(`No se emitió ningún evento "${name}"`)
  return (events[0] as T[])[0]
}
