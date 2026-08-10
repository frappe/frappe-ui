import { defineComponent, h } from 'vue'
import FunnelChart from './FunnelChart.vue'
import './style.css'

const data = [
  { stage: 'Visited', deals: 50 },
  { stage: 'Demoed', deals: 30 },
  { stage: 'Won', deals: 20 },
]

function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(FunnelChart, {
              data,
              category: 'stage',
              value: 'deals',
              ...props,
            }),
          ])
      },
    }),
  )
}

/** One hit area per stage; the columns behind them are aria-hidden. */
const hitAreas = () => cy.get('[data-slot="chart-container"] button')
const columns = () => cy.get('[data-slot="chart-container"] svg path')

describe('FunnelChart', () => {
  it('heads each stage with its name and count, in process order', () => {
    mountChart()
    cy.get('[data-slot="chart-container"]')
      .invoke('text')
      .should('match', /Visited\s*50.*Demoed\s*30.*Won\s*20/s)
  })

  it('draws a column per stage', () => {
    mountChart()
    columns().should('have.length', data.length)
  })

  it('prints each stage against the first, and nothing against the first', () => {
    mountChart()
    cy.get('[data-slot="chart-container"]')
      .should('contain.text', '60%')
      .and('contain.text', '40%')
      .and('not.contain.text', '100%')
  })

  it('drops the percentages on request', () => {
    mountChart({ showPercentages: false })
    cy.get('[data-slot="chart-container"]').should('not.contain.text', '60%')
  })

  it('gives every stage a hit area that names it', () => {
    mountChart()
    hitAreas().should('have.length', data.length)
    cy.get('[aria-label="Visited, 50"]').should('exist')
  })

  it('emits stageClick with the row behind the stage', () => {
    mountChart({ onStageClick: cy.spy().as('onClick') })
    cy.get('[aria-label="Demoed, 30"]').click()
    cy.get('@onClick').should('have.been.calledWithMatch', {
      label: 'Demoed',
      value: 30,
      index: 1,
      row: { stage: 'Demoed', deals: 30 },
    })
  })

  it('opens the tooltip over the stage under the pointer', () => {
    mountChart()
    cy.get('[aria-label="Won, 20"]').trigger('mouseenter')
    cy.get('[data-slot="chart-tooltip"]')
      .should('exist')
      .and('contain.text', 'Won')
  })

  it('reaches a stage by keyboard, not by pointer alone', () => {
    mountChart()
    cy.get('[aria-label="Visited, 50"]').focus()
    cy.get('[data-slot="chart-tooltip"]').should('exist')
  })
})
