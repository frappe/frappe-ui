import { defineComponent, h, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import Tabs from './Tabs.vue'
import TabList from './TabList.vue'
import TabTrigger from './TabTrigger.vue'
import TabPanel from './TabPanel.vue'

const items = [
  { value: 'home', label: 'Home' },
  { value: 'activity', label: 'Activity' },
]

describe('Tabs', () => {
  it('renders shorthand tabs with tablist semantics', () => {
    cy.mount(Tabs, {
      props: { tabs: items },
      slots: {
        panel: ({ tab }: { tab: (typeof items)[number] }) =>
          h('div', `${tab.label} content`),
      },
    })

    cy.get('[role=tablist]').should(
      'have.attr',
      'aria-orientation',
      'horizontal',
    )
    cy.get('[role=tab]').should('have.length', items.length)
    cy.contains('Home content').should('exist')
  })

  it('renders vertically', () => {
    cy.mount(Tabs, {
      props: { tabs: items, vertical: true },
    })

    cy.get('[role=tablist]').should('have.attr', 'aria-orientation', 'vertical')
  })

  it('selects the first tab without emitting when uncontrolled', () => {
    cy.mount(Tabs, {
      props: { tabs: items, 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })

    cy.get('[role=tab]').eq(0).should('have.attr', 'aria-selected', 'true')
    cy.get('@onUpdate').should('not.have.been.called')

    cy.get('[role=tab]').eq(1).click()

    cy.get('@onUpdate').should('have.been.calledWith', 'activity')
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true')
  })

  it('falls back to the first tab and emits when the model matches nothing', () => {
    cy.mount(Tabs, {
      props: {
        tabs: items,
        modelValue: 'missing',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('have.been.calledWith', 'home')
    cy.get('[role=tab]').eq(0).should('have.attr', 'aria-selected', 'true')
  })

  it('supports the composed form with a v-model round-trip', () => {
    const Harness = defineComponent({
      setup() {
        const value = ref<string | number>('home')

        return () =>
          h(
            Tabs,
            {
              modelValue: value.value,
              'onUpdate:modelValue': (nextValue: string | number) => {
                value.value = nextValue
              },
            },
            () => [
              h(TabList, { variant: 'subtle' }, () => [
                h(TabTrigger, { value: 'home', label: 'Home' }),
                h(TabTrigger, { value: 'activity', label: 'Activity' }),
              ]),
              h(TabPanel, { value: 'home' }, () => 'Home content'),
              h(TabPanel, { value: 'activity' }, () => 'Activity content'),
            ],
          )
      },
    })

    cy.mount(Harness)

    cy.contains('Home content').should('exist')
    cy.get('[role=tab]').eq(1).click()
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true')
    cy.contains('Activity content').should('exist')
    cy.contains('Home content').should('not.exist')
  })

  it('omits shorthand items whose condition returns false and falls back', () => {
    const showTasks = ref(true)
    const tabs = [
      { value: 'home', label: 'Home' },
      { value: 'tasks', label: 'Tasks', condition: () => showTasks.value },
    ]

    cy.mount(Tabs, {
      props: {
        tabs,
        modelValue: 'tasks',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('[role=tab]').should('have.length', 2)
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true')
    cy.get('@onUpdate').should('not.have.been.called')

    cy.then(() => {
      showTasks.value = false
    })

    cy.get('[role=tab]').should('have.length', 1)
    cy.get('@onUpdate').should('have.been.calledWith', 'home')
    cy.get('[role=tab]').eq(0).should('have.attr', 'aria-selected', 'true')
  })

  it('derives selection from the route and navigates without emitting', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/sent', component: { template: '<div />' } },
      ],
    })

    const onUpdate = cy.spy().as('onUpdate')

    const Harness = defineComponent({
      render: () =>
        h(Tabs, { 'onUpdate:modelValue': onUpdate }, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, {
              value: 'inbox',
              label: 'Inbox',
              route: '/inbox',
            }),
            h(TabTrigger, { value: 'sent', label: 'Sent', route: '/sent' }),
          ]),
        ]),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    // Route triggers render as links inside the tablist.
    cy.get('a[role=tab]').should('have.length', 2)
    cy.contains('a[role=tab]', 'Inbox').should(
      'have.attr',
      'aria-selected',
      'true',
    )

    cy.contains('a[role=tab]', 'Sent').click()

    cy.contains('a[role=tab]', 'Sent')
      .should('have.attr', 'aria-selected', 'true')
      .then(() => {
        expect(router.currentRoute.value.path).to.equal('/sent')
      })
    cy.contains('a[role=tab]', 'Inbox').should(
      'have.attr',
      'aria-selected',
      'false',
    )
    cy.get('@onUpdate').should('not.have.been.called')
  })

  it('skips disabled triggers with the keyboard and on click', () => {
    cy.mount(Tabs, {
      props: {
        tabs: [
          { value: 'home', label: 'Home' },
          { value: 'billing', label: 'Billing', disabled: true },
          { value: 'settings', label: 'Settings' },
        ],
      },
    })

    cy.get('[role=tab]').eq(1).should('have.attr', 'data-disabled')
    cy.get('[role=tab]').eq(1).click({ force: true })
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'false')

    cy.get('[role=tab]').eq(0).click()
    cy.focused().type('{rightArrow}')

    cy.get('[role=tab]').eq(2).should('have.attr', 'aria-selected', 'true')
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'false')
  })

  it('exposes the label as the accessible name of an icon-only trigger', () => {
    cy.mount(Tabs, {
      slots: {
        default: () => [
          h(TabList, { variant: 'ghost' }, () => [
            h(TabTrigger, {
              value: 'search',
              label: 'Search',
              icon: 'lucide-search',
            }),
          ]),
        ],
      },
    })

    cy.get('[role=tab]')
      .should('have.attr', 'aria-label', 'Search')
      .and('have.attr', 'title', 'Search')
    // The label is not rendered as visible text.
    cy.contains('[role=tab] span', 'Search').should('have.class', 'sr-only')
  })

  const shiftTabs = [
    { value: 'deals', label: 'Deals' },
    { value: 'contact', label: 'Contact' },
    { value: 'orgs', label: 'Organizations' },
  ]

  for (const variant of [
    'underline',
    'subtle',
    'ghost',
    'browser-tab',
  ] as const) {
    it(`keeps trigger geometry stable across selection (${variant})`, () => {
      cy.mount(Tabs, {
        props: { tabs: shiftTabs, variant },
      })

      const rects: DOMRect[] = []
      cy.get('[role=tab]').each(($el) => {
        rects.push($el[0].getBoundingClientRect())
      })

      cy.get('[role=tab]').eq(1).click()
      cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true')

      cy.get('[role=tab]').each(($el, i) => {
        const r = $el[0].getBoundingClientRect()
        expect(r.x, `tab ${i} x`).to.be.closeTo(rects[i].x, 0.01)
        expect(r.y, `tab ${i} y`).to.be.closeTo(rects[i].y, 0.01)
        expect(r.width, `tab ${i} width`).to.be.closeTo(rects[i].width, 0.01)
        expect(r.height, `tab ${i} height`).to.be.closeTo(rects[i].height, 0.01)
      })
    })
  }

  it('slides the browser-tab indicator card onto the selected trigger', () => {
    cy.mount(Tabs, {
      props: { tabs: shiftTabs, variant: 'browser-tab' },
    })

    cy.get('[role=tab]').eq(2).click()
    cy.get('[role=tab]').eq(2).should('have.attr', 'aria-selected', 'true')

    // Retries until the 200ms slide settles. The indicator covers the
    // trigger's box (reka measures integer offsets, so allow 1px).
    cy.get('[role=tablist]').should(($list) => {
      const indicator = $list[0].querySelector<HTMLElement>(
        ':scope > [aria-hidden="true"]',
      )
      expect(indicator, 'indicator').to.exist
      const ir = indicator!.getBoundingClientRect()
      const tr = $list[0]
        .querySelectorAll<HTMLElement>('[role=tab]')[2]
        .getBoundingClientRect()
      expect(ir.x, 'x').to.be.closeTo(tr.x, 1)
      expect(ir.width, 'width').to.be.closeTo(tr.width, 1)
      expect(ir.y, 'y').to.be.closeTo(tr.y, 1)
      expect(ir.height, 'height').to.be.closeTo(tr.height, 1)
    })
  })
})
