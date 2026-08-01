import { nextTick, onBeforeUnmount, onMounted, ref, type ShallowRef } from 'vue'

/** Ref a un elemento del template, tal y como lo devuelve `useTemplateRef`. */
type ElementRef = Readonly<ShallowRef<HTMLElement | null>>

export interface FloatingPanelOptions {
  /** El elemento que ancla el panel (el botón o el control visible). */
  triggerEl: ElementRef
  /** El panel teleportado. */
  panelEl: ElementRef
  /**
   * Calcula el estilo del panel a partir del rectángulo del trigger y del panel
   * ya renderizado. Es lo único que cambia de verdad entre un select, un
   * date-picker y un dropdown, así que lo pone cada componente.
   */
  position: (triggerRect: DOMRect, panelEl: HTMLElement) => Record<string, string>
  /**
   * Qué hacer cuando la página hace scroll con el panel abierto:
   * `'reposition'` lo recoloca (select, date-picker), `'close'` lo cierra (dropdown).
   */
  onScroll?: 'reposition' | 'close'
  /**
   * Escuchar el click de fuera en fase de captura. Necesario cuando el trigger
   * o el panel frenan la propagación del click.
   */
  outsideClickCapture?: boolean
}

/**
 * Panel flotante teleportado a `<body>` con `position: fixed`: apertura, cierre,
 * recolocación y limpieza de listeners.
 *
 * Lo comparten BaseSelect, BaseDatePicker y BaseDropdown. Vive aquí sobre todo
 * por el cleanup: tres copias de los mismos `removeEventListener` es donde se
 * cuelan las fugas cuando se toca uno y no los otros.
 */
export function useFloatingPanel(options: FloatingPanelOptions) {
  const open = ref(false)
  const panelStyle = ref<Record<string, string>>({})

  /** Recalcula la posición del panel. No hace nada si aún no está en el DOM. */
  function reposition() {
    const trigger = options.triggerEl.value
    const panel = options.panelEl.value
    if (!trigger || !panel) return
    panelStyle.value = options.position(trigger.getBoundingClientRect(), panel)
  }

  function close() {
    if (!open.value) return
    open.value = false
    window.removeEventListener('scroll', onScroll, true)
    window.removeEventListener('resize', close)
  }

  function onScroll() {
    if (options.onScroll === 'close') close()
    else reposition()
  }

  async function openPanel() {
    if (open.value) return
    open.value = true
    await nextTick()
    reposition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', close)
  }

  async function toggle() {
    if (open.value) close()
    else await openPanel()
  }

  function onOutsideClick(e: MouseEvent) {
    if (!open.value) return
    const target = e.target as Node
    // El panel está teleportado fuera del trigger: cuenta como "dentro".
    if (options.triggerEl.value?.contains(target) || options.panelEl.value?.contains(target)) return
    close()
  }

  const capture = !!options.outsideClickCapture

  onMounted(() => document.addEventListener('click', onOutsideClick, capture))
  onBeforeUnmount(() => {
    document.removeEventListener('click', onOutsideClick, capture)
    close()
  })

  return { open, panelStyle, openPanel, close, toggle, reposition }
}
