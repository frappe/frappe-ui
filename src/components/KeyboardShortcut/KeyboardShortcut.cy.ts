import KeyboardShortcut from './KeyboardShortcut.vue'

describe('<KeyboardShortcut />', () => {
  it('renders a combo as separate keys', () => {
    cy.mount(KeyboardShortcut, { props: { combo: 'Mod+K' } })
    cy.get('[role="note"]').should('exist')
    cy.contains('K').should('exist')
  })

  it('renders bg chip style with kbd elements', () => {
    cy.mount(KeyboardShortcut, { props: { combo: 'Mod+Shift+K', bg: true } })
    cy.get('kbd').should('have.length', 3)
  })

  it('shows + separators by default and hides them when showPlus is false', () => {
    cy.mount(KeyboardShortcut, { props: { combo: 'Mod+K' } })
    cy.contains('+').should('exist')

    cy.mount(KeyboardShortcut, {
      props: { combo: 'Mod+K', showPlus: false },
    })
    cy.contains('+').should('not.exist')
  })

  it('renders alternative combos after a separator', () => {
    cy.mount(KeyboardShortcut, {
      props: { combo: 'Mod+Backspace', altCombos: ['Delete'] },
    })
    cy.contains('/').should('exist')
  })

  it('sets an aria-label describing the shortcut', () => {
    cy.mount(KeyboardShortcut, { props: { combo: 'Mod+K' } })
    cy.get('[role="note"]')
      .invoke('attr', 'aria-label')
      .should('match', /Shortcut/)
  })

  it('falls back to the default slot when no combo is given', () => {
    cy.mount(KeyboardShortcut, {
      slots: { default: 'Custom fallback' },
    })
    cy.contains('Custom fallback').should('exist')
  })
})
