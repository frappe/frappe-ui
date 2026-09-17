/**
 * @vitest-environment jsdom
 *
 * `CodeKit` is a plain CodeMirror `Extension` with a `.configure()` on it. The
 * tests below are the member list: eight names, each removable with `false`,
 * and nothing from `@codemirror/lint` anywhere in what the kit builds.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { acceptCompletion, completionStatus } from '@codemirror/autocomplete'
import { highlightingFor } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { tags } from '@lezer/highlight'
import { CodeKit, type CodeKitOptions } from './index'
import {
  boundKeys,
  cleanupMounted,
  keyBindings,
  mountEditorView,
} from './test-helpers'

afterEach(cleanupMounted)

/** The class `codeChrome` adds, and the one every frappe rule is scoped under. */
const CHROME_CLASS = 'frappe-code'

type Kit = typeof CodeKit

/** Mounts a kit on an empty document — the state the placeholder needs. */
function probe(kit: Kit) {
  const view = mountEditorView([kit])
  return {
    view,
    has: (selector: string) => view.dom.querySelector(selector) !== null,
    binds: (key: string) => boundKeys(view.state).has(key),
  }
}

/**
 * How each member proves it is loaded. Five read the rendered DOM or the
 * keymap facet of the extension they wrap; `highlight` asks the language
 * package which class a keyword would get, which is null with no highlighter.
 */
const present: Record<
  keyof CodeKitOptions,
  (p: ReturnType<typeof probe>) => boolean
> = {
  lineNumbers: (p) => p.has('.cm-lineNumbers'),
  foldGutter: (p) => p.has('.cm-foldGutter'),
  autocompletion: (p) => p.binds('Ctrl-Space'),
  search: (p) => p.binds('Mod-f'),
  placeholder: (p) => p.has('.cm-placeholder'),
  chrome: (p) => p.view.dom.classList.contains(CHROME_CLASS),
  highlight: (p) => highlightingFor(p.view.state, [tags.keyword]) !== null,
  keymap: (p) => p.binds('Tab'),
}

const MEMBERS = Object.keys(present) as Array<keyof CodeKitOptions>

/** Every member turned on, so removing one is the only variable in the test. */
const allOn: CodeKitOptions = {
  lineNumbers: {},
  foldGutter: {},
  autocompletion: {},
  search: {},
  placeholder: 'SELECT 1',
  chrome: {},
  highlight: {},
  keymap: {},
}

describe('CodeKit', () => {
  it('is a valid CodeMirror extension', () => {
    expect(() =>
      EditorState.create({ doc: 'SELECT 1', extensions: [CodeKit] }),
    ).not.toThrow()

    const view = mountEditorView([CodeKit], 'SELECT 1')
    expect(view.state.doc.toString()).toBe('SELECT 1')
    expect(view.dom.querySelector('.cm-content')).not.toBeNull()
  })

  it('carries the fixed base: history, multiple selections and the default keymaps', () => {
    const view = mountEditorView([CodeKit])
    const keys = boundKeys(view.state)

    // `history()` and its keymap are fixed base, not members.
    expect(keys.has('Mod-z')).toBe(true)
    // `defaultKeymap`.
    expect(keys.has('Mod-Enter')).toBe(true)
    expect(view.state.facet(EditorState.allowMultipleSelections)).toBe(true)
  })

  it('loads every member when they are all turned on', () => {
    const p = probe(CodeKit.configure(allOn))
    for (const member of MEMBERS) {
      expect(present[member](p), `${member} should be loaded`).toBe(true)
    }
  })

  it.each(MEMBERS)('removes the %s member with `false`', (member) => {
    const p = probe(CodeKit.configure({ ...allOn, [member]: false }))

    expect(present[member](p), `${member} should be gone`).toBe(false)
    for (const other of MEMBERS) {
      if (other === member) continue
      expect(present[other](p), `${other} should survive`).toBe(true)
    }
  })

  it('returns a new kit from configure and leaves the receiver untouched', () => {
    const noChrome = CodeKit.configure({ chrome: false })

    expect(noChrome).not.toBe(CodeKit)
    expect(present.chrome(probe(noChrome))).toBe(false)
    // The shared default kit is the one every consumer imports, so a
    // `.configure()` call anywhere must not reach it.
    expect(present.chrome(probe(CodeKit))).toBe(true)
  })

  it('merges a chained configure into the receiver instead of resetting it', () => {
    // The `.configure()` mold StarterKit set: chaining accumulates. Rebuilding
    // from the defaults each time would silently drop the first call.
    const chained = CodeKit.configure({ lineNumbers: {} }).configure({
      search: false,
    })
    const p = probe(chained)

    expect(p.has('.cm-lineNumbers')).toBe(true)
    expect(present.search(p)).toBe(false)
  })

  it('defaults line numbers off and the placeholder to no text', () => {
    const p = probe(CodeKit)

    expect(p.has('.cm-lineNumbers')).toBe(false)
    expect(p.has('.cm-placeholder')).toBe(false)
    // The two defaults that differ from `basicSetup` are the only ones off:
    // the fold gutter, completion and search all ship on.
    expect(p.has('.cm-foldGutter')).toBe(true)
    expect(p.binds('Ctrl-Space')).toBe(true)
    expect(p.binds('Mod-f')).toBe(true)
  })

  it('renders the line-number gutter when `lineNumbers: {}` turns it on', () => {
    const view = mountEditorView(
      [CodeKit.configure({ lineNumbers: {} })],
      'a\nb',
    )

    const gutter = view.dom.querySelector('.cm-lineNumbers')
    expect(gutter).not.toBeNull()
    expect(gutter!.textContent).toContain('1')
  })

  it('renders the placeholder text on an empty document', () => {
    const view = mountEditorView([
      CodeKit.configure({ placeholder: 'SELECT 1' }),
    ])

    expect(view.dom.querySelector('.cm-placeholder')?.textContent).toBe(
      'SELECT 1',
    )
  })

  it('hides the placeholder once the document has text', () => {
    const view = mountEditorView(
      [CodeKit.configure({ placeholder: 'SELECT 1' })],
      'x',
    )

    expect(view.dom.querySelector('.cm-placeholder')).toBeNull()
  })

  it('drops the frappe-code class with `chrome: false`', () => {
    expect(
      mountEditorView([CodeKit]).dom.classList.contains(CHROME_CLASS),
    ).toBe(true)

    const bare = mountEditorView([CodeKit.configure({ chrome: false })])
    expect(bare.dom.classList.contains(CHROME_CLASS)).toBe(false)
    // Nothing in style.css matches without the class, so no frappe CSS is
    // ambient — that is the whole point of the layer being an extension.
    expect(bare.dom.className).not.toContain('frappe')
  })

  it('drops the frappe syntax colours with `highlight: false`', () => {
    const withHighlight = mountEditorView([CodeKit])
    expect(highlightingFor(withHighlight.state, [tags.keyword])).not.toBeNull()

    const without = mountEditorView([CodeKit.configure({ highlight: false })])
    expect(highlightingFor(without.state, [tags.keyword])).toBeNull()
  })

  it('binds Tab, Shift-Tab and Escape through the keymap member', () => {
    const state = mountEditorView([CodeKit]).state
    const bindings = keyBindings(state)

    // Shift-Tab rides on the Tab binding's `shift` handler, which is how
    // `indentWithTab` expresses the dedent half.
    const tab = bindings.find((binding) => binding.key === 'Tab')
    expect(tab).toBeTruthy()
    expect(typeof tab!.shift).toBe('function')
    expect(boundKeys(state).has('Escape')).toBe(true)

    const bare = mountEditorView([CodeKit.configure({ keymap: false })]).state
    expect(keyBindings(bare).some((binding) => binding.key === 'Tab')).toBe(
      false,
    )
  })

  it('lets `autocompletion: { defaultKeymap: false }` take the keys back', () => {
    // `autocompletion()` installs `completionKeymap` itself, at
    // `Prec.highest`, gated on this option. A second copy in the kit would
    // keep Enter, Escape, the arrows and Ctrl-Space bound whatever the option
    // said, and would beat a replacement keymap appended after the kit.
    const on = mountEditorView([CodeKit]).state
    expect(
      keyBindings(on).some((binding) => binding.run === acceptCompletion),
    ).toBe(true)

    const off = mountEditorView([
      CodeKit.configure({ autocompletion: { defaultKeymap: false } }),
    ]).state
    expect(
      keyBindings(off).some((binding) => binding.run === acceptCompletion),
    ).toBe(false)
    // Ctrl-Space is the completion member's alone: nothing else in the kit
    // binds it, so its absence is the whole keymap leaving.
    expect(boundKeys(off).has('Ctrl-Space')).toBe(false)
    // The completion state itself is still installed. Only the keys are gone.
    expect(completionStatus(off)).toBeNull()
  })

  it('has no lint member, so `@codemirror/lint` never enters the kit', () => {
    // @ts-expect-error `lint` is not a member: that is what keeps
    // `@codemirror/lint` an optional peer nobody installs by accident.
    const lintMember: Partial<CodeKitOptions> = { lint: {} }
    void lintMember
    expect('lint' in allOn).toBe(false)

    const view = mountEditorView([CodeKit.configure(allOn)], 'SELECT 1')
    // The lint gutter and the lint keymap are the two things the package puts
    // in a state. Neither is here.
    expect(view.dom.querySelector('.cm-gutter-lint')).toBeNull()
    expect(boundKeys(view.state).has('Mod-Shift-m')).toBe(false)
    expect(boundKeys(view.state).has('F8')).toBe(false)
  })
})
