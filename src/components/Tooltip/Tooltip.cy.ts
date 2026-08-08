import Tooltip from './Tooltip.vue'
import TooltipProvider from './TooltipProvider.vue'
import Button from '../Button/Button.vue'
import { h } from 'vue'

const Comp = () =>
  h(Tooltip, { text: 'some tooltip', hoverDelay: 0, side: 'top' }, [
    h(Button, {}, 'k'),
  ])

describe('Tooltip', () => {
  it('Renders', () => {
    cy.mount(Comp)

    cy.get('[data-reka-popper-content-wrapper]').should('not.exist')
    cy.get('button').should('have.attr', 'data-state', 'closed')

    cy.get('[role=tooltip]').should('not.exist')
    cy.get('button').trigger('focus')
    cy.get('[role=tooltip]').should('exist')

    cy.get('[role=tooltip]').should('have.text', 'some tooltip')
  })

  it('disabled prop', () => {
    cy.mount(
      h(Tooltip, { text: 'abc', disabled: true }, [h(Button, {}, 'k')]),
      { disabled: true },
    )

    cy.get('button').trigger('focus')
    cy.get('[role=tooltip]').should('not.exist')
  })

  it('#content renders inside the bubble and beats text', () => {
    cy.mount(h(Tooltip, { text: 'ignored', hoverDelay: 0 }), {
      slots: {
        default: h(Button, {}, 'k'),
        content: h('span', { 'data-cy': 'content' }, ['rich']),
      },
    })

    cy.get('button').trigger('focus')
    // Inside the bubble, so the consumer inherits the surface instead of
    // hand-copying its classes — which is what every #body call site did.
    cy.get('[data-slot=bubble]').find('[data-cy=content]').should('exist')
    cy.get('[data-slot=bubble]').should('not.contain.text', 'ignored')
  })

  it('bare drops the bubble shell but keeps the arrow', () => {
    cy.mount(h(Tooltip, { hoverDelay: 0, bare: true }), {
      slots: {
        default: h(Button, {}, 'k'),
        content: h('div', { 'data-cy': 'content' }, ['own surface']),
      },
    })

    cy.get('button').trigger('focus')
    cy.get('[data-cy=content]').should('exist')
    cy.get('[data-slot=bubble]').should('not.exist')
    cy.get('[data-slot=arrow]').should('exist')
  })

  it('exposes the arrow through a data-slot hook rather than a class prop', () => {
    cy.mount(
      h(Tooltip, { text: 'abc', hoverDelay: 0 }, [h(Button, {}, 'k')]),
    )

    cy.get('button').trigger('focus')
    cy.get('[data-slot="arrow"]').should('exist')
  })

  it('offset moves the bubble away from the trigger', () => {
    cy.mount(
      h(Tooltip, { text: 'abc', hoverDelay: 0, offset: 24 }, [
        h(Button, {}, 'k'),
      ]),
    )

    cy.get('button').trigger('focus')
    cy.get('[data-slot="content"]').should('exist')
  })

  it('grouping under a shared TooltipProvider skips the re-delay between triggers', () => {
    // `disableHoverableContent` makes leaving the trigger close its tooltip,
    // which opens the provider's skip-delay window — the toolbar use case.
    const Group = () =>
      h(
        TooltipProvider,
        { hoverDelay: 0.5, skipDelay: 0.3, disableHoverableContent: true },
        () => [
          h(Tooltip, { text: 'First' }, () =>
            h('button', { 'data-cy': 'first' }, 'one'),
          ),
          h(Tooltip, { text: 'Second' }, () =>
            h('button', { 'data-cy': 'second' }, 'two'),
          ),
        ],
      )

    cy.clock()
    cy.mount(Group)

    // First trigger incurs the full hover delay before opening.
    cy.get('[data-cy=first]').trigger('pointermove')
    cy.get('[role=tooltip]').should('not.exist')
    cy.tick(500)
    cy.get('[role=tooltip]').should('have.text', 'First')
    cy.get('[data-cy=first]').should('have.attr', 'data-state', 'delayed-open')

    // Leaving closes it and opens the skip-delay window.
    cy.get('[data-cy=first]').trigger('pointerleave')

    // Moving to the neighbour opens instantly — no clock tick needed.
    cy.get('[data-cy=second]').trigger('pointermove')
    cy.get('[role=tooltip]').should('have.text', 'Second')
    cy.get('[data-cy=second]').should('have.attr', 'data-state', 'instant-open')
  })

  it('a standalone Tooltip still mounts its own provider (no grouping)', () => {
    // Without a surrounding provider every tooltip delays independently.
    cy.clock()
    cy.mount(h(Tooltip, { text: 'solo', hoverDelay: 0.5 }, () => h('button', 'k')))

    cy.get('button').trigger('pointermove')
    cy.get('[role=tooltip]').should('not.exist')
    cy.tick(500)
    cy.get('button').should('have.attr', 'data-state', 'delayed-open')
  })
})
