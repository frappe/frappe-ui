/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createImageViewerKeydown } from './imageViewerKeymap'

function setup() {
  const actions = {
    isOpen: () => true,
    isPanning: () => false,
    onActivity: vi.fn(),
    next: vi.fn(),
    previous: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    toggleFullscreen: vi.fn(),
    close: vi.fn(),
  }
  const press = createImageViewerKeydown(actions)
  return {
    actions,
    press: (key: string) => press(new KeyboardEvent('keydown', { key })),
  }
}

afterEach(() => {
  document.documentElement.dir = ''
})

describe('image viewer arrow keys', () => {
  it('ArrowRight shows the next image on an LTR page', () => {
    const { actions, press } = setup()
    press('ArrowRight')
    expect(actions.next).toHaveBeenCalledTimes(1)
    expect(actions.previous).not.toHaveBeenCalled()
    press('ArrowLeft')
    expect(actions.previous).toHaveBeenCalledTimes(1)
  })

  it('ArrowLeft shows the next image on an RTL page', () => {
    document.documentElement.dir = 'rtl'
    const { actions, press } = setup()
    press('ArrowLeft')
    expect(actions.next).toHaveBeenCalledTimes(1)
    expect(actions.previous).not.toHaveBeenCalled()
    press('ArrowRight')
    expect(actions.previous).toHaveBeenCalledTimes(1)
  })
})
