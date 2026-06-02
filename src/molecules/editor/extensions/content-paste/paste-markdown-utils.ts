/**
 * Markdown-from-plaintext paste helper.
 *
 * Wraps `#utils/markdown` so the extension can stay declarative: detect whether
 * a pasted plaintext string looks like markdown and, if so, render it to a
 * ProseMirror {@link Slice}. Returns `null` when the text is not markdown.
 */
import type { Schema, Slice } from '@tiptap/pm/model'
import { detectMarkdown, markdownToHTML } from '#utils/markdown'
import { parseHtmlToSlice } from './paste-html-utils'

/**
 * If `text` looks like markdown, render it to HTML and parse into a slice
 * against `schema`. Returns `null` when the text is plain (not markdown).
 */
export function tryMarkdownSlice(text: string, schema: Schema): Slice | null {
  if (!text || !detectMarkdown(text)) return null
  const html = markdownToHTML(text)
  return parseHtmlToSlice(html, schema)
}
