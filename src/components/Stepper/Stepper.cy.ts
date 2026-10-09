import Stepper from './Stepper.vue'
import type { StepItem } from './types'

const steps: StepItem[] = [
  { value: 'account', label: 'Account', description: 'Name and email' },
  { value: 'workspace', label: 'Workspace' },
  { value: 'invite', label: 'Invite team', skipped: true },
  { value: 'import', label: 'Import data', meta: '0:31' },
  { value: 'review', label: 'Review' },
]

const nested: StepItem[] = [
  { value: 'plan', label: 'Plan' },
  {
    value: 'build',
    label: 'Build',
    children: [
      { value: 'configure', label: 'Configure' },
      { value: 'apply', label: 'Apply' },
    ],
  },
  { value: 'verify', label: 'Verify' },
]

const step = (label: string) => cy.contains('[data-slot="step"]', label)

describe('Stepper', () => {
  it('derives every state from the current value', () => {
    cy.mount(Stepper, {
      props: { steps, modelValue: 'import', vertical: true },
    })

    step('Account').should('have.attr', 'data-state', 'complete')
    step('Invite team').should('have.attr', 'data-state', 'skipped')
    step('Import data')
      .should('have.attr', 'data-state', 'current')
      .and('have.attr', 'aria-current', 'step')
    step('Review').should('have.attr', 'data-state', 'upcoming')
    cy.get('[aria-current="step"]').should('have.length', 1)
  })

  it('numbers unfinished steps and reads each state without the icons', () => {
    cy.mount(Stepper, {
      props: { steps, modelValue: 'import', vertical: true },
    })

    step('Import data')
      .find('[data-slot="step-indicator"]')
      .should('contain.text', '4')
    step('Review')
      .find('[data-slot="step-indicator"]')
      .should('contain.text', '5')
    step('Account').find('.sr-only').should('have.text', 'completed')
    step('Invite team').find('.sr-only').should('have.text', 'skipped')
    step('Review').find('.sr-only').should('have.text', 'not started')
  })

  it('marks a running and a failed current step', () => {
    cy.mount(Stepper, {
      props: { steps, modelValue: 'import', vertical: true, loading: true },
    })
    cy.get('[data-slot="stepper"]').should('have.attr', 'data-loading')
    step('Import data').find('.sr-only').should('have.text', 'running')

    cy.mount(Stepper, {
      props: { steps, modelValue: 'import', vertical: true, failed: true },
    })
    step('Import data')
      .should('have.attr', 'data-state', 'failed')
      .and('have.attr', 'aria-current', 'step')
  })

  it('renders descriptions and meta', () => {
    cy.mount(Stepper, {
      props: { steps, modelValue: 'import', vertical: true },
    })

    step('Account').should('contain.text', 'Name and email')
    step('Import data').should('contain.text', '0:31')
  })

  it('is not interactive unless clickable', () => {
    cy.mount(Stepper, {
      props: { steps, modelValue: 'import', vertical: true },
    })

    cy.get('[data-slot="stepper"] button').should('not.exist')
  })

  it('lets finished and skipped steps set the model when clickable', () => {
    const onUpdate = cy.spy().as('update')
    cy.mount(Stepper, {
      props: {
        steps,
        modelValue: 'import',
        vertical: true,
        clickable: true,
        'onUpdate:modelValue': onUpdate,
      },
    })

    // done and skipped steps are buttons; current and upcoming are not
    cy.get('[data-slot="stepper"] button').should('have.length', 3)
    step('Review').find('button').should('not.exist')

    step('Account').find('button').click()
    cy.get('@update').should('have.been.calledOnceWith', 'account')
  })

  it('reaches finished steps by keyboard', () => {
    const onUpdate = cy.spy().as('update')
    cy.mount(Stepper, {
      props: {
        steps,
        modelValue: 'import',
        vertical: true,
        clickable: true,
        'onUpdate:modelValue': onUpdate,
      },
    })

    step('Workspace').find('button').focus()
    cy.focused().type('{enter}')
    cy.get('@update').should('have.been.calledWith', 'workspace')
  })

  it('nests sub-steps and derives their parent', () => {
    cy.mount(Stepper, {
      props: { steps: nested, modelValue: 'apply', vertical: true },
    })

    step('Build').should('have.attr', 'data-state', 'current')
    step('Configure').should('have.attr', 'data-state', 'complete')
    step('Apply')
      .should('have.attr', 'data-state', 'current')
      .and('have.attr', 'aria-current', 'step')
    step('Build').find('ol [data-slot="step"]').should('have.length', 2)
  })

  it('shows sub-steps only under the current step when asked', () => {
    cy.mount(Stepper, {
      props: {
        steps: nested,
        modelValue: 'verify',
        vertical: true,
        substeps: 'current',
      },
    })

    cy.contains('Configure').should('not.exist')
  })

  it('completes every step', () => {
    cy.mount(Stepper, { props: { steps, completed: true, vertical: true } })

    cy.get('[data-state="current"]').should('not.exist')
    step('Review').should('have.attr', 'data-state', 'complete')
    step('Invite team').should('have.attr', 'data-state', 'skipped')
  })

  it('is the stock Progress when horizontal', () => {
    cy.mount(Stepper, { props: { steps, modelValue: 'import' } })

    cy.get('[data-slot="stepper"]').should(
      'have.attr',
      'data-orientation',
      'horizontal',
    )
    // two done and one skipped of five
    cy.get('[role=progressbar]').should('have.attr', 'aria-valuenow', '60')
    cy.get('[role=progressbar] > div').should('have.length', 5)
    cy.get('ol > [data-slot="step"]').should('have.length', 5)
  })

  it('renders step slots with their state', () => {
    cy.mount(Stepper, {
      props: { steps, modelValue: 'import', vertical: true },
      slots: {
        'step-label': ({ item, state }: any) => `${item.label} (${state})`,
      },
    })

    cy.contains('Invite team (skipped)').should('exist')
    cy.contains('Import data (current)').should('exist')
  })
})
