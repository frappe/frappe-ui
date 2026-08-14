import { defineComponent, h, ref } from 'vue'
import type { Component } from 'vue'
import Alert from '../Alert/Alert.vue'
import Button from '../Button/Button.vue'
import PageHeaderMobile from '../PageHeader/PageHeaderMobile.vue'
import Pill from './tabs/Pill.vue'
import SidebarCard from '../Sidebar/SidebarCard.vue'
import Textarea from '../Textarea/Textarea.vue'

/**
 * `useSlots()` returns `instance.slots`, which Vue mutates in place and does
 * not track. Every component here derives something from it inside a
 * `computed`, so without `useSlotTick()` the computed keeps whatever was
 * filled at mount — a slot behind a `v-if` never takes effect.
 *
 * Each case mounts with the slot empty, fills it, and empties it again.
 */
interface Case {
  /** Spec name. */
  name: string
  component: Component
  props?: Record<string, unknown>
  /** Slot the case toggles. */
  slot: string
  content: () => unknown
  /** Runs while the slot is filled. */
  filled: () => void
  /** Runs while the slot is empty. */
  empty: () => void
}

const cases: Case[] = [
  {
    // `icon: false` drops the automatic theme glyph, so `showPrefix` depends
    // on the slot alone.
    name: 'Alert gates its prefix region on #prefix',
    component: Alert,
    props: { title: 'Heads up', icon: false },
    slot: 'prefix',
    content: () => h('span', { 'data-cy': 'mark' }, '!'),
    filled: () => cy.get('[data-slot="prefix"]').should('exist'),
    empty: () => cy.get('[data-slot="prefix"]').should('not.exist'),
  },
  {
    name: 'Alert switches to the banner layout on #description',
    component: Alert,
    props: { title: 'Heads up', icon: false },
    slot: 'description',
    content: () => h('span', 'More detail'),
    filled: () => cy.get('[data-layout]').should('have.attr', 'data-layout', 'banner'),
    empty: () => cy.get('[data-layout]').should('have.attr', 'data-layout', 'row'),
  },
  {
    name: 'SidebarCard gates its prefix region on #prefix',
    component: SidebarCard,
    props: { title: 'Storage', icon: false },
    slot: 'prefix',
    content: () => h('span', { 'data-cy': 'mark' }, '!'),
    filled: () => cy.get('[data-slot="prefix"]').should('exist'),
    empty: () => cy.get('[data-slot="prefix"]').should('not.exist'),
  },
  {
    name: 'SidebarCard gates its actions region on #actions',
    component: SidebarCard,
    props: { title: 'Storage', icon: false },
    slot: 'actions',
    content: () => h('span', 'Upgrade'),
    filled: () => cy.get('[data-slot="actions"]').should('exist'),
    empty: () => cy.get('[data-slot="actions"]').should('not.exist'),
  },
  {
    // An `#icon` slot turns the button into an icon button, which replaces the
    // label region outright.
    name: 'Button becomes an icon button when #icon fills',
    component: Button,
    props: { label: 'Close' },
    slot: 'icon',
    content: () => h('span', { 'data-cy': 'mark' }, '×'),
    filled: () => {
      cy.get('[data-cy="mark"]').should('exist')
      cy.get('button').should('not.contain.text', 'Close')
    },
    empty: () => {
      cy.get('[data-cy="mark"]').should('not.exist')
      cy.get('button').should('contain.text', 'Close')
    },
  },
  {
    name: 'Pill drops icon-only intent when the default slot fills',
    component: Pill,
    props: { icon: 'lucide-x', label: 'Close' },
    slot: 'default',
    content: () => 'Close',
    filled: () => cy.get('.sr-only').should('not.exist'),
    empty: () => cy.get('.sr-only').should('exist'),
  },
  {
    // `hasLabeling` decides whether the labeling wrapper exists, and the
    // wrapper is what a caller's `class` lands on. Without it the control
    // keeps the class and the wrapper never appears.
    name: 'Textarea moves the caller class onto the labeling wrapper on #label',
    component: Textarea,
    props: { class: 'probe' },
    slot: 'label',
    content: () => 'Notes',
    filled: () => {
      cy.get('div.probe').should('exist')
      cy.get('textarea').should('not.have.class', 'probe')
    },
    empty: () => {
      cy.get('div.probe').should('not.exist')
      cy.get('textarea').should('have.class', 'probe')
    },
  },
  {
    name: 'PageHeaderMobile reserves the prefix inset on #prefix',
    component: PageHeaderMobile,
    props: { title: 'Inbox' },
    slot: 'prefix',
    content: () => h('button', { 'data-cy': 'mark' }, 'Back'),
    filled: () => cy.get('[data-cy="mark"]').should('exist'),
    empty: () => cy.get('[data-cy="mark"]').should('not.exist'),
  },
]

function harness(c: Case) {
  return defineComponent({
    setup() {
      const show = ref(false)

      return () =>
        h('div', [
          h(
            'button',
            {
              'data-cy': 'toggle',
              onClick: () => (show.value = !show.value),
            },
            'Toggle',
          ),
          h(
            c.component,
            { ...c.props },
            show.value ? { [c.slot]: () => c.content() } : {},
          ),
        ])
    },
  })
}

describe('slot-derived computeds follow the slots', () => {
  for (const c of cases) {
    it(c.name, () => {
      cy.mount(harness(c))
      c.empty()

      cy.get('[data-cy="toggle"]').click()
      c.filled()

      cy.get('[data-cy="toggle"]').click()
      c.empty()
    })
  }
})
