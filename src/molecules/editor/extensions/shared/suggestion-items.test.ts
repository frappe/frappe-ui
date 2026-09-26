/**
 * @vitest-environment jsdom
 *
 * Mention and tag items are `{ label, value }`. The list passes each matched
 * item through untouched, so the item slot receives the caller's own object
 * with whatever extra fields it carries.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Mention, Tag } from '../../extensions'
import type { MentionSuggestionItem, TagSuggestionItem } from '../../extensions'

const openEditors: Editor[] = []

function makeEditor(extension: unknown) {
  const editor = new Editor({
    extensions: [Document, Paragraph, Text, extension as never],
    element: null as unknown as HTMLElement,
    content: '<p></p>',
  })
  openEditors.push(editor)
  return editor
}

function suggester(editor: Editor, name: string) {
  const extension = editor.extensionManager.extensions.find(
    (e) => e.name === name,
  )
  if (!extension) throw new Error(`no ${name} extension`)
  return extension.options.suggestion as {
    items: (props: { query: string; editor: Editor }) => unknown[]
    command: (props: {
      editor: Editor
      range: { from: number; to: number }
      props: unknown
    }) => void
  }
}

function currentRange(editor: Editor) {
  const { from } = editor.state.selection
  return { from, to: from }
}

afterEach(() => {
  while (openEditors.length) openEditors.pop()?.destroy()
})

describe('mention items', () => {
  const jane: MentionSuggestionItem & { avatar: string } = {
    label: 'Jane Doe',
    value: 'jane@example.com',
    avatar: '/files/jane.png',
  }

  it('hands the caller item to the list, extra fields and all', () => {
    const editor = makeEditor(Mention.configure({ items: [jane] }))
    const [item] = suggester(editor, 'mentionSuggestion').items({
      query: 'jane',
      editor,
    })
    // Identity, not a copy: the item slot sees the object the app supplied.
    expect(item).toBe(jane)
  })

  it('stores `value` as the mention id and `label` as its text', () => {
    const editor = makeEditor(Mention.configure({ items: [jane] }))
    const mentionSuggester = suggester(editor, 'mentionSuggestion')
    mentionSuggester.command({
      editor,
      range: currentRange(editor),
      props: jane,
    })

    const html = editor.getHTML()
    expect(html).toContain('data-id="jane@example.com"')
    expect(html).toContain('data-label="Jane Doe"')
  })

  it('returns `{ label, value }` from getMentions', () => {
    const editor = makeEditor(Mention.configure({ items: [jane] }))
    suggester(editor, 'mentionSuggestion').command({
      editor,
      range: currentRange(editor),
      props: jane,
    })

    // `getMentions` is a data-query command, so it is registered through a
    // cast and is not in tiptap's `Commands` interface.
    const getMentions = (
      editor.commands as unknown as {
        getMentions: () => MentionSuggestionItem[]
      }
    ).getMentions
    expect(getMentions()).toEqual([
      { label: 'Jane Doe', value: 'jane@example.com' },
    ])
  })
})

describe('tag items', () => {
  const design: TagSuggestionItem & { color: string } = {
    label: 'design',
    value: 'TAG-0001',
    color: 'blue',
  }

  it('hands the caller item to the list, extra fields and all', () => {
    const editor = makeEditor(Tag.configure({ items: [design] }))
    const [item] = suggester(editor, 'tagSuggestion').items({
      query: 'des',
      editor,
    })
    expect(item).toBe(design)
  })

  it('stores `value` as the tag id', () => {
    const editor = makeEditor(Tag.configure({ items: [design] }))
    suggester(editor, 'tagSuggestion').command({
      editor,
      range: currentRange(editor),
      props: design,
    })

    const html = editor.getHTML()
    expect(html).toContain('data-tag-id="TAG-0001"')
    expect(html).toContain('data-tag-label="design"')
  })

  it('offers a new tag for an unmatched query and inserts it without an id', () => {
    const editor = makeEditor(Tag.configure({ items: [design] }))
    const tagSuggester = suggester(editor, 'tagSuggestion')
    const items = tagSuggester.items({ query: 'launch', editor })
    expect(items).toHaveLength(1)

    tagSuggester.command({
      editor,
      range: currentRange(editor),
      props: items[0],
    })

    const html = editor.getHTML()
    expect(html).toContain('data-tag-label="launch"')
    expect(html).not.toContain('data-tag-id')
  })
})
