/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import CodeEditor from '../CodeEditor.vue'
import CodePreview from '../CodePreview.vue'

describe('CodeEditor module', () => {
  // The writer lazy-loads CodeMirror in `onMounted` and CodeMirror measures
  // layout on mount, which a headless DOM (jsdom) can't render — so we only
  // assert the component imports cleanly as a valid SFC, not mount/measure.
  it('CodeEditor imports as a valid component', () => {
    expect(CodeEditor).toBeTypeOf('object')
  })

  it('CodePreview renders sanitized markdown', () => {
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

  it('CodePreview renders sanitized html', () => {
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

  it('CodePreview renders nothing for non-preview languages', () => {
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
