import Breadcrumbs from './Breadcrumbs.vue'

const items = [
  { label: 'Home', route: { name: 'home' } },
  { label: 'Library', route: { name: 'library' } },
  { label: 'Data', route: { name: 'data' } },
  { label: 'Users', route: { name: 'users' } },
]

beforeEach(() => {
  cy.on('uncaught:exception', (err) => {
    if (err.message.includes('ResizeObserver loop')) {
      return false
    }
  })
})

describe('Breadcrumbs', () => {
  it('Render', () => {
    cy.mount(Breadcrumbs, {
      props: { items },
    })

    // separators are children too
    const childrenLen = items.length * 2 - 1

    const el = '.flex.min-w-0.items-center.text-ellipsis.whitespace-nowrap > *'
    cy.get(el)
      .should('have.length', childrenLen)
      .eq(0)
      .should('have.text', 'Home')
  })

  it('Test dropdown', () => {
    cy.mount(Breadcrumbs, {
      props: { items, class: 'w-3' },
    })

    const el = '.flex.min-w-0.items-center.text-ellipsis.whitespace-nowrap > *'
    cy.get(el).should('have.length', 3)

    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menuitem]').should('have.length', items.length - 2)
  })
})
