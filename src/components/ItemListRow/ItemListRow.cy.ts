import ItemListRow from './ItemListRow.vue'

describe('ItemListRow', () => {
  it('renders the default label region', () => {
    cy.mount(ItemListRow, {
      slots: {
        default: 'Row label',
      },
    })

    cy.get('[data-slot="item-label"]').should('contain.text', 'Row label')
  })

  it('omits empty prefix and suffix regions', () => {
    cy.mount(ItemListRow, {
      slots: {
        label: 'Only label',
      },
    })

    cy.get('[data-slot="item-prefix"]').should('not.exist')
    cy.get('[data-slot="item-suffix"]').should('not.exist')
  })

  it('treats selected rows as active styling', () => {
    cy.mount(ItemListRow, {
      props: {
        selected: true,
      },
      slots: {
        default: 'Selected row',
      },
    })

    cy.get('[data-slot="item-list-row"]')
      .should('have.attr', 'data-state', 'active')
      .and('not.have.attr', 'data-disabled')
  })

  it('renders disabled hooks', () => {
    cy.mount(ItemListRow, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Disabled row',
      },
    })

    cy.get('[data-slot="item-list-row"]').should('have.attr', 'data-disabled')
  })

  it('renders #prefix and #suffix content, and #label over the default slot', () => {
    cy.mount(ItemListRow, {
      slots: {
        default: 'Default label',
        label: 'Named label',
        prefix: 'P',
        suffix: 'S',
      },
    })

    cy.get('[data-slot="item-prefix"]').should('contain.text', 'P')
    cy.get('[data-slot="item-suffix"]').should('contain.text', 'S')
    cy.get('[data-slot="item-label"]')
      .should('contain.text', 'Named label')
      .and('not.contain.text', 'Default label')
  })

  it('reflects size via data-size', () => {
    cy.mount(ItemListRow, {
      props: { size: 'lg' },
      slots: { default: 'Row' },
    })

    cy.get('[data-slot="item-list-row"]').should('have.attr', 'data-size', 'lg')
  })
})
