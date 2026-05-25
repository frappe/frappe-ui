// @vitest-environment jsdom
/**
 * Unit tests for src/composables/useShortcut.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, nextTick } from 'vue'
import {
  getActiveShortcuts,
  matchesShortcut,
  useShortcut,
  type ShortcutConfig,
} from './useShortcut'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mount a component that registers shortcuts and return unmount() function. */
function mountWithShortcut(config: ShortcutConfig | ShortcutConfig[]) {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp(
    defineComponent({
      setup() {
        useShortcut(config)
      },
      template: '<div/>',
    }),
  )
  app.mount(el)
  return {
    unmount() {
      app.unmount()
      el.remove()
    },
  }
}

/** Dispatch a keydown event on document with a given target. */
function fireKey(
  key: string,
  mods: Partial<KeyboardEventInit> = {},
  target: EventTarget = document,
) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...mods,
  })
  Object.defineProperty(event, 'target', { value: target, writable: false })
  document.dispatchEvent(event)
  return event
}

function fireKeyUp(key: string, mods: Partial<KeyboardEventInit> = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keyup', { key, bubbles: true, ...mods }),
  )
}

// ---------------------------------------------------------------------------
// matchesShortcut — direct unit tests
// ---------------------------------------------------------------------------

describe('matchesShortcut', () => {
  const makeEvent = (key: string, mods: Partial<KeyboardEventInit> = {}) =>
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...mods,
    })

  it('matches plain key', () => {
    expect(matchesShortcut(makeEvent('s'), { key: 's', description: '' })).toBe(
      true,
    )
  })

  it('does not match different key', () => {
    expect(matchesShortcut(makeEvent('a'), { key: 's', description: '' })).toBe(
      false,
    )
  })

  it('requires ctrlKey or metaKey when ctrl: true', () => {
    const config: ShortcutConfig = { key: 's', ctrl: true, description: '' }
    expect(matchesShortcut(makeEvent('s'), config)).toBe(false)
    expect(matchesShortcut(makeEvent('s', { ctrlKey: true }), config)).toBe(
      true,
    )
    expect(matchesShortcut(makeEvent('s', { metaKey: true }), config)).toBe(
      true,
    )
  })

  it('rejects extra ctrl when ctrl not required', () => {
    const config: ShortcutConfig = { key: 's', description: '' }
    expect(matchesShortcut(makeEvent('s', { ctrlKey: true }), config)).toBe(
      false,
    )
  })

  it('requires shiftKey when shift: true', () => {
    const config: ShortcutConfig = { key: 's', shift: true, description: '' }
    expect(matchesShortcut(makeEvent('s'), config)).toBe(false)
    expect(matchesShortcut(makeEvent('s', { shiftKey: true }), config)).toBe(
      true,
    )
  })

  it('requires altKey when alt: true', () => {
    const config: ShortcutConfig = { key: 'n', alt: true, description: '' }
    expect(matchesShortcut(makeEvent('n'), config)).toBe(false)
    expect(matchesShortcut(makeEvent('n', { altKey: true }), config)).toBe(true)
  })

  it('rejects extra alt when alt not required', () => {
    const config: ShortcutConfig = { key: 'n', description: '' }
    expect(matchesShortcut(makeEvent('n', { altKey: true }), config)).toBe(
      false,
    )
  })

  it('allows shift-produced keys (?) without shift: true in config', () => {
    // "?" is produced by Shift+/ — shift flag is not needed in config
    const config: ShortcutConfig = { key: '?', description: '' }
    expect(matchesShortcut(makeEvent('?', { shiftKey: true }), config)).toBe(
      true,
    )
  })

  it('is case-insensitive for the key value', () => {
    expect(
      matchesShortcut(makeEvent('escape'), { key: 'Escape', description: '' }),
    ).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Global handler — basic matching via document events
// ---------------------------------------------------------------------------

describe('useShortcut — global handler', () => {
  it('fires handler on matching key', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 's',
      description: 'Save',
      handler,
    })
    await nextTick()

    fireKey('s')
    expect(handler).toHaveBeenCalledOnce()
    unmount()
  })

  it('does not fire on non-matching key', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 's',
      description: 'Save',
      handler,
    })
    await nextTick()

    fireKey('a')
    expect(handler).not.toHaveBeenCalled()
    unmount()
  })
})

// ---------------------------------------------------------------------------
// condition
// ---------------------------------------------------------------------------

describe('useShortcut — condition', () => {
  it('does not fire when condition returns false', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'd',
      description: 'Delete',
      condition: () => false,
      handler,
    })
    await nextTick()

    fireKey('d')
    expect(handler).not.toHaveBeenCalled()
    unmount()
  })

  it('fires when condition returns true', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'd',
      description: 'Delete',
      condition: () => true,
      handler,
    })
    await nextTick()

    fireKey('d')
    expect(handler).toHaveBeenCalledOnce()
    unmount()
  })
})

// ---------------------------------------------------------------------------
// allowInInput
// ---------------------------------------------------------------------------

describe('useShortcut — allowInInput', () => {
  it('does not fire inside an <input> by default', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'r',
      description: 'Reload',
      handler,
    })
    await nextTick()

    const input = document.createElement('input')
    document.body.appendChild(input)
    fireKey('r', {}, input)

    expect(handler).not.toHaveBeenCalled()
    input.remove()
    unmount()
  })

  it('fires inside an <input> when allowInInput: true', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'r',
      description: 'Reload',
      allowInInput: true,
      handler,
    })
    await nextTick()

    const input = document.createElement('input')
    document.body.appendChild(input)
    fireKey('r', {}, input)

    expect(handler).toHaveBeenCalledOnce()
    input.remove()
    unmount()
  })
})

// ---------------------------------------------------------------------------
// isInsideDialog guard
// ---------------------------------------------------------------------------

describe('useShortcut — allowInDialog', () => {
  let dialog: HTMLElement
  let button: HTMLElement

  beforeEach(() => {
    dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    button = document.createElement('button')
    dialog.appendChild(button)
    document.body.appendChild(dialog)
  })

  afterEach(() => {
    dialog.remove()
  })

  it('does not fire when event target is inside [role=dialog] (default)', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'k',
      description: 'Action',
      handler,
    })
    await nextTick()

    fireKey('k', {}, button)
    expect(handler).not.toHaveBeenCalled()

    unmount()
  })

  it('fires inside dialog when allowInDialog is true', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'k',
      description: 'Action (dialog-aware)',
      allowInDialog: true,
      handler,
    })
    await nextTick()

    fireKey('k', {}, button)
    expect(handler).toHaveBeenCalledOnce()

    unmount()
  })

  it('fires normally when focus is outside any dialog', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'k',
      description: 'Action',
      handler,
    })
    await nextTick()

    fireKey('k')
    expect(handler).toHaveBeenCalledOnce()
    unmount()
  })
})

// ---------------------------------------------------------------------------
// hold lifecycle
// ---------------------------------------------------------------------------

describe('useShortcut — hold lifecycle', () => {
  it('calls onHold on first press and onRelease on keyup', async () => {
    const onHold = vi.fn()
    const onRelease = vi.fn()
    const { unmount } = mountWithShortcut({
      key: ' ',
      description: 'Pan mode',
      triggeredOn: 'hold',
      onHold,
      onRelease,
    })
    await nextTick()

    fireKey(' ')
    expect(onHold).toHaveBeenCalledOnce()
    expect(onRelease).not.toHaveBeenCalled()

    fireKeyUp(' ')
    expect(onRelease).toHaveBeenCalledOnce()
    unmount()
  })

  it('does not call onHold again while key is still held (repeated keydown)', async () => {
    const onHold = vi.fn()
    const { unmount } = mountWithShortcut({
      key: ' ',
      description: 'Pan mode',
      triggeredOn: 'hold',
      onHold,
    })
    await nextTick()

    fireKey(' ')
    fireKey(' ')
    fireKey(' ')
    expect(onHold).toHaveBeenCalledOnce()
    unmount()
  })
})

// ---------------------------------------------------------------------------
// Cleanup on unmount
// ---------------------------------------------------------------------------

describe('useShortcut — unmount cleanup', () => {
  it('removes handler after component unmounts', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      key: 'q',
      description: 'Quit',
      handler,
    })
    await nextTick()

    fireKey('q')
    expect(handler).toHaveBeenCalledOnce()

    unmount()
    handler.mockClear()

    fireKey('q')
    expect(handler).not.toHaveBeenCalled()
  })

  it('removes shortcut from getActiveShortcuts after unmount', async () => {
    const active = getActiveShortcuts()
    const before = active.value.length

    const { unmount } = mountWithShortcut({
      key: 'q',
      description: 'Quit unique 9283',
      handler: vi.fn(),
    })
    await nextTick()
    expect(active.value.length).toBe(before + 1)

    unmount()
    await nextTick()
    expect(active.value.length).toBe(before)
  })
})

// ---------------------------------------------------------------------------
// getActiveShortcuts — merging
// ---------------------------------------------------------------------------

describe('getActiveShortcuts — merging', () => {
  it('merges shortcuts with same identity into one entry with multiple keys', async () => {
    const active = getActiveShortcuts()

    const w1 = mountWithShortcut({
      key: 'ArrowUp',
      ctrl: true,
      description: 'Move up',
      group: 'Canvas',
      handler: vi.fn(),
    })
    const w2 = mountWithShortcut({
      key: 'k',
      ctrl: true,
      description: 'Move up',
      group: 'Canvas',
      handler: vi.fn(),
    })
    await nextTick()

    const merged = active.value.find((s) => s.description === 'Move up')
    expect(merged).toBeDefined()
    expect(merged!.keys).toHaveLength(2)
    expect(merged!.keys).toContain('ArrowUp')
    expect(merged!.keys).toContain('k')

    w1.unmount()
    w2.unmount()
  })

  it('keeps separate entries for shortcuts that differ in modifiers', async () => {
    const active = getActiveShortcuts()

    const w1 = mountWithShortcut({
      key: 'z',
      ctrl: true,
      description: 'Undo testXQ',
      group: 'Edit',
      handler: vi.fn(),
    })
    const w2 = mountWithShortcut({
      key: 'z',
      ctrl: true,
      shift: true,
      description: 'Undo testXQ',
      group: 'Edit',
      handler: vi.fn(),
    })
    await nextTick()

    const entries = active.value.filter((s) => s.description === 'Undo testXQ')
    expect(entries).toHaveLength(2)

    w1.unmount()
    w2.unmount()
  })
})
