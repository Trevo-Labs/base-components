<template>
  <div
    ref="root"
    class="select-wrapper"
    :class="[attrsClass, { 'select-wrapper--error': error }]"
    :style="attrsStyle"
  >
    <select
      :id="id"
      ref="nativeSelect"
      :value="modelValue"
      :disabled="disabled || readonly"
      :required="required"
      class="select-native"
      v-bind="nativeAttrs"
      tabindex="-1"
      aria-hidden="true"
      @change="onNativeChange"
    >
      <slot />
    </select>

    <button
      type="button"
      :class="[
        'select-trigger',
        { 'select-trigger--open': open, 'select-trigger--readonly': readonly },
      ]"
      :disabled="disabled"
      :aria-disabled="readonly || disabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span :class="['select-value', { 'select-value--placeholder': !selectedLabel }]">
        {{ selectedLabel || placeholder || '—' }}
      </span>
      <ChevronDown
        v-if="!readonly"
        :size="16"
        :class="['select-chevron', { 'select-chevron--open': open }]"
      />
    </button>

    <Teleport to="body">
      <Transition name="select-pop">
        <ul v-if="open" ref="panel" class="select-panel" role="listbox" :style="panelStyle">
          <li
            v-for="opt in options"
            :key="opt.value"
            :class="[
              'select-option',
              {
                'select-option--selected': opt.value === modelValue,
                'select-option--active': opt.value === activeValue,
              },
            ]"
            role="option"
            :aria-selected="opt.value === modelValue"
            @click="choose(opt.value)"
            @mouseenter="activeValue = opt.value"
          >
            <span class="select-option-label">{{ opt.label }}</span>
            <Check v-if="opt.value === modelValue" :size="15" class="select-option-check" />
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import './base-select.css'
import {
  useId,
  useSlots,
  useAttrs,
  useTemplateRef,
  inject,
  ref,
  computed,
  watch,
  nextTick,
  type VNode,
} from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useFloatingPanel } from '@/composables/use-floating-panel'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
// class/style dimensionan el control visible; el resto va al select nativo.
const attrsClass = computed(() => attrs.class)
const attrsStyle = computed(() => attrs.style)
const nativeAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})

const props = withDefaults(
  defineProps<{
    modelValue?: string
    error?: boolean
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
  }>(),
  {}
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
// Dentro de un BaseField adopta su id para enlazar el <label for> con el select.
const injectedId = inject<string | undefined>('baseFieldId', undefined)
const ownId = useId()
const id = injectedId ?? ownId
const slots = useSlots()

const nativeSelect = ref<HTMLSelectElement | null>(null)
const activeValue = ref<string | undefined>(undefined)
const panel = useTemplateRef<HTMLElement>('panel')

const GAP = 4

const {
  open,
  panelStyle,
  openPanel: openFloating,
  close,
} = useFloatingPanel({
  triggerEl: useTemplateRef<HTMLElement>('root'),
  panelEl: panel,
  // El panel toma el ancho del trigger y se abre hacia arriba si no cabe abajo.
  position: (r, el): Record<string, string> => {
    const h = el.offsetHeight
    const opensUp = r.bottom + h + GAP > window.innerHeight && r.top - h - GAP > 0
    return {
      left: `${r.left}px`,
      width: `${r.width}px`,
      ...(opensUp
        ? { bottom: `${window.innerHeight - r.top + GAP}px` }
        : { top: `${r.bottom + GAP}px` }),
    }
  },
  // Recolocamos al hacer scroll (p.ej. dentro de un modal) en vez de cerrar.
  onScroll: 'reposition',
})

interface Opt {
  value: string
  label: string
}

// Aplana los vnodes del slot (incluye fragmentos de v-for) y extrae los <option>.
function extractOptions(nodes: VNode[] | undefined): Opt[] {
  const out: Opt[] = []
  if (!nodes) return out
  for (const node of nodes) {
    if (Array.isArray(node.children)) {
      out.push(...extractOptions(node.children as VNode[]))
      continue
    }
    if (node.type === 'option') {
      const value = String(node.props?.value ?? '')
      const label = extractText(node.children)
      out.push({ value, label })
    }
  }
  return out
}

function extractText(children: unknown): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractText).join('')
  if (children && typeof children === 'object' && 'children' in children) {
    return extractText((children as { children: unknown }).children)
  }
  return ''
}

const options = computed<Opt[]>(() => extractOptions(slots.default?.()))

const selectedLabel = computed(
  () => options.value.find((o) => o.value === props.modelValue)?.label ?? ''
)

function onNativeChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}

function toggle() {
  if (props.disabled || props.readonly) return
  open.value ? close() : openPanel()
}

/** Abre el panel dejando activa la opción seleccionada (o la primera). */
function openPanel() {
  activeValue.value = props.modelValue ?? options.value[0]?.value
  return openFloating()
}

function choose(value: string) {
  emit('update:modelValue', value)
  close()
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (props.readonly) return
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!open.value) {
      openPanel()
      return
    }
    moveActive(e.key === 'ArrowDown' ? 1 : -1)
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (open.value && activeValue.value !== undefined) {
      choose(activeValue.value)
    } else {
      openPanel()
    }
  } else if (e.key === 'Escape') {
    close()
  }
}

function moveActive(dir: number) {
  const opts = options.value
  if (!opts.length) return
  const idx = opts.findIndex((o) => o.value === activeValue.value)
  const next = (idx + dir + opts.length) % opts.length
  activeValue.value = opts[next].value
  scrollActiveIntoView()
}

function scrollActiveIntoView() {
  nextTick(() => {
    panel.value?.querySelector('.select-option--active')?.scrollIntoView?.({ block: 'nearest' })
  })
}

// Si el valor cambia desde fuera, mantiene el nativo sincronizado.
watch(
  () => props.modelValue,
  (v) => {
    if (nativeSelect.value && nativeSelect.value.value !== v) {
      nativeSelect.value.value = v ?? ''
    }
  }
)
</script>
