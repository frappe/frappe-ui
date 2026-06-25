import { defineComponent, h, ref } from 'vue'
import HoverCard from './HoverCard.vue'
import Button from '../Button/Button.vue'

const Slots = {
  trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'Hover me'),
  default: () => h('div', { 'data-cy': 'content' }, 'Card content'),
}

describe('HoverCard', () => {
  it('opens on hover after the hoverDelay and renders inside the panel shell', () => {
    cy.clock()
    cy.mount(HoverCard, {
      slots: Slots,
      props: { hoverDelay: 0.5, leaveDelay: 0.3 },
    })

    cy.get('[data-slot="content"]').should('not.exist')
    cy.get('[data-cy="trigger"]').trigger('pointerenter')

    // Still closed before the delay elapses.
    cy.get('[data-slot="content"]').should('not.exist')
    cy.tick(500)

    cy.get('[data-slot="content"]').should('exist')
    cy.get('[data-slot="content"]')
      .find('[data-slot="content-body"]')
      .find('[data-cy="content"]')
      .should('have.text', 'Card content')
  })

  it('closes when the open model is set back to false', () => {
    // reka owns the leave-delay timing internally; here we verify the wrapper's
    // two-way open binding tears the card down when the parent closes it.
    const Harness = defineComponent({
      setup() {
        const open = ref(false)
        return () =>
          h('div', [
            h(
              Button,
              {
                'data-cy': 'toggle',
                onClick: () => (open.value = !open.value),
              },
              () => 'Toggle',
            ),
            h(
              HoverCard,
              {
                open: open.value,
                'onUpdate:open': (value: boolean) => (open.value = value),
                hoverDelay: 0,
              },
              Slots,
            ),
          ])
      },
    })

    cy.mount(Harness)
    cy.get('[data-cy="toggle"]').click()
    cy.get('[data-slot="content"]').should('exist')
    cy.get('[data-cy="toggle"]').click()
    cy.get('[data-slot="content"]').should('not.exist')
  })

  it('positions the card via side + align', () => {
    cy.clock()
    cy.mount(HoverCard, {
      slots: Slots,
      props: { hoverDelay: 0, side: 'right', align: 'end' },
    })

    cy.get('[data-cy="trigger"]').trigger('pointerenter')
    cy.tick(0)
    cy.get('[data-slot="content"]')
      .should('have.attr', 'data-side', 'right')
      .and('have.attr', 'data-align', 'end')
  })

  it('renders an arrow when arrow is set', () => {
    cy.clock()
    cy.mount(HoverCard, { slots: Slots, props: { hoverDelay: 0, arrow: true } })

    cy.get('[data-cy="trigger"]').trigger('pointerenter')
    cy.tick(0)
    cy.get('[data-slot="content"]').find('[data-slot="arrow"]').should('exist')
  })

  it('always uses animated motion for hover opens', () => {
    cy.clock()
    cy.mount(HoverCard, { slots: Slots, props: { hoverDelay: 0 } })

    cy.get('[data-cy="trigger"]').trigger('pointerenter')
    cy.tick(0)
    cy.get('[data-slot="content-body"]').should(
      'have.attr',
      'data-motion',
      'animated',
    )
  })
})
