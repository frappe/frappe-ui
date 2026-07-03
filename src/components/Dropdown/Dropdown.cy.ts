import Dropdown from './Dropdown.vue'
import { defineComponent, h } from 'vue'

const options = [
  { label: 'Edit', icon: 'lucide-edit' },
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    theme: 'red',
  },
]

const submenuActions = [
  {
    label: 'New',
    icon: 'lucide-plus',
    submenu: [
      {
        label: 'New Document',
        icon: 'lucide-file-plus',
        onClick: () => console.log('New Document clicked'),
      },
      {
        label: 'New Template',
        icon: 'lucide-file-text',
        onClick: () => console.log('New Template clicked'),
      },
    ],
  },
  {
    label: 'Edit',
    icon: 'lucide-edit',
    onClick: () => console.log('Edit clicked'),
  },
]

const nestedSubmenuActions = [
  {
    label: 'Share',
    icon: 'lucide-share',
    submenu: [
      {
        label: 'Copy link',
        icon: 'lucide-link',
        onClick: () => console.log('Copy link clicked'),
      },
      {
        label: 'Invite people',
        icon: 'lucide-user-plus',
        submenu: [
          {
            label: 'Invite by email',
            icon: 'lucide-mail',
            onClick: () => console.log('Invite by email clicked'),
          },
          {
            label: 'Share in Slack',
            icon: 'lucide-message-circle',
            onClick: () => console.log('Share in Slack clicked'),
          },
        ],
      },
    ],
  },
]

const ComponentItem = defineComponent({
  render() {
    return h('button', { 'data-cy': 'component-item' }, 'Archive')
  },
})

describe('Dropdown', () => {
  it('Rendering', () => {
    cy.mount(Dropdown, { props: { options } })

    cy.get('[role=menu]').should('not.exist')
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menu]').should('exist')
    cy.get('.menu-content').should('have.class', 'z-[100]')

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

  it('Nested submenus', () => {
    cy.mount(Dropdown, { props: { options: nestedSubmenuActions } })

    cy.get('[aria-haspopup=menu]').click()
    cy.contains('[role="menuitem"]', 'Share').click()
    cy.get('[role=menu]').should('have.length', 2)

    cy.contains('[role="menuitem"]', 'Invite people').click()
    cy.get('[role=menu]').should('have.length', 3)
    cy.contains('[role="menuitem"]', 'Invite by email').should('exist')
  })

  it('keeps custom item slots as the outer menuitem element', () => {
    cy.mount(Dropdown, {
      props: { options: [{ label: 'Edit' }] },
      slots: {
        item: ({ item }) =>
          h('button', { 'data-cy': 'custom-item' }, item.label),
      },
    })

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[data-cy="custom-item"]').should('have.attr', 'role', 'menuitem')
    cy.get('[data-cy="custom-item"]').click()
    cy.get('[role=menu]').should('not.exist')
  })

  it('keeps component items as the outer menuitem element', () => {
    cy.mount(Dropdown, {
      props: {
        options: [{ component: ComponentItem }],
      },
    })

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[data-cy="component-item"]').should('have.attr', 'role', 'menuitem')
  })

  it('Custom Trigger', () => {
    cy.mount(Dropdown, {
      props: { options },
      slots: { default: h('button', {}, 'Trigger') },
    })

    cy.get('[aria-haspopup=menu]').should('have.text', 'Trigger')
  })
})
