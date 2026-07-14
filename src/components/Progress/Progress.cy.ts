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
    // only filled intervals needs gray-10
    cy.get('[role=progressbar] div')
      .should('have.length', intervalCount)
      .each((x, i: number) => {
        const bgclass = `bg-surface-gray-${i < filledCount ? 10 : 2}`
        cy.wrap(x).should('have.class', bgclass)
      })
  })

  it('fill transition', () => {
    cy.mount(Progress, {
      props: {
        label: 'label',
        value: 20,
      },
    })

    // the continuous fill animates its width, with the default duration.
    // the curve is linear on purpose: callers update `value` on a timer, and
    // a decelerating curve visibly stutters each time it is retargeted.
    cy.get('[role=progressbar] div')
      .should('have.class', 'motion-reduce:transition-none')
      .and('have.css', 'transition-property', 'width')
      .and('have.css', 'transition-duration', '0.7s')
      .and('have.css', 'transition-timing-function', 'linear')
  })

  it('duration prop', () => {
    cy.mount(Progress, {
      props: {
        label: 'label',
        value: 20,
        duration: 0,
      },
    })

    cy.get('[role=progressbar] div').should(
      'have.css',
      'transition-duration',
      '0s',
    )
  })

  it('falls back to the default duration when duration is unusable', () => {
    // an unusable value is dropped from the inline style, so without a guard
    // the fill would animate at the transition utility's duration (150ms)
    // instead of ours
    for (const duration of [NaN, -100]) {
      cy.mount(Progress, {
        props: {
          label: 'label',
          value: 20,
          duration,
        },
      })

      cy.get('[role=progressbar] div').should(
        'have.css',
        'transition-duration',
        '0.7s',
      )
    }
  })

  it('interval bar has no width transition', () => {
    cy.mount(Progress, {
      props: {
        label: 'label',
        value: 60,
        intervals: true,
      },
    })

    cy.get('[role=progressbar] div').each((x) => {
      cy.wrap(x).should('not.have.css', 'transition-property', 'width')
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
