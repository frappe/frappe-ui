import { h } from 'vue'
import SettingsPanel from './SettingsPanel.vue'

describe('SettingsPanel', () => {
  it('renders the title', () => {
    cy.mount(SettingsPanel, { props: { title: 'General' } })
    cy.contains('h1', 'General').should('exist')
  })

  it('renders the description when provided', () => {
    cy.mount(SettingsPanel, {
      props: { title: 'General', description: 'Workspace preferences.' },
    })
    cy.contains('Workspace preferences.').should('exist')
  })

  it('omits the description when not provided', () => {
    cy.mount(SettingsPanel, { props: { title: 'General' } })
    cy.get('p').should('not.exist')
  })

  it('renders the default slot as the body', () => {
    cy.mount(SettingsPanel, {
      props: { title: 'General' },
      slots: { default: () => h('div', { class: 'body' }, 'Body content') },
    })
    cy.get('.body').should('have.text', 'Body content')
  })

  it('renders the actions slot only when provided', () => {
    cy.mount(SettingsPanel, { props: { title: 'General' } })
    cy.get('.action').should('not.exist')

    cy.mount(SettingsPanel, {
      props: { title: 'General' },
      slots: { actions: () => h('button', { class: 'action' }, 'Save') },
    })
    cy.get('.action').should('have.text', 'Save')
  })
})
