import { h } from 'vue'
import ScrollArea from './ScrollArea.vue'

describe('<ScrollArea />', () => {
  // reka-ui's ScrollArea uses a ResizeObserver internally to track content
  // size. Mounting/resizing several times in one test can trigger the
  // browser's benign "ResizeObserver loop completed with undelivered
  // notifications" warning, which Cypress otherwise treats as a fatal
  // uncaught exception. It carries no actual failure.
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('ResizeObserver loop')) return false
  })

  it('renders the default slot content', () => {
    cy.mount(ScrollArea, {
      slots: { default: () => h('div', { 'data-test': 'content' }, 'Hello') },
    })
    cy.get('[data-test=content]').should('contain.text', 'Hello')
  })

  it('renders a vertical scrollbar by default, and horizontal/both on request', () => {
    const tallContent = () =>
      h('div', { style: 'height: 2000px; width: 2000px' }, 'tall')

    // The scrollbar only mounts on pointerenter (reka-ui's default `hover` type),
    // and only once the root has a bounded size to overflow against.
    cy.mount(ScrollArea, {
      props: { class: 'h-40 w-40' },
      slots: { default: tallContent },
    })
    cy.get('[data-slot=scroll-area]').trigger('pointerenter')
    cy.get('[data-orientation=vertical]').should('exist')
    cy.get('[data-orientation=horizontal]').should('not.exist')

    cy.mount(ScrollArea, {
      props: { class: 'h-40 w-40', orientation: 'horizontal' },
      slots: { default: tallContent },
    })
    cy.get('[data-slot=scroll-area]').trigger('pointerenter')
    cy.get('[data-orientation=vertical]').should('not.exist')
    cy.get('[data-orientation=horizontal]').should('exist')

    cy.mount(ScrollArea, {
      props: { class: 'h-40 w-40', orientation: 'both' },
      slots: { default: tallContent },
    })
    cy.get('[data-slot=scroll-area]').trigger('pointerenter')
    cy.get('[data-orientation=vertical]').should('exist')
    cy.get('[data-orientation=horizontal]').should('exist')
  })

  it('the viewport is keyboard-focusable so arrow/page keys can scroll it', () => {
    cy.mount(ScrollArea, {
      slots: { default: () => h('div', { style: 'height: 2000px' }, 'tall') },
    })
    // reka-ui's ScrollAreaViewport ships tabindex=0, which is what makes the
    // region reachable and scrollable by keyboard without any extra wiring.
    cy.get('[data-reka-scroll-area-viewport]').should(
      'have.attr',
      'tabindex',
      '0',
    )
  })

  it('exposes the real scrolling element as viewportElement', () => {
    cy.mount(ScrollArea, {
      slots: { default: () => h('div', 'content') },
    }).then(({ wrapper }) => {
      expect(wrapper.vm.viewportElement).to.not.be.null
      expect(wrapper.vm.viewportElement?.tagName).to.equal('DIV')
    })
  })
})
