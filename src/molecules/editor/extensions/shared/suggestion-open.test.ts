/**
 * @vitest-environment jsdom
 *
 * Covers the "toolbar button opens the slash menu" path: the trigger char has
 * to be typed into the document for the suggester to match, so dismissing the
 * menu must take it back out again — while a trigger the USER typed stays put.
 */
import { describe, it, expect } from 'vitest'
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
    const editor = makeEditor('hello ')
    caretTo(editor, 7)
    editor.commands.insertContent(CHAR)
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

  it('returns false for an extension without a suggestion', () => {
    const editor = makeEditor()
    expect(openSuggestionMenu(editor, 'paragraph')).toBe(false)
    expect(openSuggestionMenu(editor, 'nope')).toBe(false)
  })
})
