// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h } from 'vue'
import KeyboardShortcut from './KeyboardShortcut.vue'
import { _resetComboWarnings, parseCombo, spellOut } from './combo'

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

  it('hides the alternatives from assistive tech and names them once', () => {
    const host = render({ combo: 'Mod+Backspace', altCombos: ['Delete'] })
    const root = host.querySelector('[data-slot=keyboard-shortcut]')
    expect(root?.getAttribute('aria-label')).toBe(
      'Shortcut Control + Backspace, or Delete',
    )
    expect(
      host
        .querySelector('[data-slot=keyboard-shortcut] [data-slot=alt-combos]')
        ?.getAttribute('aria-hidden'),
    ).toBe('true')
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
