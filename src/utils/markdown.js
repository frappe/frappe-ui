import showdown from 'showdown'

export function markdownToHTML(text) {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

export function htmlToMarkdown(text) {
  const converter = new showdown.Converter()
  return converter.makeMarkdown(text)
}

export function detectMarkdown(text) {
  const lines = text.split('\n')
  const markdown = lines.filter(
    (line) =>
      line.startsWith('![') ||
      line.startsWith('#') ||
      line.startsWith('> ') ||
      line.startsWith('*') ||
      line.startsWith('- ') ||
      line.startsWith('1. ') ||
      line.startsWith('```') ||
      line.startsWith('`') ||
      line.startsWith('[') ||
      line.startsWith('---')
  )
  return markdown.length > 0
}
