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

  describe('Item with both href and onClick', () => {
    // reports what the component left on the event, see mountLinkItem()
    const report = { defaultPrevented: (_prevented: boolean) => {} }

    function mountLinkItem() {
      const onClick = cy.stub().as('onClick')
      const linkItems = [
        { label: 'Home', href: '/home', onClick },
        { label: 'Users' },
      ]
      cy.mount(Breadcrumbs, { props: { items: linkItems } })

      cy.spy(report, 'defaultPrevented').as('defaultPrevented')
      cy.get('a[href="/home"]').then(($link) => {
        // runs after the component handler, because Vue bound its own first
        $link[0].addEventListener('click', (event) => {
          report.defaultPrevented(event.defaultPrevented)
          // keep the test on the page whatever the component decided
          event.preventDefault()
        })
      })
    }

    it('Keeps the real URL on the crumb', () => {
      mountLinkItem()

      cy.get('a').should('have.attr', 'href', '/home')
    })

    it('Runs onClick and stops the browser on a plain click', () => {
      mountLinkItem()

      cy.get('a[href="/home"]').click()

      cy.get('@onClick').should('have.been.calledOnce')
      // the handler gets the event, already prevented
      cy.get('@onClick').its('firstCall.args.0.type').should('eq', 'click')
      cy.get('@defaultPrevented').should('have.been.calledWith', true)
    })

    it('Leaves a modified click to the browser', () => {
      mountLinkItem()

      cy.get('a[href="/home"]').click({ metaKey: true })

      cy.get('@onClick').should('not.have.been.called')
      cy.get('@defaultPrevented').should('have.been.calledWith', false)
    })
  })
})
