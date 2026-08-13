// @vitest-environment jsdom
/**
 * Unit tests for src/composables/useKeyboardShortcut.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, nextTick, ref } from 'vue'
import {
  _keyboardShortcutKeyNames,
  _resetComboWarnings,
  _resetKeyboardShortcutWarnings,
  matchesCombo,
  parseCombo as parseComboForDisplay,
  parseComboForMatching,
} from '../utils/keyboardShortcutCombo'
import {
  getShortcutGroups,
  useKeyboardShortcut,
  type KeyboardShortcutConfig,
} from './useKeyboardShortcut'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mount a component that registers shortcuts and return unmount(). */
function mountWithShortcut(
  config: KeyboardShortcutConfig | KeyboardShortcutConfig[],
) {
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

/**
 * Mount a shortcut inside a `<KeepAlive>` and return a switch that swaps it
 * for a sibling. Swapping it out deactivates it; swapping it back activates
 * the same instance again, without a fresh setup().
 */
function mountKeptAlive(
  config: KeyboardShortcutConfig | KeyboardShortcutConfig[],
) {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const active = ref(true)
  const WithShortcut = defineComponent({
    setup() {
      useKeyboardShortcut(config)
    },
    template: '<div/>',
  })
  const Sibling = defineComponent({ template: '<div/>' })
  const app = createApp(
    defineComponent({
      setup: () => ({ active, WithShortcut, Sibling }),
      template:
        '<KeepAlive><component :is="active ? WithShortcut : Sibling" /></KeepAlive>',
    }),
  )
  app.mount(el)
  return {
    /** Deactivate or reactivate the component holding the shortcut. */
    async setActive(value: boolean) {
      active.value = value
      await nextTick()
    },
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
      matchesCombo(
        makeEvent({ key: '1', code: 'Digit1', ...MOD }),
        'Mod+Digit1',
      ),
    ).toBe(true)
  })

  it('matches punctuation by key position, not by the character it types', () => {
    expect(
      matchesCombo(makeEvent({ key: '-', code: 'Slash', ...MOD }), 'Mod+Slash'),
    ).toBe(true)
    expect(
      matchesCombo(makeEvent({ key: '/', code: 'Slash', ...MOD }), 'Mod+Slash'),
    ).toBe(true)
  })

  it('maps Backtick to the Backquote code', () => {
    expect(
      matchesCombo(makeEvent({ key: '`', code: 'Backquote' }), 'Backtick'),
    ).toBe(true)
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
// The test reset clears everything a warning sits behind
// ---------------------------------------------------------------------------

describe('_resetKeyboardShortcutWarnings — a fresh warning surface', () => {
  it('warns again about a combo an earlier parse already refused', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // A combo no other test parses, so the count below is this test's alone.
    expect(parseComboForMatching('Mod+NotAKey')).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)

    warn.mockClear()
    _resetKeyboardShortcutWarnings()

    // `parseComboForMatching` returns a cached verdict before it warns, so a
    // parse cache the reset leaves behind swallows this second warning.
    expect(parseComboForMatching('Mod+NotAKey')).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)

    warn.mockRestore()
  })
})

// ---------------------------------------------------------------------------
// Mod resolves on the same platform check the chip draws with
// ---------------------------------------------------------------------------

/**
 * Load a fresh grammar module against a stubbed `navigator`. It reads the
 * platform on first parse and caches the result, so the stub has to be in place
 * before the module graph is built.
 */
async function loadOnPlatform(navigatorStub: Record<string, unknown>) {
  vi.resetModules()
  vi.stubGlobal('navigator', navigatorStub)
  return await import('../utils/keyboardShortcutCombo')
}

describe('Mod resolves on one platform check, shared with the chip', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  // `isMacPlatform` is now the single check both halves read, so this guards
  // the check itself: these are the inputs that told two checks apart when the
  // matcher and the chip each had their own.
  const disagreements = [
    {
      name: 'navigator.platform names a Mac the userAgent does not',
      navigator: {
        platform: 'MacIntel',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    },
    {
      name: 'the userAgent names an iPhone',
      navigator: {
        platform: '',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1',
      },
    },
  ]

  for (const platform of disagreements) {
    it(`fires Mod on Meta when ${platform.name}`, async () => {
      const grammar = await loadOnPlatform(platform.navigator)

      expect(grammar.isMacPlatform()).toBe(true)
      expect(
        grammar.matchesCombo(makeEvent({ key: 's', metaKey: true }), 'Mod+S'),
      ).toBe(true)
      expect(
        grammar.matchesCombo(makeEvent({ key: 's', ctrlKey: true }), 'Mod+S'),
      ).toBe(false)
    })
  }

  it('fires Mod on Ctrl off an Apple platform', async () => {
    const grammar = await loadOnPlatform({
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })

    expect(grammar.isMacPlatform()).toBe(false)
    expect(
      grammar.matchesCombo(makeEvent({ key: 's', ctrlKey: true }), 'Mod+S'),
    ).toBe(true)
    expect(
      grammar.matchesCombo(makeEvent({ key: 's', metaKey: true }), 'Mod+S'),
    ).toBe(false)
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

  it('releases a held combo when the component unmounts', async () => {
    const onRelease = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Space',
      description: 'Pan mode',
      onHold: vi.fn(),
      onRelease,
    })
    await nextTick()

    fireKey({ key: ' ' })
    expect(onRelease).not.toHaveBeenCalled()

    // The keys never came up, so nothing else can switch pan mode off.
    unmount()
    expect(onRelease).toHaveBeenCalledOnce()
    expect(onRelease).toHaveBeenCalledWith()

    // A late keyup must not release it a second time.
    fireKeyUp({ key: ' ' })
    expect(onRelease).toHaveBeenCalledOnce()
  })

  it('releases a held combo when a <KeepAlive> deactivates it', async () => {
    const onHold = vi.fn()
    const onRelease = vi.fn()
    const kept = mountKeptAlive({
      combo: 'Space',
      description: 'Pan mode',
      onHold,
      onRelease,
    })
    await nextTick()

    fireKey({ key: ' ' })
    expect(onHold).toHaveBeenCalledOnce()
    expect(onRelease).not.toHaveBeenCalled()

    await kept.setActive(false)
    expect(onRelease).toHaveBeenCalledOnce()
    expect(onRelease).toHaveBeenCalledWith()

    // Coming back is a fresh hold, not a second release.
    await kept.setActive(true)
    expect(onRelease).toHaveBeenCalledOnce()
    fireKey({ key: ' ' })
    expect(onHold).toHaveBeenCalledTimes(2)

    kept.unmount()
    expect(onRelease).toHaveBeenCalledTimes(2)
  })

  it('does not release a shortcut that was never held', async () => {
    const onRelease = vi.fn()
    const { unmount } = mountWithShortcut({
      combo: 'Space',
      description: 'Pan mode',
      onHold: vi.fn(),
      onRelease,
    })
    await nextTick()

    unmount()
    expect(onRelease).not.toHaveBeenCalled()
  })

  it('finishes the cleanup when onRelease throws', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const handler = vi.fn()
    const { unmount } = mountWithShortcut([
      {
        combo: 'Space',
        description: 'Pan mode',
        onHold: vi.fn(),
        onRelease: () => {
          throw new Error('boom')
        },
      },
      { combo: 'Q', description: 'Quit', handler },
    ])
    await nextTick()

    fireKey({ key: ' ' })
    unmount()
    expect(error).toHaveBeenCalled()

    // The second registration still went away.
    fireKey({ key: 'q' })
    expect(handler).not.toHaveBeenCalled()
    error.mockRestore()
  })

  it('releases the other held shortcuts when onRelease throws on keyup', async () => {
    // The release path on unmount already guards each callback. The keyup path
    // must agree, or one throwing shortcut leaves every other held shortcut
    // stuck down with no way back.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onHold = vi.fn()
    const onRelease = vi.fn()
    const { unmount } = mountWithShortcut([
      {
        combo: 'Mod+Space',
        description: 'Pan mode',
        onHold: vi.fn(),
        onRelease: () => {
          throw new Error('boom')
        },
      },
      { combo: 'Mod+L', description: 'Snap to grid', onHold, onRelease },
    ])
    await nextTick()

    fireKey({ key: ' ', ...MOD })
    fireKey({ key: 'l', ...MOD })
    expect(onHold).toHaveBeenCalledOnce()

    // One keyup ends both holds: the modifier they share goes up.
    fireKeyUp({ key: 'Control' })
    expect(error).toHaveBeenCalled()
    expect(onRelease, 'the second hold was released too').toHaveBeenCalledOnce()

    // And it is no longer stuck down, so it can be held again.
    fireKey({ key: 'l', ...MOD })
    expect(onHold).toHaveBeenCalledTimes(2)

    unmount()
    error.mockRestore()
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
    expect(message).toContain('2 shortcuts are live on this keypress')
    expect(message).toContain('"Delete page" (active)')
    expect(message).toContain('"Toggle canvas dark mode" (shadowed)')

    b.unmount()
    a.unmount()
    warn.mockRestore()
  })

  it('names every registration when three or more are live', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // Suite's slides app hits this: a shared composable and the page that uses
    // it both register the arrow keys, on top of a third registration.
    const a = mountWithShortcut({
      combo: 'ArrowUp',
      description: 'Move element',
      handler: vi.fn(),
    })
    const b = mountWithShortcut({
      combo: 'ArrowUp',
      description: 'Previous slide',
      handler: vi.fn(),
    })
    const c = mountWithShortcut({
      combo: 'ArrowUp',
      description: 'Scroll thumbnails',
      handler: vi.fn(),
    })
    await nextTick()

    fireKey({ key: 'ArrowUp' })

    expect(warn).toHaveBeenCalledTimes(1)
    const message = warn.mock.calls[0][0] as string
    expect(message).toContain('Duplicate shortcut ArrowUp')
    expect(message).toContain('3 shortcuts are live on this keypress')
    // The middle registration is the one the old message dropped.
    expect(message).toContain('"Scroll thumbnails" (active)')
    expect(message).toContain('"Previous slide" (shadowed)')
    expect(message).toContain('"Move element" (shadowed)')

    c.unmount()
    b.unmount()
    a.unmount()
    warn.mockRestore()
  })
})

// ---------------------------------------------------------------------------
// KeepAlive
// ---------------------------------------------------------------------------

describe('useKeyboardShortcut — deactivated inside <KeepAlive>', () => {
  it('goes inert while deactivated, and comes back on activation', async () => {
    const handler = vi.fn()
    const kept = mountKeptAlive({
      combo: 'Q',
      description: 'Quit kept alive',
      handler,
    })
    await nextTick()

    fireKey({ key: 'q' })
    expect(handler).toHaveBeenCalledOnce()

    // A cached component still has its setup() state, but its keys belong to
    // the screen the user left.
    await kept.setActive(false)
    handler.mockClear()
    fireKey({ key: 'q' })
    expect(handler).not.toHaveBeenCalled()

    await kept.setActive(true)
    fireKey({ key: 'q' })
    expect(handler).toHaveBeenCalledOnce()

    kept.unmount()
  })

  it('leaves the dialog groups while deactivated, and rejoins them once', async () => {
    const description = 'Quit kept alive 4471'
    const rows = () =>
      getShortcutGroups()
        .flatMap((group) => group.shortcuts)
        .filter((shortcut) => shortcut.description === description)

    const kept = mountKeptAlive({
      combo: 'Q',
      description,
      handler: vi.fn(),
    })
    await nextTick()
    expect(rows()).toHaveLength(1)

    await kept.setActive(false)
    expect(rows()).toHaveLength(0)

    // Registering again must not leave a duplicate row behind.
    await kept.setActive(true)
    expect(rows()).toHaveLength(1)

    kept.unmount()
    await nextTick()
    expect(rows()).toHaveLength(0)
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
      {
        combo: 'Mod+Z',
        description: 'Undo',
        group: 'Editing',
        handler: vi.fn(),
      },
      {
        combo: 'Mod+Shift+Z',
        description: 'Redo',
        group: 'Editing',
        handler: vi.fn(),
      },
      {
        combo: 'Mod+Y',
        description: 'Redo',
        group: 'Editing',
        handler: vi.fn(),
      },
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

// ---------------------------------------------------------------------------
// The key vocabulary and the display grammar stay in step
// ---------------------------------------------------------------------------

describe('every key that fires is a key that draws', () => {
  it('draws every key name in the vocabulary, none as a raw token', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    _resetComboWarnings()

    // The matching tables and `KEY_DISPLAY` are still two tables, now in one
    // file. The display half warns and prints the token as written when it
    // meets a name `KEY_DISPLAY` and the letter/function-key rules both miss,
    // so one warning here means they have drifted: the key fires but the chip
    // cannot draw it.
    for (const key of _keyboardShortcutKeyNames) {
      const parts = parseComboForDisplay(`Mod+Shift+${key}`, false)
      expect(
        parts.map((p) => p.type),
        key,
      ).toEqual(['ctrl', 'shift', 'key'])
    }

    expect(
      warn.mock.calls.map(([message]) => message),
      'key names the display grammar does not know',
    ).toEqual([])

    warn.mockRestore()
  })
})

// ---------------------------------------------------------------------------
// The two halves reach the same verdict on a malformed combo
//
// The test above walks well-formed combos through both halves. This one walks
// malformed ones. A combo the matcher refuses must not draw a silent chip:
// downstream apps bind `:combo` from a computed value with no registration
// behind it, so the chip is the only thing that can warn.
// ---------------------------------------------------------------------------

type Verdict = 'accept' | 'warn'

/** What the matching half decides. `null` is the verdict it warns about. */
function matchingVerdict(combo: string): Verdict {
  return parseComboForMatching(combo) ? 'accept' : 'warn'
}

/** What the display half decides, plus how many chips it would draw. */
function displayVerdict(
  combo: string,
  isMac: boolean,
): { verdict: Verdict; chips: number } {
  _resetComboWarnings()
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const chips = parseComboForDisplay(combo, isMac).length
  const verdict: Verdict = warn.mock.calls.length ? 'warn' : 'accept'
  warn.mockRestore()
  return { verdict, chips }
}

/** Every row is `[combo, the verdict both halves must reach]`. */
const COMBO_VERDICTS: [combo: string, expected: Verdict][] = [
  // Well formed.
  ['Mod+K', 'accept'],
  ['mod+shift+digit1', 'accept'],
  [' Mod + K ', 'accept'],
  ['Mod+Mod+K', 'accept'],
  ['Mod+Ctrl+Mod+K', 'accept'],
  ['Shift+Mod+K', 'accept'],
  ['Space', 'accept'],
  // Empty part, in every position.
  ['Mod++K', 'warn'],
  ['Mod+K+', 'warn'],
  ['+K', 'warn'],
  ['Mod+', 'warn'],
  ['Mod+ +K', 'warn'],
  // Separators only.
  ['+', 'warn'],
  ['++', 'warn'],
  ['   ', 'warn'],
  // No key at all.
  ['Mod', 'warn'],
  ['Mod+Shift', 'warn'],
  ['Shift+Mod', 'warn'],
  ['K+Mod', 'warn'],
  // A key where a modifier belongs.
  ['K+L', 'warn'],
  ['Mod+K+L', 'warn'],
  // Names outside the grammar, including the v0 vocabulary.
  ['cmd+K', 'warn'],
  ['meta+K', 'warn'],
  ['option+K', 'warn'],
  ['Mod+Esc', 'warn'],
  ['Mod+Del', 'warn'],
  ['Mod+Foo', 'warn'],
  // Inherited object properties, in both slots.
  ['constructor', 'warn'],
  ['Mod+constructor', 'warn'],
  ['toString+K', 'warn'],
]

describe('a combo the matcher refuses is a combo the chip warns about', () => {
  it.each(COMBO_VERDICTS)(
    'agrees on %j',
    (combo: string, expected: Verdict) => {
      const matching = matchingVerdict(combo)
      const mac = displayVerdict(combo, true)
      const pc = displayVerdict(combo, false)

      expect(matching, 'matching half').toBe(expected)
      expect(mac.verdict, 'display half on macOS').toBe(expected)
      expect(pc.verdict, 'display half off macOS').toBe(expected)
    },
  )

  it('never draws a chip the matcher refuses without warning', () => {
    // The invariant behind the table: a drawn chip with no warning behind it
    // is the silent failure this family exists to remove.
    const silent = COMBO_VERDICTS.map(([combo]) => combo).filter((combo) => {
      const { verdict, chips } = displayVerdict(combo, false)
      return chips > 0 && verdict === 'accept' && matchingVerdict(combo) !== 'accept'
    })
    expect(silent, 'combos drawn as chips that can never fire').toEqual([])
  })

  it('draws nothing, and so warns about nothing, without a combo', () => {
    // An absent or empty `combo` is not a malformed combo: the component draws
    // its fallback slot instead of a chip, so there is nothing to warn about.
    for (const combo of [undefined, '']) {
      _resetComboWarnings()
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(parseComboForDisplay(combo, false)).toEqual([])
      expect(warn).not.toHaveBeenCalled()
      warn.mockRestore()
    }
  })
})
