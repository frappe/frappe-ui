import { defineComponent, h, nextTick, ref, Teleport } from 'vue'
import Tabs from './Tabs.vue'
import TabList from './TabList.vue'
import TabTrigger from './TabTrigger.vue'
import TabPanel from './TabPanel.vue'

// ---------------------------------------------------------------------------
// Browser regression guard for #801 / #1045.
//
// #801 reported an uncaught `TypeError: Failed to execute 'observe' on
// 'ResizeObserver': parameter 1 is not of type 'Element'` on every Tabs mount.
// It originates in reka's TabsIndicator, which observes a computed array:
//
//   useResizeObserver(computed(() => [context.tabsList.value, ...tabs.value]), cb)
//
// Whether that is safe depends entirely on which @vueuse/core copy reka
// resolves. @vueuse/core 10.x tests `Array.isArray(target)` against the raw
// (still-wrapped) ComputedRef, so it never unwraps the array and hands the
// whole Array to `observe()` — which throws. 14.x calls `toValue(target)`
// first and observes each element individually, which is safe. reka-ui
// declares `@vueuse/core: ^14.1.0`, so it cannot resolve a 10.x copy by
// semver; this spec is what fails if that ever stops being true (a
// `resolve.dedupe: ['@vueuse/core']`, an override, or a loosened reka range).
//
// This runs in a REAL browser against the REAL ResizeObserver — jsdom has no
// ResizeObserver at all, so a jsdom stub cannot reproduce or refute this. The
// wrapper below only records what was handed over; the real call still runs,
// so a bad target genuinely throws.
// ---------------------------------------------------------------------------

type Observed = { isElement: boolean; described: string }

const items = [
  { value: 'home', label: 'Home' },
  { value: 'activity', label: 'Activity' },
]

describe('Tabs — ResizeObserver target types (#801 / #1045)', () => {
  let observed: Observed[] = []
  let uncaught: string[] = []
  let restore: (() => void) | null = null

  beforeEach(() => {
    observed = []
    uncaught = []
    cy.on('uncaught:exception', (err) => {
      // Record rather than fail here, so the assertion below reports the
      // actual message instead of Cypress's generic bail-out.
      uncaught.push(err.message)
      return false
    })
    cy.window().then((win) => {
      const RO = (win as any).ResizeObserver
      const original = RO.prototype.observe
      RO.prototype.observe = function (target: unknown, ...rest: unknown[]) {
        observed.push({
          isElement: target instanceof (win as any).Element,
          described:
            Object.prototype.toString.call(target) +
            (target && (target as any).tagName
              ? `<${(target as any).tagName.toLowerCase()}>`
              : ''),
        })
        return original.call(this, target, ...rest)
      }
      restore = () => {
        RO.prototype.observe = original
      }
    })
  })

  afterEach(() => {
    restore?.()
    restore = null
  })

  function expectCleanObservation(minTargets: number) {
    cy.then(() => {
      expect(
        uncaught.filter((m) => /ResizeObserver/.test(m)),
        'no uncaught ResizeObserver error',
      ).to.deep.equal([])

      expect(
        observed.filter((o) => !o.isElement).map((o) => o.described),
        'every ResizeObserver target is a real Element',
      ).to.deep.equal([])

      // Non-vacuity: reka observes the tablist plus every [role=tab]. If a
      // 10.x-style copy collapsed them into one un-unwrapped Array, this
      // would be 1 (and would already have failed the Element check above).
      expect(
        observed.length,
        'observer saw the tablist and each tab individually',
      ).to.be.at.least(minTargets)
    })
  }

  it('shorthand tabs, uncontrolled', () => {
    cy.mount(Tabs, {
      props: { tabs: items },
      slots: {
        'tab-panel': ({ tab }: any) => h('div', `${tab.label} content`),
      },
    })
    cy.get('[role=tab]').should('have.length', 2)
    expectCleanObservation(3)
  })

  it('composed tabs, uncontrolled', () => {
    const Harness = defineComponent({
      render: () =>
        h(Tabs, null, () => [
          h(TabList, null, () => [
            h(TabTrigger, { value: 'home', label: 'Home' }),
            h(TabTrigger, { value: 'activity', label: 'Activity' }),
          ]),
          h(TabPanel, { value: 'home' }, () => 'Home content'),
        ]),
    })
    cy.mount(Harness)
    cy.get('[role=tab]').should('have.length', 2)
    expectCleanObservation(3)
  })

  it('tabs revealed inside a dialog-shaped v-if container', () => {
    // The reported shape: Tabs mount while their container is being inserted,
    // so TabsList's element is not settled on the indicator's first flush.
    const Harness = defineComponent({
      setup() {
        const open = ref(false)
        nextTick(() => {
          open.value = true
        })
        return { open }
      },
      render(this: any) {
        return this.open
          ? h('div', { role: 'dialog' }, [
              h(Tabs, { tabs: items }, {
                'tab-panel': ({ tab }: any) => h('div', `${tab.label} content`),
              } as any),
            ])
          : h('div')
      },
    })
    cy.mount(Harness)
    cy.get('[role=dialog] [role=tab]').should('have.length', 2)
    expectCleanObservation(3)
  })

  it('tabs inside a Teleport', () => {
    const Harness = defineComponent({
      render: () =>
        h(Teleport, { to: 'body' }, [
          h(Tabs, { tabs: items }, {
            'tab-panel': ({ tab }: any) => h('div', `${tab.label} content`),
          } as any),
        ]),
    })
    cy.mount(Harness)
    cy.get('body [role=tab]').should('have.length', 2)
    expectCleanObservation(3)
  })

  it('vertical tabs revealed inside a teleported dialog', () => {
    const Harness = defineComponent({
      setup() {
        const open = ref(false)
        nextTick(() => {
          open.value = true
        })
        return { open }
      },
      render(this: any) {
        return h(Teleport, { to: 'body' }, [
          this.open
            ? h('div', { role: 'dialog' }, [
                h(Tabs, { tabs: items, orientation: 'vertical' }, {
                  'tab-panel': ({ tab }: any) =>
                    h('div', `${tab.label} content`),
                } as any),
              ])
            : h('div'),
        ])
      },
    })
    cy.mount(Harness)
    cy.get('[role=dialog] [role=tab]').should('have.length', 2)
    expectCleanObservation(3)
  })
})
