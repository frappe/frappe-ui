import { defineComponent, h, ref } from 'vue'
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog.vue'
import {
  useKeyboardShortcut,
  type KeyboardShortcutConfig,
  type KeyboardShortcutGroup,
} from '../../composables/useKeyboardShortcut'

// Registers shortcuts and renders the dialog in one tree, so the module-level
// registry the dialog reads holds them.
const Harness = (
  shortcuts: KeyboardShortcutConfig[],
  props: Record<string, unknown> = {},
  slots?: Record<string, unknown>,
) =>
  defineComponent({
    setup() {
      useKeyboardShortcut(shortcuts)
      return () => h(KeyboardShortcutsDialog, { open: true, ...props }, slots)
    },
  })

const shortcut = (i: number, group = 'General'): KeyboardShortcutConfig => ({
  combo: `Mod+Shift+Digit${i % 10}` as KeyboardShortcutConfig['combo'],
  description: `Action ${i}`,
  group,
  handler: () => {},
})

describe('<KeyboardShortcutsDialog />', () => {
  it('renders while open', () => {
    cy.mount(Harness([shortcut(1)]))
    cy.get('[role=dialog]').should('exist')
    cy.contains('Action 1').should('exist')
  })

  it('shows an empty state when no shortcuts are registered', () => {
    cy.mount(Harness([]))
    cy.get('[data-slot=empty][data-state=empty]').should('exist')
    cy.contains('No keyboard shortcuts available on this page.').should('exist')
  })

  it('groups shortcuts under their group heading', () => {
    cy.mount(Harness([shortcut(1, 'Editing'), shortcut(2, 'Navigation')]))
    cy.get('[data-slot=group-title]').should('have.length', 2)
    cy.contains('[data-slot=group-title]', 'Editing').should('exist')
    cy.contains('[data-slot=group-title]', 'Navigation').should('exist')
  })

  it('hides the search input below the threshold and shows it above', () => {
    const few = Array.from({ length: 3 }, (_, i) => shortcut(i))
    cy.mount(Harness(few, { searchThreshold: 20 }))
    cy.get('[data-slot=search] input').should('not.exist')

    const many = Array.from({ length: 25 }, (_, i) => shortcut(i))
    cy.mount(Harness(many, { searchThreshold: 20 }))
    cy.get('[data-slot=search] input').should('exist')
  })

  it('filters shortcuts by description when searching', () => {
    const many = Array.from({ length: 25 }, (_, i) => shortcut(i))
    cy.mount(Harness(many, { searchThreshold: 20 }))
    cy.get('input[placeholder="Search shortcuts"]').type('Action 24')
    cy.contains('Action 24').should('exist')
    cy.contains('Action 1').should('not.exist')
  })

  it('leaves out a shortcut whose enabled is false', () => {
    cy.mount(
      Harness([
        { combo: 'Mod+S', description: 'Save', handler: () => {} },
        {
          combo: 'Mod+Z',
          description: 'Undo',
          enabled: false,
          handler: () => {},
        },
      ]),
    )
    cy.contains('Save').should('exist')
    cy.contains('Undo').should('not.exist')
  })

  it('merges shortcuts that share a description into one row', () => {
    cy.mount(
      Harness([
        { combo: 'Mod+Z', description: 'Undo', handler: () => {} },
        { combo: 'Mod+Shift+Z', description: 'Redo', handler: () => {} },
        { combo: 'Mod+Y', description: 'Redo', handler: () => {} },
      ]),
    )
    cy.get('[data-slot=shortcut]').should('have.length', 2)
    cy.get('[data-slot=shortcut]:contains("Redo")').should('have.length', 1)
    cy.contains('[data-slot=shortcut]', 'Redo')
      .find('[data-slot=alt-combos]')
      .should('exist')
  })

  it('replaces the grid through the default slot, which gets the groups', () => {
    cy.mount(
      Harness(
        [shortcut(1, 'Editing')],
        {},
        {
          default: ({ groups }: { groups: KeyboardShortcutGroup[] }) =>
            h(
              'div',
              { 'data-testid': 'custom' },
              groups.map((group) =>
                h('p', `${group.name}: ${group.shortcuts.length}`),
              ),
            ),
        },
      ),
    )
    cy.get('[data-testid=custom]').should('contain.text', 'Editing: 1')
    cy.get('[data-slot=groups]').should('not.exist')
  })

  it('closes on Escape', () => {
    const open = ref(true)
    cy.mount(
      defineComponent({
        setup() {
          useKeyboardShortcut([shortcut(1)])
          return () =>
            h(KeyboardShortcutsDialog, {
              open: open.value,
              'onUpdate:open': (value: boolean) => (open.value = value),
            })
        },
      }),
    )
    cy.get('[role=dialog]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('[role=dialog]').should('not.exist')
  })
})
