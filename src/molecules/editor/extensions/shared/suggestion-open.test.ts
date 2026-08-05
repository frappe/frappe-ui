/**
 * @vitest-environment jsdom
 *
 * Covers the "toolbar button opens the slash menu" path: the trigger char has
 * to be typed into the document for the suggester to match, so dismissing the
 * menu must take it back out again — while a trigger the USER typed stays put.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Editor, Extension } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion from '@tiptap/suggestion'
import { Code } from '@tiptap/extension-code'
import {
  autoOpenCleanupPlugin,
  insertSuggestionTrigger,
} from './suggestion-open'
import { createSuggestionExtension } from '../suggestion/createSuggestionExtension'

const CHAR = '/'
const suggestionKey = new PluginKey('testSuggestion')

/**
 * Stands in for the real `allow: ({state, range}) => !isInCode(...)` that
 * `createSuggestionExtension` gives every suggester. Flipped per test rather
 * than pulling a CodeBlock node into this state-machine fixture.
 */
let allowOpen = true

/**
 * A bare suggester: the real `createSuggestionExtension` wiring minus the Vue
 * popup (`render: () => ({})`), so the test stays a state-machine test.
 */
const TestSuggester = Extension.create({
  name: 'testSuggester',
  addOptions() {
    return {
      suggestion: {
        char: CHAR,
        pluginKey: suggestionKey,
        items: () => [],
        command: () => null,
        render: () => ({}),
        allow: () => allowOpen,
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({ editor: this.editor, ...this.options.suggestion }),
      autoOpenCleanupPlugin({ char: CHAR, pluginKey: suggestionKey }),
    ]
  },
})

/**
 * Editors made by a test, torn down after it. `EditorView` leaves a pending
 * `DOMObserver.flush` timeout behind; left running, it fires once jsdom is gone
 * and throws `document is not defined` out of a test that has already passed.
 */
const openEditors: Editor[] = []
/** Host elements for the attached editors, removed with them. */
const openElements: HTMLElement[] = []

function makeEditor(content = '') {
  const editor = new Editor({
    extensions: [Document, Paragraph, Text, TestSuggester],
    content: content ? `<p>${content}</p>` : '<p></p>',
  })
  openEditors.push(editor)
  return editor
}

/**
 * A suggester built the real way, so the `openSuggestionMenu` command that
 * `createSuggestionExtension` registers is present. The bare `TestSuggester`
 * above wires the plugins by hand and deliberately has no command.
 */
function makeRealEditor(content = '') {
  const key = new PluginKey('realSuggestion')
  // Attached to the document: `isFocused` is `document.activeElement === view.dom`,
  // which can never be true for a detached element.
  const element = document.createElement('div')
  document.body.appendChild(element)
  const editor = new Editor({
    element,
    extensions: [
      Document,
      Paragraph,
      Text,
      Code,
      createSuggestionExtension({
        name: 'realSuggester',
        char: '@',
        pluginKey: key,
        items: () => [],
        command: () => {},
        component: { render: () => null },
      }),
    ],
    content: content ? `<p>${content}</p>` : '<p></p>',
  })
  openEditors.push(editor)
  openElements.push(element)
  return { editor, key }
}

/**
 * What the `openSuggestionMenu` command does once it has resolved the trigger
 * char. Drives the plugin tests below against the bare fixture, which has no
 * command of its own.
 */
function open(editor: Editor) {
  const tr = editor.state.tr
  insertSuggestionTrigger(tr, CHAR)
  editor.view.dispatch(tr)
}

const body = (editor: Editor) => editor.state.doc.textContent
const isOpen = (editor: Editor) =>
  (suggestionKey.getState(editor.state) as { active: boolean }).active
/** What `@tiptap/suggestion` dispatches on Escape. */
const dismiss = (editor: Editor) =>
  editor.view.dispatch(editor.state.tr.setMeta(suggestionKey, { exit: true }))
const caretTo = (editor: Editor, pos: number) =>
  editor.commands.setTextSelection(pos)

describe('openSuggestionMenu', () => {
  beforeEach(() => {
    allowOpen = true
  })

  afterEach(() => {
    while (openEditors.length) openEditors.pop()?.destroy()
    while (openElements.length) openElements.pop()?.remove()
  })

  it('inserts a bare trigger in an empty paragraph and takes it back on dismiss', () => {
    const editor = makeEditor()
    open(editor)
    // No padding space: `allowedPrefixes` also accepts an empty prefix.
    expect(body(editor)).toBe('/')
    expect(isOpen(editor)).toBe(true)

    dismiss(editor)
    expect(body(editor)).toBe('')
  })

  it('pads the trigger after a word and removes both chars on dismiss', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    open(editor)
    expect(body(editor)).toBe('hello /')
    expect(isOpen(editor)).toBe(true)

    dismiss(editor)
    expect(body(editor)).toBe('hello')
  })

  it('removes the whole query run, not just the trigger', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    open(editor)
    editor.commands.insertContent('head')
    expect(isOpen(editor)).toBe(true)

    dismiss(editor)
    // The query was menu input, never document text.
    expect(body(editor)).toBe('hello')
  })

  it('leaves a USER-typed trigger alone', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    // A trailing space in the initial HTML is dropped on parse, so type it.
    editor.commands.insertContent(` ${CHAR}`)
    expect(isOpen(editor)).toBe(true)

    dismiss(editor)
    expect(body(editor)).toBe('hello /')
  })

  it('leaves content inserted by a chosen command intact', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    open(editor)
    editor.commands.insertContent('h1')

    // What every slash command does: consume the trigger range, then act.
    const { range } = suggestionKey.getState(editor.state) as {
      range: { from: number; to: number }
    }
    editor.chain().deleteRange(range).insertContent('WORLD').run()

    expect(body(editor)).toBe('hello WORLD')
  })

  it('takes back the padding space when the command inserts nothing inline', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    open(editor)

    // A block command (Bullet list, Heading): it consumes the trigger range and
    // changes the block, leaving nothing where the padding space now dangles.
    const { range } = suggestionKey.getState(editor.state) as {
      range: { from: number; to: number }
    }
    editor.commands.deleteRange(range)

    expect(body(editor)).toBe('hello')
  })

  it('keeps the padding space when it still separates two words', () => {
    const editor = makeEditor('hello world')
    caretTo(editor, 6)
    open(editor)

    const { range } = suggestionKey.getState(editor.state) as {
      range: { from: number; to: number }
    }
    editor.chain().deleteRange(range).insertContent('X').run()

    // The space is doing the job a user-typed one would: without it the
    // insertion would glue onto "hello".
    expect(body(editor)).toBe('hello X world')
  })

  it('cleans up when the caret moves out of the trigger range', () => {
    const editor = makeEditor('hello world')
    caretTo(editor, 6)
    open(editor)
    expect(body(editor)).toBe('hello / world')

    caretTo(editor, 1)
    expect(body(editor)).toBe('hello world')
  })

  it('cleans up when a typed space kills the match', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    open(editor)
    editor.commands.insertContent(' x')
    expect(body(editor)).toBe('hello x')
  })

  it('takes the trigger back out when the suggester never opens', () => {
    // The safety net behind the command's own pre-check: whatever the reason a
    // menu does not open, the char typed to open it has no job left to do.
    allowOpen = false
    const editor = makeEditor('hello')
    caretTo(editor, 6)

    open(editor)
    expect(isOpen(editor)).toBe(false)
    expect(body(editor)).toBe('hello')
  })

  it('takes it back out in an empty paragraph too', () => {
    // Same path, unpadded: only the trigger char goes in, only it comes out.
    allowOpen = false
    const editor = makeEditor()

    open(editor)
    expect(body(editor)).toBe('')
  })
})

describe('the openSuggestionMenu command', () => {
  afterEach(() => {
    while (openEditors.length) openEditors.pop()?.destroy()
    while (openElements.length) openElements.pop()?.remove()
  })

  it('opens the named suggester', () => {
    // The wiring consumers actually use: there is no package export, so the
    // command registered by createSuggestionExtension is the whole surface.
    const { editor, key } = makeRealEditor()

    expect(editor.commands.openSuggestionMenu('realSuggester')).toBe(true)
    expect((key.getState(editor.state) as { active: boolean }).active).toBe(
      true,
    )
    expect(editor.state.doc.textContent).toBe('@')
  })

  it('returns false for a suggester that is not there', () => {
    const { editor } = makeRealEditor()
    expect(editor.commands.openSuggestionMenu('nope')).toBe(false)
    expect(editor.state.doc.textContent).toBe('')
  })

  it('returns false for an extension with no suggestion configured', () => {
    const { editor } = makeRealEditor()
    expect(editor.commands.openSuggestionMenu('paragraph')).toBe(false)
    expect(editor.state.doc.textContent).toBe('')
  })

  it('focuses the editor, so the menu gets the next keystroke', async () => {
    // A toolbar button has taken focus by the time this runs.
    const { editor } = makeRealEditor()
    editor.commands.blur()
    expect(editor.isFocused).toBe(false)

    editor.commands.openSuggestionMenu('realSuggester')
    // tiptap's focus() defers the DOM call to the next frame.
    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(editor.isFocused).toBe(true)
  })

  it('reads the caret against the pending doc, not the stale one', () => {
    // Chained after a command that already grew the doc: resolving the new
    // position against the old doc runs past its end and throws.
    const { editor, key } = makeRealEditor()

    expect(() =>
      editor
        .chain()
        .insertContent('a much longer line than the doc started with')
        .openSuggestionMenu('realSuggester')
        .run(),
    ).not.toThrow()
    expect((key.getState(editor.state) as { active: boolean }).active).toBe(
      true,
    )
  })

  it('refuses inside code without touching the document', () => {
    // Checked before inserting, so unlike the plugin's safety net there is no
    // insert-then-remove round trip to undo.
    const { editor } = makeRealEditor('hello')
    editor.commands.setTextSelection({ from: 1, to: 6 })
    editor.commands.setMark('code')
    editor.commands.setTextSelection(6)

    expect(editor.commands.openSuggestionMenu('realSuggester')).toBe(false)
    expect(editor.state.doc.textContent).toBe('hello')
  })
})
