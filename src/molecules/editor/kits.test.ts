/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest'
import { getSchema, resolveExtensions, Mark } from '@tiptap/core'
import type { AnyExtension } from '@tiptap/core'
import { CommentKit, RichTextKit, InlineKit } from './kits'
import { StarterKit, Mention, Tag } from './extensions'

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

describe('editor kits', () => {
  it('StarterKit provides the text-editing base', () => {
    const { marks, nodes } = schemaOf(StarterKit)
    expect(nodes.has('paragraph')).toBe(true)
    expect(nodes.has('heading')).toBe(true)
    expect(marks.has('bold')).toBe(true)
    expect(marks.has('italic')).toBe(true)
  })

  it('CommentKit bundles comment-grade members and excludes table/toc/slash', () => {
    const { marks, nodes } = schemaOf(CommentKit)
    expect(nodes.has('paragraph')).toBe(true)
    expect(nodes.has('heading')).toBe(true)
    expect(nodes.has('image')).toBe(true)
    expect(nodes.has('mention')).toBe(true)
    expect(nodes.has('tagItem')).toBe(true)
    expect(marks.has('link')).toBe(true)
    // Tree-shaking boundary: comment editing never pulls these in.
    expect(nodes.has('table')).toBe(false)

    const names = extensionNames(CommentKit)
    expect(names.has('imageViewer')).toBe(true)
    expect(names.has('table')).toBe(false)
    expect(names.has('tableOfContents')).toBe(false)
    expect(names.has('slashCommands')).toBe(false)
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
    expect(names.has('styleClipboard')).toBe(true)
  })

  it('drops StyleClipboard when removed with `false`', () => {
    expect(extensionNames(RichTextKit).has('styleClipboard')).toBe(true)
    expect(
      extensionNames(RichTextKit.configure({ styleClipboard: false })).has(
        'styleClipboard',
      ),
    ).toBe(false)
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
