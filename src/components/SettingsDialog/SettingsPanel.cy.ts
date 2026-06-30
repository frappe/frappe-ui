import { h } from 'vue'
import SettingsHeader from './SettingsHeader.vue'
import SettingsRow from './SettingsRow.vue'
import Switch from '../Switch/Switch.vue'

describe('SettingsHeader', () => {
  it('renders the title and description', () => {
    cy.mount(SettingsHeader, {
      props: { title: 'General', description: 'Workspace preferences.' },
    })
    cy.contains('h2', 'General').should('exist')
    cy.contains('Workspace preferences.').should('exist')
  })

  it('omits the description when not provided', () => {
    cy.mount(SettingsHeader, { props: { title: 'General' } })
    cy.get('p').should('not.exist')
  })

  it('renders the actions slot', () => {
    cy.mount(SettingsHeader, {
      props: { title: 'General' },
      slots: { actions: () => h('button', { class: 'action' }, 'Save') },
    })
    cy.get('.action').should('have.text', 'Save')
  })

  it('lets the default slot replace the header entirely', () => {
    cy.mount(SettingsHeader, {
      props: { title: 'Ignored' },
      slots: { default: () => h('div', { class: 'custom' }, 'Custom header') },
    })
    cy.get('.custom').should('exist')
    cy.contains('Ignored').should('not.exist')
  })
})

describe('SettingsRow', () => {
  it('renders the title and description', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Public profile', description: 'Allow viewing.' },
    })
    cy.contains('Public profile').should('exist')
    cy.contains('Allow viewing.').should('exist')
  })

  it('auto-associates the title label with a slotted Switch', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Public profile' },
      slots: { default: () => h(Switch) },
    })
    // The title becomes a <label> whose `for` matches the Switch's control id.
    cy.get('label[for]')
      .invoke('attr', 'for')
      .then((forId) => {
        cy.get(`#${forId}`).should('have.attr', 'data-slot', 'control')
      })
  })

  it('toggles the Switch when the auto-wired label is clicked', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Public profile' },
      slots: { default: () => h(Switch) },
    })
    cy.get('[data-slot=control]').should('have.attr', 'aria-checked', 'false')
    cy.get('label[for]').click()
    cy.get('[data-slot=control]').should('have.attr', 'aria-checked', 'true')
  })

  it('respects an explicit label-for override', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Custom', labelFor: 'my-id' },
      slots: { default: () => h('input', { id: 'other-id' }) },
    })
    cy.get('label').should('have.attr', 'for', 'my-id')
  })
})
