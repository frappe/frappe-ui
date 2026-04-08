import MonthPicker from './MonthPicker.vue'

const currentYear = new Date().getFullYear()
const yearRangeStart = currentYear - (currentYear % 12)

describe('MonthPicker', () => {
  it('renders', () => {
    cy.mount(MonthPicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('[aria-haspopup="dialog"]').should('have.attr', 'aria-expanded', 'false')

    cy.get('button').click()

    cy.get('[aria-haspopup="dialog"]').should('have.attr', 'aria-expanded', 'true')
    cy.get('[role=dialog]').should('exist')
  })

  it('action buttons', () => {
    cy.mount(MonthPicker)
    cy.get('button').click()

    cy.get('[aria-label="Toggle view mode"]').should('have.text', currentYear)

    cy.get('[aria-label="previous"]').click()

    cy.get('[aria-label="Toggle view mode"]').should('have.text', currentYear - 1)

    cy.get('[aria-label="next"]').click()

    cy.get('[aria-label="Toggle view mode"]').should('have.text', currentYear)
    cy.get('[aria-label="Toggle view mode"]').click()

    cy.get('[aria-label="Toggle view mode"]').should(
      'have.text',
      `${yearRangeStart} - ${yearRangeStart + 11}`,
    )

    cy.get('[aria-label="Toggle view mode"]').click()
    cy.get('[aria-label="Toggle view mode"]').should('have.text', currentYear)
  })

  it('disabled', () => {
    cy.mount(MonthPicker, {
      props: { disabled: true },
    })

    cy.get('button').should('have.attr', 'disabled')
  })

  it('v-model', () => {
    cy.mount(MonthPicker, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })

    cy.get('button').click()

    cy.get('[role=gridcell]:first').click()

    cy.get('[aria-haspopup=dialog]').then((x) => {
      cy.get('@onUpdate').should('have.been.calledWith', x.text().trim())
    })

    cy.get('[aria-label="Toggle view mode"]').click()

    cy.get('[role=gridcell]:first').click()

    cy.get('[aria-haspopup=dialog]').then((x) => {
      cy.get('@onUpdate').should('have.been.calledWith', x.text().trim())
    })
  })
})
