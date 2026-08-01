import { ref } from 'vue'

export type NotifyType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: number
  type: NotifyType
  message: string
  /** Título opcional; si se omite se usa uno por defecto según el tipo. */
  title?: string
}

// Estado global compartido (fuera de la función → singleton entre componentes).
const notifications = ref<Notification[]>([])
let nextId = 0

const DEFAULT_DURATION = 4000

function dismiss(id: number) {
  const i = notifications.value.findIndex((n) => n.id === id)
  if (i !== -1) notifications.value.splice(i, 1)
}

function push(type: NotifyType, message: string, opts: { title?: string; duration?: number } = {}) {
  const id = nextId++
  notifications.value.push({ id, type, message, title: opts.title })

  const duration = opts.duration ?? DEFAULT_DURATION
  if (duration > 0) {
    window.setTimeout(() => dismiss(id), duration)
  }
  return id
}

export function useNotify() {
  return {
    notifications,
    dismiss,
    notify: push,
    success: (message: string, opts?: { title?: string; duration?: number }) =>
      push('success', message, opts),
    error: (message: string, opts?: { title?: string; duration?: number }) =>
      push('error', message, opts),
    info: (message: string, opts?: { title?: string; duration?: number }) =>
      push('info', message, opts),
    warning: (message: string, opts?: { title?: string; duration?: number }) =>
      push('warning', message, opts),
  }
}
