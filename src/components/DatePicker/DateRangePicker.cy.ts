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

    const todayStr = getTodaysDate() + ' to ' + getTodaysDate()
    cy.get('input').should('have.value', todayStr)
  })
})
