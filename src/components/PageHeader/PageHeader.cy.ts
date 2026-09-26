import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import PageHeader from './PageHeader.vue'
import PageHeaderBase from './PageHeaderBase.vue'
import PageHeaderBackButton from './PageHeaderBackButton.vue'
import PageHeaderTarget from './PageHeaderTarget.vue'
import PageHeaderMobile from './PageHeaderMobile.vue'
import PageHeaderMobileTitle from './PageHeaderMobileTitle.vue'
import PageHeaderTitle from './PageHeaderTitle.vue'

// Mimics an app layout: a target at the top, the "page" (slot content) in a
// scroll container below it, the way routed pages are slotted into a shell.
const Layout = defineComponent({
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        { style: 'height: 200px; display: flex; flex-direction: column' },
        [
          h(PageHeaderTarget, { 'data-testid': 'target' }),
          h(
            'div',
            { 'data-testid': 'page', style: 'flex: 1; overflow-y: auto' },
            slots.default?.(),
          ),
        ],
      )
  },
})

describe('PageHeader', () => {
  it('renders in place when no target exists', () => {
    cy.mount(PageHeaderBase, {
      slots: { default: () => 'Standalone header' },
    })
    cy.get('header').should('contain.text', 'Standalone header')
  })

  it('teleports into the target', () => {
    cy.mount(Layout, {
      slots: {
        default: () => h(PageHeader, null, { default: () => 'Page title' }),
      },
    })
    cy.get('[data-testid=target] header').should('contain.text', 'Page title')
    cy.get('[data-testid=page] header').should('not.exist')
  })

  // SHELL-Q9: one click, and `data-no-scroll-top` keeps its name.
  it('honours data-no-scroll-top on a non-interactive element', () => {
    cy.mount(Layout, {
      slots: {
        default: () => [
          h(PageHeader, null, {
            default: () => [
              h('span', { 'data-no-scroll-top': '' }, 'Breadcrumb'),
              h('span', 'Title'),
            ],
          }),
          h('div', { style: 'height: 2000px' }),
        ],
      },
    })
    cy.get('[data-testid=page]').scrollTo(0, 500)
    cy.get('header [data-no-scroll-top]').click()
    cy.get('[data-testid=page]').should(($el) => {
      expect($el[0].scrollTop).to.be.greaterThan(0)
    })
  })

  it('scrolls its scroll container to top on empty-area clicks, ignoring interactive elements', () => {
    cy.mount(Layout, {
      slots: {
        default: () => [
          h(PageHeader, null, {
            default: () => [
              h('span', 'Title'),
              h('button', { type: 'button' }, 'Action'),
            ],
          }),
          h('div', { style: 'height: 2000px' }),
        ],
      },
    })
    cy.get('[data-testid=page]').scrollTo(0, 500)
    cy.get('header button').click()
    cy.get('[data-testid=page]').should(($el) => {
      expect($el[0].scrollTop).to.be.greaterThan(0)
    })
    cy.get('header').click()
    cy.get('[data-testid=page]').should(($el) => {
      expect($el[0].scrollTop).to.equal(0)
    })
  })
})

describe('PageHeaderBackButton', () => {
  it('uses fallbackRoute after a cold load', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/new', component: { render: () => null } },
        { path: '/drafts', component: { render: () => null } },
      ],
    })
    router.push('/new')
    cy.wrap(router.isReady()).then(() => {
      cy.mount(PageHeaderBackButton, {
        props: { fallbackRoute: '/drafts' },
        global: { plugins: [router] },
      })
      cy.get('button').click().then(() => {
        expect(router.currentRoute.value.fullPath).to.equal('/drafts')
      })
    })
  })
})

describe('PageHeaderTitle', () => {
  it('renders `title`, overridden by the default slot', () => {
    cy.mount(PageHeaderTitle, { props: { title: 'From prop' } })
    cy.get('span').should('contain.text', 'From prop')

    cy.mount(PageHeaderTitle, {
      props: { title: 'From prop' },
      slots: { default: () => 'From slot' },
    })
    cy.get('span').should('contain.text', 'From slot')
    cy.get('span').should('not.contain.text', 'From prop')
  })
})

describe('PageHeaderMobile', () => {
  // VOC-Q7: the height is fixed at 52px. `--mobile-header-height` is gone, so
  // setting it on an ancestor changes nothing.
  it('is 52px tall and reads no CSS variable for its height', () => {
    cy.mount(
      defineComponent({
        setup() {
          return () =>
            h('div', { style: '--mobile-header-height: 120px' }, [
              h(PageHeaderMobile, { title: 'Discussion' }),
            ])
        },
      }),
    )
    cy.get('header').should(($el) => {
      expect($el[0].getBoundingClientRect().height).to.equal(52)
    })
  })

  it('renders the #prefix, default, and #suffix slots', () => {
    cy.mount(PageHeaderMobile, {
      slots: {
        prefix: () => h('button', { 'data-test': 'prefix' }, 'Back'),
        default: () => h(PageHeaderMobileTitle, { title: 'Discussion' }),
        suffix: () => h('button', { 'data-test': 'suffix' }, 'More'),
      },
    })
    cy.get('[data-test=prefix]').should('contain.text', 'Back')
    cy.get('h1').should('contain.text', 'Discussion')
    cy.get('[data-test=suffix]').should('contain.text', 'More')
  })
})

describe('PageHeaderMobileTitle', () => {
  it('renders the #prefix slot next to the title', () => {
    cy.mount(PageHeaderMobileTitle, {
      props: { title: 'Announcements' },
      slots: { prefix: () => h('span', { 'data-test': 'prefix' }, '#') },
    })
    cy.get('[data-test=prefix]').should('contain.text', '#')
    cy.get('span').should('contain.text', 'Announcements')
  })
})
