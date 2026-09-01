import { defineComponent, h, ref } from 'vue'
import Popover from './Popover.vue'
import Button from '../Button/Button.vue'

// New-contract slots: #trigger is rendered via reka PopoverTrigger as-child, so
// click/keyboard/aria wiring is automatic — the trigger must NOT bind onClick.
const NewSlots = {
  trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'Click me'),
  default: () => h('div', { 'data-cy': 'content' }, 'Popover content'),
}

describe('Popover', () => {
  // ---------------------------------------------------------------------------
  // New contract
  // ---------------------------------------------------------------------------
  describe('contract', () => {
    it('auto-wires #trigger to open on click (no manual onClick)', () => {
      cy.mount(Popover, { slots: NewSlots })

      cy.get('[data-slot="content"]').should('not.exist')
      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')
      cy.get('[data-cy="content"]').should('have.text', 'Popover content')
    })

    it('toggles closed when the trigger is clicked while open', () => {
      cy.mount(Popover, { slots: NewSlots })

      // Open, then click the trigger again. The trigger click must END closed.
      // Regression: a trigger pointerdown looks "outside" the content, so the
      // dismissable layer would close it and reka's onOpenToggle would reopen
      // it — leaving it stuck open (close-then-reopen flicker).
      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')
      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('not.exist')
    })

    it('exposes reactive open state to the #trigger slot', () => {
      // The #trigger click is auto-wired by reka, so the slot must NOT bind its
      // own onClick (that would double-toggle). It can still read `open` to
      // reflect state — e.g. flip a label or a chevron.
      cy.mount(Popover, {
        slots: {
          trigger: ({ open }: { open: boolean }) =>
            h(Button, { 'data-cy': 'trigger' }, () =>
              open ? 'Close' : 'Open',
            ),
          default: () => h('div', { 'data-cy': 'content' }, 'content'),
        },
      })

      cy.get('[data-cy="trigger"]').should('have.text', 'Open')
      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')
      cy.get('[data-cy="trigger"]').should('have.text', 'Close')
    })

    it('exposes close() to the #default slot content', () => {
      cy.mount(Popover, {
        slots: {
          trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'T'),
          default: ({ close }: { close: () => void }) =>
            h(
              Button,
              { 'data-cy': 'dismiss', onClick: () => close() },
              () => 'Done',
            ),
        },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')
      cy.get('[data-cy="dismiss"]').click()
      cy.get('[data-slot="content"]').should('not.exist')
    })

    it('renders #default inside the shared PopoverPanel shell', () => {
      cy.mount(Popover, { slots: NewSlots })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]')
        .find('[data-slot="content-body"]')
        .should('exist')
        .find('[data-cy="content"]')
        .should('exist')
    })

    it('bare renders #default without the PopoverPanel shell', () => {
      cy.mount(Popover, { props: { bare: true }, slots: NewSlots })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').find('[data-cy="content"]').should('exist')
      cy.get('[data-slot="content-body"]').should('not.exist')
    })

    it('renders an arrow when arrow is set', () => {
      cy.mount(Popover, { props: { arrow: true }, slots: NewSlots })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').find('[data-slot="arrow"]').should('exist')
    })

    it('wires aria-haspopup and aria-expanded on the trigger', () => {
      cy.mount(Popover, { slots: NewSlots })

      cy.get('[data-cy="trigger"]')
        .should('have.attr', 'aria-haspopup', 'dialog')
        .and('have.attr', 'aria-expanded', 'false')

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-cy="trigger"]').should('have.attr', 'aria-expanded', 'true')
    })

    it('supports v-model:open (controlled open/close)', () => {
      const Harness = defineComponent({
        setup() {
          const open = ref(false)
          return () =>
            h('div', [
              h(
                Button,
                { 'data-cy': 'external', onClick: () => (open.value = true) },
                () => 'Open',
              ),
              h(
                Popover,
                {
                  open: open.value,
                  'onUpdate:open': (value: boolean) => (open.value = value),
                },
                {
                  trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'T'),
                  default: () =>
                    h('div', { 'data-cy': 'content' }, 'controlled'),
                },
              ),
            ])
        },
      })

      cy.mount(Harness)

      cy.get('[data-slot="content"]').should('not.exist')
      // Open from an external control, proving the parent owns the state.
      cy.get('[data-cy="external"]').click()
      cy.get('[data-slot="content"]').should('exist')
    })

    it('emits update:open (and behavior-named open/close)', () => {
      cy.mount(Popover, {
        slots: NewSlots,
        props: {
          'onUpdate:open': cy.spy().as('onUpdateOpen'),
          onOpen: cy.spy().as('onOpen'),
          onClose: cy.spy().as('onClose'),
        },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('@onUpdateOpen').should('have.been.calledWith', true)
      cy.get('@onOpen').should('have.been.called')

      cy.get('body').type('{esc}')
      cy.get('@onUpdateOpen').should('have.been.calledWith', false)
      cy.get('@onClose').should('have.been.called')
    })

    it('does not emit open when a controlled parent declines the request', () => {
      // A consumer that binds `:open` and honours `update:open` only on the way
      // down (the calendar's event pills delay opening so a double click can
      // edit instead) leaves the popover shut. `open` must stay unemitted: a
      // listener registered there would never see the `close` that never comes.
      const Harness = defineComponent({
        setup() {
          const open = ref(false)
          return () =>
            h(
              Popover,
              {
                open: open.value,
                // Declines every request to open; still closes on the way down.
                'onUpdate:open': (value: boolean) =>
                  !value && (open.value = false),
                onOpen: cy.spy().as('onOpen'),
                onClose: cy.spy().as('onClose'),
              },
              {
                trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'T'),
                default: () => h('div', { 'data-cy': 'content' }, 'controlled'),
              },
            )
        },
      })

      cy.mount(Harness)

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('not.exist')
      cy.get('@onOpen').should('not.have.been.called')
      cy.get('@onClose').should('not.have.been.called')
    })

    it('closes on Escape', () => {
      cy.mount(Popover, { slots: NewSlots })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')
      cy.get('body').type('{esc}')
      cy.get('[data-slot="content"]').should('not.exist')
    })

    it('positions content via side + align', () => {
      cy.mount(Popover, {
        slots: NewSlots,
        props: { side: 'right', align: 'end' },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]')
        .should('have.attr', 'data-side', 'right')
        .and('have.attr', 'data-align', 'end')
    })

    it('matchTriggerWidth sets min-width to the trigger width', () => {
      cy.mount(Popover, {
        slots: NewSlots,
        props: { matchTriggerWidth: true },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]')
        .should('have.attr', 'style')
        .and('include', 'min-width')
    })

    it('opens without an enter/exit animation (instant motion)', () => {
      // A panel that appears at a fixed spot has nothing to scale from, so the
      // entrance would only add latency. Opacity-only fade, no scale.
      cy.mount(Popover, { slots: NewSlots })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content-body"]').should(
        'have.attr',
        'data-motion',
        'instant',
      )
    })

    it('uses the same instant motion for keyboard opens', () => {
      cy.mount(Popover, { slots: NewSlots })

      cy.get('[data-cy="trigger"]').focus().type('{enter}')
      cy.get('[data-slot="content-body"]').should(
        'have.attr',
        'data-motion',
        'instant',
      )
    })

    describe('dismissible', () => {
      it('closes on outside click when dismissible (default)', () => {
        cy.mount(Popover, { slots: NewSlots })

        cy.get('[data-cy="trigger"]').click()
        cy.get('[data-slot="content"]').should('exist')
        cy.get('body').click(0, 0)
        cy.get('[data-slot="content"]').should('not.exist')
      })

      it('stays open on outside click when dismissible=false', () => {
        cy.mount(Popover, {
          slots: NewSlots,
          props: { dismissible: false },
        })

        cy.get('[data-cy="trigger"]').click()
        cy.get('[data-slot="content"]').should('exist')
        cy.get('body').click(0, 0)
        cy.get('[data-slot="content"]').should('exist')
      })

      it('closes on Escape when dismissible (default)', () => {
        cy.mount(Popover, { slots: NewSlots })

        cy.get('[data-cy="trigger"]').click()
        cy.get('[data-slot="content"]').should('exist')
        cy.get('[data-slot="content"]').trigger('keydown', { key: 'Escape' })
        cy.get('[data-slot="content"]').should('not.exist')
      })

      it('stays open on Escape when dismissible=false', () => {
        cy.mount(Popover, {
          slots: NewSlots,
          props: { dismissible: false },
        })

        cy.get('[data-cy="trigger"]').click()
        cy.get('[data-slot="content"]').should('exist')
        cy.get('[data-slot="content"]').trigger('keydown', { key: 'Escape' })
        cy.get('[data-slot="content"]').should('exist')
      })
    })

    it('exposes open() and close() methods', () => {
      const popoverRef = ref()
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              Popover,
              { ref: (el: unknown) => (popoverRef.value = el) },
              {
                trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'T'),
                default: () => h('div', { 'data-cy': 'content' }, 'exposed'),
              },
            )
        },
      })

      cy.mount(Harness)
      cy.get('[data-slot="content"]').should('not.exist')
      cy.then(() => popoverRef.value.open())
      cy.get('[data-slot="content"]').should('exist')
      cy.then(() => popoverRef.value.close())
      cy.get('[data-slot="content"]').should('not.exist')
    })
  })
})
