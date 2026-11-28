/**
 * @vitest-environment jsdom
 *
 * Sanitization is checked against the real DOMPurify, which needs a DOM.
 */

import { describe, expect, it } from 'vitest'
import { markdownToHTML, markdownToRawHTML } from './markdown'

describe('markdownToHTML', () => {
  it('renders GitHub-flavoured markdown and keeps line breaks', () => {
    const html = markdownToHTML(
      '**Deals**\nin review\n\n| Deal | Stage |\n| --- | --- |\n| Acme | Won |',
    )
    expect(html).toContain('<strong>Deals</strong><br>in review')
    expect(html).toContain('<table>')
    expect(html).toContain('<td>Acme</td>')
  })

  it('keeps links but drops scripts, event handlers and javascript: URLs', () => {
    const html = markdownToHTML(
      '[docs](https://frappe.io) [bad](javascript:alert(1))\n\n<script>alert(1)</script><img src=x onerror="alert(1)">',
    )
    expect(html).toContain('<a href="https://frappe.io">docs</a>')
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
  })
})

describe('markdownToRawHTML', () => {
  it('leaves the HTML unsanitized for the editor to filter', () => {
    expect(markdownToRawHTML('<img src=x onerror="alert(1)">')).toContain(
      'onerror',
    )
  })
})
