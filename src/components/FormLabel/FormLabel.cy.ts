import FormLabel from './FormLabel.vue'

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

  it('applies the size classes', () => {
    cy.mount(FormLabel, {
      props: { label: 'Email', size: 'md' },
    })
    cy.get('label').should('have.class', 'text-base')

    cy.mount(FormLabel, {
      props: { label: 'Email', size: 'sm' },
    })
    cy.get('label').should('have.class', 'text-xs')
  })
})
