import './style.css'

import type { EditorView } from '@codemirror/view'
import { defineComponent, h, ref, type Ref } from 'vue'
import { CodeEditor, CodeEditorContent, CodeKit, useCodeEditor } from './index'

const CONTENT = '[data-slot="code-editor-content"]'

/**
 * Mounts `<CodeEditor>` with the content part in its slot, plus a button to
 * click when a test needs the editor blurred by something that is not the
 * editor. `change` and `overflow` are aliased spies.
 */
function mountCodeEditor(
  options: {
    content?: string
    editable?: boolean
    contentClass?: string
    maxHeight?: string
  } = {},
) {
  const value = ref(options.content ?? '')
  const onChange = cy.spy().as('change')
  const onOverflow = cy.spy().as('overflow')

  const TestHost = defineComponent({
    setup() {
      return () =>
        h('div', { class: 'w-[420px] p-4' }, [
          h(
            CodeEditor,
            {
              modelValue: value.value,
              'onUpdate:modelValue': (next: string) => {
                value.value = next
              },
              extensions: [CodeKit],
              editable: options.editable ?? true,
              onChange,
            },
            {
              default: () => [
                h(CodeEditorContent, {
                  class: options.contentClass,
                  style: options.maxHeight
                    ? { '--code-max-height': options.maxHeight }
                    : undefined,
                  onOverflow,
                }),
              ],
            },
          ),
          h('button', { type: 'button' }, 'outside'),
        ])
    },
  })

  cy.mount(TestHost)
  return value
}

/**
 * Presses a key on the editor's contenteditable and reports whether the
 * default was cancelled.
 *
 * `cy.type()` has never supported `{tab}` (cypress-io/cypress#299), and the
 * `defaultPrevented` flag is the assertion that matters anyway: a Tab the
 * editor consumes is a Tab the browser does not turn into a focus move.
 */
function press(key: string, init: KeyboardEventInit = {}) {
  return cy.get('.cm-content').then(($el) => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...init,
    })
    $el[0].dispatchEvent(event)
    return event.defaultPrevented
  })
}

describe('code editor browser behavior', () => {
  // `<CodeEditorContent>` writes `--_code-text-height` and toggles a class from
  // inside its own ResizeObserver callback. It skips a write that changes
  // nothing, but a real resize still writes, and Chrome then reports
  // "ResizeObserver loop completed with undelivered notifications". It is a
  // notification, not a thrown error: the overflow signal below is asserted in
  // full. Cypress fails a test on any uncaught exception, so this one message is
  // let through, and nothing else.
  Cypress.on('uncaught:exception', (error) =>
    error.message.includes('ResizeObserver loop') ? false : undefined,
  )

  it('updates the model on every keystroke and commits once on blur', () => {
    const value = mountCodeEditor()

    cy.get('.cm-content').click().type('SELECT')
    // `update:modelValue` is the live channel: it fires on every doc change.
    cy.then(() => expect(value.value).to.eq('SELECT'))
    cy.get('@change').should('not.have.been.called')

    cy.get('.cm-content').type(' 1')
    cy.then(() => expect(value.value).to.eq('SELECT 1'))

    // `change` is the commit point, and it carries the committed value.
    cy.get('button').click()
    cy.get('@change').should('have.been.calledOnce')
    cy.get('@change').should('have.been.calledWith', 'SELECT 1')
  })

  it('emits no commit when the user focuses and leaves without typing', () => {
    mountCodeEditor({ content: 'SELECT 1' })

    cy.get('.cm-content').click()
    cy.get('button').click()
    cy.get('@change').should('not.have.been.called')

    // An edit behind the blur is what makes it a commit.
    cy.get('.cm-content').click().type('0')
    cy.get('button').click()
    cy.get('@change').should('have.been.calledOnce')
  })

  it('signals overflow across the height cap, and only on the transitions', () => {
    mountCodeEditor({ maxHeight: '80px' })

    cy.get(CONTENT).should('not.have.attr', 'data-overflowing')

    cy.get('.cm-content')
      .click()
      .type('1{enter}2{enter}3{enter}4{enter}5{enter}6{enter}7{enter}8')

    cy.get(CONTENT).should('have.attr', 'data-overflowing', 'true')
    cy.get('@overflow').should('have.been.calledWith', true)

    cy.get('.cm-content').type('{selectall}{backspace}')

    cy.get(CONTENT).should('not.have.attr', 'data-overflowing')
    cy.get('@overflow').should('have.been.calledWith', false)
    // Two crossings, two emits: every keystroke in between changed the height
    // without changing the answer.
    cy.get('@overflow').should('have.callCount', 2)
  })

  it('caps the box from a class as well as from --code-max-height', () => {
    // The recommended field pattern swaps `max-h-*` classes to expand, so the
    // package's own layout rule must never outrank one. It is written at zero
    // specificity for exactly this.
    mountCodeEditor({ contentClass: 'max-h-[80px]' })

    cy.get(CONTENT).should('not.have.attr', 'data-overflowing')
    cy.get('.cm-content')
      .click()
      .type('1{enter}2{enter}3{enter}4{enter}5{enter}6{enter}7{enter}8')

    cy.get(CONTENT).should('have.css', 'max-height', '80px')
    cy.get(CONTENT).should('have.attr', 'data-overflowing', 'true')
    cy.get('@overflow').should('have.been.calledWith', true)
  })

  it('indents with Tab and dedents with Shift-Tab instead of moving focus', () => {
    const value = mountCodeEditor({ content: 'SELECT 1' })

    cy.get('.cm-content').click()
    press('Tab', { keyCode: 9, which: 9 }).should('eq', true)
    cy.then(() => expect(value.value).to.eq('  SELECT 1'))
    cy.focused().should('have.class', 'cm-content')

    press('Tab', { keyCode: 9, which: 9, shiftKey: true }).should('eq', true)
    cy.then(() => expect(value.value).to.eq('SELECT 1'))
    cy.focused().should('have.class', 'cm-content')
  })

  it('blurs the editor on Escape, the WCAG 2.1.2 way out', () => {
    mountCodeEditor({ content: 'SELECT 1' })

    cy.get('.cm-content').click()
    cy.get('.cm-editor').should('have.class', 'cm-focused')

    // Without this a keyboard user who tabbed in could never tab out, because
    // Tab now indents.
    cy.get('.cm-content').type('{esc}')

    cy.get('.cm-editor').should('not.have.class', 'cm-focused')
    cy.focused().should('not.exist')
  })

  it('closes the search panel on Escape before it blurs', () => {
    // `searchKeymap` binds Escape in the `editor` scope as well as
    // `search-panel`, and the frappe keymap sits above it at `Prec.high`. An
    // unconditional blur would leave the panel open, drop focus, and fire the
    // blur commit on the way out.
    mountCodeEditor({ content: 'SELECT 1' })

    cy.get('.cm-content').click()
    press('f', { keyCode: 70, which: 70, ctrlKey: true }).should('eq', true)
    cy.get('.cm-search').should('exist')

    // Escape from the code, not from the panel: the panel's own field runs in
    // the `search-panel` scope, where this binding is absent.
    cy.get('.cm-content').click().type('{esc}')

    cy.get('.cm-search').should('not.exist')
    cy.get('.cm-editor').should('have.class', 'cm-focused')
    cy.get('@change').should('not.have.been.called')

    // The next one is the WCAG exit again.
    cy.get('.cm-content').type('{esc}')
    cy.get('.cm-editor').should('not.have.class', 'cm-focused')
  })

  it('hands a template ref the view itself, not a ref to it', () => {
    // Vue unwraps a handed-back ref at the proxy boundary. The exposed type
    // says so, and this is the runtime half: `.editor` is the view, and
    // `.editor.value` does not exist.
    let exposed!: { editor: EditorView | null }

    const TestHost = defineComponent({
      setup() {
        const editorRef = ref<{ editor: EditorView | null } | null>(null)
        return () => {
          exposed = editorRef.value as { editor: EditorView | null }
          return h('div', { class: 'w-[420px] p-4' }, [
            h(
              CodeEditor,
              { ref: editorRef, modelValue: 'SELECT 1', extensions: [CodeKit] },
              { default: () => [h(CodeEditorContent)] },
            ),
          ])
        }
      },
    })

    cy.mount(TestHost)

    cy.get('.cm-content').should('contain.text', 'SELECT 1')
    cy.then(() => {
      expect(exposed.editor).to.have.property('state')
      expect(exposed.editor!.state.doc.toString()).to.eq('SELECT 1')
      // The documented call. On the old shape this reached `undefined` and the
      // optional chain swallowed it.
      exposed.editor!.focus()
    })
    cy.get('.cm-editor').should('have.class', 'cm-focused')
  })

  it('falls `class` through to the content part root', () => {
    mountCodeEditor({ contentClass: 'min-h-40 rounded-md' })

    cy.get(CONTENT)
      .should('have.class', 'min-h-40')
      .and('have.class', 'rounded-md')
      // The box is the part's own root, and the view lives inside it.
      .find('.cm-editor')
      .should('exist')
  })

  it('renders a non-editable view with `editable: false`', () => {
    mountCodeEditor({ content: 'SELECT 1', editable: false })

    cy.get('.cm-content')
      .should('have.attr', 'contenteditable', 'false')
      .and('contain.text', 'SELECT 1')
  })

  it('drives the content part straight from useCodeEditor, with no wrapper', () => {
    // The L4 path: the composable plus the part, and no `<CodeEditor>` in
    // sight. This is what the optional `editor` prop exists for.
    let content!: Ref<string>

    const TestHost = defineComponent({
      setup() {
        content = ref('SELECT 1')
        const editor = useCodeEditor({
          content,
          extensions: [CodeKit],
        })
        return () =>
          h('div', { class: 'w-[420px] p-4' }, [
            h(CodeEditorContent, { editor: editor.value, class: 'min-h-20' }),
          ])
      },
    })

    cy.mount(TestHost)

    cy.get(CONTENT).find('.cm-content').should('contain.text', 'SELECT 1')
    cy.get('.cm-content').click().type(' WHERE x')
    cy.then(() => expect(content.value).to.eq('SELECT 1 WHERE x'))
  })

  it('lets an explicit `:editor="null"` beat the injected view', () => {
    const TestHost = defineComponent({
      setup() {
        return () =>
          h('div', { class: 'w-[420px] p-4' }, [
            h(
              CodeEditor,
              { modelValue: 'SELECT 1', extensions: [CodeKit] },
              {
                default: () => [
                  h(CodeEditorContent, { 'data-testid': 'injected' }),
                  h(CodeEditorContent, {
                    'data-testid': 'explicit-null',
                    editor: null,
                  }),
                ],
              },
            ),
          ])
      },
    })

    cy.mount(TestHost)

    // The first part takes the provided view.
    cy.get('[data-testid="injected"]').find('.cm-editor').should('exist')
    // The second was handed `null` on purpose, so it stays an empty box.
    cy.get('[data-testid="explicit-null"]').should('be.empty')
  })

  it('clears the overflow state and the scroll class when the view goes away', () => {
    // Both belong to a view the part is showing. The part never owns the view,
    // so what it set on the way in it has to unset on the way out.
    const onOverflow = cy.spy().as('overflow')
    let view!: EditorView

    const TestHost = defineComponent({
      setup() {
        const editor = useCodeEditor({
          // Tall enough to overflow the cap, and wide enough to scroll sideways.
          content: ref(`SELECT ${'x'.repeat(200)}\n2\n3\n4\n5\n6\n7\n8\n9\n10`),
          extensions: [CodeKit],
        })
        view = editor.value!
        const attached = ref(true)
        return () =>
          h('div', { class: 'w-[420px] p-4' }, [
            h(CodeEditorContent, {
              editor: attached.value ? editor.value : null,
              style: { '--code-max-height': '80px' },
              onOverflow,
            }),
            h(
              'button',
              { type: 'button', onClick: () => (attached.value = false) },
              'detach',
            ),
          ])
      },
    })

    cy.mount(TestHost)

    cy.get(CONTENT).should('have.attr', 'data-overflowing', 'true')
    cy.get('@overflow').should('have.been.calledWith', true)

    // Scroll right, so the gutter shadow is lit when the view leaves.
    cy.then(() => {
      view.scrollDOM.scrollLeft = 200
      view.scrollDOM.dispatchEvent(new Event('scroll'))
    })
    cy.get(CONTENT).should('have.attr', 'data-scrolled-x', 'true')

    cy.get('button').click()

    cy.get(CONTENT).should('not.have.attr', 'data-overflowing')
    cy.get(CONTENT).should('not.have.attr', 'data-scrolled-x')
    cy.get('@overflow').should('have.been.calledWith', false)
    // The view outlives the part, so nothing the part set may ride away on it.
    cy.then(() =>
      expect(view.dom.getAttribute('class')).to.not.contain('scrolled'),
    )
  })

  it('keeps the horizontal scroll flag across a focus change', () => {
    // CodeMirror owns `view.dom`'s `class` attribute and rewrites the whole
    // string on focus and blur. A flag kept there would disappear while the
    // code was still scrolled right, and the cache would never re-toggle it.
    mountCodeEditor({ content: `SELECT ${'x'.repeat(200)}`, maxHeight: '80px' })

    // `focus()` and `blur()` rather than clicks: the long line makes the
    // contenteditable wider than the box, and Cypress refuses to click what it
    // cannot see the centre of.
    cy.get('.cm-content').focus()
    cy.get('.cm-editor').should('have.class', 'cm-focused')
    cy.get('.cm-scroller').then(($el) => {
      $el[0].scrollLeft = 200
      $el[0].dispatchEvent(new Event('scroll'))
    })
    cy.get(CONTENT).should('have.attr', 'data-scrolled-x', 'true')

    cy.get('.cm-content').blur()

    cy.get('.cm-editor').should('not.have.class', 'cm-focused')
    cy.get(CONTENT).should('have.attr', 'data-scrolled-x', 'true')
  })

  it('releases the resize observer when the view goes away', () => {
    // The part can lose its view without gaining another one. An observer left
    // attached would retain the departed view's `contentDOM` and `scrollDOM`
    // until the part itself unmounted.
    const live = new Map<ResizeObserver, Element[]>()
    const watchers = (target: Element) =>
      [...live.values()].filter((targets) => targets.includes(target)).length

    let view!: EditorView

    const TestHost = defineComponent({
      setup() {
        const editor = useCodeEditor({
          content: ref('SELECT 1'),
          extensions: [CodeKit],
        })
        view = editor.value!
        const attached = ref(true)
        return () =>
          h('div', { class: 'w-[420px] p-4' }, [
            h(CodeEditorContent, {
              editor: attached.value ? editor.value : null,
              class: 'min-h-20',
            }),
            h(
              'button',
              { type: 'button', onClick: () => (attached.value = false) },
              'detach',
            ),
          ])
      },
    })

    cy.window().then((win) => {
      const Native = win.ResizeObserver
      // Track what each observer watches, against the real implementation
      // rather than by reading private state off the component. CodeMirror
      // keeps its own observer on `scrollDOM`, so counting calls alone would
      // mix the two.
      class Tracking extends Native {
        observe(target: Element, options?: ResizeObserverOptions) {
          live.set(this, [...(live.get(this) ?? []), target])
          super.observe(target, options)
        }
        disconnect() {
          live.delete(this)
          super.disconnect()
        }
      }
      win.ResizeObserver = Tracking as typeof win.ResizeObserver
    })

    cy.mount(TestHost)
    cy.get('.cm-editor').should('exist')
    cy.then(() => {
      expect(watchers(view.contentDOM), 'contentDOM before detach').to.eq(1)
      // The part's, plus the view's own.
      expect(watchers(view.scrollDOM), 'scrollDOM before detach').to.eq(2)
    })

    cy.get('button').click()

    cy.get('.cm-editor').should('not.exist')
    cy.then(() => {
      expect(watchers(view.contentDOM), 'contentDOM after detach').to.eq(0)
      // The view outlives the part: the engine owns it, and its own observer
      // stays. Only the part's is gone.
      expect(watchers(view.scrollDOM), 'scrollDOM after detach').to.eq(1)
    })
  })
})
