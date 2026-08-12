import KeyboardShortcut from './KeyboardShortcut.vue'

describe('<KeyboardShortcut />', () => {
  it('renders a combo as separate keys', () => {
    cy.mount(KeyboardShortcut, { props: { combo: 'Mod+K' } })
    cy.get('[role="img"]').should('exist')
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
    cy.get('[role="img"]')
      .first()
      .invoke('attr', 'aria-label')
      .should('match', /Shortcut/)
  })

  it('falls back to the default slot when no combo is given', () => {
    cy.mount(KeyboardShortcut, {
      slots: { default: 'Custom fallback' },
    })
    cy.contains('Custom fallback').should('exist')
  })

  it('carries the documented styling hooks', () => {
    cy.mount(KeyboardShortcut, { props: { combo: 'Mod+Shift+K' } })
    cy.get('[data-slot=keyboard-shortcut]').should('not.have.attr', 'data-bg')
    cy.get('[data-slot=keyboard-shortcut] [data-slot=key]').should(
      'have.length',
      3,
    )
    cy.get('[data-slot=key][data-key-type=shift]').should('exist')
    cy.get('[data-slot=keyboard-shortcut] [data-slot=separator]').should(
      'have.length',
      2,
    )

    cy.mount(KeyboardShortcut, { props: { combo: 'Mod+K', bg: true } })
    cy.get('[data-slot=keyboard-shortcut]').should(
      'have.attr',
      'data-bg',
      'true',
    )
  })

  it('renders the key names a shortcut combo uses', () => {
    cy.mount(KeyboardShortcut, { props: { combo: 'Digit1' } })
    cy.get('[data-slot=key]').should('contain.text', '1')

    cy.mount(KeyboardShortcut, { props: { combo: 'Slash' } })
    cy.get('[data-slot=key]').should('contain.text', '/')

    cy.mount(KeyboardShortcut, { props: { combo: 'Backtick' } })
    cy.get('[data-slot=key]').should('contain.text', '`')
  })

  it('takes no role without a combo, so the fallback slot stays readable', () => {
    cy.mount(KeyboardShortcut, { slots: { default: 'Custom fallback' } })
    // A negative attribute assertion yields undefined, so it ends the chain.
    cy.get('[data-slot=keyboard-shortcut]').should('not.have.attr', 'role')
    cy.get('[data-slot=keyboard-shortcut]').should(
      'contain.text',
      'Custom fallback',
    )
  })

  it('drops the non-modifier icons when useIcons is false, in both modes', () => {
    cy.mount(KeyboardShortcut, {
      props: { combo: 'Mod+Enter', bg: true, useIcons: false },
    })
    cy.get('[data-slot=key]').last().should('contain.text', '\u21b5')
    cy.get('[data-slot=key] .lucide-corner-down-left').should('not.exist')
    // A modifier glyph is not one of the keys the prop names, so it stays.
    cy.get('[data-slot=key] .lucide-command, [data-slot=key]')
      .first()
      .should('exist')

    cy.mount(KeyboardShortcut, {
      props: { combo: 'Mod+Enter', bg: true, useIcons: true },
    })
    cy.get('[data-slot=key] .lucide-corner-down-left').should('exist')
  })

  it('nests the alternative combos inside the root and names them', () => {
    cy.mount(KeyboardShortcut, {
      props: { combo: 'Mod+Backspace', altCombos: ['Delete'] },
    })
    // A labelled `role="img"` already hides the subtree, so the alternatives
    // need no `aria-hidden` of their own.
    cy.get('[data-slot=keyboard-shortcut] [data-slot=alt-combos]').should(
      'exist',
    )
    cy.get('[data-slot=keyboard-shortcut]')
      .first()
      .invoke('attr', 'aria-label')
      .should('contain', ', or Delete')
  })
})
