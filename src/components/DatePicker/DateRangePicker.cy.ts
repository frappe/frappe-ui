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

const pad = (n: number) => String(n).padStart(2, '0')
const formatLocalDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const getTodaysDate = () => formatLocalDate(new Date())

// 10 -> 2026-02-10
const getDateFromDay = (day: number) => {
  const d = new Date()
  d.setDate(day)
  return formatLocalDate(d)
}

describe('DateRangePicker', () => {
  it('renders', () => {
    cy.mount(DateRangePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
  })

  it('action btns', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

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

  it('Clear button is disabled until both ends are selected', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

    cy.get('input').should('have.value', '')
    cy.get('[aria-label="Clear"]').should('be.disabled')
    cy.contains('10').click()
    cy.get('[aria-label="Clear"]').should('be.disabled')
    cy.contains('13').click()
    cy.get('input').should('not.have.value', '')
  })

  it('Clear button removes the value', () => {
    // Pre-seed via modelValue so the Clear button is enabled on first open.
    cy.mount(DateRangePicker, {
      props: { modelValue: ['2025-06-10', '2025-06-15'] },
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').should('not.be.disabled')
    cy.get('[aria-label="Clear"]').click()
    cy.get('input').should('have.value', '')
  })

  it('Today button', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

    cy.get('input').should('have.value', '')
    cy.get('[aria-label="Today"]').click()

    const todayStr = getTodaysDate() + ' to ' + getTodaysDate()
    cy.get('input').should('have.value', todayStr)
  })

  it('emits v-model as [from, to] array', () => {
    cy.mount(DateRangePicker, {
      props: {
        modelValue: ['2025-06-10', '2025-06-10'],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="2025-06-12"]').click()
    cy.get('[aria-label="2025-06-15"]').click()
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.deep.equal(['2025-06-12', '2025-06-15'])
    })
  })

  it('emits [] when range is cleared', () => {
    cy.mount(DateRangePicker, {
      props: {
        modelValue: ['2025-06-10', '2025-06-15'],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.deep.equal([])
    })
  })

  it('clearable=false hides footer', () => {
    cy.mount(DateRangePicker, { props: { clearable: false } })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Clear"]').should('not.exist')
  })

  it('minDate and maxDate disable out-of-range cells', () => {
    cy.mount(DateRangePicker, {
      props: {
        modelValue: ['2025-06-15', '2025-06-15'],
        minDate: '2025-06-10',
        maxDate: '2025-06-20',
      },
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="2025-06-09"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-21"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-15"]').should('not.have.attr', 'aria-disabled')
  })

  it('exposes open() method', () => {
    cy.mount(DateRangePicker).then(({ component }) => {
      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => (component as any).open())
      cy.get('[role=dialog]').should('exist')
    })
  })
})
