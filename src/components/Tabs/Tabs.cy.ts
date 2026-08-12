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
        'tab-panel': ({ tab }: { tab: (typeof items)[number] }) =>
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

  it('renders every shorthand slot into its generated tab', () => {
    // Vue fails silently on an unknown slot name, so a typo in the four
    // shorthand keys would ship green. This renders all of them.
    cy.mount(Tabs, {
      props: { tabs: items },
      slots: {
        'tab-prefix': ({ tab }: { tab: (typeof items)[number] }) =>
          h('span', `[${tab.value}`),
        'tab-label': ({
          tab,
          selected,
        }: {
          tab: (typeof items)[number]
          selected: boolean
        }) => h('span', `${tab.label}${selected ? '*' : ''}`),
        'tab-suffix': () => h('span', ']'),
        'tab-panel': ({ tab }: { tab: (typeof items)[number] }) =>
          h('div', `${tab.label} content`),
      },
    })

    cy.get('[role=tab]').eq(0).should('have.text', '[homeHome*]')
    cy.get('[role=tab]').eq(1).should('have.text', '[activityActivity]')
    cy.contains('Home content').should('exist')
  })

  it('exposes a shared data-slot on the sliding indicator', () => {
    // `TabButtons` is pixel-identical at the same variant, so indicator CSS
    // must be able to target both with one selector (P10).
    cy.mount(Tabs, { props: { tabs: items, variant: 'subtle' } })
    cy.get('[data-slot="tab-list"] [data-slot="tab-indicator"]').should('exist')
  })

  it('clips the pill indicator so its shadow stops at the track', () => {
    cy.mount(Tabs, { props: { tabs: items, variant: 'subtle' } })

    // The track can't clip: it would cut a focused trigger's ring too. The
    // layer holding the indicator does it instead.
    cy.get('[data-slot="tab-list"]').should(
      'not.have.css',
      'overflow',
      'hidden',
    )
    cy.get('[data-slot="tab-indicator"]')
      .parent()
      .should('have.css', 'overflow', 'hidden')

    // Square corners would clip the edges and leave the corners bleeding,
    // which is the bug. The layer has to round like the track.
    cy.get('[data-slot="tab-list"]').then(($track) => {
      const radius = getComputedStyle($track[0]).borderRadius
      expect(radius, 'track radius').not.to.equal('0px')
      cy.get('[data-slot="tab-indicator"]')
        .parent()
        .should('have.css', 'border-radius', radius)
    })
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

  it('moves off a selected trigger that turns disabled, and never starts on one', () => {
    const lock = ref(false)
    const model = ref('activity')
    const Harness = defineComponent({
      render: () =>
        h(Tabs, {
          modelValue: model.value,
          'onUpdate:modelValue': (v: string) => (model.value = v),
          tabs: [
            { value: 'home', label: 'Home' },
            { value: 'activity', label: 'Activity', disabled: lock.value },
          ],
        }),
    })

    cy.mount(Harness)
    cy.contains('[role=tab]', 'Activity').should(
      'have.attr',
      'aria-selected',
      'true',
    )

    // Disabling the selected trigger must move selection to the first
    // selectable one and tell the app, the same way a stale model does.
    cy.then(() => {
      lock.value = true
    })
    cy.contains('[role=tab]', 'Home')
      .should('have.attr', 'aria-selected', 'true')
      .then(() => {
        expect(model.value).to.equal('home')
      })
  })

  it('selects nothing when every trigger is disabled', () => {
    const onUpdate = cy.spy().as('onUpdate')
    cy.mount(Tabs, {
      props: {
        'onUpdate:modelValue': onUpdate,
        tabs: [
          { value: 'home', label: 'Home', disabled: true },
          { value: 'activity', label: 'Activity', disabled: true },
        ],
      },
    })

    // No tab is reachable, so none may be shown as selected and no value may
    // be handed to a controlled model.
    cy.get('[role=tab]').each(($el) => {
      cy.wrap($el)
        .find('[data-state]')
        .should('have.attr', 'data-state', 'inactive')
    })
    cy.get('@onUpdate').should('not.have.been.called')
  })

  it('does not start on a disabled trigger the model points at', () => {
    const model = ref('activity')
    cy.mount(Tabs, {
      props: {
        modelValue: model.value,
        'onUpdate:modelValue': (v: string) => (model.value = v),
        tabs: [
          { value: 'home', label: 'Home' },
          { value: 'activity', label: 'Activity', disabled: true },
        ],
      },
    })

    cy.contains('[role=tab]', 'Home')
      .should('have.attr', 'aria-selected', 'true')
      .then(() => {
        expect(model.value).to.equal('home')
      })
  })

  it('keeps the parent tab selected on a child route, and prefers an exact match', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/settings', component: { template: '<div />' } },
        {
          path: '/settings/billing',
          component: { template: '<router-view />' },
          children: [{ path: 'history', component: { template: '<div />' } }],
        },
      ],
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, {
              value: 'settings',
              label: 'Settings',
              route: '/settings',
            }),
            h(TabTrigger, {
              value: 'billing',
              label: 'Billing',
              route: '/settings/billing',
            }),
          ]),
        ]),
    })

    cy.wrap(router.push('/settings'))
    cy.mount(Harness, { global: { plugins: [router] } })
    cy.contains('[role=tab]', 'Settings')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    // `/settings/billing` is inclusively active for both triggers. The exact
    // match must win, or a nested route would keep selecting its parent tab.
    cy.then(() => router.push('/settings/billing'))
    cy.contains('[role=tab]', 'Billing')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    // A child route with no trigger of its own keeps the parent selected,
    // via RouterLink's inclusive matching.
    cy.then(() => router.push('/settings/billing/history'))
    cy.contains('[role=tab]', 'Billing')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
  })

  it('lets a bound model win over route triggers', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/sent', component: { template: '<div />' } },
      ],
    })

    const model = ref('sent')
    const Harness = defineComponent({
      render: () =>
        h(
          Tabs,
          {
            modelValue: model.value,
            'onUpdate:modelValue': (v: string) => (model.value = v),
          },
          () => [
            h(TabList, { variant: 'underline' }, () => [
              h(TabTrigger, {
                value: 'inbox',
                label: 'Inbox',
                route: '/inbox',
              }),
              h(TabTrigger, { value: 'sent', label: 'Sent', route: '/sent' }),
            ]),
          ],
        ),
    })

    // The URL says Inbox, the model says Sent. With a binding present the
    // model is the source of truth and `route` is only a navigation side
    // effect, so route mode must stay off.
    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })
    cy.contains('[role=tab]', 'Sent')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    // Clicking still navigates and now also updates the model.
    cy.contains('[role=tab]', 'Inbox').click()
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
      .then(() => {
        expect(model.value).to.equal('inbox')
        expect(router.currentRoute.value.path).to.equal('/inbox')
      })
  })

  it('does not select a disabled trigger whose route is current', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/archive', component: { template: '<div />' } },
      ],
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, {
              value: 'archive',
              label: 'Archive',
              route: '/archive',
              disabled: true,
            }),
          ]),
          h(TabPanel, { value: 'inbox' }, () => 'Inbox panel'),
          h(TabPanel, { value: 'archive' }, () => 'Archive panel'),
        ]),
    })

    // Reaching a disabled trigger's route directly must not select it — the
    // trigger renders as a button, so the user could never select it either.
    cy.wrap(router.push('/archive'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('[role=tab]', 'Archive').should(
      'have.attr',
      'aria-selected',
      'false',
    )
    cy.contains('Archive panel').should('not.exist')
  })

  it('stays in value mode when the only route trigger is disabled', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/archive', component: { template: '<div />' } },
      ],
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox' }),
            h(TabTrigger, { value: 'drafts', label: 'Drafts' }),
            h(TabTrigger, {
              value: 'archive',
              label: 'Archive',
              route: '/archive',
              disabled: true,
            }),
          ]),
        ]),
    })

    // A disabled route trigger is excluded from route selection, so it must
    // not put the root in route mode either — otherwise nothing is selected
    // and every click on an enabled trigger is discarded.
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('[role=tab]', 'Inbox').should(
      'have.attr',
      'aria-selected',
      'true',
    )
    cy.contains('[role=tab]', 'Drafts').click()
    cy.contains('[role=tab]', 'Drafts').should(
      'have.attr',
      'aria-selected',
      'true',
    )
  })

  it('selects a non-route trigger while route mode is on', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
      ],
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, { value: 'drafts', label: 'Drafts' }),
          ]),
        ]),
    })

    // The route matches no trigger, so the route trigger stays unselected —
    // but the non-route trigger has nothing to navigate and must still be
    // selectable rather than locked out by route mode.
    cy.wrap(router.push('/'))
    cy.mount(Harness, { global: { plugins: [router] } })

    // Assert the root's own selection (which drives the active styling), not
    // just reka's aria-selected — reka falls back to uncontrolled state when
    // the model is undefined, so aria-selected flips either way.
    cy.contains('[role=tab]', 'Drafts').click()
    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'inactive')
  })

  it('drops a clicked non-route trigger from route mode once it is disabled', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
      ],
    })

    const lock = ref(false)
    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, {
              value: 'drafts',
              label: 'Drafts',
              disabled: lock.value,
            }),
          ]),
        ]),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    // Drafts wins the click, then turns disabled. A tab the user can no
    // longer select must not stay active — selection returns to the route.
    cy.contains('[role=tab]', 'Drafts').click()
    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    cy.then(() => {
      lock.value = true
    })
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    // Re-enabling must not hand selection back. The override ended when the
    // trigger went disabled; taking it again needs another click.
    cy.then(() => {
      lock.value = false
    })
    cy.contains('[role=tab]', 'Drafts').should('not.have.attr', 'disabled')
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'inactive')
  })

  it('falls back to a non-route trigger when only a disabled route matches', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/archive', component: { template: '<div />' } },
      ],
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, {
              value: 'archive',
              label: 'Archive',
              route: '/archive',
              disabled: true,
            }),
            h(TabTrigger, { value: 'drafts', label: 'Drafts' }),
          ]),
        ]),
    })

    // The URL matches only the disabled trigger, which route selection skips.
    // The enabled non-route trigger claims no URL, so it must take selection
    // rather than leaving the whole list blank at mount.
    cy.wrap(router.push('/archive'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
    cy.contains('[role=tab]', 'Archive')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'inactive')
  })

  it('keeps route-mode selection on a trigger that changes its value', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/inbox', component: { template: '<div />' } }],
    })

    const draftsValue = ref('drafts')
    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, { value: draftsValue.value, label: 'Drafts' }),
          ]),
        ]),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    // The override tracks the trigger, not the value it had when clicked, so
    // renaming it keeps the same tab selected instead of dropping back to the
    // route and leaving the old value loose for another trigger to claim.
    cy.contains('[role=tab]', 'Drafts').click()
    cy.then(() => {
      draftsValue.value = 'drafts-2'
    })
    // Wait for the rename to reach the DOM before reading the state, or the
    // assertion passes on the pre-update render and proves nothing.
    cy.contains('[role=tab]', 'Drafts')
      .should('have.attr', 'id')
      .and('contain', 'drafts-2')
    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
  })

  it('does not let a remounted conditional tab reclaim route-mode selection', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/inbox', component: { template: '<div />' } }],
    })

    const show = ref(true)
    const Harness = defineComponent({
      render: () =>
        h(Tabs, {
          tabs: [
            { value: 'inbox', label: 'Inbox', route: '/inbox' },
            { value: 'drafts', label: 'Drafts', condition: () => show.value },
          ],
        }),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('[role=tab]', 'Drafts').click()
    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    // Hiding Drafts hands selection back to the route. Showing it again must
    // not silently take selection back — the user did not ask for that.
    cy.then(() => {
      show.value = false
    })
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    cy.then(() => {
      show.value = true
    })
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'inactive')
  })

  it('lets a non-route click win over a matching route, until the route moves', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
      ],
    })

    const onUpdate = cy.stub().as('update')
    const Harness = defineComponent({
      render: () =>
        h(Tabs, { 'onUpdate:modelValue': onUpdate }, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, { value: 'drafts', label: 'Drafts' }),
          ]),
        ]),
    })

    // The route matches Inbox. Clicking Drafts must select Drafts rather than
    // emit a value the root does not show — Drafts has no route, so the URL
    // can never stand for it.
    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')

    cy.contains('[role=tab]', 'Drafts').click()
    cy.contains('[role=tab]', 'Drafts')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
    cy.get('@update').should('have.been.calledWith', 'drafts')

    // Clicking back onto the route trigger hands selection to the route again.
    cy.contains('[role=tab]', 'Inbox').click()
    cy.contains('[role=tab]', 'Inbox')
      .find('[data-state]')
      .should('have.attr', 'data-state', 'active')
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

  it('slides the subtle pill onto the selected trigger', () => {
    // The pill sits in a clip layer, so reka positions it from a containing
    // block that is not the tablist. The layer's box matches the tablist's
    // padding box, but a drift there would be invisible without this.
    cy.mount(Tabs, { props: { tabs: shiftTabs, variant: 'subtle' } })

    cy.get('[role=tab]').eq(2).click()
    cy.get('[role=tab]').eq(2).should('have.attr', 'aria-selected', 'true')

    // Retries until the 200ms slide settles. The indicator covers the
    // trigger's box (reka measures integer offsets, so allow 1px).
    cy.get('[role=tablist]').should(($list) => {
      const indicator = $list[0].querySelector<HTMLElement>(
        '[data-slot="tab-indicator"]',
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

  it('moves focus without navigating when arrowing over route triggers', () => {
    // Automatic activation would select on arrow, but a route trigger only
    // navigates on click or Enter — so the arrow would land on a tab that
    // selects nothing and goes nowhere. Route mode uses manual activation:
    // arrows move focus, Enter commits. This also matches the ARIA APG rule
    // that activation with a significant side effect should be manual.
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/sent', component: { template: '<div />' } },
      ],
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, { value: 'sent', label: 'Sent', route: '/sent' }),
          ]),
        ]),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('a[role=tab]', 'Inbox').focus().type('{rightarrow}')

    // Focus moved to Sent, but Inbox stays selected and the route stands.
    cy.focused().should('contain.text', 'Sent')
    cy.contains('a[role=tab]', 'Inbox')
      .should('have.attr', 'aria-selected', 'true')
      .then(() => {
        expect(router.currentRoute.value.path).to.equal('/inbox')
      })
  })

  it('does not let the keyboard select while nothing matches the route', () => {
    // An all-route list on a URL matching no trigger: `selected` is
    // undefined, which reka reads as uncontrolled and then drives its own
    // selection. Space commits under manual activation without following the
    // link, so it would flip `aria-selected` on a trigger whose Pill stays
    // inactive, and it would stick until a route matched. The root hands reka
    // a value no trigger carries instead.
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/sent', component: { template: '<div />' } },
      ],
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox', route: '/inbox' }),
            h(TabTrigger, { value: 'sent', label: 'Sent', route: '/sent' }),
          ]),
        ]),
    })

    cy.wrap(router.push('/'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.get('[role=tab][aria-selected=true]').should('not.exist')

    cy.contains('a[role=tab]', 'Inbox').focus().type(' ')

    cy.get('[role=tab][aria-selected=true]')
      .should('not.exist')
      .then(() => {
        expect(router.currentRoute.value.path).to.equal('/')
      })
  })

  it('keeps activation manual when a model is bound alongside routes', () => {
    // A bound model turns route mode off, but clicking a route trigger still
    // navigates. Under automatic activation the arrow key emitted the value
    // without navigating while a click did both, so the keyboard and the
    // mouse ended on different URLs.
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
        h(Tabs, {
          modelValue: 'inbox',
          'onUpdate:modelValue': onUpdate,
          tabs: [
            { value: 'inbox', label: 'Inbox', route: '/inbox' },
            { value: 'sent', label: 'Sent', route: '/sent' },
          ],
        }),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('a[role=tab]', 'Inbox').focus().type('{rightarrow}')

    // Focus moved, but nothing was selected and nothing navigated.
    cy.focused().should('contain.text', 'Sent')
    cy.get('@onUpdate')
      .should('not.have.been.called')
      .then(() => {
        expect(router.currentRoute.value.path).to.equal('/inbox')
      })
  })

  it('shows a focus ring that the track does not clip', () => {
    // P12: the shell owns the ring for both components and every track. The
    // subtle track has 1px of padding, so `overflow-hidden` there used to cut
    // the outer half of it off.
    cy.mount(Tabs, { props: { tabs: items, variant: 'subtle' } })

    cy.get('[role=tab]').eq(1).focus()

    cy.get('[role=tab]')
      .eq(1)
      .should(($tab) => {
        const outline = getComputedStyle($tab[0]).outline
        expect(outline, 'outline').to.not.equal('')
        expect(outline, 'outline').to.not.contain('none')
      })

    cy.get('[data-slot="tab-list"]').should(($list) => {
      expect(
        getComputedStyle($list[0]).overflow,
        'track overflow',
      ).to.not.equal('hidden')
    })
  })

  it('keeps activation manual for composed route triggers', () => {
    // Composed triggers register after the root renders, and reka reads the
    // activation mode before that. The root reads the slot's own vnodes
    // instead, so a hand-written route list behaves like a `tabs` one.
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
        h(
          Tabs,
          { modelValue: 'inbox', 'onUpdate:modelValue': onUpdate },
          () => [
            h(TabList, { variant: 'underline' }, () => [
              h(TabTrigger, {
                value: 'inbox',
                label: 'Inbox',
                route: '/inbox',
              }),
              h(TabTrigger, { value: 'sent', label: 'Sent', route: '/sent' }),
            ]),
          ],
        ),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('a[role=tab]', 'Inbox').focus().type('{rightarrow}')

    cy.focused().should('contain.text', 'Sent')
    cy.get('@onUpdate').should('not.have.been.called')
    cy.contains('a[role=tab]', 'Inbox')
      .should('have.attr', 'aria-selected', 'true')
      .then(() => {
        expect(router.currentRoute.value.path).to.equal('/inbox')
      })
  })

  it('finds route triggers behind a v-for in the slot', () => {
    // `v-for` hands the slot a nested list rather than flat vnodes, so the
    // scan has to walk into it.
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/sent', component: { template: '<div />' } },
      ],
    })

    const onUpdate = cy.spy().as('onUpdate')
    const links = [
      { value: 'inbox', label: 'Inbox', route: '/inbox' },
      { value: 'sent', label: 'Sent', route: '/sent' },
    ]

    const Harness = defineComponent({
      render: () =>
        h(
          Tabs,
          { modelValue: 'inbox', 'onUpdate:modelValue': onUpdate },
          () => [
            h(TabList, { variant: 'underline' }, () =>
              links.map((link) => h(TabTrigger, { key: link.value, ...link })),
            ),
          ],
        ),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('a[role=tab]', 'Inbox').focus().type('{rightarrow}')

    cy.get('@onUpdate')
      .should('not.have.been.called')
      .then(() => {
        expect(router.currentRoute.value.path).to.equal('/inbox')
      })
  })

  it('does not call a panel component scoped slot while scanning', () => {
    // The scan runs inside setup. Calling an arbitrary component's scoped
    // default slot with no argument throws where the slot destructures, and a
    // throw there takes the whole component down rather than degrading.
    const Scoped = defineComponent({
      setup(_, { slots }) {
        return () => h('div', slots.default?.({ item: { name: 'panel ok' } }))
      },
    })

    const Harness = defineComponent({
      render: () =>
        h(Tabs, { modelValue: 'inbox' }, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'inbox', label: 'Inbox' }),
          ]),
          h(TabPanel, { value: 'inbox' }, () => [
            h(Scoped, null, {
              default: ({ item }: { item: { name: string } }) =>
                h('span', item.name),
            }),
          ]),
        ]),
    })

    cy.mount(Harness)

    cy.get('[role=tab]').should('have.length', 1)
    cy.contains('panel ok').should('exist')
  })

  it('ignores route triggers that belong to a nested Tabs in a panel', () => {
    // A nested route list must not turn off arrow-key selection in the outer,
    // route-free one.
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
      ],
    })

    const onUpdate = cy.spy().as('onUpdate')

    const Harness = defineComponent({
      render: () =>
        h(Tabs, { 'onUpdate:modelValue': onUpdate }, () => [
          h(TabList, { variant: 'underline' }, () => [
            h(TabTrigger, { value: 'one', label: 'One' }),
            h(TabTrigger, { value: 'two', label: 'Two' }),
          ]),
          h(TabPanel, { value: 'one' }, () => [
            h(Tabs, null, () => [
              h(TabList, { variant: 'underline' }, () => [
                h(TabTrigger, {
                  value: 'inbox',
                  label: 'Inbox',
                  route: '/inbox',
                }),
              ]),
            ]),
          ]),
        ]),
    })

    cy.wrap(router.push('/'))
    cy.mount(Harness, { global: { plugins: [router] } })

    // Outer list keeps automatic activation: arrowing selects.
    cy.contains('[role=tab]', 'One').focus().type('{rightarrow}')
    cy.get('@onUpdate').should('have.been.calledWith', 'two')
  })

  it('finds route triggers through a plain element wrapper', () => {
    // A TabList inside a toolbar row is ordinary. Element children are
    // normalised into an array at vnode creation, so descending into them
    // cannot call a slot.
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
        h(
          Tabs,
          { modelValue: 'inbox', 'onUpdate:modelValue': onUpdate },
          () => [
            h('div', { class: 'flex justify-between' }, [
              h(TabList, { variant: 'underline' }, () => [
                h(TabTrigger, {
                  value: 'inbox',
                  label: 'Inbox',
                  route: '/inbox',
                }),
                h(TabTrigger, { value: 'sent', label: 'Sent', route: '/sent' }),
              ]),
              h('button', 'Action'),
            ]),
          ],
        ),
    })

    cy.wrap(router.push('/inbox'))
    cy.mount(Harness, { global: { plugins: [router] } })

    cy.contains('a[role=tab]', 'Inbox').focus().type('{rightarrow}')

    cy.focused().should('contain.text', 'Sent')
    cy.get('@onUpdate')
      .should('not.have.been.called')
      .then(() => {
        expect(router.currentRoute.value.path).to.equal('/inbox')
      })
  })

  it('honours a bound model that starts undefined over route triggers', () => {
    // `const tab = ref()` with `v-model` is ordinary. Testing the model's
    // value rather than the binding turned route mode on, and route mode
    // never emits for a route trigger — so the ref stayed undefined and the
    // binding was dead for the life of the component.
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/inbox', component: { template: '<div />' } },
        { path: '/sent', component: { template: '<div />' } },
      ],
    })

    const tab = ref<string | undefined>(undefined)

    const Harness = defineComponent({
      render: () =>
        h(
          Tabs,
          {
            modelValue: tab.value,
            'onUpdate:modelValue': (value: string) => {
              tab.value = value
            },
          },
          () => [
            h(TabList, { variant: 'underline' }, () => [
              h(TabTrigger, {
                value: 'inbox',
                label: 'Inbox',
                route: '/inbox',
              }),
              h(TabTrigger, { value: 'sent', label: 'Sent', route: '/sent' }),
            ]),
          ],
        ),
    })

    cy.wrap(router.push('/'))
    cy.mount(Harness, { global: { plugins: [router] } })

    // The model wins: it fills in rather than deferring to the router.
    cy.wrap(tab).its('value').should('equal', 'inbox')

    cy.contains('a[role=tab]', 'Sent').click()
    cy.wrap(tab).its('value').should('equal', 'sent')
  })

  it('forwards side to the generated TabList in shorthand mode', () => {
    // `variant` and `size` were forwarded and `side` was not, so a shorthand
    // vertical browser-tab list could only ever attach left.
    cy.mount(Tabs, {
      props: {
        tabs: items,
        variant: 'browser-tab',
        vertical: true,
        side: 'right',
      },
    })

    cy.get('[data-slot="tab-list"]').should(($list) => {
      expect(
        getComputedStyle($list[0]).borderRightWidth,
        'right rail',
      ).to.not.equal('0px')
    })
  })
})
