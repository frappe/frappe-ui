// Turns the rendered article into Markdown for "Copy page". Component pages
// are assembled from includes and live demos, so the rendered page is the
// only place the whole text exists at run time.

function inline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ''
  if (!(node instanceof HTMLElement)) return ''
  if (node.classList.contains('header-anchor')) return ''
  const inner = Array.from(node.childNodes).map(inline).join('')
  switch (node.tagName) {
    case 'CODE':
      return '`' + node.textContent + '`'
    case 'STRONG':
    case 'B':
      return `**${inner}**`
    case 'EM':
    case 'I':
      return `_${inner}_`
    case 'A':
      return `[${inner}](${(node as HTMLAnchorElement).href})`
    default:
      return inner
  }
}

// Nested lists keep their own markers, indented under the parent item.
function list(el: Element, depth = 0): string {
  const indent = '  '.repeat(depth)
  return Array.from(el.children)
    .map((li, i) => {
      const marker = el.tagName === 'OL' ? `${i + 1}.` : '-'
      const text = Array.from(li.childNodes)
        .filter(
          (n) => !(n instanceof HTMLElement && /^(UL|OL)$/.test(n.tagName)),
        )
        .map(inline)
        .join('')
        .trim()
      const children = Array.from(li.children)
        .filter((c) => /^(UL|OL)$/.test(c.tagName))
        .map((c) => '\n' + list(c, depth + 1))
        .join('')
      return `${indent}${marker} ${text}${children}`
    })
    .join('\n')
}

// A table cell must stay on one line, and its own `|` must not start a new
// column. A cell can hold several parts, such as a prop's type and its
// description, so keep them apart.
function cell(el: Element): string {
  const parts = el.children.length
    ? Array.from(el.children).map((c) => inline(c).trim())
    : [inline(el).trim()]
  return parts
    .filter(Boolean)
    .join(' — ')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\|/g, '\\|')
}

function block(el: Element): string {
  // Live demos and playground knobs are not content. The API tables also
  // render a phone-only copy of each row, which would repeat every description.
  if (el.matches('[data-demo-preview], .dot-grid, .sm\\:hidden')) return ''
  const tag = el.tagName
  if (/^H[1-4]$/.test(tag))
    return '#'.repeat(Number(tag[1])) + ' ' + inline(el).trim()
  if (tag === 'P') return inline(el).trim()
  if (tag === 'UL' || tag === 'OL') return list(el)
  const isCode =
    tag === 'PRE' || el.matches('[class*="language-"], .component-preview-code')
  if (isCode && el.querySelector('pre, code')) {
    const pre = tag === 'PRE' ? el : el.querySelector('pre')!
    const lang = el.className.match(/language-(\w+)/)?.[1] ?? 'vue'
    return '```' + lang + '\n' + (pre.textContent ?? '').trimEnd() + '\n```'
  }
  if (tag === 'TABLE') {
    const rows = Array.from(el.querySelectorAll('tr')).map(
      (tr) =>
        '| ' +
        Array.from(tr.children).map(cell).join(' | ') +
        ' |',
    )
    if (rows.length > 1) rows.splice(1, 0, rows[0].replace(/[^|]+/g, ' --- '))
    return rows.join('\n')
  }
  return Array.from(el.children).map(block).filter(Boolean).join('\n\n')
}

export function pageMarkdown(): string {
  const article = document.querySelector('main article')
  if (!article) return ''
  const body = Array.from(article.children)
    .map(block)
    .filter(Boolean)
    .join('\n\n')
  return `${body}\n\nSource: ${location.href}\n`
}
