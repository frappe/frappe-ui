/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest'
import { Editor, getSchema, resolveExtensions, Mark } from '@tiptap/core'
import type { AnyExtension } from '@tiptap/core'
import { ref } from 'vue'
import { CommentKit, RichTextKit, InlineKit } from './kits'
import { StarterKit, Mention, Tag, Link, Code, CodeBlock } from './extensions'
import type { CommandItem } from './extensions'

function schemaOf(...extensions: AnyExtension[]) {
  const schema = getSchema(extensions)
  return {
    marks: new Set(Object.keys(schema.marks)),
    nodes: new Set(Object.keys(schema.nodes)),
    topNode: schema.topNodeType.name,
  }
}

function extensionNames(extension: AnyExtension) {
  return new Set(resolveExtensions([extension]).map((e) => e.name))
}

/**
 * Run the slash suggester's `items` against a live editor built from the kit.
 * A real editor is needed because each command's `isAvailable` tests the
 * loaded schema.
 */
function slashItems(kit: AnyExtension, query: string): CommandItem[] {
  const editor = new Editor({
    extensions: [kit],
    element: null as unknown as HTMLElement,
  })
  try {
    const slash = editor.extensionManager.extensions.find(
      (e) => e.name === 'slashCommands',
    )
    return slash?.options.suggestion.items({ query, editor }) ?? []
  } finally {
    editor.destroy()
  }
}

describe('editor kits', () => {
  it('StarterKit provides the text-editing base', () => {
    const { marks, nodes } = schemaOf(StarterKit)
    expect(nodes.has('paragraph')).toBe(true)
    expect(nodes.has('heading')).toBe(true)
    expect(marks.has('bold')).toBe(true)
    expect(marks.has('italic')).toBe(true)
    expect(marks.has('link')).toBe(false)
    expect(marks.has('code')).toBe(false)
    expect(nodes.has('codeBlock')).toBe(false)
  })

  it('StarterKit composes with frappe-ui replacements without duplicate stock extensions', () => {
    expect(() => schemaOf(StarterKit, Link, Code, CodeBlock)).not.toThrow()
    const { marks, nodes } = schemaOf(StarterKit, Link, Code, CodeBlock)
    expect(marks.has('link')).toBe(true)
    expect(marks.has('code')).toBe(true)
    expect(nodes.has('codeBlock')).toBe(true)
  })

  it('CommentKit bundles comment-grade members and excludes table/toc/slash', () => {
    const { marks, nodes } = schemaOf(CommentKit)
    expect(nodes.has('paragraph')).toBe(true)
    expect(nodes.has('heading')).toBe(true)
    expect(nodes.has('image')).toBe(true)
    expect(nodes.has('attachment')).toBe(true)
    expect(nodes.has('mention')).toBe(true)
    expect(nodes.has('tagItem')).toBe(true)
    expect(marks.has('link')).toBe(true)
    // Tree-shaking boundary: comment editing never pulls these in.
    expect(nodes.has('table')).toBe(false)

    const names = extensionNames(CommentKit)
    expect(names.has('imageViewer')).toBe(true)
    expect(names.has('mediaDrop')).toBe(true)
    expect(names.has('table')).toBe(false)
    expect(names.has('tableOfContents')).toBe(false)
    expect(names.has('slashCommands')).toBe(false)
  })

  it('drops the attachment node when removed with `false`', () => {
    expect(schemaOf(CommentKit).nodes.has('attachment')).toBe(true)
    const { nodes } = schemaOf(CommentKit.configure({ attachment: false }))
    expect(nodes.has('attachment')).toBe(false)
    expect(nodes.has('image')).toBe(true) // others remain
  })

  it('RichTextKit adds tables, task lists, color, and slash commands', () => {
    const { marks, nodes } = schemaOf(RichTextKit)
    expect(nodes.has('table')).toBe(true)
    expect(nodes.has('taskList')).toBe(true)
    expect(nodes.has('taskItem')).toBe(true)
    expect(marks.has('textStyle')).toBe(true) // registered alongside Color
    // Named highlight: the frappe Highlight extension's mark is `namedHighlight`
    // (stores a palette name, not raw hex), replacing stock `highlight`.
    expect(marks.has('namedHighlight')).toBe(true)

    const names = extensionNames(RichTextKit)
    expect(names.has('slashCommands')).toBe(true)
    // Named color: the frappe Color extension is `namedColor`, not stock `color`.
    expect(names.has('namedColor')).toBe(true)
    expect(names.has('textAlign')).toBe(true)
  })

  it('leaves StyleClipboard and Toc out until they are asked for', () => {
    const stock = extensionNames(RichTextKit)
    expect(stock.has('styleClipboard')).toBe(false)
    expect(stock.has('tocNode')).toBe(false)
    // ImageViewer is the exception: it stays on.
    expect(stock.has('imageViewer')).toBe(true)

    const opted = extensionNames(
      RichTextKit.configure({ styleClipboard: {}, toc: {} }),
    )
    expect(opted.has('styleClipboard')).toBe(true)
    expect(opted.has('tocNode')).toBe(true)
  })

  it('removes a member with `false`', () => {
    const { nodes } = schemaOf(CommentKit.configure({ mention: false }))
    expect(nodes.has('mention')).toBe(false)
    expect(nodes.has('image')).toBe(true) // others remain

    const { nodes: noTable } = schemaOf(RichTextKit.configure({ table: false }))
    expect(noTable.has('table')).toBe(false)
  })

  it('drops ImageGroup when Image is removed (it depends on the image node)', () => {
    const { nodes } = schemaOf(CommentKit.configure({ image: false }))
    expect(nodes.has('image')).toBe(false)
    expect(nodes.has('imageGroup')).toBe(false)
  })

  it('configures a member without throwing (heading levels)', () => {
    expect(() =>
      schemaOf(RichTextKit.configure({ heading: { levels: [2, 3, 4] } })),
    ).not.toThrow()
    const { nodes } = schemaOf(
      RichTextKit.configure({ heading: { levels: [2, 3, 4] } }),
    )
    expect(nodes.has('heading')).toBe(true)
  })

  it('keeps data-driven members inert until given items', () => {
    // Mention: node always present; `@` suggestion only when items configured.
    expect(extensionNames(Mention.configure({})).has('mentionSuggestion')).toBe(
      false,
    )
    expect(
      extensionNames(Mention.configure({ items: [] })).has('mentionSuggestion'),
    ).toBe(true)

    // Tag: node always present; `#` suggestion only when items configured.
    expect(extensionNames(Tag.configure({})).has('tagSuggestion')).toBe(false)
    expect(
      extensionNames(Tag.configure({ items: [] })).has('tagSuggestion'),
    ).toBe(true)

    // The tag node renders existing tags regardless (StarterKit supplies the doc).
    expect(schemaOf(StarterKit, Tag.configure({})).nodes.has('tagItem')).toBe(
      true,
    )
  })

  it('swaps a kit member for a custom one without duplicate-name errors', () => {
    const CustomLink = Mark.create({ name: 'link' })
    expect(() =>
      schemaOf(CommentKit.configure({ link: false }), CustomLink),
    ).not.toThrow()
    const { marks } = schemaOf(
      CommentKit.configure({ link: false }),
      CustomLink,
    )
    expect(marks.has('link')).toBe(true)
  })

  it('keeps the built-in slash menu for `{}` and replaces it for `{ items }`', () => {
    const builtIn = slashItems(RichTextKit, '')
    expect(builtIn.length).toBeGreaterThan(1)

    const items = [
      {
        title: 'Only one',
        icon: '',
        command: () => {},
      },
    ]
    const replaced = slashItems(
      RichTextKit.configure({ slashCommands: { items } }),
      '',
    )
    expect(replaced.map((item) => item.title)).toEqual(['Only one'])
  })

  it('reads a reactive slash-command list on every open', () => {
    const items = ref([{ title: 'First', icon: '', command: () => {} }])
    const kit = RichTextKit.configure({ slashCommands: { items } })
    expect(slashItems(kit, '').map((item) => item.title)).toEqual(['First'])

    items.value = [{ title: 'Second', icon: '', command: () => {} }]
    expect(slashItems(kit, '').map((item) => item.title)).toEqual(['Second'])
  })

  it('InlineKit produces single-line rich text (marks + link, no block tools)', () => {
    const { marks, nodes, topNode } = schemaOf(InlineKit)
    expect(topNode).toBe('doc')
    expect(nodes.has('paragraph')).toBe(true)
    expect(marks.has('bold')).toBe(true)
    expect(marks.has('italic')).toBe(true)
    expect(marks.has('link')).toBe(true)
    // No block-level affordances.
    expect(nodes.has('heading')).toBe(false)
    expect(nodes.has('bulletList')).toBe(false)
    expect(nodes.has('blockquote')).toBe(false)
  })
})
