import { defineComponent, h, ref } from 'vue'
import SettingsDialog from './SettingsDialog.vue'
import SettingsSidebar from './SettingsSidebar.vue'
import SettingsNavGroup from './SettingsNavGroup.vue'
import SettingsNavItem from './SettingsNavItem.vue'
import SettingsContent from './SettingsContent.vue'
import SettingsPanel from './SettingsPanel.vue'

const panel = (text: string) =>
  defineComponent({ render: () => h('div', { class: 'tab-panel' }, text) })

const tabs = [
  { label: 'Profile', value: 'profile', component: panel('Profile content') },
  { label: 'General', value: 'general', component: panel('General content') },
  { label: 'Members', value: 'members', component: panel('Members content') },
]

// A minimal consumer that wires the active tab the way an app would: the kit's
// reka-ui Tabs owns selection, the consumer only binds `tab` and supplies a
// matching `value` on each nav item and panel.
const Harness = defineComponent({
  props: { modelValue: { type: Boolean, default: true } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const active = ref(tabs[0].value)
    return () =>
      h(
        SettingsDialog,
        {
          modelValue: props.modelValue,
          'onUpdate:modelValue': (v: boolean) => emit('update:modelValue', v),
          tab: active.value,
          'onUpdate:tab': (v: string) => (active.value = v),
        },
        () => [
          h(SettingsSidebar, () =>
            h(SettingsNavGroup, { label: 'Workspace' }, () =>
              tabs.map((tab) =>
                h(
                  SettingsNavItem,
                  { key: tab.value, value: tab.value },
                  () => tab.label,
                ),
              ),
            ),
          ),
          h(SettingsContent, () =>
            tabs.map((tab) =>
              h(SettingsPanel, { key: tab.value, value: tab.value }, () =>
                h(tab.component),
              ),
            ),
          ),
        ],
      )
  },
})

describe('SettingsDialog', () => {
  it('does not render while closed; renders when open (v-model)', () => {
    cy.mount(Harness, { props: { modelValue: false } })
    cy.get('[role=dialog]').should('not.exist')

    cy.mount(Harness, { props: { modelValue: true } })
    cy.get('[role=dialog]').should('exist')
  })

  it('renders all nav items in the sidebar', () => {
    cy.mount(Harness)
    cy.get('[role=dialog]').within(() => {
      cy.contains('Profile').should('exist')
      cy.contains('General').should('exist')
      cy.contains('Members').should('exist')
    })
  })

  it('shows the first tab content by default', () => {
    cy.mount(Harness)
    cy.get('[role=dialog] .tab-panel').should('have.text', 'Profile content')
  })

  it('switches the active tab on click', () => {
    cy.mount(Harness)
    cy.get('[role=dialog] .tab-panel').should('have.text', 'Profile content')
    cy.get('[role=dialog]').contains('Members').click()
    cy.get('[role=dialog] .tab-panel').should('have.text', 'Members content')
  })

  it('exposes tablist / tab / tabpanel roles with aria-selected', () => {
    cy.mount(Harness)
    cy.get('[role=tablist]').should('exist')
    cy.get('[role=tab]').should('have.length', 3)
    // cy.contains(selector, text) returns the element matching the selector;
    // a bare .contains() would drill into the inner label <span> instead.
    cy.contains('[role=tab]', 'Profile').should(
      'have.attr',
      'aria-selected',
      'true',
    )
    cy.contains('[role=tab]', 'Members').should(
      'have.attr',
      'aria-selected',
      'false',
    )
    cy.get('[role=tabpanel]').should('have.text', 'Profile content')
  })

  it('moves the active tab with arrow keys (manual activation needs Enter)', () => {
    cy.mount(Harness)
    cy.contains('[role=tab]', 'Profile').focus().type('{downarrow}')
    // manual activation: arrow only moves focus, selection follows on Enter
    cy.focused().should('contain.text', 'General')
    cy.focused().type('{enter}')
    cy.get('[role=tabpanel]').should('have.text', 'General content')
  })

  it('emits update:modelValue when the dialog is closed', () => {
    const onUpdate = cy.spy().as('onUpdate')
    cy.mount(Harness, {
      props: { modelValue: true, 'onUpdate:modelValue': onUpdate },
    })
    cy.get('[role=dialog]').should('exist')
    cy.get('body').type('{esc}')
    cy.get('@onUpdate').should('have.been.calledWith', false)
  })
})
