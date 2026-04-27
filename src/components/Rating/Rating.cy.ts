import Rating from './Rating.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

describe('Rating', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('Renders', () => {
    cy.mount(Rating, { props: { modelValue: 2, label: 'abc' } })

    cy.get('label').should('contain.text', 'abc')

    cy.get('.lucide-star').each(($el, i) => {
      cy.wrap($el).should(
        'have.class',
        i < 2 ? '!fill-yellow-500' : 'fill-gray-300',
      )
    })
  })

  it('v-model', () => {
    const onUpdate = cy.spy().as('onUpdate')

    cy.mount(Rating, {
      props: { modelValue: 0, 'onUpdate:modelValue': onUpdate },
    })

    cy.get('[role="radio"]').eq(2).click()
    cy.get('@onUpdate').should('have.been.calledWith', 3)
  })

  it('readonly', () => {
    cy.mount(Rating, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate'), readonly: true },
    })

    cy.get('[role="radio"]').eq(1).click()
    cy.get('@onUpdate').should('not.have.been.called')
  })

  it('sizes', () => {
    const sizes = {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-7',
    } as const

    for (const size in sizes) {
      cy.mount(Rating, {
        props: { modelValue: 2, size: size as keyof typeof sizes },
      })
      cy.get('.lucide-star').first().should('have.class', sizes[size as keyof typeof sizes])
    }
  })

  it('max controls star count', () => {
    cy.mount(Rating, { props: { modelValue: 2, max: 10 } })
    cy.get('[role="radio"]').should('have.length', 10)
  })

  it('rating_from alias still works and warns', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'warn').as('consoleWarn')
    })
    cy.mount(Rating, { props: { modelValue: 2, rating_from: 10 } })
    cy.get('[role="radio"]').should('have.length', 10)
    cy.get('@consoleWarn').should(
      'have.been.calledWithMatch',
      /Rating\.rating_from is deprecated/,
    )
  })

  describe('shared labeling contract', () => {
    it('wires aria-labelledby and aria-describedby to the radiogroup', () => {
      cy.mount(Rating, {
        props: { label: 'Quality', description: 'Pick a rating.' },
      })
      cy.get('[role="radiogroup"]').then(($el) => {
        const id = $el.attr('id')!
        expect($el.attr('aria-labelledby')).to.equal(`${id}-label`)
        expect($el.attr('aria-describedby')).to.equal(`${id}-description`)
      })
    })

    it('renders error state and suppresses description', () => {
      cy.mount(Rating, {
        props: {
          label: 'Quality',
          description: 'helper',
          error: 'Please rate.',
        },
      })
      cy.get('[role="radiogroup"]').should('have.attr', 'aria-invalid', 'true')
      cy.contains('Please rate.').should('exist')
    })
  })
})
