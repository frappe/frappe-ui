import Progress from './Progress.vue'

describe('Progress', () => {
  it('Renders', () => {
    cy.mount(Progress, {
      props: {
        label: 'label',
        value: 20,
      },
    })

    cy.get('span').should('have.text', 'label')

    // a full-width fill slid 80% left leaves 20% of it visible
    cy.get('[role=progressbar] div')
      .should('have.attr', 'style')
      .and('include', 'transform: translateX(-80%)')
  })

  it('exposes the value to assistive tech', () => {
    cy.mount(Progress, { props: { label: 'Uploading', value: 20 } })

    cy.get('[role=progressbar]')
      .should('have.attr', 'aria-valuenow', '20')
      .and('have.attr', 'aria-valuemin', '0')
      .and('have.attr', 'aria-valuemax', '100')
      // the visible label, not a bare "20%", says what the bar measures
      .and('have.attr', 'aria-label', 'Uploading')
      .and('have.attr', 'data-state', 'loading')
  })

  it('clamps the fill to the ends of the track', () => {
    for (const [value, offset] of [
      [150, 0],
      [-20, -100],
    ] as const) {
      cy.mount(Progress, { props: { label: 'label', value } })

      cy.get('[role=progressbar] div')
        .should('have.attr', 'style')
        .and('include', `transform: translateX(${offset}%)`)
    }
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

    // the continuous fill animates its transform, easing in and out of each new
    // value instead of running at a constant speed. duration and curve match
    // Radix UI's progress demo.
    cy.get('[role=progressbar] div')
      .should('have.class', 'motion-reduce:transition-none')
      .and('have.css', 'transition-property', 'transform')
      .and('have.css', 'transition-duration', '0.66s')
      .and(
        'have.css',
        'transition-timing-function',
        'cubic-bezier(0.65, 0, 0.35, 1)',
      )
  })

  it('interval bar has no transform transition', () => {
    cy.mount(Progress, {
      props: {
        label: 'label',
        value: 60,
        intervals: true,
      },
    })

    cy.get('[role=progressbar] div').each((x) => {
      cy.wrap(x).should('not.have.css', 'transition-property', 'transform')
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
