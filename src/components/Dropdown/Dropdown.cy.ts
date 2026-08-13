import Dropdown from './Dropdown.vue'
import { h } from 'vue'

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

describe('Dropdown', () => {
  it('Rendering', () => {
    cy.mount(Dropdown, { props: { options } })

    cy.get('[role=menu]').should('not.exist')
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menu]').should('exist')

    cy.get('[role=menuitem]')
      .eq(1)
      .should('contain.text', 'Delete')
      .within(() => {
        // Danger rows use the same ink as the ghost red Button; ink-red-5
        // is too dim against the dark-mode menu surface.
        cy.contains('Delete').should('have.class', 'text-ink-red-7')
        cy.get('.lucide-trash-2').should('have.class', 'text-ink-red-7')
      })

    cy.get('[role=menuitem]').eq(1).click()

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

  it('keeps slots.item rows as the outer menuitem element', () => {
    cy.mount(Dropdown, {
      props: {
        options: [
          {
            label: 'Archive',
            slots: {
              item: () => h('button', { 'data-cy': 'slots-item' }, 'Archive'),
            },
          },
        ],
      },
    })

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[data-cy="slots-item"]').should('have.attr', 'role', 'menuitem')
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

  it('round-trips v-model:open', () => {
    cy.mount(Dropdown, {
      props: {
        options,
        open: true,
        'onUpdate:open': cy.spy().as('updateOpen'),
      },
    })

    cy.get('[role=menu]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('@updateOpen').should('have.been.calledWith', false)
  })

  it('disables the trigger via button.disabled', () => {
    cy.mount(Dropdown, {
      props: { options, button: { label: 'Options', disabled: true } },
    })

    cy.get('[aria-haspopup=menu]').should('be.disabled')
    cy.get('[aria-haspopup=menu]').click({ force: true })
    cy.get('[role=menu]').should('not.exist')
  })

  it('disabled items do not fire onClick and are skipped by the keyboard', () => {
    const onClick = cy.spy().as('onClick')
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Enabled', onClick: () => {} },
          { label: 'Disabled', disabled: true, onClick },
        ],
      },
    })

    cy.get('[aria-haspopup=menu]').click()
    cy.contains('[role=menuitem]', 'Disabled').should(
      'have.attr',
      'data-disabled',
    )
    cy.contains('[role=menuitem]', 'Disabled').click({ force: true })
    cy.get('@onClick').should('not.have.been.called')

    // Arrow navigation wraps over the disabled item back to the enabled one.
    cy.get('[role=menu]').type('{downarrow}')
    cy.contains('[role=menuitem]', 'Enabled').should(
      'have.attr',
      'data-highlighted',
    )
    cy.get('[role=menu]').type('{downarrow}')
    cy.contains('[role=menuitem]', 'Enabled').should(
      'have.attr',
      'data-highlighted',
    )
  })

  it('supports arrow keys, Enter, and Escape', () => {
    const onClick = cy.spy().as('onClick')
    cy.mount(Dropdown, {
      props: {
        options: [
          { label: 'Edit', onClick: () => {} },
          { label: 'Delete', onClick },
        ],
      },
    })

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menu]').type('{downarrow}{downarrow}')
    cy.contains('[role=menuitem]', 'Delete').should(
      'have.attr',
      'data-highlighted',
    )
    cy.focused().type('{enter}')
    cy.get('@onClick').should('have.been.called')
    cy.get('[role=menu]').should('not.exist')

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menu]').type('{esc}')
    cy.get('[role=menu]').should('not.exist')
  })

  it('renders group labels, and #group-label overrides them', () => {
    const grouped = [
      { group: 'Edit', options: [{ label: 'Rename' }] },
    ]
    cy.mount(Dropdown, { props: { options: grouped } })
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[data-slot=group-label]').should('contain.text', 'Edit')

    cy.mount(Dropdown, {
      props: { options: grouped },
      slots: {
        'group-label': ({ group }) =>
          h('span', { 'data-cy': 'group-label' }, group.group.toUpperCase()),
      },
    })
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[data-cy=group-label]').should('have.text', 'EDIT')
  })

  it('renders the empty state, and #empty replaces it', () => {
    cy.mount(Dropdown, {
      props: { options: [{ label: 'Hidden', condition: () => false }] },
    })
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[data-slot=empty]').should('contain.text', 'No options')

    cy.mount(Dropdown, {
      props: { options: [] },
      slots: { empty: () => h('span', {}, 'Nothing here') },
    })
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[data-slot=empty]').should('contain.text', 'Nothing here')
  })

  it('does not render the removed { group, items } shape', () => {
    cy.mount(Dropdown, {
      props: {
        options: [{ group: 'Edit', items: [{ label: 'Rename' }] }] as any,
      },
    })

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menuitem]').should('not.exist')
    cy.get('[data-slot=empty]').should('exist')
  })
})
