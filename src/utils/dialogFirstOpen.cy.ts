import { defineComponent, h } from 'vue'
import { dialogs, prompt } from './dialog'

// `prompt` loads FormControl on first use. This spec runs in its own page, so
// the prompt below is the first one and has to wait for that load. The dialog
// must still appear with its fields in place, never empty for a frame and
// then filled in.

const DialogManager = defineComponent({
  name: 'DialogManager',
  setup() {
    return () =>
      h(
        'div',
        dialogs.value.map((d) => h(d.component, { key: d.id })),
      )
  },
})

beforeEach(() => {
  dialogs.value = []
})

// See dialog.cy.ts: a combobox measuring itself inside a dialog emits this
// harmless ResizeObserver notification.
Cypress.on('uncaught:exception', (err) =>
  err.message.includes('ResizeObserver loop') ? false : undefined,
)

it('the first prompt shows its fields in the same frame as the dialog', () => {
  // Mutation observers run before the browser paints, so the first record
  // is what the first painted frame of the dialog holds.
  const firstFrame: { text: boolean; combobox: boolean }[] = []
  const observer = new MutationObserver(() => {
    const dialog = document.querySelector('[role=dialog]')
    if (!dialog || firstFrame.length) return
    firstFrame.push({
      text: !!dialog.querySelector('input[type=text]'),
      combobox: !!dialog.querySelector('[role=combobox]'),
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })

  cy.mount(DialogManager)
  cy.then(() => {
    prompt({
      title: 'New label',
      fields: [
        { name: 'name', label: 'Name' },
        {
          name: 'color',
          label: 'Color',
          type: 'combobox',
          options: [{ label: 'Red', value: 'red' }],
        },
      ],
      onConfirm: () => {},
    })
  })

  cy.get('[role=dialog] [role=combobox]').should('be.visible')
  cy.then(() => {
    observer.disconnect()
    expect(firstFrame).to.deep.equal([{ text: true, combobox: true }])
  })
})

it('a prompt closed before its fields load never shows', () => {
  cy.mount(DialogManager)
  cy.then(() => {
    const handle = prompt({
      title: 'Closed early',
      fields: [{ name: 'name', label: 'Name' }],
      onConfirm: () => {},
    })
    handle.close()
  })
  cy.wait(100)
  cy.get('[role=dialog]').should('not.exist')
  cy.then(() => expect(dialogs.value).to.have.length(0))
})
