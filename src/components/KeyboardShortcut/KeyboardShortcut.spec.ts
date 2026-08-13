// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, createApp, h } from 'vue'
import KeyboardShortcut from './KeyboardShortcut.vue'
import {
  _resetComboWarnings,
  parseCombo,
  spellOut,
} from '../../utils/keyboardShortcutCombo'

function render(props: Record<string, unknown>): HTMLElement {
  const host = document.createElement('div')
  document.body.appendChild(host)
  createApp({ render: () => h(KeyboardShortcut, props) }).mount(host)
  return host
}

/** Rendered text of each key chip. `bg` draws every part as text or an icon. */
function keys(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll('[data-slot=key]')).map((el) =>
    (el.textContent ?? '').trim(),
  )
}

beforeEach(() => _resetComboWarnings())

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('parseCombo', () => {
  it('reads every modifier the grammar defines', () => {
    expect(parseCombo('Mod+Ctrl+Alt+Shift+K', true).map((p) => p.type)).toEqual(
      ['cmd', 'ctrl', 'alt', 'shift', 'key'],
    )
    expect(parseCombo('Mod+K', true).map((p) => p.display)).toEqual(['⌘', 'K'])
    expect(parseCombo('Mod+K', false).map((p) => p.display)).toEqual([
      'Ctrl',
      'K',
    ])
  })

  it('collapses Mod and Ctrl into one chip off macOS', () => {
    expect(
      parseCombo('Mod+Ctrl+Alt+Shift+K', false).map((p) => p.display),
    ).toEqual(['Ctrl', 'Alt', 'Shift', 'K'])
    expect(spellOut(parseCombo('Mod+Ctrl+K', false))).toBe('Control + K')
  })

  it('ignores inherited object properties', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(parseCombo('constructor', false).map((p) => p.display)).toEqual([
      'constructor',
    ])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(spellOut(parseCombo('toString', false))).toBe('toString')
  })

  it('reads the key names the combo grammar defines', () => {
    const display = (combo: string) =>
      parseCombo(combo, false).map((p) => p.display)
    expect(display('Digit1')).toEqual(['1'])
    expect(display('Slash')).toEqual(['/'])
    expect(display('Backtick')).toEqual(['`'])
    expect(display('Plus')).toEqual(['+'])
    expect(display('Equal')).toEqual(['='])
    expect(display('BracketLeft')).toEqual(['['])
    expect(display('Escape')).toEqual(['Esc'])
    expect(display('Insert')).toEqual(['Insert'])
    expect(display('F5')).toEqual(['F5'])
    expect(display('k')).toEqual(['K'])
  })

  it('warns once per token outside the grammar, and renders it as written', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(parseCombo('cmd+K', false).map((p) => p.display)).toEqual([
      'cmd',
      'K',
    ])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('"cmd"')

    parseCombo('cmd+J', false)
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('warns about an empty part instead of dropping it', () => {
    // `Mod++K` is the plausible v0 fix-up for `key: '+'`. Dropping the empty
    // part drew ⌘ K for a combo `useKeyboardShortcut` refuses.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    parseCombo('Mod++K', false)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('An empty part')
  })

  it('warns about a modifier where the key belongs', () => {
    // `Mod+Shift` names no key, so it draws two chips and fires on nothing.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    parseCombo('Mod+Shift', false)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('"Shift"')
  })

  it('rejects the v0 aliases the display no longer accepts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (const token of ['meta', 'command', 'option', 'esc', 'del', 'win']) {
      parseCombo(`${token}+P`, false)
    }
    expect(warn).toHaveBeenCalledTimes(6)
  })

  it('spells a combo for an aria-label, punctuation included', () => {
    expect(spellOut(parseCombo('Mod+Shift+ArrowUp', true))).toBe(
      'Command + Shift + Up Arrow',
    )
    expect(spellOut(parseCombo('Mod+BracketLeft', false))).toBe(
      'Control + Bracket Left',
    )
    expect(spellOut(parseCombo('Mod+Slash', false))).toBe('Control + Slash')
    expect(spellOut(parseCombo('Mod+Digit1', false))).toBe('Control + 1')
  })

  it('spells the shortened key names in full', () => {
    expect(spellOut(parseCombo('Escape', false))).toBe('Escape')
    expect(spellOut(parseCombo('PageUp', false))).toBe('Page Up')
    expect(spellOut(parseCombo('PageDown', false))).toBe('Page Down')
  })
})

describe('<KeyboardShortcut />', () => {
  it('renders the grammar key names as chips', () => {
    expect(keys(render({ combo: 'Mod+Shift+Digit1', bg: true }))).toEqual([
      'Ctrl',
      'Shift',
      '1',
    ])
    expect(keys(render({ combo: 'Slash', bg: true }))).toEqual(['/'])
  })

  it('names the alternatives once, on a role that replaces the subtree', () => {
    const host = render({ combo: 'Mod+Backspace', altCombos: ['Delete'] })
    const root = host.querySelector('[data-slot=keyboard-shortcut]')
    expect(root?.getAttribute('aria-label')).toBe(
      'Shortcut Control + Backspace, or Delete',
    )
    // `note` is not a role whose children are presentational, so a reader met
    // every chip a second time. `img` is, which is what the label assumes.
    expect(root?.getAttribute('role')).toBe('img')
    expect(
      host
        .querySelector('[data-slot=keyboard-shortcut] [data-slot=alt-combos]')
        ?.hasAttribute('aria-hidden'),
    ).toBe(false)
  })

  it('leaves the chips unlabelled, since the root role replaces them', () => {
    // A per-key label is unreachable behind the root `role="img"`, and the
    // ones the chips carried were the glyph, not the word: `↵`, not `Enter`.
    for (const props of [
      { combo: 'Mod+Shift+Alt+Enter' },
      { combo: 'Mod+Shift+Alt+Enter', bg: true },
    ]) {
      const host = render(props)
      expect(host.querySelectorAll('[data-slot=key] [role=img]').length).toBe(0)
      expect(host.querySelectorAll('[data-slot=key] [aria-label]').length).toBe(
        0,
      )
    }
  })

  it('takes no role without a combo, so the fallback slot stays readable', () => {
    const host = render({})
    const root = host.querySelector('[data-slot=keyboard-shortcut]')
    expect(root?.hasAttribute('role')).toBe(false)
    expect(root?.hasAttribute('aria-label')).toBe(false)
  })

  it('honours useIcons in bg mode, for the keys the prop names', () => {
    const withIcons = render({ combo: 'Mod+Enter', bg: true, useIcons: true })
    expect(
      withIcons.querySelector('[data-slot=key] .lucide-corner-down-left'),
    ).not.toBe(null)

    const withoutIcons = render({
      combo: 'Mod+Enter',
      bg: true,
      useIcons: false,
    })
    expect(
      withoutIcons.querySelector('[data-slot=key] .lucide-corner-down-left'),
    ).toBe(null)
    expect(keys(withoutIcons)).toEqual(['Ctrl', '↵'])
  })

  it('applies a caller class once, not once per bind', () => {
    const host = render({ combo: 'Mod+K', class: 'px-1' })
    const className =
      host.querySelector('[data-slot=keyboard-shortcut]')?.className ?? ''
    expect(className.split(/\s+/).filter((c) => c === 'px-1')).toEqual(['px-1'])
  })

  it('keeps the fallthrough override order for role and aria-label', () => {
    // Auto-inherit runs after the template's own `role` and `aria-label`, so a
    // caller value wins. Dropping the explicit `v-bind` must not change that.
    const host = render({
      combo: 'Mod+K',
      role: 'button',
      'aria-label': 'Open the palette',
      'data-testid': 'shortcut',
    })
    const root = host.querySelector('[data-slot=keyboard-shortcut]')
    expect(root?.getAttribute('role')).toBe('button')
    expect(root?.getAttribute('aria-label')).toBe('Open the palette')
    expect(root?.getAttribute('data-testid')).toBe('shortcut')
  })

  it('warns for a chip bound from a computed value, with no registration', () => {
    // Downstream apps bind `:combo` from a computed value, so the chip is the
    // only thing that can report a malformed combo. Before the fix this drew
    // Ctrl K and said nothing, while the matching half refused the same combo.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const host = document.createElement('div')
    document.body.appendChild(host)
    createApp({
      setup: () => ({ combo: computed(() => 'Mod++K') }),
      template: '<KeyboardShortcut :combo="combo" />',
      components: { KeyboardShortcut },
    }).mount(host)

    expect(keys(host)).toEqual(['Ctrl', '', 'K'])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('An empty part')
  })

  it('marks the bg variant with data-bg', () => {
    const plain = render({ combo: 'Mod+K' })
    expect(
      plain
        .querySelector('[data-slot=keyboard-shortcut]')
        ?.hasAttribute('data-bg'),
    ).toBe(false)

    const bg = render({ combo: 'Mod+K', bg: true })
    expect(
      bg
        .querySelector('[data-slot=keyboard-shortcut]')
        ?.getAttribute('data-bg'),
    ).toBe('true')
  })
})
