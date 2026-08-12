import { defineComponent, h } from 'vue'
import KeyboardShortcutsModal from './KeyboardShortcutsModal.vue'
import { useShortcut, type ShortcutConfig } from '../../composables/useShortcut'

// Registers shortcuts via useShortcut and renders the modal in the same tree,
// so getActiveShortcuts() (module-level registry) picks them up.
const Harness = (
  shortcuts: ShortcutConfig[],
  props: Record<string, unknown> = {},
) =>
  defineComponent({
    setup() {
      useShortcut(shortcuts)
      return () => h(KeyboardShortcutsModal, { open: true, ...props })
    },
  })

const shortcut = (i: number, group = 'General'): ShortcutConfig => ({
  key: String(i),
  ctrl: true,
  description: `Action ${i}`,
  group,
  handler: () => {},
})

describe('KeyboardShortcutsModal', () => {
  it('renders while open', () => {
    cy.mount(Harness([shortcut(1)]))
    cy.get('[role=dialog]').should('exist')
    cy.contains('Action 1').should('exist')
  })

  it('shows an empty state when no shortcuts are registered', () => {
    cy.mount(Harness([]))
    cy.contains('No keyboard shortcuts available on this page.').should(
      'exist',
    )
  })

  it('groups shortcuts under their group heading', () => {
    cy.mount(
      Harness([shortcut(1, 'Editing'), shortcut(2, 'Navigation')]),
    )
    cy.contains('Editing').should('exist')
    cy.contains('Navigation').should('exist')
  })

  it('hides the search input below the search threshold, shows it above', () => {
    const few = Array.from({ length: 3 }, (_, i) => shortcut(i))
    cy.mount(Harness(few, { searchThreshold: 20 }))
    cy.get('input[placeholder="Search shortcuts"]').should('not.exist')

    const many = Array.from({ length: 25 }, (_, i) => shortcut(i))
    cy.mount(Harness(many, { searchThreshold: 20 }))
    cy.get('input[placeholder="Search shortcuts"]').should('exist')
  })

  it('filters shortcuts by description when searching', () => {
    const many = Array.from({ length: 25 }, (_, i) => shortcut(i))
    cy.mount(Harness(many, { searchThreshold: 20 }))
    cy.get('input[placeholder="Search shortcuts"]').type('Action 24')
    cy.contains('Action 24').should('exist')
    cy.contains('Action 1').should('not.exist')
  })
})
