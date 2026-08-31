import { defineComponent, h, ref } from 'vue'
import TabButtons from './TabButtons.vue'

describe('<TabButtons />', () => {
  it('updates the selected value', () => {
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'day',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.contains('button', 'Week').click()

    cy.get('@onUpdate').should('have.been.calledWith', 'week')
  })

  it('exposes the same data-slot hooks as the Tabs family', () => {
    // The two are pixel-identical at the same variant, so track and indicator
    // CSS must be targetable with one selector per part (P10).
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'day',
        variant: 'subtle',
      },
    })

    cy.get('[data-slot="tab-buttons"] [data-slot="tab-indicator"]').should(
      'exist',
    )
    cy.get('[data-slot="tab-button"]').should('have.length', 2)
  })

  it('carries data-value on each tab so one tab can be styled', () => {
    // `class` on an option was removed in 1.0.0; TabButtons.md and the
    // migration guide both hand callers this exact selector, so pin it.
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
        ],
        modelValue: 'open',
      },
    })

    cy.get('[data-slot="tab-button"][data-value="open"]')
      .should('have.length', 1)
      .and('contain.text', 'Open')
      .and('have.attr', 'data-state', 'checked')
    cy.get('[data-slot="tab-button"][data-value="closed"]').should(
      'have.length',
      1,
    )
  })

  it('clips the pill indicator so its shadow stops at the track', () => {
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'day',
        variant: 'subtle',
      },
    })

    // The track can't clip: it would cut a focused trigger's ring too. The
    // layer holding the indicator does it instead.
    cy.get('[data-slot="tab-buttons"]').should(
      'not.have.css',
      'overflow',
      'hidden',
    )
    cy.get('[data-slot="tab-indicator"]')
      .parent()
      .should('have.css', 'overflow', 'hidden')

    // Square corners would clip the edges and leave the corners bleeding,
    // which is the bug. The layer has to round like the track.
    cy.get('[data-slot="tab-buttons"]').then(($track) => {
      const radius = getComputedStyle($track[0]).borderRadius
      expect(radius, 'track radius').not.to.equal('0px')
      cy.get('[data-slot="tab-indicator"]')
        .parent()
        .should('have.css', 'border-radius', radius)
    })
  })

  it('does not double-call button click handlers', () => {
    const onClick = cy.spy().as('onClick')

    cy.mount(TabButtons, {
      props: {
        options: [{ label: 'Month', value: 'month', onClick }],
        modelValue: 'month',
      },
    })

    cy.contains('button', 'Month').click()

    cy.get('@onClick').should('have.been.calledOnce')
  })

  it('leaves selection empty for a stale model', () => {
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'month',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('button[data-state=checked]').should('not.exist')
  })

  it('keeps hidden labels accessible for icon-only buttons', () => {
    const CalendarIcon = {
      name: 'calendar-icon',
      render() {
        return h('svg', { 'data-cy': 'calendar-icon' })
      },
    }

    cy.mount(TabButtons, {
      props: {
        options: [
          {
            label: 'Calendar',
            value: 'calendar',
            icon: CalendarIcon,
          },
        ],
        modelValue: 'calendar',
      },
    })

    cy.get('button')
      .should('have.attr', 'aria-label', 'Calendar')
      .and('have.attr', 'title', 'Calendar')
    cy.get('[data-cy="calendar-icon"]').should('exist')
  })

  it('rounds the focusable tab element to match the pill', () => {
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'day',
      },
    })

    cy.contains('button', 'Day').should('have.class', 'rounded-[7px]')
  })

  it('stretches buttons to equal widths across the container when fluid', () => {
    const Harness = defineComponent({
      render: () =>
        h('div', { style: 'width: 300px' }, [
          h(TabButtons, {
            fluid: true,
            modelValue: 'day',
            options: [
              { label: 'Day', value: 'day' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
            ],
          }),
        ]),
    })

    cy.mount(Harness)

    cy.get('button').should('have.length', 3)
    cy.get('button').then(($buttons) => {
      const widths = [...$buttons].map((el) => el.getBoundingClientRect().width)
      const [first, ...rest] = widths
      for (const width of rest) {
        expect(width).to.be.closeTo(first, 1)
      }
      // Three equal buttons fill the 300px container (minus track padding
      // and the gaps between them).
      expect(first).to.be.greaterThan(90)
    })
  })

  it('drives the track visuals through the variant prop', () => {
    const options = [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
    ]

    cy.mount(TabButtons, {
      props: { options, modelValue: 'day' },
    })

    // Default variant is `subtle`: a gray pill track.
    cy.get('.bg-surface-gray-2').should('exist')

    cy.mount(TabButtons, {
      props: { options, modelValue: 'day', variant: 'underline' },
    })

    // `underline` draws a bottom rail instead of the pill track.
    cy.get('.bg-surface-gray-2').should('not.exist')
    cy.get('.border-b').should('exist')
  })

  it('slides the browser-tab indicator card onto the checked button', () => {
    const Harness = defineComponent({
      setup() {
        const value = ref('day')
        return () =>
          h(TabButtons, {
            options: [
              { label: 'Day', value: 'day' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
            ],
            variant: 'browser-tab',
            modelValue: value.value,
            'onUpdate:modelValue': (v: string | number) => {
              value.value = String(v)
            },
          })
      },
    })

    cy.mount(Harness)

    cy.contains('button', 'Month').click()
    cy.contains('button', 'Month').should('have.attr', 'data-state', 'checked')

    // Retries until the 200ms slide settles: the indicator card covers the
    // checked button's box exactly (rect-based measurement).
    cy.contains('button', 'Month').should(($btn) => {
      const indicator = document.querySelector<HTMLElement>(
        '[data-slot="tab-indicator"]',
      )
      expect(indicator, 'indicator').to.exist
      const ir = indicator!.getBoundingClientRect()
      const br = $btn[0].getBoundingClientRect()
      expect(ir.x, 'x').to.be.closeTo(br.x, 0.5)
      expect(ir.width, 'width').to.be.closeTo(br.width, 0.5)
      expect(ir.y, 'y').to.be.closeTo(br.y, 0.5)
      expect(ir.height, 'height').to.be.closeTo(br.height, 0.5)
    })
  })

  it('slides the indicator without a bound model', () => {
    // No `modelValue`: the component holds its own selection, so the sliding
    // surface must still follow the click. Measuring off the prop alone
    // leaves the indicator parked while the pill's text color moves.
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ],
      },
    })

    cy.contains('button', 'Month').click()
    cy.contains('button', 'Month').should('have.attr', 'data-state', 'checked')

    cy.contains('button', 'Month').should(($btn) => {
      const indicator = document.querySelector<HTMLElement>(
        '[data-slot="tab-indicator"]',
      )
      expect(indicator, 'indicator').to.exist
      expect(getComputedStyle(indicator!).display, 'display').to.not.equal(
        'none',
      )
      const ir = indicator!.getBoundingClientRect()
      const br = $btn[0].getBoundingClientRect()
      expect(ir.x, 'x').to.be.closeTo(br.x, 0.5)
      expect(ir.width, 'width').to.be.closeTo(br.width, 0.5)
    })
  })
})
