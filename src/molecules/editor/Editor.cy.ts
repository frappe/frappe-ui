import './style.css'

import { defineComponent, h, ref } from 'vue'
import { EditorContent, RichTextKit, Editor } from './index'

function mountEditor(
  options: {
    extensions?: unknown[]
    content?: string
    topOffset?: number
    editable?: boolean
  } = {},
) {
  const value = ref(options.content ?? '<p></p>')
  const extensions = options.extensions ?? [RichTextKit]

  const TestHost = defineComponent({
    setup() {
      return () =>
        h(
          'div',
          {
            style: options.topOffset
              ? { marginTop: `${options.topOffset}px` }
              : undefined,
          },
          [
            h(
              Editor,
              {
                modelValue: value.value,
                'onUpdate:modelValue': (next: string) => {
                  value.value = next
                },
                extensions,
                editable: options.editable ?? true,
              },
              {
                default: ({ editor }: { editor: any }) => [
                  h(EditorContent, {
                    editor,
                    class:
                      'min-h-24 w-[520px] rounded border border-outline-gray-2 p-3',
                  }),
                ],
              },
            ),
          ],
        )
    },
  })

  cy.mount(TestHost)
  return value
}

describe('v1 editor browser behavior', () => {
  it('hides slash commands whose capabilities are unavailable', () => {
    mountEditor({
      extensions: [
        RichTextKit.configure({
          table: false,
          iframe: false,
          toc: false,
          taskList: false,
          image: false,
          video: false,
        }),
      ],
    })

    cy.get('.ProseMirror').click().type('/')

    cy.contains('button', 'Heading 2').should('be.visible')
    cy.contains('button', 'Table').should('not.exist')
    cy.contains('button', 'Embed').should('not.exist')
    cy.contains('button', 'Task List').should('not.exist')
    cy.contains('button', 'Image').should('not.exist')
    cy.contains('button', 'Video').should('not.exist')
  })

  it('renders editor content as the contenteditable root', () => {
    mountEditor()

    cy.get('[data-slot="editor-content"]')
      .should('have.attr', 'contenteditable', 'true')
      .and('have.class', 'ProseMirror')
      .find('[contenteditable="true"]')
      .should('not.exist')
  })

  it('shows the embed slash command when the iframe extension is loaded', () => {
    mountEditor()

    cy.get('.ProseMirror').click().type('/Emb')

    cy.contains('button', 'Embed').should('be.visible')
  })

  it('opens the link editor near the clicked link, not at the top of the document', () => {
    mountEditor({
      topOffset: 320,
      content: '<p><a href="https://example.com">Example link</a></p>',
    })

    cy.contains('.ProseMirror a', 'Example link').click()

    cy.contains('a', 'https://example.com')
      .should('be.visible')
      .then(($link) => {
        const top = $link[0].getBoundingClientRect().top
        expect(top).to.be.greaterThan(200)
      })
  })

  it('closes the link editor when clicking outside it', () => {
    mountEditor({
      content: '<p><a href="https://example.com">Example link</a> and text</p>',
    })

    cy.contains('.ProseMirror a', 'Example link').click()
    cy.contains('a', 'https://example.com').should('be.visible')

    cy.get('.ProseMirror').click('bottomRight', { force: true })

    cy.contains('a', 'https://example.com').should('not.exist')
  })

  it('opens the image viewer when a readonly image is clicked', () => {
    mountEditor({
      editable: false,
      content: '<p><img src="/files/example.png" alt="Example image"></p>',
    })

    cy.get('.ProseMirror img[alt="Example image"]').click()

    cy.get('body .fixed img[alt="Example image"]')
      .filter('[src$="/files/example.png"]')
      .should('be.visible')
  })
})
