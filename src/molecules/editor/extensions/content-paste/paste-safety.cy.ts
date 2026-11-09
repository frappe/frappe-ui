/**
 * Pasted content comes from any page the user copied from. Its event
 * handlers must never run, on either paste path: HTML (`text/html`) and
 * markdown-looking plain text (`text/plain`), which is rendered to HTML first.
 *
 * This runs in a real browser on purpose: jsdom never fires `onerror` or
 * `ontoggle`, so it cannot tell a live-document parse from an inert one.
 */
import '../../style.css'

import { defineComponent, h, ref } from 'vue'
import { Editor, EditorContent, RichTextKit } from '../../index'

type Hits = string[]

declare global {
  interface Window {
    __pasteHits?: Hits
    __pasteHit?: (id: string) => void
  }
}

const HTML_PASTES: Record<string, string> = {
  'img onerror': `<p>pasted html</p><img src="x:" onerror="__pasteHit('img')">`,
  'details ontoggle': `<p>pasted html</p><details open ontoggle="__pasteHit('details')"><summary>s</summary></details>`,
  'video source onerror': `<p>pasted html</p><video><source src="x:" onerror="__pasteHit('video')"></video>`,
}

const MARKDOWN_PASTE = `# pasted markdown\n\n<img src="x:" onerror="__pasteHit('markdown')">`

function mountEditor() {
  const value = ref('<p></p>')
  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Editor,
          {
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next),
            extensions: [RichTextKit],
          },
          {
            default: ({ editor }: { editor: unknown }) => [
              h(EditorContent, { editor, class: 'min-h-24 w-[520px] p-3' }),
            ],
          },
        )
    },
  })
  cy.mount(Host)
}

function paste(data: Record<string, string>) {
  cy.get('.ProseMirror').then(($el) => {
    const clipboardData = new DataTransfer()
    for (const [type, value] of Object.entries(data)) {
      clipboardData.setData(type, value)
    }
    $el[0].dispatchEvent(
      new ClipboardEvent('paste', {
        clipboardData,
        bubbles: true,
        cancelable: true,
      }),
    )
  })
}

function expectNoHandlerRan() {
  // Error and toggle events fire asynchronously, so give them time to land.
  cy.wait(500)
  cy.window().its('__pasteHits').should('deep.equal', [])
}

describe('editor paste', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.__pasteHits = []
      win.__pasteHit = (id) => win.__pasteHits!.push(id)
    })
    mountEditor()
  })

  for (const [name, html] of Object.entries(HTML_PASTES)) {
    it(`does not run handlers in pasted HTML (${name})`, () => {
      paste({ 'text/html': html, 'text/plain': 'pasted html' })
      cy.get('.ProseMirror').should('contain.text', 'pasted html')
      expectNoHandlerRan()
    })
  }

  it('does not run handlers in pasted markdown', () => {
    paste({ 'text/plain': MARKDOWN_PASTE })
    cy.get('.ProseMirror h1').should('contain.text', 'pasted markdown')
    expectNoHandlerRan()
  })
})
