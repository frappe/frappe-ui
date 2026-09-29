import { h } from 'vue'
import PageHeaderMobile from './PageHeaderMobile.vue'

describe('<PageHeaderMobile /> in RTL', () => {
  beforeEach(() => {
    cy.document().then((doc) => {
      doc.documentElement.setAttribute('dir', 'rtl')
    })
  })

  afterEach(() => {
    cy.document().then((doc) => {
      doc.documentElement.removeAttribute('dir')
    })
  })

  it('keeps the prefix control on the reading-start side', () => {
    cy.mount(PageHeaderMobile, {
      slots: {
        prefix: () => h('button', { 'data-test': 'prefix' }, 'back'),
      },
      props: { title: 'Title' },
    })
    cy.get('header').then(($header) => {
      const headerRect = $header[0].getBoundingClientRect()
      cy.get('[data-test=prefix]').then(($prefix) => {
        const prefixRect = $prefix[0].getBoundingClientRect()
        expect(prefixRect.right).to.be.closeTo(headerRect.right, 15)
      })
    })
  })
})
