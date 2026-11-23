import TableSizePicker from './TableSizePicker.vue'

function pickWith(keys: string) {
  const onPick = cy.spy().as('onPick')
  cy.mount(TableSizePicker, { props: { onPick } })
  cy.get('[role="grid"]').focus().type(keys)
}

describe('TableSizePicker', () => {
  it('ArrowRight adds a column', () => {
    pickWith('{rightArrow}{enter}')
    cy.get('@onPick').should('have.been.calledWith', { rows: 3, cols: 4 })
  })

  describe('on an RTL page', () => {
    beforeEach(() => {
      document.documentElement.dir = 'rtl'
    })
    afterEach(() => {
      document.documentElement.dir = ''
    })

    it('ArrowLeft adds a column, as the grid grows to the left', () => {
      pickWith('{leftArrow}{enter}')
      cy.get('@onPick').should('have.been.calledWith', { rows: 3, cols: 4 })
    })

    it('ArrowRight removes a column', () => {
      pickWith('{rightArrow}{enter}')
      cy.get('@onPick').should('have.been.calledWith', { rows: 3, cols: 2 })
    })
  })
})
