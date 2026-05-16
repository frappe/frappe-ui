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

const pad = (n: number) => String(n).padStart(2, '0')
const getTodaysDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

describe('DatePicker', () => {
  it('renders', () => {
    cy.mount(DatePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
  })

  it('action btns', () => {
    cy.mount(DatePicker)
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

  it('today button selects today and closes popover', () => {
    cy.mount(DatePicker)
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', getTodaysDate())
  })

  it('clear button removes the value', () => {
    // Pre-seed via modelValue so the Clear footer button is rendered on first open.
    cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
    cy.get('input').should('have.value', '2025-06-15')
    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', '')
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
        onChange: cy.spy().as('onChange'),
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').dblclick()

    cy.get('[aria-label="Today"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', getTodaysDate())
    cy.get('@onChange').should('have.been.calledWith', getTodaysDate())
  })

  it('keepOpen prop', () => {
    cy.mount(DatePicker, { props: { keepOpen: true } })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('readonly prop', () => {
    cy.mount(DatePicker, { props: { readonly: true } })
    cy.get('input').should('have.attr', 'readonly')
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('minDate and maxDate disable out-of-range cells', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        minDate: '2025-06-10',
        maxDate: '2025-06-20',
      },
    })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="2025-06-09"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-21"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-15"]').should('not.have.attr', 'aria-disabled')
  })

  it('isDateUnavailable callback disables matching cells', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        // disable weekends in the rendered month
        isDateUnavailable: (d: any) => d.day() === 0 || d.day() === 6,
      },
    })
    cy.get('input').dblclick()
    // 2025-06-14 is a Saturday, 2025-06-15 is a Sunday, 2025-06-16 is a Monday
    cy.get('[aria-label="2025-06-14"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-15"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-16"]').should('not.have.attr', 'aria-disabled')
  })

  it('exposes open() method', () => {
    cy.mount(DatePicker).then(({ component }) => {
      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => (component as any).open())
      cy.get('[role=dialog]').should('exist')
    })
  })
})
