import Progress from './Progress.vue'

describe('Progress', () => {
  it('Renders', () => {
    const val = '20'

    cy.mount(Progress, {
      props: {
        label: 'label',
        value: val,
      },
    })

    cy.get('span').should('have.text', 'label')

    cy.get('[role=progressbar] div')
      .should('have.attr', 'style')
      .and('include', `width: ${val}%`)
  })

  it('hint prop & slot', () => {
    cy.mount(Progress, {
      props: {
        label: 'label',
        value: 20,
        hint: true,
      },
      slots: {
        hint: () => 'hint 20%',
      },
    })

    cy.get('div').should('contain.text', 'hint 20%')
  })

  it('intervals', () => {
    const intervalCount = 5
    const value = 60

    cy.mount(Progress, {
      props: {
        label: 'label',
        value,
        intervals: true,
        intervalCount,
      },
    })

    const filledCount = Math.round((value / 100) * intervalCount)

    // verify number of intervals divs
    // only filled intervals needs gray-7
    cy.get('[role=progressbar] div')
      .should('have.length', intervalCount)
      .each((x, i: number) => {
        const bgclass = `bg-surface-gray-${i < filledCount ? 7 : 2}`
        cy.wrap(x).should('have.class', bgclass)
      })
  })

  it('sizes', () => {
    const sizeclasses = {
      sm: 'h-[2px]',
      md: 'h-1',
      lg: 'h-2',
      xl: 'h-3',
    }

    for (const size in sizeclasses) {
      cy.mount(Progress, {
        props: {
          label: 'label',
          value: 20,
          size: size,
        },
      })
      cy.get('[role=progressbar]').should('have.class', sizeclasses[size])
    }
  })
})
