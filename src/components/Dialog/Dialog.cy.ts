import { ref, h, defineComponent } from 'vue'
import Dialog from './Dialog.vue'
import Button from '../Button/Button.vue'

describe('Dialog', () => {
  // ---- Canonical v1 surface --------------------------------------------------

  it('renders title, message and action; ctx.close() closes the dialog', () => {
    const onClose = cy.spy().as('onClose')
    const onActionClick = cy.spy().as('onActionClick')

    const Wrapper = defineComponent({
      setup() {
        const open = ref(false)
        return { open }
      },
      render() {
        return [
          h(
            Button,
            { onClick: () => (this.open = true) },
            { default: () => 'Show' },
          ),
          h(Dialog, {
            open: this.open,
            'onUpdate:open': (v: boolean) => (this.open = v),
            onClose,
            title: 'Modal Dialog',
            message: 'A simple modal.',
            actions: [
              {
                label: 'Close',
                variant: 'solid',
                onClick: (ctx: { close: () => void }) => {
                  onActionClick()
                  ctx.close()
                },
              },
            ],
          }),
        ]
      },
    })

    cy.mount(Wrapper)

    cy.get('[role=dialog]').should('not.exist')
    cy.contains('button', 'Show').click()

    cy.get('[role=dialog]').should('exist')
    cy.get('[role=dialog]').contains('h3', 'Modal Dialog').should('exist')
    cy.get('[role=dialog]').contains('p', 'A simple modal.').should('exist')

    cy.get('[role=dialog]').contains('button', 'Close').click()
    cy.get('@onActionClick').should('have.been.called')
    cy.get('@onClose').should('have.been.called')
    cy.get('[role=dialog]').should('not.exist')
  })

  it('v-model (modelValue) still works as a legacy binding', () => {
    const Wrapper = defineComponent({
      setup() {
        const open = ref(false)
        return { open }
      },
      render() {
        return [
          h(
            Button,
            { onClick: () => (this.open = true) },
            { default: () => 'Show' },
          ),
          h(Dialog, {
            modelValue: this.open,
            'onUpdate:modelValue': (v: boolean) => (this.open = v),
            title: 'Legacy v-model',
          }),
        ]
      },
    })

    cy.mount(Wrapper)
    cy.contains('button', 'Show').click()
    cy.get('[role=dialog]').contains('h3', 'Legacy v-model').should('exist')
  })

  // ---- New behavior props ----------------------------------------------------

  it('dismissable=false blocks outside click and Escape from closing', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        title: 'Locked',
        message: 'Cannot dismiss',
        dismissable: false,
      },
    })

    cy.get('[role=dialog]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('[role=dialog]').should('exist')
  })

  it('showCloseButton renders an accessible close affordance that closes the dialog', () => {
    const Wrapper = defineComponent({
      setup() {
        const open = ref(true)
        return { open }
      },
      render() {
        return h(Dialog, {
          open: this.open,
          'onUpdate:open': (v: boolean) => (this.open = v),
          title: 'With X',
        })
      },
    })

    cy.mount(Wrapper)
    cy.get('[role=dialog]').should('exist')
    cy.get('[role=dialog] [aria-label=Close]').click()
    cy.get('[role=dialog]').should('not.exist')
  })

  it('showCloseButton=false hides the close button', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        title: 'No X',
        showCloseButton: false,
      },
    })

    cy.get('[role=dialog]').should('exist')
    cy.get('[role=dialog] [aria-label=Close]').should('not.exist')
  })

  it('bare suppresses chrome and renders only the default slot', () => {
    cy.mount(Dialog, {
      props: { open: true, bare: true },
      slots: {
        default: h(
          'div',
          { 'data-cy': 'bare-content', class: 'p-6' },
          'bare content',
        ),
      },
    })

    cy.get('[role=dialog]').should('exist')
    cy.get('[data-cy=bare-content]').should('have.text', 'bare content')
    // No auto-header h3, no auto close button.
    cy.get('[role=dialog] h3').should('not.exist')
    cy.get('[role=dialog] [aria-label=Close]').should('not.exist')
  })

  it('omits the auto-header when no title is provided (no "Untitled" fallback)', () => {
    cy.mount(Dialog, {
      props: { open: true, message: 'Just a message.' },
    })

    cy.get('[role=dialog]').should('exist')
    cy.get('[role=dialog] h3').should('not.exist')
    cy.get('[role=dialog]').contains('p', 'Just a message.').should('exist')
  })

  // ---- Canonical slots -------------------------------------------------------

  it('renders #default, #title, and #actions slots', () => {
    cy.mount(Dialog, {
      props: { open: true },
      slots: {
        title: h('span', { 'data-cy': 'title' }, 'Custom title'),
        default: h('div', { 'data-cy': 'default' }, 'Custom body'),
        actions: h('div', { 'data-cy': 'actions' }, 'Custom actions'),
      },
    })

    cy.get('[data-cy=title]').should('have.text', 'Custom title')
    cy.get('[data-cy=default]').should('have.text', 'Custom body')
    cy.get('[data-cy=actions]').should('have.text', 'Custom actions')
  })

  // ---- Icon theming ----------------------------------------------------------

  it('renders an icon by theme color', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        title: 'Heads up',
        icon: { name: 'lucide-alert-triangle', theme: 'red' },
      },
    })

    cy.get('[role=dialog] .lucide-alert-triangle').should('exist')
  })

  // ---- Back-compat -----------------------------------------------------------

  it('accepts the legacy `options` blob', () => {
    cy.mount(Dialog, {
      props: {
        modelValue: true,
        options: {
          title: 'Legacy options',
          message: 'Still works.',
          actions: [{ label: 'OK', variant: 'solid' }],
        },
      },
    })

    cy.get('[role=dialog]').contains('h3', 'Legacy options').should('exist')
    cy.get('[role=dialog]').contains('p', 'Still works.').should('exist')
    cy.get('[role=dialog]').contains('button', 'OK').should('exist')
  })

  it('accepts legacy #body-header / #body-content slots', () => {
    cy.mount(Dialog, {
      props: { modelValue: true },
      slots: {
        'body-header': h(
          'div',
          { 'data-cy': 'body-header' },
          'legacy header',
        ),
        'body-content': h(
          'div',
          { 'data-cy': 'body-content' },
          'legacy content',
        ),
      },
    })

    cy.get('[data-cy=body-header]').should('have.text', 'legacy header')
    cy.get('[data-cy=body-content]').should('have.text', 'legacy content')
  })

  it('inverts `disableOutsideClickToClose` into `dismissable`', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        title: 'Locked',
        disableOutsideClickToClose: true,
      },
    })

    cy.get('[role=dialog]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('[role=dialog]').should('exist')
  })
})
