import Duration from './Duration.vue'
import { formatDuration, parseDuration } from './duration'

describe('Duration', () => {
  it('renders a text input', () => {
    cy.mount(Duration)
    cy.get('input').should('exist')
  })

  it('displays the model value formatted (short by default)', () => {
    cy.mount(Duration, { props: { modelValue: 5445 } })
    cy.get('input').should('have.value', '1h 30m 45s')
  })

  it('renders the long and colon presets', () => {
    cy.mount(Duration, { props: { modelValue: 5445, format: 'long' } })
    cy.get('input').should('have.value', '1 hour 30 minutes 45 seconds')

    cy.mount(Duration, { props: { modelValue: 5445, format: 'colon' } })
    cy.get('input').should('have.value', '1:30:45')
  })

  it('renders a custom token template format', () => {
    cy.mount(Duration, { props: { modelValue: 7323, format: 'hh:mm:ss' } })
    cy.get('input').should('have.value', '02:02:03')
  })

  it('edits in canonical short notation regardless of display format', () => {
    cy.mount(Duration, { props: { modelValue: 7323, format: 'hh:mm:ss' } })
    cy.get('input').should('have.value', '02:02:03')
    cy.get('input').focus().should('have.value', '2h 2m 3s')
  })

  it('commits a parsed value on blur', () => {
    cy.mount(Duration, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })
    cy.get('input').type('1h 30m').blur()
    cy.get('@onUpdate').should('be.calledWith', 5400)
    cy.get('input').should('have.value', '1h 30m')
  })

  it('commits on Enter', () => {
    cy.mount(Duration, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })
    cy.get('input').type('90s{enter}')
    cy.get('@onUpdate').should('be.calledWith', 90)
  })

  it('reverts to the saved value on Escape without committing', () => {
    cy.mount(Duration, {
      props: {
        modelValue: 60,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').focus().clear().type('5h{esc}')
    cy.get('@onUpdate').should('not.be.called')
    cy.get('input').should('have.value', '1m')
  })

  it('shows an internal error for invalid input and does not commit', () => {
    cy.mount(Duration, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })
    cy.get('input').type('not a duration').blur()
    cy.get('@onUpdate').should('not.be.called')
    cy.get('input').should('have.attr', 'aria-invalid', 'true')
    cy.contains('Invalid format').should('exist')
  })

  it('releases focus after an invalid commit but keeps the rejected text visible', () => {
    cy.mount(Duration, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })
    cy.get('input').as('field').type('not a duration')
    cy.get('@field').blur()
    // Focus is not trapped — the user can click away.
    cy.get('@field').should('have.value', 'not a duration').and('not.have.focus')
    // Re-focusing and correcting still commits.
    cy.get('@field').focus().clear().type('1h 30m').blur()
    cy.get('@onUpdate').should('be.calledWith', 5400)
  })

  it('a caller-provided error takes precedence over the internal one', () => {
    cy.mount(Duration, { props: { error: 'Field is required.' } })
    cy.contains('Field is required.').should('exist')
  })

  it('clearing the field commits null', () => {
    cy.mount(Duration, {
      props: {
        modelValue: 60,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').focus().clear().blur()
    cy.get('@onUpdate').should('be.calledWith', null)
  })

  it('exposes the shared labeling contract', () => {
    cy.mount(Duration, {
      props: { label: 'Time spent', description: 'Logged hours', required: true },
    })
    cy.get('label').should('contain.text', 'Time spent')
    cy.contains('Logged hours').should('exist')
    cy.get('input').should('have.attr', 'aria-required', 'true')
  })

  it('forwards size and variant to the underlying input', () => {
    cy.mount(Duration, { props: { size: 'lg', variant: 'outline' } })
    cy.get('input').should('have.attr', 'data-size', 'lg')
  })

  it('disables the input', () => {
    cy.mount(Duration, { props: { disabled: true } })
    cy.get('input').should('be.disabled')
  })
})

describe('parseDuration', () => {
  it('parses unit syntax in any order', () => {
    expect(parseDuration('1h 30m 45s')).to.equal(5445)
    expect(parseDuration('45s 1h 30m')).to.equal(5445)
    expect(parseDuration('1h30m45s')).to.equal(5445)
  })

  it('parses long-form units', () => {
    expect(parseDuration('1 hour 30 minutes')).to.equal(5400)
    expect(parseDuration('2hrs 15min')).to.equal(8100)
  })

  it('parses colon syntax', () => {
    expect(parseDuration('1:30:45')).to.equal(5445)
    expect(parseDuration('1:30')).to.equal(90)
    expect(parseDuration(':45')).to.equal(45)
  })

  it('treats a bare integer as seconds', () => {
    expect(parseDuration('90')).to.equal(90)
  })

  it('rejects invalid input', () => {
    expect(parseDuration('')).to.equal(null)
    expect(parseDuration('abc')).to.equal(null)
    expect(parseDuration('1h foo 2m')).to.equal(null)
    expect(parseDuration('1h 2h')).to.equal(null) // duplicate unit
  })
})

describe('formatDuration', () => {
  it('formats each preset', () => {
    expect(formatDuration(5445)).to.equal('1h 30m 45s')
    expect(formatDuration(5445, 'long')).to.equal('1 hour 30 minutes 45 seconds')
    expect(formatDuration(5445, 'colon')).to.equal('1:30:45')
  })

  it('the short preset omits zero parts', () => {
    expect(formatDuration(90)).to.equal('1m 30s')
    expect(formatDuration(3600)).to.equal('1h')
  })

  it('singularizes long-form units', () => {
    expect(formatDuration(3661, 'long')).to.equal('1 hour 1 minute 1 second')
  })

  it('renders custom token templates literally', () => {
    expect(formatDuration(5445, "h'h' m'm' s's'")).to.equal('1h 30m 45s')
    expect(formatDuration(90, "h'h' m'm' s's'")).to.equal('0h 1m 30s')
    expect(formatDuration(7323, 'hh:mm:ss')).to.equal('02:02:03')
    expect(formatDuration(5445, "h 'hours'")).to.equal('1 hours')
  })

  it('renders zero and nullish values', () => {
    expect(formatDuration(0)).to.equal('0s')
    expect(formatDuration(null)).to.equal('')
    expect(formatDuration(undefined)).to.equal('')
  })
})
