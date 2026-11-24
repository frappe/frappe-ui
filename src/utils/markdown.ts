import DOMPurify from 'dompurify'
import { marked } from 'marked'

/**
 * Markdown as HTML that is safe to render with `v-html`: GitHub-flavoured,
 * with line breaks kept, and sanitized with DOMPurify.
 */
export function markdownToHTML(text: string): string {
  return DOMPurify.sanitize(markdownToRawHTML(text))
}

/**
 * Markdown as unsanitized HTML, for the editor's paste path, where the editor
 * schema keeps only the nodes it knows.
 */
export function markdownToRawHTML(text: string): string {
  return marked.parse(text, {
    gfm: true,
    breaks: true,
    async: false,
  }) as string
}

export function detectMarkdown(text: string): boolean {
  const lines = text.split('\n')
  const markdown = lines.filter(
    (line) =>
      // check for inline markdown content like images, links, italic, bold, etc.
      /!\[.*\]\(.*\)/.test(line) ||
      /\[.*\]\(.*\)/.test(line) ||
      /(^|\s)\*.*\*(\s|$)/.test(line) ||
      /(^|\s)_.*_(\s|$)/.test(line) ||
      /(^|\s)\*\*.*\*\*(\s|$)/.test(line) ||
      /(^|\s)__.*__(\s|$)/.test(line) ||
      /(^|\s)~~.*~~(\s|$)/.test(line) ||
      // check for block markdown content like headings, code blocks, lists, etc.
      line.startsWith('![') ||
      line.startsWith('#') ||
      line.startsWith('> ') ||
      line.startsWith('*') ||
      line.startsWith('- ') ||
      line.startsWith('1. ') ||
      line.startsWith('```') ||
      line.startsWith('`') ||
      line.startsWith('[') ||
      line.startsWith('---'),
  )
  return markdown.length > 0
}
