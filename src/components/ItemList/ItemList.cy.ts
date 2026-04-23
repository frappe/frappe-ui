import ItemList from './ItemList.vue'

describe('ItemList', () => {
  it('renders items and emits item-click', () => {
    const onItemClick = cy.spy().as('onItemClick')

    cy.mount(ItemList, {
      props: {
        items: [
          { label: 'First', value: 'first' },
          { label: 'Second', value: 'second' },
        ],
        onItemClick,
      },
    })

    cy.get('[data-slot="item"]').should('have.length', 2)
    cy.contains('button', 'First').click()
    cy.get('@onItemClick').should('have.been.calledWithMatch', {
      label: 'First',
      value: 'first',
    })
  })

  it('renders grouped items', () => {
    cy.mount(ItemList, {
      props: {
        groups: [
          {
            group: 'Favorites',
            items: [{ label: 'Apple', value: 'apple' }],
          },
          {
            group: 'Others',
            items: [{ label: 'Orange', value: 'orange' }],
          },
        ],
      },
    })

    cy.contains('[data-slot="group-label"]', 'Favorites').should('exist')
    cy.contains('[data-slot="group-label"]', 'Others').should('exist')
    cy.get('[data-slot="item"]').should('have.length', 2)
  })

  it('renders selected styling without a built-in checkmark', () => {
    cy.mount(ItemList, {
      props: {
        items: [{ label: 'Selected', value: 'selected', selected: true }],
      },
    })

    cy.get('[data-slot="item-list-row"]').should(
      'have.attr',
      'data-state',
      'active',
    )
    cy.get('[data-slot="item-suffix"]').should('not.exist')
  })

  it('does not emit item-click for disabled items', () => {
    const onItemClick = cy.spy().as('onItemClick')

    cy.mount(ItemList, {
      props: {
        items: [{ label: 'Disabled', value: 'disabled', disabled: true }],
        onItemClick,
      },
    })

    cy.contains('button', 'Disabled')
      .should('be.disabled')
      .click({ force: true })
    cy.get('@onItemClick').should('not.have.been.called')
  })

  it('prefers normalized groups over items and omits empty groups', () => {
    cy.mount(ItemList, {
      props: {
        items: [{ label: 'Ignored item', value: 'ignored' }],
        groups: [
          {
            group: 'Hidden',
            items: [],
          },
          {
            group: 'Visible',
            items: [{ label: 'Grouped item', value: 'grouped' }],
          },
        ],
      },
    })

    cy.contains('[data-slot="group-label"]', 'Hidden').should('not.exist')
    cy.contains('[data-slot="group-label"]', 'Visible').should('exist')
    cy.contains('button', 'Ignored item').should('not.exist')
    cy.contains('button', 'Grouped item').should('exist')
  })

  it('renders empty state', () => {
    cy.mount(ItemList, {
      props: {
        items: [],
        emptyText: 'Nothing here',
      },
    })

    cy.contains('[data-slot="empty"]', 'Nothing here').should('exist')
  })
})
