import { defineComponent, h, ref } from 'vue'
import { TabsRoot } from 'reka-ui'
import SettingsBody from './SettingsBody.vue'
import SettingsHeader from './SettingsHeader.vue'
import SettingsPanel from './SettingsPanel.vue'
import SettingsRow from './SettingsRow.vue'
import Switch from '../Switch/Switch.vue'

describe('SettingsHeader', () => {
  it('renders the title and description', () => {
    cy.mount(SettingsHeader, {
      props: { title: 'General', description: 'Workspace preferences.' },
    })
    cy.contains('h2', 'General').should('exist')
    cy.contains('Workspace preferences.').should('exist')
  })

  it('omits the description when not provided', () => {
    cy.mount(SettingsHeader, { props: { title: 'General' } })
    cy.get('p').should('not.exist')
  })

  it('renders the actions slot', () => {
    cy.mount(SettingsHeader, {
      props: { title: 'General' },
      slots: { actions: () => h('button', { class: 'action' }, 'Save') },
    })
    cy.get('.action').should('have.text', 'Save')
  })

  it('lets the default slot replace the header entirely', () => {
    cy.mount(SettingsHeader, {
      props: { title: 'Ignored' },
      slots: { default: () => h('div', { class: 'custom' }, 'Custom header') },
    })
    cy.get('.custom').should('exist')
    cy.contains('Ignored').should('not.exist')
  })
})

describe('SettingsHeader scroll divider', () => {
  const mountPanel = () =>
    cy.mount(() =>
      h(TabsRoot, { defaultValue: 'a', class: 'flex h-80 w-[40rem]' }, () =>
        h(SettingsPanel, { value: 'a' }, () => [
          h(SettingsHeader, { title: 'General', description: 'Prefs.' }),
          h(SettingsBody, null, () =>
            h('div', { class: 'h-[60rem]' }, 'Long content'),
          ),
        ]),
      ),
    )
  const headerBorder = () => cy.contains('h2', 'General').closest('.border-b')

  it('shows a divider only once the body has scrolled', () => {
    mountPanel()
    headerBorder().should('not.have.attr', 'data-scrolled')
    headerBorder().should('have.css', 'border-bottom-color', 'rgba(0, 0, 0, 0)')

    cy.get('[data-slot="scroll-area-viewport"]').scrollTo(0, 80)
    headerBorder().should('have.attr', 'data-scrolled')
    headerBorder().should(
      'not.have.css',
      'border-bottom-color',
      'rgba(0, 0, 0, 0)',
    )

    cy.get('[data-slot="scroll-area-viewport"]').scrollTo(0, 0)
    headerBorder().should('not.have.attr', 'data-scrolled')
  })

  it('keeps the header the same height when the divider appears', () => {
    mountPanel()
    headerBorder().then(($el) => {
      const before = $el.outerHeight()
      cy.get('[data-slot="scroll-area-viewport"]').scrollTo(0, 80)
      headerBorder().should(($h) => expect($h.outerHeight()).to.equal(before))
    })
  })

  it('clears the divider when the panel is shown again at the top', () => {
    cy.mount(
      defineComponent({
        setup() {
          const shown = ref(true)
          return () =>
            h(
              TabsRoot,
              { defaultValue: 'a', class: 'flex h-80 w-[40rem]' },
              () => [
                h(
                  'button',
                  {
                    id: 'toggle',
                    onClick: () => (shown.value = !shown.value),
                  },
                  'Toggle',
                ),
                h(SettingsPanel, { value: 'a' }, () =>
                  shown.value
                    ? [
                        h(SettingsHeader, { title: 'General' }),
                        h(SettingsBody, null, () =>
                          h('div', { class: 'h-[60rem]' }, 'Long content'),
                        ),
                      ]
                    : null,
                ),
              ],
            )
        },
      }),
    )
    cy.get('[data-slot="scroll-area-viewport"]').scrollTo(0, 80)
    headerBorder().should('have.attr', 'data-scrolled')
    cy.get('#toggle').click()
    cy.get('#toggle').click()
    headerBorder().should('not.have.attr', 'data-scrolled')
  })

  it('renders a header and a body without a panel around them', () => {
    cy.mount(() => [
      h(SettingsHeader, { title: 'General' }),
      h(SettingsBody, null, () => h('div', { class: 'h-40' }, 'Content')),
    ])
    cy.contains('h2', 'General').should('exist')
    cy.get('[data-scrolled]').should('not.exist')
  })
})

describe('SettingsRow', () => {
  it('renders the title and description', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Public profile', description: 'Allow viewing.' },
    })
    cy.contains('Public profile').should('exist')
    cy.contains('Allow viewing.').should('exist')
  })

  it('lets the description slot replace the description text', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Public profile', description: 'Ignored' },
      slots: {
        description: () => h('a', { href: '/help' }, 'Read the guide'),
      },
    })
    cy.contains('a', 'Read the guide').should('have.attr', 'href', '/help')
    cy.contains('Ignored').should('not.exist')
  })

  it('auto-associates the title label with a slotted Switch', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Public profile' },
      slots: { default: () => h(Switch) },
    })
    // The title becomes a <label> whose `for` matches the Switch's control id.
    cy.get('label[for]')
      .invoke('attr', 'for')
      .then((forId) => {
        cy.get(`#${forId}`).should('have.attr', 'data-slot', 'control')
      })
  })

  it('toggles the Switch when the auto-wired label is clicked', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Public profile' },
      slots: { default: () => h(Switch) },
    })
    cy.get('[data-slot=control]').should('have.attr', 'aria-checked', 'false')
    cy.get('label[for]').click()
    cy.get('[data-slot=control]').should('have.attr', 'aria-checked', 'true')
  })

  it('respects an explicit label-for override', () => {
    cy.mount(SettingsRow, {
      props: { title: 'Custom', labelFor: 'my-id' },
      slots: { default: () => h('input', { id: 'other-id' }) },
    })
    cy.get('label').should('have.attr', 'for', 'my-id')
  })
})
