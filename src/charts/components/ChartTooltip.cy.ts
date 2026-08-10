import { defineComponent, h, ref } from 'vue'
import ChartTooltip from './ChartTooltip.vue'
import '../style.css'

const items = [
  {
    name: 'sales',
    label: 'Sales',
    color: '#318AD8',
    value: 10,
    formattedValue: '10',
  },
  {
    name: 'refunds',
    label: 'Refunds',
    color: '#48BB74',
    value: 4,
    formattedValue: '4',
  },
]

/**
 * The tooltip teleports out of the mount root and hangs off a viewport point,
 * so there is nothing to size around it. It is also `position: fixed` and
 * `pointer-events-none`, which Cypress reads as covered: every case asserts on
 * `exist`, on the text, or on the inline style rather than on visibility.
 */
function mountTooltip(props: Record<string, any> = {}, slots?: any) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h(
            ChartTooltip,
            { open: true, x: 100, y: 100, label: 'Jan', items, ...props },
            slots,
          )
      },
    }),
  )
}

const tooltip = () => cy.get('[data-slot="chart-tooltip"]')

describe('ChartTooltip', () => {
  // v-model is N/A: the chart owns whether the tooltip is open and where it
  // hangs. Loading and error are N/A — a tooltip is only asked for over a
  // datapoint that has already been drawn.

  it('prints the category and a row per reading', () => {
    mountTooltip()
    tooltip()
      .should('exist')
      .and('have.attr', 'role', 'tooltip')
      .and('contain.text', 'Jan')
      .and('contain.text', 'Sales')
      .and('contain.text', '10')
      .and('contain.text', 'Refunds')
      .and('contain.text', '4')
  })

  it('draws each row in the color of the series it stands for', () => {
    mountTooltip()
    tooltip()
      .find('.rounded-1')
      .first()
      .should('have.css', 'background-color', 'rgb(49, 138, 216)')
  })

  it('prints the share of the total where a chart measures one', () => {
    mountTooltip({
      label: undefined,
      items: [{ ...items[0], percent: 71.4 }],
    })
    tooltip().should('contain.text', '10').and('contain.text', '71%')
  })

  it('prints no share where the chart measures none', () => {
    mountTooltip()
    tooltip().should('not.contain.text', '%')
  })

  it('heads nothing when there is no category to head it with', () => {
    mountTooltip({ label: undefined })
    tooltip().should('exist').and('not.contain.text', 'Jan')
  })

  describe('when there is nothing to say', () => {
    it('draws nothing while closed', () => {
      mountTooltip({ open: false })
      tooltip().should('not.exist')
    })

    it('draws nothing with no readings', () => {
      mountTooltip({ items: [] })
      tooltip().should('not.exist')
    })
  })

  describe('slot', () => {
    it('takes an app’s own body in place of the rows', () => {
      mountTooltip({}, {
        default: ({ label, items: rows }: any) =>
          h('div', { id: 'own' }, `${label}: ${rows.length} series`),
      } as any)

      cy.get('#own').should('have.text', 'Jan: 2 series')
      tooltip().should('not.contain.text', 'Sales')
    })
  })

  describe('placement', () => {
    // Out of the mount root: a tooltip clipped by the card it hangs off would
    // be cut in half at the card's edge.
    it('teleports to the body rather than into the chart', () => {
      mountTooltip()
      tooltip().parent().should('match', 'body')
    })

    it('hangs off the point it is given', () => {
      mountTooltip({ x: 100, y: 100 })
      tooltip().should('have.css', 'left', '112px')
      tooltip().should('have.css', 'top', '112px')
      tooltip().should('have.css', 'visibility', 'visible')
    })

    it('flips to the other side of the pointer at the viewport edge', () => {
      cy.viewport(500, 500)
      mountTooltip({ x: 490, y: 490 })
      tooltip().then(($el) => {
        const { left, top, right, bottom } = $el[0].getBoundingClientRect()
        expect(right).to.be.at.most(500)
        expect(bottom).to.be.at.most(500)
        expect(left).to.be.lessThan(490)
        expect(top).to.be.lessThan(490)
      })
    })

    it('follows the pointer to a new point', () => {
      cy.mount(
        defineComponent({
          setup() {
            const point = ref({ x: 100, y: 100 })
            return () =>
              h('div', [
                h(
                  'button',
                  {
                    id: 'move',
                    onClick: () => (point.value = { x: 200, y: 240 }),
                  },
                  'Move',
                ),
                h(ChartTooltip, {
                  open: true,
                  x: point.value.x,
                  y: point.value.y,
                  items,
                }),
              ])
          },
        }),
      )
      tooltip().should('have.css', 'left', '112px')
      cy.get('#move').click()
      tooltip().should('have.css', 'left', '212px')
      tooltip().should('have.css', 'top', '252px')
    })
  })

  describe('direction', () => {
    it('carries the direction it is told to lay out in', () => {
      mountTooltip({ dir: 'rtl' })
      tooltip().should('have.attr', 'dir', 'rtl')
    })
  })

  describe('keyboard', () => {
    // A tooltip follows the pointer and takes no press of its own, so it is
    // out of the tab order and out of the way of the pointer.
    it('takes neither focus nor the pointer', () => {
      mountTooltip()
      tooltip().should('not.have.attr', 'tabindex')
      tooltip().should('have.css', 'pointer-events', 'none')
      tooltip().find('button, a, input').should('not.exist')
    })
  })
})
