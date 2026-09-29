import SplitButton from './SplitButton.vue'

describe('SplitButton', () => {
  it('runs the main action on click, and a menu action from the chevron', () => {
    const onClick = cy.spy().as('onClick')
    const onStaging = cy.spy().as('onStaging')
    cy.mount(SplitButton, {
      props: {
        label: 'Publish',
        options: [{ label: 'Publish to staging', onClick: onStaging }],
        onClick,
      },
    })

    cy.contains('button', 'Publish').click()
    cy.get('@onClick').should('have.been.calledOnce')
    cy.get('[role=menu]').should('not.exist')

    cy.get('[aria-haspopup=menu]').click()
    cy.contains('[role=menuitem]', 'Publish to staging').click()
    cy.get('@onStaging').should('have.been.calledOnce')
    cy.get('@onClick').should('have.been.calledOnce')
  })

  it('opens the menu from the keyboard and returns focus to the chevron', () => {
    const onStaging = cy.spy().as('onStaging')
    cy.mount(SplitButton, {
      props: {
        label: 'Publish',
        menuLabel: 'More ways to publish',
        options: [
          { label: 'Publish to staging', onClick: onStaging },
          { label: 'Unpublish', onClick: () => {} },
        ],
      },
    })

    cy.get('[aria-label="More ways to publish"]').focus()
    cy.focused().type('{enter}')
    cy.get('[role=menu]').should('be.visible')
    cy.get('[role=menu]').type('{esc}')
    cy.get('[role=menu]').should('not.exist')
    cy.focused().should('have.attr', 'aria-label', 'More ways to publish')

    cy.focused().type('{downarrow}')
    cy.contains('[role=menuitem]', 'Publish to staging').should(
      'have.attr',
      'data-highlighted',
    )
    cy.focused().type('{enter}')
    cy.get('@onStaging').should('have.been.calledOnce')
  })

  it("doesn't open the menu while loading", () => {
    cy.mount(SplitButton, {
      props: {
        label: 'Publish',
        loading: true,
        options: [{ label: 'Unpublish', onClick: () => {} }],
      },
    })
    cy.get('[aria-haspopup=menu]')
      .should('not.be.disabled')
      .and('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-haspopup=menu]').click({ force: true })
    cy.get('[role=menu]').should('not.exist')
    cy.get('[aria-haspopup=menu]').focus().type('{enter}')
    cy.get('[role=menu]').should('not.exist')
  })
})
