import Sidebar from './Sidebar.vue'
import { h } from 'vue'
import LucideBox from '~icons/lucide/box'
import SidebarHeader from './SidebarHeader.vue'

const header = {
  title: 'Sidebar',
  subtitle: 'Brand name',
  logo: 'https://raw.githubusercontent.com/frappe/crm/develop/.github/logo.svg',

  menuItems: [
    {
      label: 'Help',
      to: '/help',
      onClick: () => alert('Help clicked!'),
    },
    {
      label: 'Logout',
      to: '/logout',
      onClick: () => alert('Logging out...'),
    },
  ],
}

const sections = [
  {
    label: '',
    items: [
      { label: 'Notifications', to: '', icon: LucideBox },
      { label: 'Leads', to: '/leads', icon: LucideBox },
      { label: 'Deals', to: '/deals', icon: LucideBox },
      { label: 'Contacts', to: '/contacts', icon: LucideBox },
      { label: 'Organizations', to: '/organizations', icon: LucideBox },
      { label: 'Notes', to: '/notes', icon: LucideBox },
      { label: 'Tasks', to: '/tasks', icon: LucideBox },
      { label: 'Call Logs', to: '/call-logs', icon: LucideBox },
      { label: 'Email Templates', to: '/email-templates', icon: LucideBox },
    ],
  },
  {
    label: 'Group 1',
    collapsible: true,
    items: [
      { label: 'My Open Deals', to: '/my-open-deals', icon: LucideBox },
      { label: 'Partnership Deals', to: '/partnership-deals', icon: LucideBox },
      { label: 'Unassigned Deals', to: '/unassigned-deals', icon: LucideBox },
      {
        label: 'Enterprise Pipeline',
        to: '/enterprise-pipeline',
        icon: LucideBox,
      },
    ],
  },
]

const testComponent = () => {
  return h('div', {}, [h(Sidebar, { header, sections, class: 'w-fit' })])
}

describe('Sidebar', () => {
  it('renders the sidebar header', () => {
    cy.mount(testComponent)

    cy.get('img').should('exist')

    cy.contains('Sidebar').should('exist')
    cy.contains('Brand name').should('exist')

    cy.get('[role=menu]').should('not.exist')
    cy.get('[aria-haspopup=menu]').should('exist').click()
    cy.root().click(0, 0, { force: true })
    cy.get('[role=menu]').should('exist')
    cy.get('[role=menuitem]').should('have.length', header.menuItems.length)

    let sidebarLinks = []
    sections.forEach((section) => {
      const tmp = section.items.map((item) => item.label)
      sidebarLinks.push(...tmp)
    })

    sidebarLinks.forEach((label) => {
      cy.get(`[aria-label='${label}']`).should('exist')
    })

    cy.get("[aria-label='Leads']").should('not.have.attr', 'isCollapsed')
    cy.get('[aria-label=Expand]').click()
    cy.get("[aria-label='Leads']").should('have.attr', 'isCollapsed')
  })
})
