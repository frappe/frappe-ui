import ContextMenu from './ContextMenu.vue'
import { defineComponent, h, ref } from 'vue'

const trigger = () =>
  h('div', { 'data-cy': 'trigger', style: 'padding: 20px; display: inline-block' }, 'Right-click me')

const simpleOptions = [
  { label: 'Open', icon: 'lucide-external-link' },
  { label: 'Rename', icon: 'lucide-pen' },
  { label: 'Delete', icon: 'lucide-trash-2', theme: 'red' },
]

describe('ContextMenu', () => {
  it('calls onClick and closes the menu when an item is selected', () => {
    const onClick = cy.stub().as('onClick')

    cy.mount(ContextMenu, {
      props: { options: [{ label: 'Open', onClick }] },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menuitem]').click()
    cy.get('@onClick').should('have.been.calledOnce')
    cy.get('[role=menu]').should('not.exist')
  })

  it('renders group labels for grouped options', () => {
    cy.mount(ContextMenu, {
      props: {
        options: [
          {
            group: 'Actions',
            options: [{ label: 'Edit' }, { label: 'Duplicate' }],
          },
          {
            group: 'Danger',
            options: [{ label: 'Delete', theme: 'red' }],
          },
        ],
      },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.contains('[data-slot=group-label]', 'Actions').should('exist')
    cy.contains('[data-slot=group-label]', 'Danger').should('exist')
    cy.get('[role=menuitem]').should('have.length', 3)
  })

  it('hides items when condition returns false', () => {
    cy.mount(ContextMenu, {
      props: {
        options: [
          { label: 'Visible', condition: () => true },
          { label: 'Hidden', condition: () => false },
        ],
      },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menuitem]').should('have.length', 1)
    cy.contains('[role=menuitem]', 'Hidden').should('not.exist')
  })

  it('opens submenus', () => {
    cy.mount(ContextMenu, {
      props: {
        options: [
          {
            label: 'Share',
            submenu: [
              { label: 'Copy link' },
              { label: 'Invite people' },
            ],
          },
        ],
      },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role="menuitem"][aria-haspopup="menu"]').click()
    cy.get('[role=menu]').should('have.length', 2)
    cy.contains('[role=menuitem]', 'Copy link').should('exist')
  })

  it('switch items render a toggle and fire onClick with the new boolean', () => {
    const onToggle = cy.stub().as('onToggle')

    cy.mount(ContextMenu, {
      props: { options: [{ label: 'Dark mode', switch: true, switchValue: false, onClick: onToggle }] },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=switch]').should('have.attr', 'aria-checked', 'false')
    cy.get('[role=switch]').click()
    cy.get('@onToggle').should('have.been.calledOnceWith', true)
  })

  it('accepts an explicit #trigger slot as the right-clickable area', () => {
    cy.mount(ContextMenu, {
      props: { options: simpleOptions },
      slots: {
        trigger: () =>
          h('div', { 'data-cy': 'named-trigger', style: 'padding: 20px' }, 'Named trigger'),
      },
    })

    cy.get('[data-cy=named-trigger]').rightclick()
    cy.get('[role=menu]').should('exist')
  })

  it('opens without an enter/exit animation (instant motion)', () => {
    // The menu appears at the cursor with no transform-origin tying it there,
    // so a scale entrance grew it from its own middle and only added latency.
    cy.mount(ContextMenu, {
      props: { options: simpleOptions },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[data-slot="content"]').should(
      'have.attr',
      'data-motion',
      'instant',
    )
  })

  it('closes when clicking outside the menu', () => {
    cy.mount(ContextMenu, {
      props: { options: simpleOptions },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menu]').should('exist')
    cy.get('body').click(0, 0, { force: true })
    cy.get('[role=menu]').should('not.exist')
  })

  it('updates v-model:open when the menu opens and closes', () => {
    const open = ref(false)

    cy.mount(defineComponent({
      setup() {
        return () =>
          h('div', [
            h('span', { 'data-cy': 'state' }, open.value ? 'open' : 'closed'),
            h(
              ContextMenu,
              {
                open: open.value,
                'onUpdate:open': (val: boolean) => { open.value = val },
                options: [{ label: 'Edit' }],
              },
              {
                default: () =>
                  h('div', { 'data-cy': 'trigger', style: 'padding: 20px' }, 'Right-click me'),
              },
            ),
          ])
      },
    }))

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[data-cy=state]').should('have.text', 'open')
    cy.get('[role=menuitem]').click()
    cy.get('[data-cy=state]').should('have.text', 'closed')
  })

  it('prevents scroll while the menu is open', () => {
    cy.mount(ContextMenu, {
      props: { options: simpleOptions },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menu]').should('exist')

    cy.window().then((win) => {
      const event = new WheelEvent('wheel', { deltaY: 100, cancelable: true, bubbles: true })
      win.dispatchEvent(event)
      expect(event.defaultPrevented).to.be.true
    })
  })

  it('releases scroll lock when the menu closes', () => {
    cy.mount(ContextMenu, {
      props: { options: simpleOptions },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menu]').should('exist')
    cy.get('body').click(0, 0, { force: true })
    cy.get('[role=menu]').should('not.exist')

    cy.window().then((win) => {
      const event = new WheelEvent('wheel', { deltaY: 100, cancelable: true, bubbles: true })
      win.dispatchEvent(event)
      expect(event.defaultPrevented).to.be.false
    })
  })

  it('disabled items do not fire onClick', () => {
    const onClick = cy.stub().as('onClick')

    cy.mount(ContextMenu, {
      props: { options: [{ label: 'Delete', disabled: true, onClick }] },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menuitem]').should('have.attr', 'data-disabled')
    cy.get('[role=menuitem]').click({ force: true })
    cy.get('@onClick').should('not.have.been.called')
  })

  it('supports arrow keys, Enter, and Escape', () => {
    const onClick = cy.stub().as('onClick')

    cy.mount(ContextMenu, {
      props: {
        options: [
          { label: 'Open', onClick: () => {} },
          { label: 'Rename', onClick },
        ],
      },
      slots: { default: trigger },
    })

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menu]').type('{downarrow}{downarrow}')
    cy.contains('[role=menuitem]', 'Rename').should(
      'have.attr',
      'data-highlighted',
    )
    cy.focused().type('{enter}')
    cy.get('@onClick').should('have.been.called')
    cy.get('[role=menu]').should('not.exist')

    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[role=menu]').type('{esc}')
    cy.get('[role=menu]').should('not.exist')
  })

  it('renders the empty state, and #empty replaces it', () => {
    cy.mount(ContextMenu, {
      props: { options: [] },
      slots: { default: trigger },
    })
    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[data-slot=empty]').should('contain.text', 'No options')

    cy.mount(ContextMenu, {
      props: { options: [] },
      slots: {
        default: trigger,
        empty: () => h('span', {}, 'Nothing here'),
      },
    })
    cy.get('[data-cy=trigger]').rightclick()
    cy.get('[data-slot=empty]').should('contain.text', 'Nothing here')
  })
})
