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

  it('opens on pointer press, not on release', () => {
    cy.mount(Dropdown, { props: { options } })

    cy.get('[aria-haspopup=menu]').trigger('pointerdown', {
      button: 0,
      pointerType: 'mouse',
    })
    cy.get('[role=menu]').should('exist')

    // The click that ends the same press must not toggle the menu back shut.
    // Sent bare, with no fresh pointerdown: a real press releases into exactly
    // one click, while `.click()` would synthesize a whole new press. Pointer
    // clicks carry `detail: 1` (0 marks keyboard/script clicks).
    // `force` because the open modal menu puts `pointer-events: none` on body.
    cy.get('[aria-haspopup=menu]').trigger('pointerup', {
      button: 0,
      force: true,
    })
    cy.get('[aria-haspopup=menu]').trigger('click', { detail: 1, force: true })
    cy.get('[role=menu]').should('exist')
  })

  it('stops swallowing clicks once the opening press ends without one', () => {
    cy.mount(Dropdown, { props: { options } })

    // The press opens the menu and arms the trailing-click swallow…
    cy.get('[aria-haspopup=menu]').trigger('pointerdown', {
      button: 0,
      pointerType: 'mouse',
    })
    cy.get('[role=menu]').should('exist')

    // …but this press ends without a click (released outside the window,
    // canceled). A fresh press+click is an independent gesture and must
    // toggle normally, closing the open menu.
    // `force` because the open modal menu puts `pointer-events: none` on body.
    cy.get('[aria-haspopup=menu]').click({ force: true })
    cy.get('[role=menu]').should('not.exist')
  })

  it('lets a pointerless click through after a canceled press', () => {
    cy.mount(Dropdown, { props: { options } })

    // The press opens the menu and arms the trailing-click swallow…
    cy.get('[aria-haspopup=menu]').trigger('pointerdown', {
      button: 0,
      pointerType: 'mouse',
    })
    cy.get('[role=menu]').should('exist')

    // …but the press ends without a click, and Escape dismisses the menu.
    // Keydown sent bare: `.type()` would click the menu to focus it first,
    // and that pointerdown would (correctly) disarm the swallow.
    cy.get('[role=menu]').trigger('keydown', { key: 'Escape', force: true })
    cy.get('[role=menu]').should('not.exist')

    // A keyboard or assistive-tech activation emits a bare click
    // (`detail: 0`) with no pointerdown: it must reach reka's trigger.
    // Dispatched by hand — cy.trigger() ignores a custom `detail`.
    cy.get('[aria-haspopup=menu]').then(($trigger) => {
      $trigger[0].dispatchEvent(
        new MouseEvent('click', { bubbles: true, detail: 0 }),
      )
    })
    cy.get('[role=menu]').should('exist')
  })

  it('leaves touch presses to the click path', () => {
    cy.mount(Dropdown, { props: { options } })

    cy.get('[aria-haspopup=menu]').trigger('pointerdown', {
      button: 0,
      pointerType: 'touch',
    })
    cy.get('[role=menu]').should('not.exist')

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menu]').should('exist')
  })

  it('Custom Trigger', () => {
    cy.mount(Dropdown, {
      props: { options },
      slots: { default: h('button', {}, 'Trigger') },
    })

    cy.get('[aria-haspopup=menu]').should('have.text', 'Trigger')
  })
})
