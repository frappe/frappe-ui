import { h } from 'vue'
import Divider from './Divider.vue'

describe('Divider', () => {
  it('renders a horizontal divider by default', () => {
    cy.mount(Divider)

    cy.get('hr')
      .should('exist')
      .and('have.class', 'border-t-[1px]')
      .and('have.class', 'w-full')
  })

  it('renders a vertical divider', () => {
    cy.mount(Divider, {
      props: {
        orientation: 'vertical',
      },
    })

    cy.get('hr')
      .should('exist')
      .and('have.class', 'border-l-[1px]')
      .and('not.have.class', 'w-full')
  })

  it('renders an action button and calls its onClick handler', () => {
    const onClick = cy.stub().as('actionOnClick')

    cy.mount(Divider, {
      props: {
        action: {
          label: 'Load more',
          onClick,
        },
      },
    })

    cy.contains('button', 'Load more').click()
    cy.get('@actionOnClick').should('have.been.calledOnce')
    cy.get('div').should('exist')
  })

  it('supports deprecated handler and warns once', () => {
    const handler = cy.stub().as('actionHandler')

    cy.window().then((win) => {
      cy.stub(win.console, 'warn').as('consoleWarn')
    })

    cy.mount(Divider, {
      props: {
        action: {
          label: 'Load more',
          handler,
        },
      },
    })

    cy.get('@consoleWarn').then((consoleWarn) => {
      const matchingCalls = (consoleWarn as sinon.SinonStub)
        .getCalls()
        .filter((call) =>
          /Divider\.action\.handler is deprecated/.test(String(call.args[0])),
        )

      expect(matchingCalls).to.have.length(1)
    })

    cy.contains('button', 'Load more').click()
    cy.get('@actionHandler').should('have.been.calledOnce')
  })

  it('does not overlap sibling content in vertical action mode', () => {
    cy.mount({
      render() {
        return h('div', { class: 'flex h-32 items-center gap-4' }, [
          h('span', { 'data-cy': 'left' }, 'Left panel'),
          h(Divider, {
            orientation: 'vertical',
            flexItem: true,
            action: {
              label: 'Edit',
              onClick: () => {},
            },
          }),
          h('span', { 'data-cy': 'right' }, 'Right panel'),
        ])
      },
    })

    cy.get('button')
      .should('exist')
      .then(($button) => {
        const buttonRect = $button[0].getBoundingClientRect()

        cy.get('[data-cy="left"]').then(($left) => {
          const leftRect = $left[0].getBoundingClientRect()
          expect(leftRect.right).to.be.lessThan(buttonRect.left)
        })

        cy.get('[data-cy="right"]').then(($right) => {
          const rightRect = $right[0].getBoundingClientRect()
          expect(rightRect.left).to.be.greaterThan(buttonRect.right)
        })
      })
  })
})
