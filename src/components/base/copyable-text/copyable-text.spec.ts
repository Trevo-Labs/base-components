import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import CopyableText from './copyable-text.vue'

describe('CopyableText', () => {
  it('renderiza el texto recibido', () => {
    const { getByText } = render(CopyableText, { props: { text: 'ABC-123' } })
    expect(getByText('ABC-123')).toBeTruthy()
  })

  it('copia el texto al portapapeles al pulsar el botón', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const { getByRole } = render(CopyableText, { props: { text: 'ABC-123' } })

    await fireEvent.click(getByRole('button'))

    expect(writeText).toHaveBeenCalledWith('ABC-123')
  })

  it('muestra el feedback de copiado tras copiar', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    const { getByRole } = render(CopyableText, { props: { text: 'ABC-123' } })
    const button = getByRole('button')

    expect(button.classList.contains('copyable-text--copied')).toBe(false)

    await fireEvent.click(button)

    await waitFor(() => {
      expect(button.classList.contains('copyable-text--copied')).toBe(true)
    })
  })
})
