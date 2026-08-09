import { defineComponent, h, ref } from 'vue'
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
})
