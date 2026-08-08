import { defineComponent, h, ref, type Ref } from 'vue'
import BottomSheet from './BottomSheet.vue'
import Button from '../Button/Button.vue'

// `BottomSheet.test.ts` covers the drag gesture against `useSheetDrag`. This
// file covers the component contract: rendering, the open model, the dismiss
// channels, focus, and the slot.
//
// The sheet is modal, so reka puts `pointer-events: none` on <body> while it is
// open. That is the behaviour we want and it makes clicking the page behind the
// sheet impossible — including from a test. So the open state is driven through
// the model ref, and the dismiss channels are exercised on the sheet itself.

const Body = () => h('div', { 'data-cy': 'body' }, 'Sheet body')

function harness(props: Record<string, unknown> = {}) {
  const open: Ref<boolean> = ref(false)
  const Harness = defineComponent({
    setup() {
      return () =>
        h('div', [
          h(Button, { 'data-cy': 'behind' }, () => 'Behind the sheet'),
          h(
            BottomSheet,
            {
              open: open.value,
              'onUpdate:open': (value: boolean) => (open.value = value),
              ...props,
            },
            { default: Body },
          ),
        ])
    },
  })
  return { Harness, open }
}

function pressEscape() {
  cy.get('[role="dialog"]').trigger('keydown', { key: 'Escape', force: true })
}

describe('BottomSheet', () => {
  it('renders nothing until it is opened', () => {
    const { Harness, open } = harness()
    cy.mount(Harness)

    cy.get('[data-cy="body"]').should('not.exist')
    cy.then(() => (open.value = true))
    cy.get('[data-cy="body"]').should('be.visible')
  })

  it('round-trips v-model:open in both directions', () => {
    const { Harness, open } = harness()
    cy.mount(Harness)

    // Parent -> component.
    cy.then(() => (open.value = true))
    cy.get('[data-cy="body"]').should('exist')

    // Component -> parent: a dismiss writes back through update:open, so the
    // parent's ref follows rather than falling one step out of sync.
    pressEscape()
    cy.get('[data-cy="body"]').should('not.exist')
    cy.then(() => expect(open.value).to.be.false)
  })

  it('renders the title and uses it as the accessible name', () => {
    const { Harness, open } = harness({ title: 'Actions' })
    cy.mount(Harness)

    cy.then(() => (open.value = true))
    cy.contains('Actions').should('be.visible')
    cy.get('[role="dialog"]').should('have.attr', 'aria-label', 'Actions')
  })

  it('falls back to a generic accessible name without a title', () => {
    const { Harness, open } = harness()
    cy.mount(Harness)

    cy.then(() => (open.value = true))
    cy.get('[role="dialog"]').should('have.attr', 'aria-label', 'Bottom sheet')
  })

  it('keeps focus inside the sheet while it is open (P12)', () => {
    // The sheet deliberately does not pull focus on open — on a phone that pops
    // the keyboard for a sheet the user has not typed into yet. What it must
    // still do is hold focus once it is open, or the page behind the overlay
    // stays reachable by keyboard.
    const { Harness, open } = harness({ title: 'Actions' })
    cy.mount(Harness)

    cy.then(() => (open.value = true))
    cy.get('[data-cy="body"]').should('exist')

    cy.get('[data-cy="behind"]').focus({ force: true })
    cy.focused().then(($focused) => {
      cy.get('[role="dialog"]').then(($sheet) => {
        expect(
          $sheet[0] === $focused[0] || $sheet[0].contains($focused[0]),
          'focus is pulled back into the sheet',
        ).to.be.true
      })
    })
  })

  it('closes on Escape when dismissible', () => {
    const { Harness, open } = harness()
    cy.mount(Harness)

    cy.then(() => (open.value = true))
    cy.get('[data-cy="body"]').should('exist')
    pressEscape()
    cy.get('[data-cy="body"]').should('not.exist')
  })

  it('closes on an outside click when dismissible', () => {
    const { Harness, open } = harness()
    cy.mount(Harness)

    cy.then(() => (open.value = true))
    cy.get('[data-cy="body"]').should('exist')
    cy.get('.bottom-sheet-overlay').click({ force: true })
    cy.get('[data-cy="body"]').should('not.exist')
  })

  it('stays open on Escape and outside click when dismissible is false', () => {
    const { Harness, open } = harness({ dismissible: false })
    cy.mount(Harness)

    cy.then(() => (open.value = true))
    cy.get('[data-cy="body"]').should('exist')

    pressEscape()
    cy.get('[data-cy="body"]').should('exist')

    cy.get('.bottom-sheet-overlay').click({ force: true })
    cy.get('[data-cy="body"]').should('exist')
    cy.then(() => expect(open.value).to.be.true)
  })

  it('emits after-leave once the close animation has finished', () => {
    const onAfterLeave = cy.spy().as('afterLeave')
    const { Harness, open } = harness({ 'onAfter-leave': onAfterLeave })
    cy.mount(Harness)

    cy.then(() => (open.value = true))
    cy.get('[data-cy="body"]').should('exist')
    cy.get('@afterLeave').should('not.have.been.called')

    cy.then(() => (open.value = false))
    cy.get('@afterLeave').should('have.been.called')
  })
})
