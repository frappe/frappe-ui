import Dropdown from './Dropdown.vue'
import { h } from 'vue'

const options = [
  { label: 'Edit', icon: 'edit' },
  {
    label: 'Delete',
    icon: 'trash-2',
    theme: 'red',
  },
]

const submenuActions = [
  {
    label: 'New',
    icon: 'plus',
    submenu: [
      {
        label: 'New Document',
        icon: 'file-plus',
        onClick: () => console.log('New Document clicked'),
      },
      {
        label: 'New Template',
        icon: 'file-text',
        onClick: () => console.log('New Template clicked'),
      },
    ],
  },
  {
    label: 'Edit',
    icon: 'edit',
    onClick: () => console.log('Edit clicked'),
  },
]

describe('Dropdown', () => {
  it('Rendering', () => {
    cy.mount(Dropdown, { props: { options } })

    cy.get('[role=menu]').should('not.exist')
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menu]').should('exist')

    cy.get('[role=menuitem]').eq(1).should('contain.text', 'Delete').click()

    cy.get('[role=menu]').should('not.exist')
  })

  it('Submenus', () => {
    cy.mount(Dropdown, { props: { options: submenuActions } })

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menu]').should('have.length', 1)

    cy.get('[role="menuitem"][aria-haspopup="menu"]').click()

    cy.get('[role=menu]').should('have.length', 2)
  })

  it('Custom Trigger', () => {
    cy.mount(Dropdown, {
      props: { options },
      slots: { default: h('button', {}, 'Trigger') },
    })

    cy.get('[aria-haspopup=menu]').should('have.text', 'Trigger')
  })
})
