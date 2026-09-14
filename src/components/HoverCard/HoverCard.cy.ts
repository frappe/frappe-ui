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
      props: { hoverDelay: 500, leaveDelay: 300 },
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

  it('opens on keyboard focus and closes on Escape (P12)', () => {
    // A hover-only card is unreachable without a pointer. reka's trigger opens
    // on focus and closes on Escape; this pins that wiring to the wrapper.
    cy.mount(HoverCard, { slots: Slots, props: { hoverDelay: 0 } })

    cy.get('[data-slot="content"]').should('not.exist')
    cy.get('[data-cy="trigger"]').focus()
    cy.get('[data-slot="content"]').should('exist')

    cy.get('body').trigger('keydown', { key: 'Escape' })
    cy.get('[data-slot="content"]').should('not.exist')
  })

  it('emits update:open when the card opens from the trigger', () => {
    const onUpdate = cy.spy().as('update')
    cy.mount(HoverCard, {
      slots: Slots,
      props: { hoverDelay: 0, 'onUpdate:open': onUpdate },
    })

    cy.get('[data-cy="trigger"]').focus()
    cy.get('@update').should('have.been.calledWith', true)
  })

  it('exposes open() and close() methods', () => {
    const cardRef = ref<any>(null)
    const Harness = defineComponent({
      setup() {
        return () => h(HoverCard, { ref: cardRef, hoverDelay: 0 }, Slots)
      },
    })

    cy.mount(Harness)
    cy.then(() => cardRef.value.open())
    cy.get('[data-slot="content"]').should('exist')
    cy.then(() => cardRef.value.close())
    cy.get('[data-slot="content"]').should('not.exist')
  })

  it('exposes open controls to trigger and content slots', () => {
    let setOpen: ((value: boolean) => void) | undefined
    cy.mount(HoverCard, {
      props: { hoverDelay: 0 },
      slots: {
        trigger: (props) => {
          setOpen = props.setOpen
          return h(Button, { 'data-cy': 'trigger' }, () => 'Trigger')
        },
        default: ({ open, close }) =>
          h(Button, { 'data-cy': 'close', onClick: close }, () => String(open)),
      },
    })

    cy.then(() => setOpen?.(true))
    cy.get('[data-slot="trigger"]').should('exist')
    cy.get('[data-cy="close"]').should('have.text', 'true').click()
    cy.get('[data-slot="content"]').should('not.exist')
  })

  it('stays open when the trigger is re-entered after an explicit close', () => {
    let close: (() => void) | undefined
    cy.mount(HoverCard, {
      props: { hoverDelay: 30, leaveDelay: 0 },
      slots: {
        trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'Trigger'),
        default: (props) => {
          close = props.close
          return h('div', { 'data-cy': 'card' }, 'Card')
        },
      },
    })

    cy.get('[data-cy=trigger]').trigger('pointerenter', {
      pointerType: 'mouse',
    })
    cy.get('[data-cy=card]').should('exist')
    cy.then(() => close?.())
    cy.get('[data-cy=card]').should('not.exist')
    cy.get('[data-cy=trigger]')
      .trigger('pointerleave', { pointerType: 'mouse' })
      .trigger('pointerenter', { pointerType: 'mouse' })
    cy.get('[data-cy=card]').should('exist')
    cy.wait(50)
    cy.get('[data-cy=card]').should('exist')
  })

  it('does not forward arbitrary attributes to the content', () => {
    cy.mount(HoverCard, {
      props: { hoverDelay: 0, 'data-consumer-attr': 'ignored' } as any,
      slots: Slots,
    })
    cy.get('[data-cy="trigger"]').focus()
    cy.get('[data-slot="content"]').should(
      'not.have.attr',
      'data-consumer-attr',
    )
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

  it('opens without an enter/exit animation (instant motion)', () => {
    cy.clock()
    cy.mount(HoverCard, { slots: Slots, props: { hoverDelay: 0 } })

    cy.get('[data-cy="trigger"]').trigger('pointerenter')
    cy.tick(0)
    cy.get('[data-slot="content-body"]').should(
      'have.attr',
      'data-motion',
      'instant',
    )
  })
})
