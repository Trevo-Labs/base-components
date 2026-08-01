import { fireEvent, render, within } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import KanbanBoard from './kanban-board.vue'

interface Card {
  id: string
  estado: 'todo' | 'done'
  titulo: string
}

const columns = [
  { key: 'todo', label: 'Por hacer' },
  { key: 'done', label: 'Hecho' },
] as const

const items: Card[] = [
  { id: '1', estado: 'todo', titulo: 'Tarea 1' },
  { id: '2', estado: 'todo', titulo: 'Tarea 2' },
  { id: '3', estado: 'done', titulo: 'Tarea 3' },
]

interface KanbanBoardTestProps {
  columns: { key: string; label: string; variant?: 'success' | 'danger'; removable?: boolean }[]
  items: Card[]
  columnKey: (item: Card) => Card['estado']
  itemId: (item: Card) => string
  emptyText?: string
  card?: boolean
  stats?: { label: string; value: string | number; variant?: 'success' | 'danger' }[]
}

function renderBoard(
  props: Partial<KanbanBoardTestProps> = {},
  extraSlots: Record<string, string> = {}
) {
  return render(KanbanBoard as unknown as new () => { $props: KanbanBoardTestProps }, {
    props: {
      columns: [...columns],
      items,
      columnKey: (item: Card) => item.estado,
      itemId: (item: Card) => item.id,
      ...props,
    },
    slots: {
      default: '<template #default="{ item }">{{ item.titulo }}</template>',
      ...extraSlots,
    },
  })
}

describe('KanbanBoard', () => {
  it('agrupa los items por columna y muestra el contador', () => {
    const { getAllByText } = renderBoard()
    expect(getAllByText('Por hacer')[0]).toBeTruthy()
    expect(getAllByText('2')[0]).toBeTruthy() // contador de "Por hacer"
    expect(getAllByText('1')[0]).toBeTruthy() // contador de "Hecho"
  })

  it('renderiza el slot con el item de cada tarjeta', () => {
    const { getByText } = renderBoard()
    expect(getByText('Tarea 1')).toBeTruthy()
    expect(getByText('Tarea 2')).toBeTruthy()
    expect(getByText('Tarea 3')).toBeTruthy()
  })

  it('muestra el texto vacío cuando una columna no tiene items', () => {
    const { getByText } = renderBoard({
      items: [{ id: '1', estado: 'todo', titulo: 'Solo esta' }],
      emptyText: 'Sin tareas',
    })
    expect(getByText('Sin tareas')).toBeTruthy()
  })

  it('emite item-click con el item al pulsar una tarjeta', async () => {
    const { getByText, emitted } = renderBoard()
    await fireEvent.click(getByText('Tarea 1'))
    expect(emitted()['item-click']?.[0]).toEqual([items[0]])
  })

  it('emite move-item con el id arrastrado y la columna destino al soltar', async () => {
    // jsdom no implementa DataTransfer; el componente guarda el id arrastrado
    // en una variable interna (draggingId) que no depende de dataTransfer,
    // así que basta con disparar dragstart/drop sin él.
    const { getByText, container, emitted } = renderBoard()

    const card = getByText('Tarea 1').closest('.kanban-item') as HTMLElement
    await fireEvent.dragStart(card)

    const cols = container.querySelectorAll('.kanban-col-body')
    const doneColumnBody = cols[1] as HTMLElement // "Hecho"
    await fireEvent.drop(doneColumnBody)

    expect(emitted()['move-item']?.[0]).toEqual(['1', 'done'])
  })

  it('no emite move-item si se suelta sin haber arrastrado nada', async () => {
    const { container, emitted } = renderBoard()
    const cols = container.querySelectorAll('.kanban-col-body')

    await fireEvent.drop(cols[1] as HTMLElement)

    expect(emitted()['move-item']).toBeUndefined()
  })

  it('cada columna filtra únicamente sus propios items', () => {
    const { container } = renderBoard()
    const cols = container.querySelectorAll('.kanban-col')
    const todoCol = within(cols[0] as HTMLElement)
    const doneCol = within(cols[1] as HTMLElement)

    expect(todoCol.getByText('Tarea 1')).toBeTruthy()
    expect(todoCol.getByText('Tarea 2')).toBeTruthy()
    expect(() => todoCol.getByText('Tarea 3')).toThrow()

    expect(doneCol.getByText('Tarea 3')).toBeTruthy()
    expect(() => doneCol.getByText('Tarea 1')).toThrow()
  })

  it('aplica la clase de tarjeta a los items cuando card está activo', () => {
    const { container } = renderBoard({ card: true })
    expect(container.querySelectorAll('.kanban-item--card').length).toBe(items.length)
  })

  it('pinta la columna con su variante terminal', () => {
    const { container } = renderBoard({
      columns: [
        { key: 'todo', label: 'Por hacer' },
        { key: 'done', label: 'Hecho', variant: 'success' },
      ],
    })
    const cols = container.querySelectorAll('.kanban-col')
    expect((cols[1] as HTMLElement).classList.contains('kanban-col--success')).toBe(true)
  })

  it('renderiza la barra de métricas cuando se pasan stats', () => {
    const { getByText } = renderBoard({
      stats: [
        { label: 'Total', value: 3 },
        { label: 'Hechas', value: 1, variant: 'success' },
      ],
    })
    expect(getByText('Total')).toBeTruthy()
    expect(getByText('Hechas')).toBeTruthy()
  })

  it('renderiza el slot de acciones por cada item', () => {
    const { getAllByText } = renderBoard(
      {},
      { actions: '<template #actions="{ item }"><button>Cerrar {{ item.id }}</button></template>' }
    )
    expect(getAllByText(/Cerrar/).length).toBe(items.length)
  })

  it('no propaga el click de las acciones al item (no emite item-click)', async () => {
    const { getAllByText, emitted } = renderBoard(
      {},
      { actions: '<template #actions="{ item }"><button>Cerrar {{ item.id }}</button></template>' }
    )
    await fireEvent.click(getAllByText(/Cerrar/)[0] as HTMLElement)
    expect(emitted()['item-click']).toBeUndefined()
  })

  it('solo muestra el botón de ocultar en columnas removable', () => {
    const { container } = renderBoard({
      columns: [
        { key: 'todo', label: 'Por hacer' },
        { key: 'done', label: 'Hecho', variant: 'success', removable: true },
      ],
    })
    const botones = container.querySelectorAll('.kanban-col-hide')
    expect(botones.length).toBe(1)
  })

  it('emite remove-column con la key al pulsar el botón de ocultar', async () => {
    const { container, emitted } = renderBoard({
      columns: [
        { key: 'todo', label: 'Por hacer' },
        { key: 'done', label: 'Hecho', variant: 'success', removable: true },
      ],
    })
    await fireEvent.click(container.querySelector('.kanban-col-hide') as HTMLElement)
    expect(emitted()['remove-column']?.[0]).toEqual(['done'])
  })
})
