import DatePicker from './DatePicker.vue'

const monthsLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const currentYear = new Date().getFullYear()
const currentMonth = monthsLabels[new Date().getMonth()]

const getTodaysDate = () => {
  return new Date().toISOString().split('T')[0]
}

const getTomorrowsDate = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

describe('DatePicker', () => {
  it('renders', () => {
    cy.mount(DatePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').click()
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('action btns', () => {
    cy.mount(DatePicker)
    cy.get('input').click()
    cy.get('input').click()

    const currMonthIndex = monthsLabels.indexOf(currentMonth)
    const prevMonthIndex = currentMonth == 'Jan' ? 11 : currMonthIndex - 1
    const nextMonthIndex = currentMonth == 'Dec' ? 0 : currMonthIndex + 1
    const prevYear = currentMonth == 'Jan' ? currentYear - 1 : currentYear
    const nextYear = currentMonth == 'Dec' ? currentYear + 1 : currentYear

    cy.get('[aria-label=previous]').click()
    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels[prevMonthIndex] + ' ' + prevYear,
    )

    cy.get('[aria-label=next]').dblclick()

    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels[nextMonthIndex] + ' ' + nextYear,
    )
  })

  it('footer buttons', () => {
    cy.mount(DatePicker)
    cy.get('input').dblclick()

    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', getTodaysDate())

    cy.get('input').dblclick()

    cy.get('[aria-label="Tomorrow"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', getTomorrowsDate())

    cy.get('input').dblclick()

    cy.get('[aria-label="Clear"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', '')

    cy.get('[role=dialog]').should('not.exist')
  })

  it('autoclose', () => {
    cy.mount(DatePicker, {
      props: { autoClose: true },
    })

    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')

    cy.mount(DatePicker, {
      props: { autoClose: false },
    })

    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('v-model', () => {
    cy.mount(DatePicker, {
      props: {
        'onChange': cy.spy().as('onChange'),
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').dblclick()

    cy.get('[aria-label="Today"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', getTodaysDate())
    cy.get('@onChange').should('have.been.calledWith', getTodaysDate())
  })
})
