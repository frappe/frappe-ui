import { defineComponent, h } from 'vue'
import { confirm, danger, dialog, dialogs, prompt } from './dialog'

// The imperative API only appends to `dialogs.value`; nothing in the
// module renders them. A tiny manager mirrors what an app sets up at
// the root, so each spec can mount once and just call the helpers.
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
  // dialogs is module-level state; reset between tests or registrations leak.
  dialogs.value = []
})

describe('dialog.ts — imperative API', () => {
  // ---- namespace ----------------------------------------------------------

  it('exposes confirm / prompt / danger', () => {
    expect(typeof dialog.confirm).to.equal('function')
    expect(typeof dialog.prompt).to.equal('function')
    expect(typeof dialog.danger).to.equal('function')
  })

  // ---- confirm: defaults --------------------------------------------------

  it('confirm renders title + message with default Confirm / Cancel buttons', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 'Delete file?', message: 'This cannot be undone.' })
    })
    cy.get('[role=dialog]').should('exist')
    cy.get('[role=dialog]').contains('h3', 'Delete file?').should('exist')
    cy.get('[role=dialog]')
      .contains('p', 'This cannot be undone.')
      .should('exist')
    cy.get('[role=dialog]').contains('button', 'Confirm').should('exist')
    cy.get('[role=dialog]').contains('button', 'Cancel').should('exist')
  })

  it('confirm uses custom labels when provided', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ confirmLabel: 'Yes, do it', cancelLabel: 'Nevermind' })
    })
    cy.get('[role=dialog]').contains('button', 'Yes, do it').should('exist')
    cy.get('[role=dialog]').contains('button', 'Nevermind').should('exist')
  })

  // ---- confirm: onConfirm lifecycle --------------------------------------

  it('invokes onConfirm with { close, setError } and closes on success', () => {
    const onConfirm = cy.spy().as('onConfirm')
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onConfirm })
    })
    cy.contains('button', 'Confirm').click()
    cy.get('@onConfirm').should('have.been.calledOnce')
    cy.get('@onConfirm').then((spy: any) => {
      const ctx = spy.firstCall.args[0]
      expect(ctx).to.have.property('close').that.is.a('function')
      expect(ctx).to.have.property('setError').that.is.a('function')
    })
    cy.get('[role=dialog]').should('not.exist')
  })

  it('holds loading state on confirm while async onConfirm is pending, then closes', () => {
    let resolveOuter: () => void = () => {}
    const onConfirm = () =>
      new Promise<void>((r) => {
        resolveOuter = r
      })
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onConfirm })
    })
    cy.contains('button', 'Confirm').click()
    // loading spinner is rendered as an svg.animate-spin inside the button
    cy.contains('button', 'Confirm').find('svg.animate-spin').should('exist')
    cy.contains('button', 'Cancel').should('be.disabled')
    cy.then(() => resolveOuter())
    cy.get('[role=dialog]').should('not.exist')
  })

  it('renders inline error and re-enables buttons when onConfirm rejects', () => {
    const onConfirm = () => Promise.reject(new Error('Network down'))
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onConfirm })
    })
    cy.contains('button', 'Confirm').click()
    cy.get('[role=dialog]').contains('Network down').should('exist')
    cy.get('[role=dialog]').should('exist')
    cy.contains('button', 'Confirm')
      .find('svg.animate-spin')
      .should('not.exist')
  })

  it('extracts frappe-style messages[] from a rejection payload', () => {
    const onConfirm = () =>
      Promise.reject({ messages: ['Server says no'] })
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onConfirm })
    })
    cy.contains('button', 'Confirm').click()
    cy.get('[role=dialog]').contains('Server says no').should('exist')
  })

  it('falls back to a generic message for null / unknown rejection shape', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onConfirm: () => Promise.reject(null) })
    })
    cy.contains('button', 'Confirm').click()
    cy.get('[role=dialog]').contains('Something went wrong').should('exist')
  })

  it('ignores repeated confirm clicks while a previous call is pending', () => {
    let calls = 0
    let resolveOuter: () => void = () => {}
    const onConfirm = () => {
      calls++
      return new Promise<void>((r) => (resolveOuter = r))
    }
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onConfirm })
    })
    cy.contains('button', 'Confirm').click()
    cy.contains('button', 'Confirm').click({ force: true })
    cy.contains('button', 'Confirm').click({ force: true })
    cy.then(() => {
      expect(calls).to.equal(1)
      resolveOuter()
    })
    cy.get('[role=dialog]').should('not.exist')
  })

  it('onConfirm can imperatively call setError to surface a message and unlock buttons', () => {
    let capturedSetError: ((m: string | null) => void) | null = null
    const onConfirm = (ctx: { setError: (m: string | null) => void }) =>
      new Promise<void>(() => {
        capturedSetError = ctx.setError
      })
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onConfirm })
    })
    cy.contains('button', 'Confirm').click()
    cy.then(() => capturedSetError?.('Bad password'))
    cy.get('[role=dialog]').contains('Bad password').should('exist')
    cy.contains('button', 'Confirm')
      .find('svg.animate-spin')
      .should('not.exist')
    cy.then(() => capturedSetError?.(null))
    cy.get('[role=dialog]').contains('Bad password').should('not.exist')
  })

  // ---- confirm: cancel / dismiss -----------------------------------------

  it('cancel button calls onCancel and closes', () => {
    const onCancel = cy.spy().as('onCancel')
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', onCancel })
    })
    cy.contains('button', 'Cancel').click()
    cy.get('@onCancel').should('have.been.calledOnce')
    cy.get('[role=dialog]').should('not.exist')
  })

  it('dismissible=false blocks Esc from closing', () => {
    const onCancel = cy.spy().as('onCancel')
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 'Locked', dismissible: false, onCancel })
    })
    cy.get('body').type('{esc}')
    cy.get('[role=dialog]').should('exist')
    cy.get('@onCancel').should('not.have.been.called')
  })

  it('dismissible=false hides the close (X) button', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 'Locked', dismissible: false })
    })
    cy.get('[role=dialog] [aria-label=Close]').should('not.exist')
  })

  it('without onConfirm, the confirm button just closes the dialog', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't' })
    })
    cy.contains('button', 'Confirm').click()
    cy.get('[role=dialog]').should('not.exist')
  })

  it('handle.close() closes the dialog programmatically', () => {
    let handle: { close: () => void } | null = null
    cy.mount(DialogManager)
    cy.then(() => {
      handle = confirm({ title: 'Programmatic' })
    })
    cy.get('[role=dialog]').should('exist')
    cy.then(() => handle?.close())
    cy.get('[role=dialog]').should('not.exist')
  })

  // ---- confirm: theming ---------------------------------------------------

  it('theme=red paints the confirm button red and shows the default alert icon', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 'Danger', theme: 'red' })
    })
    cy.get('[role=dialog] .lucide-alert-triangle').should('exist')
    cy.contains('button', 'Confirm').should(
      'have.class',
      'bg-surface-red-5',
    )
  })

  it('a string icon overrides the theme default', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 'Info', theme: 'blue', icon: 'lucide-rocket' })
    })
    cy.get('[role=dialog] .lucide-rocket').should('exist')
    cy.get('[role=dialog] .lucide-info').should('not.exist')
  })

  // ---- confirm: custom actions -------------------------------------------

  it('custom actions render left-to-right and replace the default pair', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({
        title: 'Unsaved',
        confirmLabel: 'IGNORED',
        cancelLabel: 'IGNORED',
        onConfirm: () => {},
        actions: [
          { label: 'Save', variant: 'solid' },
          { label: 'Discard', variant: 'outline' },
          { label: 'Back to editor' },
        ],
      })
    })
    cy.get('[role=dialog] button')
      .filter(':visible')
      .then(($buttons) => {
        // close (X) + 3 actions; we only care about the labelled ones in order
        const labels = [...$buttons]
          .map((b) => b.textContent?.trim())
          .filter((t) => t && t !== '')
        expect(labels).to.deep.equal(['Save', 'Discard', 'Back to editor'])
      })
    cy.contains('button', 'IGNORED').should('not.exist')
  })

  it('an action with no onClick simply closes the dialog', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({ title: 't', actions: [{ label: 'Got it' }] })
    })
    cy.contains('button', 'Got it').click()
    cy.get('[role=dialog]').should('not.exist')
  })

  it('only the clicked action shows loading; siblings are disabled until it settles', () => {
    let resolveA: () => void = () => {}
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({
        title: 't',
        actions: [
          {
            label: 'A',
            onClick: () =>
              new Promise<void>((r) => {
                resolveA = r
              }),
          },
          { label: 'B', onClick: cy.spy().as('onB') },
        ],
      })
    })
    cy.contains('button', 'A').click()
    cy.contains('button', 'A').find('svg.animate-spin').should('exist')
    cy.contains('button', 'B').should('be.disabled')
    cy.contains('button', 'B').click({ force: true })
    cy.get('@onB').should('not.have.been.called')
    cy.then(() => resolveA())
    cy.get('[role=dialog]').should('not.exist')
  })

  it('action onClick rejection renders inline error and keeps dialog open', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      confirm({
        title: 't',
        actions: [
          {
            label: 'Save',
            variant: 'solid',
            onClick: () => Promise.reject(new Error('Save failed')),
          },
        ],
      })
    })
    cy.contains('button', 'Save').click()
    cy.get('[role=dialog]').contains('Save failed').should('exist')
    cy.get('[role=dialog]').should('exist')
    cy.contains('button', 'Save')
      .find('svg.animate-spin')
      .should('not.exist')
  })

  // ---- danger -------------------------------------------------------------

  it('danger forces theme=red, alert-triangle icon, and Delete label', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      danger({ title: 'Delete account?', message: 'This is forever.' })
    })
    cy.get('[role=dialog] .lucide-alert-triangle').should('exist')
    cy.contains('button', 'Delete')
      .should('exist')
      .and('have.class', 'bg-surface-red-5')
  })

  it('danger lets you override the confirm label', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      danger({ title: 'Revoke?', confirmLabel: 'Revoke access' })
    })
    cy.contains('button', 'Revoke access').should('exist')
    cy.contains('button', 'Delete').should('not.exist')
  })

  // ---- prompt -------------------------------------------------------------

  it('prompt renders one field per spec with Submit / Cancel defaults', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 'New space',
        fields: [
          { name: 'name', label: 'Name' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ],
        onConfirm: () => {},
      })
    })
    cy.get('[role=dialog]').contains('label', 'Name').should('exist')
    cy.get('[role=dialog]').contains('label', 'Description').should('exist')
    cy.get('[role=dialog] textarea').should('exist')
    cy.contains('button', 'Submit').should('exist')
    cy.contains('button', 'Cancel').should('exist')
  })

  it('prompt submits typed values via onConfirm', () => {
    const onConfirm = cy.spy().as('onConfirm')
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 'Name it',
        fields: [{ name: 'name', label: 'Name' }],
        onConfirm,
      })
    })
    cy.get('[role=dialog] input[type=text]').type('marketing')
    cy.contains('button', 'Submit').click()
    cy.get('@onConfirm').should('have.been.calledOnce')
    cy.get('@onConfirm').then((spy: any) => {
      const ctx = spy.firstCall.args[0]
      expect(ctx.values).to.deep.equal({ name: 'marketing' })
      expect(ctx).to.have.property('close').that.is.a('function')
      expect(ctx).to.have.property('setError').that.is.a('function')
    })
    cy.get('[role=dialog]').should('not.exist')
  })

  it('prompt seeds defaultValue and submits it untouched', () => {
    const onConfirm = cy.spy().as('onConfirm')
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 't',
        fields: [
          { name: 'name', defaultValue: 'Ada' },
          { name: 'agree', type: 'checkbox' },
        ],
        onConfirm,
      })
    })
    cy.contains('button', 'Submit').click()
    cy.get('@onConfirm').then((spy: any) => {
      expect(spy.firstCall.args[0].values).to.deep.equal({
        name: 'Ada',
        agree: false,
      })
    })
  })

  it('prompt silently no-ops submit when a required text field is empty', () => {
    const onConfirm = cy.spy().as('onConfirm')
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 't',
        fields: [{ name: 'name', label: 'Name', required: true }],
        onConfirm,
      })
    })
    cy.contains('button', 'Submit').click()
    cy.get('@onConfirm').should('not.have.been.called')
    cy.get('[role=dialog]').should('exist')
  })

  it('prompt validators surface inline errors and block submit', () => {
    const onConfirm = cy.spy().as('onConfirm')
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 't',
        fields: [
          {
            name: 'email',
            label: 'Email',
            defaultValue: 'bad',
            validate: (v: string) =>
              v === 'bad' ? 'Invalid email' : null,
          },
        ],
        onConfirm,
      })
    })
    cy.contains('button', 'Submit').click()
    cy.get('[role=dialog]').contains('Invalid email').should('exist')
    cy.get('@onConfirm').should('not.have.been.called')
    cy.contains('button', 'Submit')
      .find('svg.animate-spin')
      .should('not.exist')
  })

  it('prompt clears a stale field error as soon as the user edits it', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 't',
        fields: [
          {
            name: 'name',
            label: 'Name',
            defaultValue: 'x',
            validate: (v: string) => (v === 'x' ? 'Too short' : null),
          },
        ],
        onConfirm: () => {},
      })
    })
    cy.contains('button', 'Submit').click()
    cy.get('[role=dialog]').contains('Too short').should('exist')
    cy.get('[role=dialog] input[type=text]').type('ok')
    cy.get('[role=dialog]').contains('Too short').should('not.exist')
  })

  it('prompt surfaces onConfirm rejection inline without closing', () => {
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 't',
        fields: [{ name: 'name', defaultValue: 'Ada' }],
        onConfirm: () => Promise.reject(new Error('Server boom')),
      })
    })
    cy.contains('button', 'Submit').click()
    cy.get('[role=dialog]').contains('Server boom').should('exist')
    cy.get('[role=dialog]').should('exist')
  })

  it('prompt cancel calls onCancel and closes', () => {
    const onCancel = cy.spy().as('onCancel')
    cy.mount(DialogManager)
    cy.then(() => {
      prompt({
        title: 't',
        fields: [{ name: 'name' }],
        onConfirm: () => {},
        onCancel,
      })
    })
    cy.contains('button', 'Cancel').click()
    cy.get('@onCancel').should('have.been.calledOnce')
    cy.get('[role=dialog]').should('not.exist')
  })

  // ---- stacking -----------------------------------------------------------

  it('multiple dialogs stack and each handle closes only its own', () => {
    let h1: { close: () => void } | null = null
    let h2: { close: () => void } | null = null
    cy.mount(DialogManager)
    cy.then(() => {
      h1 = confirm({ title: 'First' })
      h2 = confirm({ title: 'Second' })
    })
    cy.get('[role=dialog]').should('have.length', 2)
    cy.then(() => h1?.close())
    cy.contains('h3', 'First').should('not.exist')
    cy.contains('h3', 'Second').should('exist')
    cy.then(() => h2?.close())
    cy.get('[role=dialog]').should('not.exist')
  })
})
