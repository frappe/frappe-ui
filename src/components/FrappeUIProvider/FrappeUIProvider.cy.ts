import { h } from 'vue'
import FrappeUIProvider from './FrappeUIProvider.vue'
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

  it('mounts a Toaster so toast.* has somewhere to render', () => {
    cy.mount(FrappeUIProvider)
    cy.get('[data-sonner-toaster]').should('exist')
  })
})
