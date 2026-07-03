import { marked } from 'marked'
import DOMPurify from 'dompurify'

export function markdownToHTML(text: string): string {
  // Use synchronous marked.parse
  const html = marked.parse(text, {
    gfm: true,
    breaks: true,
    async: false,
  }) as string
  // DOMPurify needs a DOM; without one (SSR/Node) it returns '' and drops all output.
  return typeof window === 'undefined' ? html : DOMPurify.sanitize(html)
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
