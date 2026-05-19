import { defineComponent, h } from 'vue'
import Rating from './Rating.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

describe('Rating', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('Renders', () => {
    cy.mount(Rating, { props: { modelValue: 2, label: 'abc' } })

    cy.get('label').should('contain.text', 'abc')

    cy.get('[data-slot="star"]').each(($el, i) => {
      cy.wrap($el).should(
        'have.attr',
        'data-state',
        i < 2 ? 'filled' : 'empty',
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
      cy.get('[data-slot="star"]')
        .first()
        .should('have.class', sizes[size as keyof typeof sizes])
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

  describe('step=0.5 (slider mode)', () => {
    it('switches to slider role and exposes aria-value*', () => {
      cy.mount(Rating, { props: { modelValue: 3.5, step: 0.5, max: 5 } })
      cy.get('[role="slider"]').should('exist')
      cy.get('[role="radiogroup"]').should('not.exist')
      cy.get('[role="slider"]')
        .should('have.attr', 'aria-valuemin', '0')
        .and('have.attr', 'aria-valuemax', '5')
        .and('have.attr', 'aria-valuenow', '3.5')
        .and('have.attr', 'aria-valuetext', '3.5')
    })

    it('left-half click emits half value', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: { modelValue: 0, step: 0.5, 'onUpdate:modelValue': onUpdate },
      })
      cy.get('[data-slot="star"]')
        .eq(2)
        .then(($btn) => {
          const rect = $btn[0].getBoundingClientRect()
          cy.wrap($btn).click(rect.width * 0.25, rect.height / 2)
        })
      cy.get('@onUpdate').should('have.been.calledWith', 2.5)
    })

    it('right-half click emits full value', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: { modelValue: 0, step: 0.5, 'onUpdate:modelValue': onUpdate },
      })
      cy.get('[data-slot="star"]')
        .eq(2)
        .then(($btn) => {
          const rect = $btn[0].getBoundingClientRect()
          cy.wrap($btn).click(rect.width * 0.75, rect.height / 2)
        })
      cy.get('@onUpdate').should('have.been.calledWith', 3)
    })
  })

  describe('allowClear', () => {
    it('clicking the same value clears to 0 when allowClear is set', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: {
          modelValue: 3,
          allowClear: true,
          'onUpdate:modelValue': onUpdate,
        },
      })
      cy.get('[role="radio"]').eq(2).click()
      cy.get('@onUpdate').should('have.been.calledWith', 0)
    })

    it('clicking the same value keeps it when allowClear is false', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: { modelValue: 3, 'onUpdate:modelValue': onUpdate },
      })
      cy.get('[role="radio"]').eq(2).click()
      cy.get('@onUpdate').should('not.have.been.calledWith', 0)
      cy.get('[role="radio"][aria-checked="true"]').should(
        'have.attr',
        'data-index',
        '3',
      )
    })
  })

  describe('showValueTooltip', () => {
    it('renders the tooltip when hovering over a star', () => {
      cy.mount(Rating, {
        props: { modelValue: 0, showValueTooltip: true, max: 5 },
      })
      cy.get('[role="radio"]').eq(2).trigger('pointermove')
      cy.contains('3 / 5').should('be.visible')
    })

    it('does not render the tooltip when showValueTooltip is false', () => {
      cy.mount(Rating, { props: { modelValue: 0, max: 5 } })
      cy.get('[role="radio"]').eq(2).trigger('mousemove')
      cy.contains('3 / 5').should('not.exist')
    })
  })

  describe('icon', () => {
    it('renders a custom lucide icon component for each star', () => {
      cy.mount(Rating, {
        props: {
          modelValue: 3,
          icon: defineComponent({
            render: () => h('svg', { 'data-test-icon': 'heart' }),
          }),
        },
      })
      cy.get('[data-slot="star"]')
        .first()
        .find('[data-test-icon="heart"]')
        .should('exist')
    })

    it('passes fill="currentColor" so closed-path SVGs render filled', () => {
      cy.mount(Rating, { props: { modelValue: 3 } })
      cy.get('[data-slot="star"]')
        .first()
        .find('svg')
        .first()
        .should('have.attr', 'fill', 'currentColor')
    })
  })

  describe('keyboard', () => {
    it('radiogroup: arrow right moves selection forward', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: { modelValue: 2, 'onUpdate:modelValue': onUpdate },
      })
      cy.get('[role="radio"][aria-checked="true"]').focus().type('{rightArrow}')
      cy.get('@onUpdate').should('have.been.calledWith', 3)
    })

    it('radiogroup: Home selects the first star', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: { modelValue: 4, 'onUpdate:modelValue': onUpdate },
      })
      cy.get('[role="radio"][aria-checked="true"]').focus().type('{home}')
      cy.get('@onUpdate').should('have.been.calledWith', 1)
    })

    it('slider: arrow right increments by step', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: {
          modelValue: 2,
          step: 0.5,
          'onUpdate:modelValue': onUpdate,
        },
      })
      cy.get('[role="slider"]').focus().type('{rightArrow}')
      cy.get('@onUpdate').should('have.been.calledWith', 2.5)
    })

    it('slider: digit keys set the value', () => {
      const onUpdate = cy.spy().as('onUpdate')
      cy.mount(Rating, {
        props: {
          modelValue: 0,
          step: 0.5,
          'onUpdate:modelValue': onUpdate,
        },
      })
      cy.get('[role="slider"]').focus().type('4')
      cy.get('@onUpdate').should('have.been.calledWith', 4)
    })
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

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(Rating, {
        props: { label: 'Quality', size: 'lg', required: true, modelValue: 3 },
      })
      cy.get('[role="radiogroup"]').should('have.attr', 'data-slot', 'control')
      cy.get('[role="radiogroup"]').should('have.attr', 'data-size', 'lg')
      cy.get('[role="radiogroup"]').should('have.attr', 'data-state', 'valid')
      cy.get('[role="radiogroup"]').should('have.attr', 'data-required', 'true')
    })

    it('exposes data-disabled and data-readonly when readonly', () => {
      cy.mount(Rating, { props: { label: 'Quality', readonly: true } })
      cy.get('[role="radiogroup"]').should('have.attr', 'data-disabled', 'true')
      cy.get('[role="radiogroup"]').should('have.attr', 'data-readonly', 'true')
    })
  })
})
