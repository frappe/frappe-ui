import { defineComponent, h, ref } from 'vue'
import ProportionBar from './ProportionBar.vue'
import './style.css'

const data = [
  { part: 'Compute', amount: 60 },
  { part: 'Storage', amount: 30 },
  { part: 'Bandwidth', amount: 10 },
]

function mountBar(
  props: Record<string, any> = {},
  slots?: Record<string, (props?: any) => unknown>,
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; padding: 24px' }, [
            h(
              ProportionBar,
              {
                data,
                category: 'part',
                value: 'amount',
                ...props,
              },
              slots,
            ),
          ])
      },
    }),
  )
}

const segments = () => cy.get('[data-slot="chart-segment"]')
const legendEntries = () => cy.get('[data-slot="chart-legend"] button')
const tooltip = () => cy.get('[data-slot="chart-tooltip"]')

/** The declared width of a segment, as the percentage the style carries. */
function widthOf(label: string) {
  return cy
    .get(`[aria-label^="${label},"]`)
    .invoke('attr', 'style')
    .then((style) => Number(/width:\s*([\d.]+)%/.exec(style ?? '')?.[1]))
}

describe('ProportionBar', () => {
  it('draws one segment per row, in row order', () => {
    mountBar()
    segments().should('have.length', 3)
    segments()
      .first()
      .should('have.attr', 'aria-label')
      .and('contain', 'Compute')
  })

  it('colors the segments from the categorical ramp', () => {
    mountBar()
    const seen: string[] = []
    segments().each(($el) => {
      const color = $el.css('background-color')
      expect(color).to.match(/^rgba?\(/)
      expect(color).not.to.equal('rgba(0, 0, 0, 0)')
      seen.push(color)
    })
    cy.then(() => expect(new Set(seen).size).to.equal(3))
  })

  it('sizes each segment by its share of the total', () => {
    mountBar()
    widthOf('Compute').should('be.closeTo', 60, 0.01)
    widthOf('Storage').should('be.closeTo', 30, 0.01)
    widthOf('Bandwidth').should('be.closeTo', 10, 0.01)
  })

  it('names each segment with its value and its share', () => {
    mountBar()
    cy.get('[aria-label="Compute, 60, 60%"]').should('exist')
  })

  it("runs the caller's format over the values it prints", () => {
    mountBar({ format: (value: number) => `$${value}.00` })
    cy.get('[aria-label="Compute, $60.00, 60%"]').should('exist')
  })

  it('widens a share too small to see, without re-ordering the bar', () => {
    mountBar({
      data: [
        { part: 'Used', amount: 999 },
        { part: 'Left', amount: 1 },
      ],
    })

    widthOf('Left').should('be.greaterThan', 1)
    widthOf('Used').should('be.greaterThan', 90)
  })

  it('reads the hovered segment out in a tooltip', () => {
    mountBar()
    segments().first().trigger('mouseenter')
    tooltip().should('contain.text', 'Compute').and('contain.text', '60%')
    segments().first().trigger('mouseleave')
    tooltip().should('not.exist')
  })

  it('opens the tooltip on keyboard focus too', () => {
    mountBar()
    segments().eq(1).focus()
    tooltip().should('contain.text', 'Storage')
  })

  // at-bar item 3.4 — P12. The segments are the plot's only controls, so the
  // tab order, the focus ring and Enter/Space are the component's keyboard
  // contract.
  it('puts every drawn segment in the tab order, in reading order', () => {
    mountBar()
    segments().each(($el) => {
      expect($el.prop('tagName')).to.equal('BUTTON')
      expect($el.attr('tabindex')).to.not.equal('-1')
    })

    cy.get('body').tab?.()
    segments().first().focus().should('be.focused')
  })

  it('shows a focus ring on keyboard focus', () => {
    mountBar()
    segments()
      .first()
      .focus()
      .should(($el) => {
        const style = window.getComputedStyle($el[0])
        const ring = `${style.boxShadow} ${style.outlineWidth} ${style.outlineStyle}`
        expect(ring).to.not.match(/^none 0px none$/)
      })
  })

  it('answers Enter and Space on the focused segment with select', () => {
    const onSelect = cy.spy().as('keySelect')
    mountBar({ onSelect })

    segments().eq(1).focus().type('{enter}')
    cy.get('@keySelect').should('have.been.calledWithMatch', {
      name: 'Storage',
    })

    segments().eq(2).focus().type(' ')
    cy.get('@keySelect').should('have.been.calledWithMatch', {
      name: 'Bandwidth',
    })
  })

  it('emits select with the row behind the segment', () => {
    const onSelect = cy.spy().as('select')
    mountBar({ onSelect })
    segments().eq(2).click()
    cy.get('@select').should('have.been.calledWithMatch', {
      name: 'Bandwidth',
      value: 10,
      rows: [{ part: 'Bandwidth', amount: 10 }],
    })
  })

  it("prints each segment's share in the legend", () => {
    mountBar()
    legendEntries().should('have.length', 3)
    cy.get('[data-slot="chart-legend"]').should('contain.text', '30%')
  })

  it('takes a segment off the bar and re-percentages the rest', () => {
    mountBar()
    cy.get('[aria-label="Hide Bandwidth"]').click()
    segments().should('have.length', 2)
    widthOf('Compute').should('be.closeTo', 66.67, 0.01)
    cy.get('[aria-label="Show Bandwidth"]').should('exist')
  })

  it('refuses to hide the last visible segment', () => {
    mountBar()
    cy.get('[aria-label="Hide Bandwidth"]').click()
    cy.get('[aria-label="Hide Storage"]').click()
    cy.get('[aria-label="Hide Compute"]').click()
    segments().should('have.length', 1)
  })

  it('will not hide the last drawn segment past a zero-valued one', () => {
    // The zero-valued part has a legend entry but no block. Hiding the part
    // that is drawn would leave nothing on the track and show the empty state.
    mountBar({
      data: [
        { part: 'Used', amount: 10 },
        { part: 'Free', amount: 0 },
      ],
    })

    segments().should('have.length', 1)
    cy.get('[aria-label="Hide Used"]').click()
    segments().should('have.length', 1)
    cy.get('[data-slot="chart-container"]').should(
      'not.have.attr',
      'data-state',
      'empty',
    )
  })

  it('still lets a zero-valued entry toggle when one segment is drawn', () => {
    // Hiding a part with no block cannot empty the bar, so the guard that
    // protects the last drawn segment must not block it.
    mountBar({
      data: [
        { part: 'Used', amount: 10 },
        { part: 'Free', amount: 0 },
      ],
    })

    segments().should('have.length', 1)
    cy.get('[aria-label="Hide Free"]').click()
    cy.get('[aria-label="Show Free"]').should('exist')
    segments().should('have.length', 1)
  })

  it('follows the header spacing when a parent adds the actions slot', () => {
    const withActions = ref(false)
    cy.mount(
      defineComponent({
        setup() {
          return () =>
            h('div', { style: 'width: 480px; padding: 24px' }, [
              h(
                ProportionBar,
                { data, category: 'part', value: 'amount' },
                withActions.value
                  ? { actions: () => h('button', 'Export') }
                  : {},
              ),
            ])
        },
      }),
    )

    const pad = () => cy.get('[data-slot="chart-plot"] > div > div')
    pad().should('have.css', 'padding-top', '0px')
    cy.then(() => (withActions.value = true))
    pad().should('have.css', 'padding-top', '8px')
    cy.then(() => (withActions.value = false))
    pad().should('have.css', 'padding-top', '0px')
  })

  it('drives the legend from a bound hiddenSegments', () => {
    const hidden = ref(['Storage'])
    cy.mount(
      defineComponent({
        setup() {
          return () =>
            h('div', { style: 'width: 480px; padding: 24px' }, [
              h(ProportionBar, {
                data,
                category: 'part',
                value: 'amount',
                hiddenSegments: hidden.value,
                'onUpdate:hiddenSegments': (next: string[]) => {
                  hidden.value = next
                },
              }),
            ])
        },
      }),
    )

    segments().should('have.length', 2)
    cy.get('[aria-label="Show Storage"]')
      .click()
      .then(() => {
        expect(hidden.value).to.deep.equal([])
      })
  })

  it('draws no legend for a single part', () => {
    mountBar({ data: [{ part: 'Compute', amount: 60 }] })
    cy.get('[data-slot="chart-legend"]').should('not.exist')
  })

  it('groups the tail past maxSegments into one segment', () => {
    mountBar({
      data: Array.from({ length: 8 }, (_, i) => ({
        part: `Part ${i + 1}`,
        amount: 10 - i,
      })),
      maxSegments: 3,
    })

    segments().should('have.length', 3)
    cy.get('[aria-label^="Others,"]').should('exist')
  })

  it('draws an 8px track by default', () => {
    mountBar()
    cy.get('[data-slot="chart-track"]')
      .should('have.attr', 'data-size', 'sm')
      .and('have.css', 'height', '8px')
    segments().first().should('have.css', 'height', '8px')
  })

  it('takes its thickness from size', () => {
    const heights = { sm: '8px', md: '12px' }
    for (const [size, height] of Object.entries(heights)) {
      mountBar({ size })
      cy.get('[data-slot="chart-track"]').should('have.css', 'height', height)
      segments().first().should('have.css', 'height', height)
    }
  })

  it('grows the hovered segment by 2px, whatever the size', () => {
    mountBar({ size: 'sm' })
    segments().first().trigger('mouseenter')
    segments().first().should('have.css', 'height', '10px')

    mountBar({ size: 'md' })
    segments().first().trigger('mouseenter')
    segments().first().should('have.css', 'height', '14px')
  })

  it("cuts the corner deeper as the track thickens, up to the donut's", () => {
    const radii = { sm: '3px', md: '4px' }
    for (const [size, radius] of Object.entries(radii)) {
      mountBar({ size })
      segments().first().should('have.css', 'border-radius', radius)
    }
  })

  it("separates the segments by the ring's own gap", () => {
    mountBar()
    cy.get('[data-slot="chart-track"]').should('have.css', 'column-gap', '3px')
  })

  it('keeps that gap at every size', () => {
    for (const size of ['sm', 'md']) {
      mountBar({ size })
      cy.get('[data-slot="chart-track"]').should(
        'have.css',
        'column-gap',
        '3px',
      )
    }
  })

  it('clears the header rather than sitting under it like a rule', () => {
    mountBar({ title: 'Support queue' })
    cy.get('[data-slot="chart-plot"] > div > div').should(
      'have.css',
      'padding-top',
      '8px',
    )
  })

  it('takes no header space when there is no header', () => {
    mountBar()
    cy.get('[data-slot="chart-plot"] > div > div').should(
      'have.css',
      'padding-top',
      '0px',
    )
  })

  it('steps the other segments back while one is hovered', () => {
    mountBar()
    segments().first().trigger('mouseenter')
    segments().first().should('have.css', 'opacity', '1')
    segments().eq(1).should('have.css', 'opacity', '0.75')
    segments().first().trigger('mouseleave')
    segments().eq(1).should('have.css', 'opacity', '1')
  })

  it('steps them back from the legend too', () => {
    mountBar()
    cy.get('[aria-label="Hide Compute"]').trigger('mouseenter')
    segments().first().should('have.css', 'opacity', '1')
    segments().eq(2).should('have.css', 'opacity', '0.75')
  })

  it('blurs nothing while the legend points at a hidden segment', () => {
    mountBar()
    cy.get('[aria-label="Hide Bandwidth"]').click()
    cy.get('[aria-label="Show Bandwidth"]').trigger('mouseenter')
    segments().each(($el) => {
      expect($el).to.have.css('opacity', '1')
    })
  })

  it('states its title and subtitle above the bar', () => {
    mountBar({ title: 'Where the bill goes', subtitle: 'August 2026' })
    cy.get('[data-slot="chart-header"]')
      .should('contain.text', 'Where the bill goes')
      .and('contain.text', 'August 2026')
  })

  it('draws the empty state when every row is unusable', () => {
    mountBar({ data: [{ part: 'Refund', amount: -5 }] })
    cy.get('[data-slot="chart-container"]')
      .should('have.attr', 'data-state', 'empty')
      .and('contain.text', 'No data to show')
  })

  it('forwards the three states as slots', () => {
    mountBar({ loading: true }, { loading: () => h('div', 'fetching…') })
    cy.get('[data-slot="chart-container"]').should('contain.text', 'fetching…')

    mountBar({ error: 'nope' }, { error: () => h('div', 'try again') })
    cy.get('[data-slot="chart-container"]').should('contain.text', 'try again')

    mountBar({ data: [] }, { empty: () => h('div', 'nothing billed yet') })
    cy.get('[data-slot="chart-container"]').should(
      'contain.text',
      'nothing billed yet',
    )
  })

  it('renders the actions slot in the header', () => {
    mountBar(
      { title: 'Support queue' },
      { actions: () => h('button', 'Export') },
    )
    cy.get('[data-slot="chart-header"]').should('contain.text', 'Export')
  })

  it('renders the title-suffix slot beside the title', () => {
    mountBar(
      { title: 'Support queue' },
      { 'title-suffix': () => h('span', 'beta') },
    )
    cy.get('[data-slot="chart-header"]')
      .should('contain.text', 'Support queue')
      .and('contain.text', 'beta')
  })

  it('replaces the tooltip body through the slot', () => {
    mountBar(
      {},
      { tooltip: ({ items }: any) => h('div', `own: ${items[0].label}`) },
    )
    segments().first().trigger('mouseenter')
    tooltip().should('contain.text', 'own: Compute')
  })
})
