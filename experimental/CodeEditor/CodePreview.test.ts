/**
 * @vitest-environment jsdom
 *
 * CodePreview is the sanitize-before-render half of the pair, pure enough to
 * mount in jsdom. The CodeEditor writer lazy-loads CodeMirror and measures
 * layout on mount (which jsdom can't render), so its behaviour is covered in
 * CodeEditor.cy.ts instead.
 */
import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import CodePreview from './CodePreview.vue'

describe('CodePreview', () => {
  it('renders sanitized markdown', () => {
    const host = document.createElement('div')
    const app = createApp(CodePreview, {
      modelValue: '# Title',
      language: 'markdown',
    })
    app.mount(host)
    expect(host.innerHTML).toContain('<h1')
    expect(host.textContent).toContain('Title')
    app.unmount()
  })

  it('renders sanitized html', () => {
    const host = document.createElement('div')
    const app = createApp(CodePreview, {
      modelValue: '<p>hi</p><script>alert(1)</script>',
      language: 'html',
    })
    app.mount(host)
    expect(host.innerHTML).toContain('<p>hi</p>')
    // The script tag is stripped by DOMPurify.
    expect(host.innerHTML).not.toContain('alert(1)')
    app.unmount()
  })

  it('renders nothing for non-preview languages', () => {
    const host = document.createElement('div')
    const app = createApp(CodePreview, {
      modelValue: 'const a = 1;',
      language: 'javascript',
    })
    app.mount(host)
    expect(host.textContent).toBe('')
    app.unmount()
  })
})
