import ThemeSwitcher from './ThemeSwitcher.vue'

describe('<ThemeSwitcher />', () => {
  beforeEach(() => {
    localStorage.removeItem('theme')
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders the three theme options as a radiogroup', () => {
    cy.mount(ThemeSwitcher)

    cy.get('[role="radiogroup"]').should('exist')
    cy.get('[role="radio"]').should('have.length', 3)
    cy.get('[data-theme-option="light"]').should('exist')
    cy.get('[data-theme-option="dark"]').should('exist')
    cy.get('[data-theme-option="system"]').should('exist')
  })

  it('renders the default heading and description', () => {
    cy.mount(ThemeSwitcher)

    cy.contains('Theme').should('exist')
    cy.contains('Switch between light, dark, or system theme').should('exist')
  })

  it('drives <html data-theme> and emits on selection', () => {
    cy.mount(ThemeSwitcher, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })

    cy.get('[data-theme-option="dark"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', 'dark')
    cy.document().its('documentElement').should('have.attr', 'data-theme', 'dark')

    cy.get('[data-theme-option="light"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', 'light')
    cy.document().its('documentElement').should('have.attr', 'data-theme', 'light')
  })

  it('marks the bound theme as checked (controlled)', () => {
    cy.mount(ThemeSwitcher, { props: { modelValue: 'dark' } })

    cy.get('[data-theme-option="dark"]').should(
      'have.attr',
      'data-state',
      'checked',
    )
    cy.get('[data-theme-option="light"]').should(
      'have.attr',
      'data-state',
      'unchecked',
    )
  })

  it('reflects the selection through aria-checked', () => {
    cy.mount(ThemeSwitcher, { props: { modelValue: 'dark' } })

    cy.get('[data-theme-option="dark"]').should(
      'have.attr',
      'aria-checked',
      'true',
    )
    cy.get('[data-theme-option="light"]').should(
      'have.attr',
      'aria-checked',
      'false',
    )
    cy.get('[data-theme-option="system"]').should(
      'have.attr',
      'aria-checked',
      'false',
    )
  })

  it('renders a custom brand name and translated option labels', () => {
    cy.mount(ThemeSwitcher, {
      props: {
        name: 'Acme',
        themeLabels: { light: 'Claro', dark: 'Oscuro', system: 'Sistema' },
      },
    })

    cy.get('[data-theme-option="light"]').contains('Acme').should('exist')
    cy.contains('Claro').should('exist')
    cy.contains('Oscuro').should('exist')
    cy.contains('Sistema').should('exist')
  })
})
