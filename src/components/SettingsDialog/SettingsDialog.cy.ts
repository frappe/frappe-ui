import { defineComponent, h, ref } from 'vue'
import SettingsDialog from './SettingsDialog.vue'
import SettingsSidebar from './SettingsSidebar.vue'
import SettingsNavGroup from './SettingsNavGroup.vue'
import SettingsNavItem from './SettingsNavItem.vue'
import SettingsContent from './SettingsContent.vue'

const panel = (text: string) =>
  defineComponent({ render: () => h('div', { class: 'tab-panel' }, text) })

const tabs = [
  { label: 'Profile', component: panel('Profile content') },
  { label: 'General', component: panel('General content') },
  { label: 'Members', component: panel('Members content') },
]

// A minimal consumer that wires active state the way an app would.
const Harness = defineComponent({
  props: { modelValue: { type: Boolean, default: true } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const active = ref(tabs[0])
    return () =>
      h(
        SettingsDialog,
        {
          modelValue: props.modelValue,
          'onUpdate:modelValue': (v: boolean) => emit('update:modelValue', v),
        },
        () => [
          h(SettingsSidebar, () =>
            h(SettingsNavGroup, { label: 'Workspace' }, () =>
              tabs.map((tab) =>
                h(
                  SettingsNavItem,
                  {
                    key: tab.label,
                    active: active.value.label === tab.label,
                    onClick: () => (active.value = tab),
                  },
                  () => tab.label,
                ),
              ),
            ),
          ),
          h(SettingsContent, () => h(active.value.component)),
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
