import { h, KeepAlive, ref } from 'vue'
import FrappeUIProvider from './FrappeUIProvider.vue'
import Dialogs from '../Dialogs.vue'
import { dialog, dialogs } from '../../utils/dialog'

describe('<FrappeUIProvider />', () => {
  // The imperative dialog stack is a module-level singleton, so a dialog left
  // open by one test would otherwise bleed into the next.
  afterEach(() => {
    dialogs.value = []
  })

  it('renders the default slot content unchanged', () => {
    cy.mount(FrappeUIProvider, {
      slots: { default: () => h('div', { 'data-test': 'app' }, 'App') },
    })
    cy.get('[data-test=app]').should('contain.text', 'App')
  })

  it('mounts the imperative dialog stack alongside the app', () => {
    cy.mount(FrappeUIProvider, {
      slots: { default: () => h('div', 'App') },
    })
    cy.then(() => dialog.confirm({ title: 'Delete this?' }))
    cy.get('[role=dialog]').should('contain.text', 'Delete this?')
  })

  it('dedups a sibling <Dialogs /> mounted in the slot content', () => {
    // The provider's internal <Dialogs /> and one mounted by the app are
    // siblings, not ancestor/descendant — inject alone cannot dedup them.
    cy.mount(FrappeUIProvider, {
      slots: { default: () => [h('div', 'App'), h(Dialogs)] },
    })
    cy.then(() => dialog.confirm({ title: 'Only once' }))
    cy.get('[role=dialog]').should('have.length', 1)
  })

  it('hands the claim to the surviving host when the winner unmounts', () => {
    // The app's slot-mounted <Dialogs /> registers first and wins. When it
    // goes away (route change, v-if), the provider's own host must take
    // over — not leave the stack with no renderer.
    const show = ref(true)
    cy.mount(FrappeUIProvider, {
      slots: {
        default: () => [h('div', 'App'), show.value ? h(Dialogs) : null],
      },
    })
    cy.then(() => dialog.confirm({ title: 'Before' }))
    cy.get('[role=dialog]').should('have.length', 1)
    cy.then(() => (dialogs.value = []))
    cy.then(() => (show.value = false))
    cy.then(() => dialog.confirm({ title: 'After handover' }))
    cy.get('[role=dialog]').should('have.length', 1)
    cy.get('[role=dialog]').should('contain.text', 'After handover')
  })

  it('hands the claim over when a keep-alive host deactivates', () => {
    // A deactivated component never unmounts — without the deactivated
    // hook it would keep the claim and render into detached DOM.
    const Other = { template: '<div>Other</div>' }
    const view = ref<any>(Dialogs)
    cy.mount(FrappeUIProvider, {
      slots: { default: () => h(KeepAlive, null, [h(view.value)]) },
    })
    cy.then(() => (view.value = Other))
    cy.then(() => dialog.confirm({ title: 'After deactivate' }))
    cy.get('[role=dialog]').should('have.length', 1)
    cy.get('[role=dialog]').should('contain.text', 'After deactivate')
  })

  it('releases the host claim on unmount so a new mount renders again', () => {
    cy.mount(FrappeUIProvider, {
      slots: { default: () => [h(Dialogs), h(Dialogs)] },
    }).then(({ wrapper }) => wrapper.unmount())
    cy.mount(FrappeUIProvider)
    cy.then(() => dialog.confirm({ title: 'Fresh host' }))
    cy.get('[role=dialog]').should('have.length', 1)
    cy.get('[role=dialog]').should('contain.text', 'Fresh host')
  })

  it('mounts a Toaster so toast.* has somewhere to render', () => {
    cy.mount(FrappeUIProvider)
    cy.get('[data-sonner-toaster]').should('exist')
  })
})
