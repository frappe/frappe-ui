import { ref, h, defineComponent } from 'vue'
import Dialog from './Dialog.vue'
import Button from '../Button/Button.vue'
import Dropdown from '../Dropdown/Dropdown.vue'

describe('Dialog', () => {
  // ---- Canonical v1 surface --------------------------------------------------

  it('renders with default props', () => {
    cy.mount(Dialog, { props: { open: true } })

    cy.get('[role=dialog]').should('exist')
    // Defaults: size 'lg', position 'center', no title/message/actions.
    cy.get('[role=dialog]').should('have.class', 'max-w-lg')
    cy.get('[data-position=center]').should('exist')
    cy.get('[role=dialog] h3').should('not.exist')
    cy.get('[role=dialog] [aria-label=Close]').should('exist')
  })

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

  it('`open` wins over `modelValue` when both are bound', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        modelValue: false,
        title: 'Open wins',
      },
    })

    cy.get('[role=dialog]').contains('h3', 'Open wins').should('exist')

    cy.mount(Dialog, {
      props: {
        open: false,
        modelValue: true,
        title: 'Still closed',
      },
    })

    cy.get('[role=dialog]').should('not.exist')
  })

  // ---- New behavior props ----------------------------------------------------

  it('closes on outside click when dismissible', () => {
    const Wrapper = defineComponent({
      setup() {
        const open = ref(true)
        return { open }
      },
      render() {
        return h(Dialog, {
          open: this.open,
          'onUpdate:open': (v: boolean) => (this.open = v),
          title: 'Dismissible',
        })
      },
    })

    cy.mount(Wrapper)
    cy.get('[role=dialog]').should('exist')
    // `force` is required for any outside target: a modal Reka dialog sets
    // `pointer-events: none` on <body>, so nothing outside the content is a hit
    // target. The dismiss itself is driven by DismissableLayer's document-level
    // pointerdown listener, which still sees the event.
    cy.get('.dialog-overlay').click(0, 0, { force: true })
    cy.get('[role=dialog]').should('not.exist')
  })

  it('dismissible=false blocks outside click and Escape from closing', () => {
    const Wrapper = defineComponent({
      setup() {
        const open = ref(true)
        return { open }
      },
      render() {
        return h(Dialog, {
          open: this.open,
          'onUpdate:open': (v: boolean) => (this.open = v),
          title: 'Locked',
          message: 'Cannot dismiss',
          dismissible: false,
        })
      },
    })

    cy.mount(Wrapper)
    cy.get('[role=dialog]').should('exist')
    cy.get('.dialog-overlay').click(0, 0, { force: true })
    cy.get('[role=dialog]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('[role=dialog]').should('exist')
  })

  it('focuses and types into an input clicked inside a scrollable dialog', () => {
    cy.mount(Dialog, {
      props: { open: true, title: 'Long form' },
      slots: {
        default: () =>
          h(
            'div',
            {
              'data-cy': 'tall-dialog-body',
              style: {
                height: '1200px',
                display: 'flex',
                alignItems: 'flex-end',
              },
            },
            [
              h('input', {
                'data-cy': 'mouse-focus-input',
                type: 'text',
              }),
            ],
          ),
      },
    })

    // Overflow lives on the scroll container, not on the overlay — the overlay
    // is a bare backdrop so that field pointerdowns never reach its
    // `pointerdown.left.prevent` handler.
    cy.get('.dialog-overlay').should(($overlay) => {
      expect($overlay[0].scrollHeight).to.equal($overlay[0].clientHeight)
    })
    cy.get('.dialog-scroll-container').should(($scroller) => {
      expect($scroller[0].scrollHeight).to.be.greaterThan(
        $scroller[0].clientHeight,
      )
    })
    // The structural guard for the bug this test covers: nesting the content
    // back inside the overlay would silently kill click-to-focus again.
    cy.get('.dialog-scroll-container').find('[role=dialog]').should('exist')
    cy.get('.dialog-overlay').find('[role=dialog]').should('not.exist')

    // Cypress cannot synthesize fully trusted OS-level events, so this guards
    // the click-to-focus behavior contract rather than the exact event chain.
    cy.get('[data-cy=mouse-focus-input]')
      .click()
      .should('be.focused')
      .type('Focused by mouse')
      .should('have.value', 'Focused by mouse')
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

  it('passes `{ close }` to #default and #title, and `{ close, actions }` to #actions', () => {
    const Wrapper = defineComponent({
      setup() {
        const open = ref(true)
        return { open }
      },
      render() {
        return h(
          Dialog,
          {
            open: this.open,
            'onUpdate:open': (v: boolean) => (this.open = v),
            actions: [{ label: 'Got it' }],
          },
          {
            title: ({ close }: { close: () => void }) =>
              h(
                'button',
                { 'data-cy': 'title-close', onClick: close },
                'Custom title',
              ),
            default: ({ close }: { close: () => void }) =>
              h(
                'button',
                { 'data-cy': 'default-close', onClick: close },
                'Custom body',
              ),
            actions: ({
              close,
              actions,
            }: {
              close: () => void
              actions: Array<{ label: string }>
            }) => [
              h(
                'div',
                { 'data-cy': 'actions-relayout' },
                actions.map((a) => a.label).join(', '),
              ),
              h('button', { 'data-cy': 'actions-close', onClick: close }),
            ],
          },
        )
      },
    })

    cy.mount(Wrapper)

    cy.get('[data-cy=title-close]').should('exist')
    cy.get('[data-cy=default-close]').should('exist')
    cy.get('[data-cy=actions-relayout]').should('have.text', 'Got it')
    cy.get('[data-cy=actions-close]').should('exist')
    cy.get('[data-cy=default-close]').click()
    cy.get('[role=dialog]').should('not.exist')
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

  // ---- Escape ------------------------------------------------------------

  it('Escape closes the dialog when dismissible (the default)', () => {
    const Wrapper = defineComponent({
      setup() {
        const open = ref(true)
        return { open }
      },
      render() {
        return h(Dialog, {
          open: this.open,
          'onUpdate:open': (v: boolean) => (this.open = v),
          title: 'Dismissible',
        })
      },
    })

    cy.mount(Wrapper)
    cy.get('[role=dialog]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('[role=dialog]').should('not.exist')
  })

  // ---- Autofocus -------------------------------------------------------------

  it('focuses a descendant marked with `autofocus` on open', () => {
    cy.mount(Dialog, {
      props: { open: true, title: 'Rename' },
      slots: {
        default: () =>
          h('input', {
            'data-cy': 'name-input',
            autofocus: '',
            value: 'untitled',
          }),
      },
    })

    cy.get('[data-cy=name-input]').should('be.focused')
    // Inputs/textareas get their value selected so the user can type-to-replace.
    cy.window().then((win) => {
      const el = win.document.querySelector(
        '[data-cy=name-input]',
      ) as HTMLInputElement
      expect(el.selectionStart).to.equal(0)
      expect(el.selectionEnd).to.equal('untitled'.length)
    })
  })

  it('walks into a non-focusable `[autofocus]` wrapper and focuses the first focusable inside', () => {
    cy.mount(Dialog, {
      props: { open: true, title: 'Preferences' },
      slots: {
        default: () =>
          h('div', { autofocus: '' }, [
            h('span', 'label'),
            h('button', { 'data-cy': 'toggle', type: 'button' }, 'Toggle'),
            h('button', { 'data-cy': 'second', type: 'button' }, 'Other'),
          ]),
      },
    })

    cy.get('[data-cy=toggle]').should('be.focused')
  })

  // ---- Action layout ---------------------------------------------------------

  it('renders a single action full-width when size is md or smaller', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        size: 'md',
        title: 'Subscription updated',
        actions: [{ label: 'Got it', variant: 'solid' }],
      },
    })

    cy.get('[role=dialog]')
      .contains('button', 'Got it')
      .should('have.class', 'w-full')
      .parent()
      .should('not.have.class', 'flex')
  })

  it('renders multiple actions side-by-side at natural width on a small dialog', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        size: 'md',
        title: 'Discard changes?',
        actions: [
          { label: 'Keep editing' },
          { label: 'Discard', variant: 'solid' },
        ],
      },
    })

    cy.get('[role=dialog]')
      .contains('button', 'Discard')
      .should('not.have.class', 'w-full')
      .parent()
      .should('have.class', 'flex')
      .and('have.class', 'justify-end')
      .and('have.class', 'gap-2')
  })

  it('does not stretch a single action when the dialog is larger than md', () => {
    cy.mount(Dialog, {
      props: {
        open: true,
        size: 'xl',
        title: 'Report generated',
        actions: [{ label: 'Download', variant: 'solid' }],
      },
    })

    cy.get('[role=dialog]')
      .contains('button', 'Download')
      .should('not.have.class', 'w-full')
      .parent()
      .should('have.class', 'flex')
      .and('have.class', 'justify-end')
  })

  it('holds an action button in a loading state while its async onClick is pending', () => {
    let resolveClick: () => void = () => {}
    cy.mount(Dialog, {
      props: {
        open: true,
        title: 'Saving',
        actions: [
          {
            label: 'Save',
            variant: 'solid',
            onClick: () =>
              new Promise<void>((resolve) => {
                resolveClick = resolve
              }),
          },
        ],
      },
    })

    cy.contains('button', 'Save').click()
    cy.contains('button', 'Save').find('[role="status"]').should('exist')
    cy.then(() => resolveClick())
    cy.contains('button', 'Save').find('[role="status"]').should('not.exist')
  })

  it('falls back to Reka default focus when nothing is marked', () => {
    cy.mount(Dialog, {
      props: { open: true, title: 'Plain', message: 'No marker here.' },
    })

    // No `[autofocus]` → our handler is a no-op and Reka's FocusScope
    // takes over. The important contract is that focus lands somewhere
    // inside the dialog (not on the body or a sibling).
    cy.get('[role=dialog]').should('exist')
    cy.focused().closest('[role=dialog]').should('exist')
  })

  it('pins both layers at z-50, below the z-100 floating family', () => {
    cy.mount(Dialog, {
      props: { open: true, title: 'Stacking', message: 'Layer check.' },
    })

    // z-50 clears app chrome like the z-10 sticky ListGroup header (#1051)
    // while staying under the z-[100] menus and popovers, which portal to the
    // same target and must open above a dialog.
    cy.get('.dialog-overlay').should('have.css', 'z-index', '50')
    cy.get('.dialog-scroll-container').should('have.css', 'z-index', '50')
  })

  it('keeps a dropdown opened inside it above the dialog layers', () => {
    cy.mount(Dialog, {
      props: { open: true, title: 'With a menu' },
      slots: {
        default: () =>
          h(
            Dropdown,
            { options: [{ label: 'Rename' }, { label: 'Delete' }] },
            { default: () => h('button', 'Open dropdown') },
          ),
      },
    })

    cy.contains('button', 'Open dropdown').click()
    // Reka copies the content's z-index onto its fixed floating wrapper at
    // mount, so the menu only clears the z-50 dialog because `menuClasses`
    // carries z-[100]. Hit-test rather than trust paint order.
    cy.get('.menu-content').should(($menu) => {
      const r = $menu[0].getBoundingClientRect()
      const hit = document.elementFromPoint(
        Math.round(r.left + r.width / 2),
        Math.round(r.top + r.height / 2),
      )
      expect(
        $menu[0].contains(hit),
        'menu is the topmost element at its centre',
      ).to.be.true
    })
  })
})
