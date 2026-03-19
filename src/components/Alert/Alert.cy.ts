import Alert from './Alert.vue'
import { h } from 'vue'

const titleTxt = 'some title'
const description = 'some description'
const el = '[role="alert"]'
const themes = ['blue', 'red', 'green']

const TestIcon = {
  render() {
    return h('svg', { 'data-cy': 'prefix-icon' })
  },
}

describe('Alert', () => {
  it('Test text', () => {
    cy.mount(Alert, {
      props: {
        title: titleTxt,
        description: description,
      },
    })

    cy.get(`${el} span`).should('have.text', titleTxt)
    cy.get(`${el} p`).should('have.text', description)
  })

  it('Themes', () => {
    themes.forEach((x) => {
      cy.mount(Alert, {
        props: { theme: x, title: titleTxt, description: description },
      })

      cy.get(el).should('have.class', `bg-surface-${x}-2`)
    })
  })

  it('Dismiss', () => {
    cy.mount(Alert)
    cy.get(el).should('exist')
    cy.get(`${el} button`).click()
    cy.get(el).should('not.exist')
  })

  it('Non Dismissable', () => {
    cy.mount(Alert, { props: { dismissable: false } })
    cy.get(`${el} button`).should('not.exist')
  })

  it('Icon slot', () => {
    cy.mount(Alert, {
      slots: { icon: TestIcon },
    })
    cy.get('[data-cy="prefix-icon"]').should('exist')
  })

  it('Footer slot', () => {
    cy.mount(Alert, {
      slots: { footer: h('div', { id: 'footer' }, 'some footer') },
    })

    cy.get(`${el} #footer`).should('exist')
  })
})
