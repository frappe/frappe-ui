import { defineComponent, h } from 'vue'
import SettingsDialog from './SettingsDialog.vue'
import type { SettingsSection } from './types'

const panel = (text: string) =>
  defineComponent({ render: () => h('div', { class: 'tab-panel' }, text) })

function makeSections(onProfileClick?: () => void): SettingsSection[] {
  return [
    {
      label: 'Account',
      items: [
        {
          label: 'Profile',
          icon: 'lucide-circle-user',
          component: panel('Profile content'),
          onClick: onProfileClick,
        },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { label: 'General', icon: 'lucide-settings', component: panel('General content') },
        { label: 'Members', icon: 'lucide-users', component: panel('Members content') },
      ],
    },
  ]
}

const sections = makeSections()

describe('SettingsDialog', () => {
  it('does not render while closed; renders when open (v-model)', () => {
    cy.mount(SettingsDialog, { props: { modelValue: false, sections } })
    cy.get('[role=dialog]').should('not.exist')

    cy.mount(SettingsDialog, { props: { modelValue: true, sections } })
    cy.get('[role=dialog]').should('exist')
  })

  it('renders all section items in the sidebar', () => {
    cy.mount(SettingsDialog, { props: { modelValue: true, sections } })
    cy.get('[role=dialog]').within(() => {
      cy.contains('Profile').should('exist')
      cy.contains('General').should('exist')
      cy.contains('Members').should('exist')
    })
  })

  it('shows the first item content by default', () => {
    cy.mount(SettingsDialog, { props: { modelValue: true, sections } })
    cy.get('[role=dialog] .tab-panel').should('have.text', 'Profile content')
  })

  it('switches the active tab on click and invokes the item onClick', () => {
    const onProfileClick = cy.stub().as('onProfileClick')
    cy.mount(SettingsDialog, {
      props: { modelValue: true, sections: makeSections(onProfileClick) },
    })
    cy.get('[role=dialog] .tab-panel').should('have.text', 'Profile content')

    cy.get('[role=dialog]').contains('Members').click()
    cy.get('[role=dialog] .tab-panel').should('have.text', 'Members content')

    cy.get('[role=dialog]').contains('Profile').click()
    cy.get('@onProfileClick').should('have.been.called')
  })

  it('overrides the content area via the #tab-content slot', () => {
    cy.mount(SettingsDialog, {
      props: { modelValue: true, sections },
      slots: {
        'tab-content': (slotProps: { tab?: { label: string } }) =>
          h('div', { class: 'custom-content' }, `Custom: ${slotProps.tab?.label}`),
      },
    })
    cy.get('[role=dialog] .custom-content').should('have.text', 'Custom: Profile')
  })

  it('emits update:modelValue when the dialog is closed', () => {
    const onUpdate = cy.spy().as('onUpdate')
    cy.mount(SettingsDialog, {
      props: { modelValue: true, sections, 'onUpdate:modelValue': onUpdate },
    })
    cy.get('[role=dialog]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('@onUpdate').should('have.been.calledWith', false)
  })
})
