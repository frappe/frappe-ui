import { h } from 'vue'
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
