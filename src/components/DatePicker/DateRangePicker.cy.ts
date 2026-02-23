import DateRangePicker from './DateRangePicker.vue'

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

// 10 -> 2026-02-10
const getDateFromDay = (day: number) => {
  const d = new Date()
  d.setDate(day)
  return d.toISOString()?.split('T')?.[0]
}

describe('DateRangePicker', () => {
  it('renders', () => {
    cy.mount(DateRangePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').click()
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('action btns', () => {
    cy.mount(DateRangePicker)
    cy.get('input').click()
    cy.get('input').click()

    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      currentMonth.slice(0, 3) + ' ' + currentYear,
    )

    cy.get('[aria-label=previous]').click({ multiple: true })

    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels.at(-1) + ' ' + (currentYear - 1),
    )

    cy.get('[aria-label=next]').click({ multiple: true })

    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels[1] + ' ' + currentYear,
    )
  })

  it('Gridcells onclick', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

    cy.get('[role=dialog]').should('exist')

    cy.contains('10').click()
    cy.contains('13').click()

    const rangeDate = getDateFromDay(10) + ' to ' + getDateFromDay(13)

    cy.get('input').should('have.value', rangeDate)
  })

  it('Clear button', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

    cy.get('input').should('have.value', '')
    cy.contains('10').click()
    cy.contains('13').click()
    cy.get('input').should('not.have.value', '')

    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('input').should('have.text', '')
  })

  it('Today button', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

    cy.get('input').should('have.value', '')
    cy.get('[aria-label="Today"]').click()

    const todayStr =  getTodaysDate() + ' to ' + getTodaysDate()
    cy.get('input').should('have.value', todayStr)
  })
})
