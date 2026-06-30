import { defineComponent, h, ref } from 'vue'
import Popover from './Popover.vue'
import Button from '../Button/Button.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

// New-contract slots: #trigger is rendered via reka PopoverTrigger as-child, so
// click/keyboard/aria wiring is automatic — the trigger must NOT bind onClick.
const NewSlots = {
  trigger: () => h(Button, { 'data-cy': 'trigger' }, () => 'Click me'),
  default: () => h('div', { 'data-cy': 'content' }, 'Popover content'),
}

// Legacy-contract slots: #target uses reka PopoverAnchor with MANUAL wiring, so
// the caller is responsible for calling togglePopover on click.
const LegacySlots = {
  target: ({ togglePopover }: { togglePopover: () => void }) =>
    h(
      Button,
      { 'data-cy': 'trigger', onClick: togglePopover },
      () => 'Click me',
    ),
  'body-main': () => h('div', { 'data-cy': 'content' }, 'Popover content'),
}

describe('Popover', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  // ---------------------------------------------------------------------------
  // New contract
  // ---------------------------------------------------------------------------
  describe('new contract', () => {
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

    it('exposes reactive isOpen to the #trigger slot', () => {
      // The #trigger click is auto-wired by reka, so the slot must NOT bind its
      // own onClick (that would double-toggle). It can still read isOpen to
      // reflect state — e.g. flip a label or a chevron.
      cy.mount(Popover, {
        slots: {
          trigger: ({ isOpen }: { isOpen: boolean }) =>
            h(Button, { 'data-cy': 'trigger' }, () =>
              isOpen ? 'Close' : 'Open',
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

    it('uses animated motion for pointer opens', () => {
      cy.mount(Popover, { slots: NewSlots })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content-body"]').should(
        'have.attr',
        'data-motion',
        'animated',
      )
    })

    it('uses instant motion for keyboard opens', () => {
      cy.mount(Popover, { slots: NewSlots })

      // Keyboard activation opens without a preceding pointerdown -> instant.
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

  // ---------------------------------------------------------------------------
  // Deprecated contract (kept working through v1.x)
  // ---------------------------------------------------------------------------
  describe('deprecated contract', () => {
    it('#target manual wiring opens once and does NOT double-toggle', () => {
      cy.mount(Popover, { slots: LegacySlots })

      cy.get('[data-slot="content"]').should('not.exist')
      // A single click must end with the popover OPEN. If reka also toggled,
      // the popover would flicker closed again (double-toggle regression).
      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')
      cy.get('[data-cy="content"]').should('have.text', 'Popover content')
    })

    it('#body-main renders inside the default container', () => {
      cy.mount(Popover, { slots: LegacySlots })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content-body"]')
        .find('[data-cy="content"]')
        .should('exist')
    })

    it('#body overrides the default chrome', () => {
      cy.mount(Popover, {
        slots: {
          target: ({ togglePopover }: { togglePopover: () => void }) =>
            h(
              Button,
              { 'data-cy': 'trigger', onClick: togglePopover },
              () => 'T',
            ),
          body: () => h('div', { 'data-cy': 'full-body' }, 'override'),
          'body-main': () => h('div', { 'data-cy': 'inner' }, 'inner'),
        },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-cy="full-body"]').should('exist')
      cy.get('[data-cy="inner"]').should('not.exist')
      // #body is bare: it must NOT be wrapped in the PopoverPanel shell, so a
      // consumer bringing its own surface doesn't get a panel-in-a-panel.
      cy.get('[data-slot="content-body"]').should('not.exist')
    })

    it('maps show / v-model:show -> open', () => {
      const Harness = defineComponent({
        setup() {
          const show = ref(false)
          return () =>
            h('div', [
              h(
                Button,
                { 'data-cy': 'external', onClick: () => (show.value = true) },
                () => 'Open',
              ),
              h(
                Popover,
                {
                  show: show.value,
                  'onUpdate:show': (value: boolean) => (show.value = value),
                },
                LegacySlots,
              ),
            ])
        },
      })

      cy.mount(Harness)
      cy.get('[data-slot="content"]').should('not.exist')
      cy.get('[data-cy="external"]').click()
      cy.get('[data-slot="content"]').should('exist')
    })

    it('still emits update:show alongside update:open', () => {
      cy.mount(Popover, {
        slots: LegacySlots,
        props: {
          'onUpdate:show': cy.spy().as('onUpdateShow'),
          'onUpdate:open': cy.spy().as('onUpdateOpen'),
        },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('@onUpdateShow').should('have.been.calledWith', true)
      cy.get('@onUpdateOpen').should('have.been.calledWith', true)
    })

    it('maps placement="bottom-end" -> side="bottom" + align="end"', () => {
      cy.mount(Popover, {
        slots: LegacySlots,
        props: { placement: 'bottom-end' },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]')
        .should('have.attr', 'data-side', 'bottom')
        .and('have.attr', 'data-align', 'end')
    })

    it('maps bare placement="bottom" -> align="center"', () => {
      cy.mount(Popover, {
        slots: LegacySlots,
        props: { placement: 'bottom' },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]')
        .should('have.attr', 'data-side', 'bottom')
        .and('have.attr', 'data-align', 'center')
    })

    it('maps hideOnBlur=false -> dismissible=false (stays open on outside click)', () => {
      cy.mount(Popover, {
        slots: LegacySlots,
        props: { hideOnBlur: false },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')
      cy.get('body').click(0, 0)
      cy.get('[data-slot="content"]').should('exist')
    })

    it('maps matchTargetWidth -> matchTriggerWidth', () => {
      cy.mount(Popover, {
        slots: LegacySlots,
        props: { matchTargetWidth: true },
      })

      cy.get('[data-cy="trigger"]').click()
      cy.get('[data-slot="content"]')
        .should('have.attr', 'style')
        .and('include', 'min-width')
    })

    it('trigger="hover" still opens on mouseover', () => {
      cy.mount(Popover, {
        slots: LegacySlots,
        props: { trigger: 'hover', hoverDelay: 0 },
      })

      cy.get('[data-slot="content"]').should('not.exist')
      cy.get('[data-cy="trigger"]').trigger('mouseover')
      cy.get('[data-slot="content"]').should('exist')
    })

    it('warns once when deprecated slots are used', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn')
      })
      cy.mount(Popover, { slots: LegacySlots })
      cy.get('@consoleWarn').should('have.been.calledWithMatch', /#target/)
    })
  })
})
