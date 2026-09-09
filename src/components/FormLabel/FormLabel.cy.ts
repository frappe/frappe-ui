import FormLabel from './FormLabel.vue'
import TextInput from '../TextInput/TextInput.vue'

describe('FormLabel', () => {
  it('renders the label text', () => {
    cy.mount(FormLabel, {
      props: { label: 'Email' },
    })
    cy.get('label').should('contain.text', 'Email')
  })

  it('renders required indicator with an accessible note', () => {
    cy.mount(FormLabel, {
      props: { label: 'Name', required: true },
    })
    cy.get('label').within(() => {
      cy.get('span[aria-hidden="true"]').should('contain.text', '*')
      cy.get('span.sr-only').should('contain.text', '(required)')
    })
  })

  it('does not render the required indicator by default', () => {
    cy.mount(FormLabel, {
      props: { label: 'Name' },
    })
    cy.get('label').within(() => {
      cy.get('span[aria-hidden="true"]').should('not.exist')
      cy.get('span.sr-only').should('not.exist')
    })
  })

  it('wires the id prop to the for attribute', () => {
    cy.mount(FormLabel, {
      props: { label: 'Email', id: 'email-field' },
    })
    cy.get('label').should('have.attr', 'for', 'email-field')
  })

  it('renders at a fixed 13px in ink-gray-6', () => {
    cy.mount(FormLabel, {
      props: { label: 'Email' },
    })
    cy.get('label')
      .should('have.class', 'text-sm')
      .and('have.class', 'text-ink-gray-6')
      .and('have.css', 'font-size', '13px')
  })

  it('ignores a stale size attribute rather than resizing', () => {
    // `size` was removed with the fixed label type. It is not a prop any
    // more, so it falls through to the DOM as an attribute and changes
    // nothing — the label still reads at 13px.
    cy.mount(FormLabel, {
      props: { label: 'Email', size: 'md' } as never,
    })
    cy.get('label').should('have.css', 'font-size', '13px')
  })

  it('matches InputLabel, the other label implementation', () => {
    // The two used to disagree: 12px/14px here, a flat 14px there. Both are
    // 13px now, so `FormLabel` and a `TextInput` label are interchangeable.
    cy.mount(FormLabel, { props: { label: 'Email' } })
    cy.get('label').should('have.css', 'font-size', '13px')

    cy.mount(TextInput, { props: { label: 'Email' } })
    cy.get('label').should('have.css', 'font-size', '13px')
  })
})
