import { ref } from 'vue'

export type ConfirmTone = 'danger' | 'primary'

interface ConfirmOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  tone?: ConfirmTone
}

interface ConfirmRequest extends Required<Omit<ConfirmOptions, 'message'>> {
  message: string
  resolve: (value: boolean) => void
}

const current = ref<ConfirmRequest | null>(null)

function ask(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    current.value = {
      title: options.title,
      message: options.message ?? '',
      confirmText: options.confirmText ?? 'Confirmar',
      cancelText: options.cancelText ?? 'Cancelar',
      tone: options.tone ?? 'primary',
      resolve,
    }
  })
}

function resolve(value: boolean) {
  current.value?.resolve(value)
  current.value = null
}

export function useConfirm() {
  return {
    current,
    requestConfirm: ask,
    resolveConfirm: resolve,
  }
}
