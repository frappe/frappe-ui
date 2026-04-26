<script setup lang="ts">
import { reactive } from 'vue'
import { Sidebar } from 'frappe-ui'

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
}

const crmSidebar = reactive({
  header: {
    title: 'Frappe CRM',
    subtitle: 'Jane Doe',
    logo: 'https://raw.githubusercontent.com/frappe/crm/develop/.github/logo.svg',
    menuItems: [
      { label: 'Toggle Theme', icon: 'lucide-moon', onClick: toggleTheme },
      {
        label: 'Help',
        to: '/help',
        icon: 'lucide-settings',
        onClick: () => alert('Help clicked!'),
      },
      {
        label: 'Logout',
        to: '/logout',
        icon: 'lucide-user',
        onClick: () => alert('Logging out...'),
      },
    ],
  },
  sections: [
    {
      label: '',
      items: [{ label: 'Notifications', icon: 'lucide-bell', to: '' }],
    },
    {
      label: '',
      items: [
        { label: 'Leads', icon: 'lucide-users', to: '/leads' },
        { label: 'Deals', icon: 'lucide-briefcase', to: '/deals' },
        { label: 'Contacts', icon: 'lucide-user-check', to: '/contacts' },
        { label: 'Organizations', icon: 'lucide-building', to: '/organizations' },
        { label: 'Notes', icon: 'lucide-clipboard', to: '/notes' },
        { label: 'Tasks', icon: 'lucide-check-square', to: '/tasks' },
        { label: 'Call Logs', icon: 'lucide-phone', to: '/call-logs' },
        {
          label: 'Email Templates',
          icon: 'lucide-mail',
          to: '/email-templates',
        },
      ],
    },
    {
      label: 'Views',
      collapsible: true,
      items: [
        { label: 'My Open Deals', icon: 'lucide-link', to: '/my-open-deals' },
        { label: 'Partnership Deals', icon: 'lucide-link', to: '/partnership-deals' },
        { label: 'Unassigned Deals', icon: 'lucide-link', to: '/unassigned-deals' },
        {
          label: 'Enterprise Pipeline',
          icon: 'lucide-link',
          to: '/enterprise-pipeline',
        },
      ],
    },
  ],
})
</script>

<template>
  <Sidebar :header="crmSidebar.header" :sections="crmSidebar.sections" />
</template>
