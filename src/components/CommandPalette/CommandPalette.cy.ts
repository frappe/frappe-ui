import { defineComponent, h, ref } from 'vue'
import CommandPalette from './CommandPalette.vue'
import type { CommandPaletteGroup } from './types'

const groups: CommandPaletteGroup[] = [
  {
    title: 'Pages',
    items: [
      { name: 'inbox', title: 'Inbox' },
      { name: 'settings', title: 'Settings', description: 'App settings' },
    ],
  },
  {
    title: 'Hidden group',
    hideTitle: true,
    items: [{ name: 'help', title: 'Help' }],
  },
]

// Owns `open` itself so the Dialog's v-model round-trips (Mod+K, item
// selection, and Escape all need to be able to close/open it for real).
const Harness = (initialOpen: boolean, onSelect?: (item: unknown) => void) =>
  defineComponent({
    setup() {
      const open = ref(initialOpen)
      const searchQuery = ref('')
      return () =>
        h(CommandPalette, {
          open: open.value,
          'onUpdate:open': (v: boolean) => (open.value = v),
          searchQuery: searchQuery.value,
          'onUpdate:searchQuery': (v: string) => (searchQuery.value = v),
          groups,
          onSelect,
        })
    },
  })

describe('CommandPalette', () => {
  it('does not render while closed; renders when open (v-model:open)', () => {
    cy.mount(Harness(false))
    cy.get('[role=dialog]').should('not.exist')

    cy.mount(Harness(true))
    cy.get('[role=dialog]').should('exist')
  })

  it('renders group titles and items, honoring hideTitle', () => {
    cy.mount(Harness(true))
    cy.contains('Pages').should('exist')
    cy.contains('Inbox').should('exist')
    cy.contains('Settings').should('exist')
    cy.contains('App settings').should('exist')
    cy.contains('Hidden group').should('not.exist')
    cy.contains('Help').should('exist')
  })

  it('emits select and closes when an item is picked', () => {
    const onSelect = cy.spy().as('onSelect')
    cy.mount(Harness(true, onSelect))
    cy.contains('Inbox').click()
    cy.get('@onSelect').should(
      'have.been.calledWith',
      Cypress.sinon.match({ name: 'inbox' }),
    )
    cy.get('[role=dialog]').should('not.exist')
  })

  it('updates search-query while typing', () => {
    cy.mount(Harness(true))
    cy.get('input[placeholder="Search"]').type('inb')
    cy.get('input[placeholder="Search"]').should('have.value', 'inb')
  })

  it('opens on Mod+K from anywhere on the page', () => {
    cy.mount(Harness(false))
    cy.get('[role=dialog]').should('not.exist')
    cy.get('body').type('{ctrl}k', { release: false })
    cy.get('[role=dialog]').should('exist')
  })
})
