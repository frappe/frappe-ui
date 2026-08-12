// @vitest-environment jsdom
/**
 * Unit tests for src/composables/useKeyboardShortcut.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, nextTick, ref } from 'vue'
import {
  _resetKeyboardShortcutWarnings,
  getShortcutGroups,
  matchesCombo,
  useKeyboardShortcut,
  type KeyboardShortcutConfig,
} from './useKeyboardShortcut'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mount a component that registers shortcuts and return unmount(). */
function mountWithShortcut(config: KeyboardShortcutConfig | KeyboardShortcutConfig[]) {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp(
    defineComponent({
      setup() {
        useKeyboardShortcut(config)
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

/** Dispatch a keydown on document with a given target. */
function fireKey(
  init: KeyboardEventInit,
  target: EventTarget = document,
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...init,
  })
  Object.defineProperty(event, 'target', { value: target, writable: false })
  document.dispatchEvent(event)
  return event
}

function fireKeyUp(init: KeyboardEventInit) {
  document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, ...init }))
}

const makeEvent = (init: KeyboardEventInit) =>
  new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })

// jsdom reports a non-Mac userAgent, so `Mod` resolves to Ctrl here.
const MOD = { ctrlKey: true }

beforeEach(() => {
  _resetKeyboardShortcutWarnings()
})

// ---------------------------------------------------------------------------
// matchesCombo — the grammar
// ---------------------------------------------------------------------------

describe('matchesCombo — letters and named keys read event.key', () => {
  it('matches a bare letter', () => {
    expect(matchesCombo(makeEvent({ key: 's' }), 'S')).toBe(true)
    expect(matchesCombo(makeEvent({ key: 'a' }), 'S')).toBe(false)
  })

  it('matches a named key', () => {
    expect(matchesCombo(makeEvent({ key: 'Escape' }), 'Escape')).toBe(true)
    expect(matchesCombo(makeEvent({ key: 'ArrowUp' }), 'ArrowUp')).toBe(true)
    expect(matchesCombo(makeEvent({ key: ' ' }), 'Space')).toBe(true)
  })

  it('ignores the physical code for letters', () => {
    // AZERTY: the key that types "a" sits on the physical Q key.
    expect(matchesCombo(makeEvent({ key: 'a', code: 'KeyQ' }), 'A')).toBe(true)
    expect(matchesCombo(makeEvent({ key: 'a', code: 'KeyQ' }), 'Q')).toBe(false)
  })
})

describe('matchesCombo — digits and punctuation read event.code', () => {
  it('fires on the shifted character of a digit key', () => {
    expect(
      matchesCombo(
        makeEvent({ key: '!', code: 'Digit1', shiftKey: true, ...MOD }),
        'Mod+Shift+Digit1',
      ),
    ).toBe(true)
    expect(
      matchesCombo(makeEvent({ key: '1', code: 'Digit1', ...MOD }), 'Mod+Digit1'),
    ).toBe(true)
  })

  it('matches punctuation wherever the layout puts the character', () => {
    expect(
      matchesCombo(makeEvent({ key: '-', code: 'Slash', ...MOD }), 'Mod+Slash'),
    ).toBe(true)
    expect(
      matchesCombo(makeEvent({ key: '/', code: 'Slash', ...MOD }), 'Mod+Slash'),
    ).toBe(true)
  })

  it('maps Backtick to the Backquote code', () => {
    expect(matchesCombo(makeEvent({ key: '`', code: 'Backquote' }), 'Backtick')).toBe(
      true,
    )
  })
})

describe('matchesCombo — modifiers', () => {
  it('requires every modifier the combo names', () => {
    expect(matchesCombo(makeEvent({ key: 's' }), 'Mod+S')).toBe(false)
    expect(matchesCombo(makeEvent({ key: 's', ...MOD }), 'Mod+S')).toBe(true)
  })

  it('rejects a modifier the combo does not name', () => {
    expect(matchesCombo(makeEvent({ key: 's', ...MOD }), 'S')).toBe(false)
    expect(
      matchesCombo(makeEvent({ key: 's', shiftKey: true, ...MOD }), 'Mod+S'),
    ).toBe(false)
    expect(matchesCombo(makeEvent({ key: 's', altKey: true }), 'S')).toBe(false)
  })

  it('accepts Mod, Ctrl, Alt and Shift together in fixed order', () => {
    expect(
      matchesCombo(
        makeEvent({ key: 'l', ctrlKey: true, altKey: true, shiftKey: true }),
        'Mod+Alt+Shift+L',
      ),
    ).toBe(true)
  })

  it('is case-insensitive about the written combo', () => {
    expect(matchesCombo(makeEvent({ key: 's', ...MOD }), 'mod+s')).toBe(true)
  })

  it('never matches a v0 config that carries no combo, and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const legacy = { key: 's', ctrl: true } as unknown as { combo: string }
    expect(matchesCombo(makeEvent({ key: 's', ...MOD }), legacy.combo)).toBe(
      false,
    )
    expect(matchesCombo(makeEvent({ key: 's', ...MOD }), legacy.combo)).toBe(
      false,
    )
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('never matches an invalid combo, and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(matchesCombo(makeEvent({ key: '+', ...MOD }), 'Mod++')).toBe(false)
    expect(matchesCombo(makeEvent({ key: '+', ...MOD }), 'Mod++')).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })
})

// ---------------------------------------------------------------------------
// Global handler
// ---------------------------------------------------------------------------

describe('useKeyboardShortcut — global handler', () => {
  it('fires the handler on a matching combo', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Mod+S',
      description: 'Save',
      handler,
    })
    await nextTick()

    fireKey({ key: 's', ...MOD })
    expect(handler).toHaveBeenCalledOnce()
    unmount()
  })

  it('does not fire on a different combo', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Mod+S',
      description: 'Save',
      handler,
    })
    await nextTick()

    fireKey({ key: 'a', ...MOD })
    expect(handler).not.toHaveBeenCalled()
    unmount()
  })

  it('calls preventDefault by default and skips it when asked', async () => {
    const first = mountWithShortcut({
      combo: 'Mod+S',
      description: 'Save',
      handler: vi.fn(),
    })
    await nextTick()
    expect(fireKey({ key: 's', ...MOD }).defaultPrevented).toBe(true)
    first.unmount()

    const second = mountWithShortcut({
      combo: 'Mod+S',
      description: 'Save',
      preventDefault: false,
      handler: vi.fn(),
    })
    await nextTick()
    expect(fireKey({ key: 's', ...MOD }).defaultPrevented).toBe(false)
    second.unmount()
  })
})

// ---------------------------------------------------------------------------
// enabled — inert, and hidden from the dialog
// ---------------------------------------------------------------------------

describe('useKeyboardShortcut — enabled', () => {
  it('does not fire when enabled is false', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Mod+D',
      description: 'Delete',
      enabled: false,
      handler,
    })
    await nextTick()

    fireKey({ key: 'd', ...MOD })
    expect(handler).not.toHaveBeenCalled()
    unmount()
  })

  it('reads a ref and a getter, live', async () => {
    const handler = vi.fn()
    const canEdit = ref(false)
    const { unmount } = mountWithShortcut({
      combo: 'Mod+D',
      description: 'Delete',
      enabled: canEdit,
      handler,
    })
    await nextTick()

    fireKey({ key: 'd', ...MOD })
    expect(handler).not.toHaveBeenCalled()

    canEdit.value = true
    fireKey({ key: 'd', ...MOD })
    expect(handler).toHaveBeenCalledOnce()
    unmount()
  })

  it('hides a disabled shortcut from the dialog groups', async () => {
    const readOnly = ref(true)
    const { unmount } = mountWithShortcut({
      combo: 'Mod+Z',
      description: 'Undo while read-only',
      group: 'Editing',
      enabled: () => !readOnly.value,
      handler: vi.fn(),
    })
    await nextTick()

    const listed = () =>
      getShortcutGroups()
        .flatMap((group) => group.shortcuts)
        .some((s) => s.description === 'Undo while read-only')

    expect(listed()).toBe(false)
    readOnly.value = false
    expect(listed()).toBe(true)
    unmount()
  })
})

// ---------------------------------------------------------------------------
// allowInInput / allowInDialog
// ---------------------------------------------------------------------------

describe('useKeyboardShortcut — allowInInput', () => {
  it('does not fire inside an <input> by default', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'R',
      description: 'Reload',
      handler,
    })
    await nextTick()

    const input = document.createElement('input')
    document.body.appendChild(input)
    fireKey({ key: 'r' }, input)

    expect(handler).not.toHaveBeenCalled()
    input.remove()
    unmount()
  })

  it('fires inside an <input> when allowInInput is true', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'R',
      description: 'Reload',
      allowInInput: true,
      handler,
    })
    await nextTick()

    const input = document.createElement('input')
    document.body.appendChild(input)
    fireKey({ key: 'r' }, input)

    expect(handler).toHaveBeenCalledOnce()
    input.remove()
    unmount()
  })
})

describe('useKeyboardShortcut — allowInDialog', () => {
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

  it('does not fire when the target is inside [role=dialog]', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'K',
      description: 'Action',
      handler,
    })
    await nextTick()

    fireKey({ key: 'k' }, button)
    expect(handler).not.toHaveBeenCalled()
    unmount()
  })

  it('fires inside a dialog when allowInDialog is true', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'K',
      description: 'Action (dialog-aware)',
      allowInDialog: true,
      handler,
    })
    await nextTick()

    fireKey({ key: 'k' }, button)
    expect(handler).toHaveBeenCalledOnce()
    unmount()
  })
})

// ---------------------------------------------------------------------------
// Hold mode
// ---------------------------------------------------------------------------

describe('useKeyboardShortcut — hold mode', () => {
  it('calls onHold on the first press and onRelease on keyup', async () => {
    const onHold = vi.fn()
    const onRelease = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Space',
      description: 'Pan mode',
      onHold,
      onRelease,
    })
    await nextTick()

    fireKey({ key: ' ' })
    expect(onHold).toHaveBeenCalledOnce()
    expect(onRelease).not.toHaveBeenCalled()

    fireKeyUp({ key: ' ' })
    expect(onRelease).toHaveBeenCalledOnce()
    unmount()
  })

  it('does not repeat onHold while the key stays down', async () => {
    const onHold = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Space',
      description: 'Pan mode',
      onHold,
    })
    await nextTick()

    fireKey({ key: ' ' })
    fireKey({ key: ' ' })
    fireKey({ key: ' ' })
    expect(onHold).toHaveBeenCalledOnce()
    unmount()
  })

  it('releases when a modifier the combo needs goes up', async () => {
    const onRelease = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Mod+Shift+L',
      description: 'Highlight blocks',
      onHold: vi.fn(),
      onRelease,
    })
    await nextTick()

    fireKey({ key: 'l', shiftKey: true, ...MOD })
    fireKeyUp({ key: 'Shift', ctrlKey: true })
    expect(onRelease).toHaveBeenCalledOnce()
    unmount()
  })
})

// ---------------------------------------------------------------------------
// Precedence — last registration wins, and warns
// ---------------------------------------------------------------------------

describe('useKeyboardShortcut — precedence', () => {
  it('fires the last registration on a shared combo', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const first = vi.fn()
    const second = vi.fn()
    const a = mountWithShortcut({
      combo: 'Mod+Shift+D',
      description: 'Toggle canvas dark mode',
      handler: first,
    })
    const b = mountWithShortcut({
      combo: 'Mod+Shift+D',
      description: 'Delete page',
      handler: second,
    })
    await nextTick()

    fireKey({ key: 'd', shiftKey: true, ...MOD })
    expect(second).toHaveBeenCalledOnce()
    expect(first).not.toHaveBeenCalled()

    b.unmount()
    a.unmount()
    warn.mockRestore()
  })

  it('keeps both alive when their guards are mutually exclusive', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const inEditMode = ref(true)
    const moveElement = vi.fn()
    const changeSlide = vi.fn()

    const a = mountWithShortcut({
      combo: 'ArrowUp',
      description: 'Move element',
      enabled: inEditMode,
      handler: moveElement,
    })
    const b = mountWithShortcut({
      combo: 'ArrowUp',
      description: 'Change slide',
      enabled: () => !inEditMode.value,
      handler: changeSlide,
    })
    await nextTick()

    fireKey({ key: 'ArrowUp' })
    expect(moveElement).toHaveBeenCalledOnce()
    expect(changeSlide).not.toHaveBeenCalled()

    inEditMode.value = false
    fireKey({ key: 'ArrowUp' })
    expect(moveElement).toHaveBeenCalledOnce()
    expect(changeSlide).toHaveBeenCalledOnce()

    // Mutually exclusive guards are not a collision.
    expect(warn).not.toHaveBeenCalled()

    b.unmount()
    a.unmount()
    warn.mockRestore()
  })

  it('warns once on a real collision, naming the shadowed and the active shortcut', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const a = mountWithShortcut({
      combo: 'Mod+Shift+P',
      description: 'Toggle canvas dark mode',
      handler: vi.fn(),
    })
    const b = mountWithShortcut({
      combo: 'Mod+Shift+P',
      description: 'Delete page',
      handler: vi.fn(),
    })
    await nextTick()

    // Nothing is warned until a keypress finds both of them live.
    expect(warn).not.toHaveBeenCalled()

    fireKey({ key: 'p', shiftKey: true, ...MOD })
    fireKey({ key: 'p', shiftKey: true, ...MOD })

    expect(warn).toHaveBeenCalledTimes(1)
    const message = warn.mock.calls[0][0] as string
    expect(message).toContain('Duplicate shortcut Mod+Shift+P')
    expect(message).toContain(
      '"Toggle canvas dark mode" (registered first, now shadowed)',
    )
    expect(message).toContain('"Delete page" (active)')

    b.unmount()
    a.unmount()
    warn.mockRestore()
  })
})

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

describe('useKeyboardShortcut — unmount cleanup', () => {
  it('removes the handler after the component unmounts', async () => {
    const handler = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Q',
      description: 'Quit',
      handler,
    })
    await nextTick()

    fireKey({ key: 'q' })
    expect(handler).toHaveBeenCalledOnce()

    unmount()
    handler.mockClear()

    fireKey({ key: 'q' })
    expect(handler).not.toHaveBeenCalled()
  })

  it('removes the shortcut from the dialog groups after unmount', async () => {
    const count = () =>
      getShortcutGroups().flatMap((group) => group.shortcuts).length
    const before = count()

    const { unmount } = mountWithShortcut({
      combo: 'Q',
      description: 'Quit unique 9283',
      handler: vi.fn(),
    })
    await nextTick()
    expect(count()).toBe(before + 1)

    unmount()
    await nextTick()
    expect(count()).toBe(before)
  })
})

// ---------------------------------------------------------------------------
// getShortcutGroups — grouping and description merging
// ---------------------------------------------------------------------------

describe('getShortcutGroups', () => {
  it('groups by group name and defaults to General', async () => {
    const { unmount } = mountWithShortcut([
      { combo: 'A', description: 'Action A', group: 'Alpha', handler: vi.fn() },
      { combo: 'B', description: 'Action B', group: 'Beta', handler: vi.fn() },
      { combo: 'C', description: 'Action C', group: 'Alpha', handler: vi.fn() },
      { combo: 'G', description: 'Ungrouped action', handler: vi.fn() },
    ])
    await nextTick()

    const groups = getShortcutGroups()
    const byName = (name: string) => groups.find((g) => g.name === name)
    expect(byName('Alpha')!.shortcuts).toHaveLength(2)
    expect(byName('Beta')!.shortcuts).toHaveLength(1)
    expect(
      byName('General')!.shortcuts.some(
        (s) => s.description === 'Ungrouped action',
      ),
    ).toBe(true)

    unmount()
  })

  it('merges shortcuts that share a description into one row with altCombos', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { unmount } = mountWithShortcut([
      { combo: 'Mod+Z', description: 'Undo', group: 'Editing', handler: vi.fn() },
      {
        combo: 'Mod+Shift+Z',
        description: 'Redo',
        group: 'Editing',
        handler: vi.fn(),
      },
      { combo: 'Mod+Y', description: 'Redo', group: 'Editing', handler: vi.fn() },
    ])
    await nextTick()

    const editing = getShortcutGroups().find((g) => g.name === 'Editing')!
    const redo = editing.shortcuts.filter((s) => s.description === 'Redo')
    expect(redo).toHaveLength(1)
    expect(redo[0].combo).toBe('Mod+Shift+Z')
    expect(redo[0].altCombos).toEqual(['Mod+Y'])

    unmount()
    warn.mockRestore()
  })

  it('keeps the same description in two groups apart', async () => {
    const { unmount } = mountWithShortcut([
      { combo: 'X', description: 'Cut', group: 'Edit', handler: vi.fn() },
      { combo: 'Mod+X', description: 'Cut', group: 'Canvas', handler: vi.fn() },
    ])
    await nextTick()

    const groups = getShortcutGroups()
    const cuts = groups.flatMap((g) =>
      g.shortcuts.filter((s) => s.description === 'Cut'),
    )
    expect(cuts).toHaveLength(2)

    unmount()
  })
})
