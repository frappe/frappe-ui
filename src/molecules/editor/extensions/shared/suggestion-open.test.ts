/**
 * @vitest-environment jsdom
 *
 * Covers the "toolbar button opens the slash menu" path: the trigger char has
 * to be typed into the document for the suggester to match, so dismissing the
 * menu must take it back out again — while a trigger the USER typed stays put.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { Editor, Extension } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion from '@tiptap/suggestion'
import { autoOpenCleanupPlugin, openSuggestionMenu } from './suggestion-open'

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

function makeEditor(content = '') {
  return new Editor({
    extensions: [Document, Paragraph, Text, TestSuggester],
    content: content ? `<p>${content}</p>` : '<p></p>',
  })
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

  it('inserts a bare trigger in an empty paragraph and takes it back on dismiss', () => {
    const editor = makeEditor()
    openSuggestionMenu(editor, 'testSuggester')
    // No padding space: `allowedPrefixes` also accepts an empty prefix.
    expect(body(editor)).toBe('/')
    expect(isOpen(editor)).toBe(true)

    dismiss(editor)
    expect(body(editor)).toBe('')
  })

  it('pads the trigger after a word and removes both chars on dismiss', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    openSuggestionMenu(editor, 'testSuggester')
    expect(body(editor)).toBe('hello /')
    expect(isOpen(editor)).toBe(true)

    dismiss(editor)
    expect(body(editor)).toBe('hello')
  })

  it('removes the whole query run, not just the trigger', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    openSuggestionMenu(editor, 'testSuggester')
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
    openSuggestionMenu(editor, 'testSuggester')
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
    openSuggestionMenu(editor, 'testSuggester')

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
    openSuggestionMenu(editor, 'testSuggester')

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
    openSuggestionMenu(editor, 'testSuggester')
    expect(body(editor)).toBe('hello / world')

    caretTo(editor, 1)
    expect(body(editor)).toBe('hello world')
  })

  it('cleans up when a typed space kills the match', () => {
    const editor = makeEditor('hello')
    caretTo(editor, 6)
    openSuggestionMenu(editor, 'testSuggester')
    editor.commands.insertContent(' x')
    expect(body(editor)).toBe('hello x')
  })

  it('leaves nothing behind when the suggester refuses to open here', () => {
    // What `allow: !isInCode(...)` does for every real suggester: the caret is
    // in a code block, so the menu never opens and the trigger we typed to open
    // it has no job left to do.
    allowOpen = false
    const editor = makeEditor('hello')
    caretTo(editor, 6)

    expect(openSuggestionMenu(editor, 'testSuggester')).toBe(false)
    expect(isOpen(editor)).toBe(false)
    expect(body(editor)).toBe('hello')
  })

  it('leaves nothing behind when it refuses to open in an empty paragraph', () => {
    // Same path, unpadded: only the trigger char goes in, only it comes out.
    allowOpen = false
    const editor = makeEditor()

    expect(openSuggestionMenu(editor, 'testSuggester')).toBe(false)
    expect(body(editor)).toBe('')
  })

  it('returns false for an extension without a suggestion', () => {
    const editor = makeEditor()
    expect(openSuggestionMenu(editor, 'paragraph')).toBe(false)
    expect(openSuggestionMenu(editor, 'nope')).toBe(false)
  })
})
