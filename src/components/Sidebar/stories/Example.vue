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
        { label: 'Leads', icon: 'lucide-users', to: '' },
        { label: 'Deals', icon: 'lucide-briefcase', to: '' },
        { label: 'Contacts', icon: 'lucide-user-check', to: '' },
        { label: 'Organizations', icon: 'lucide-building', to: '' },
        { label: 'Notes', icon: 'lucide-clipboard', to: '' },
        { label: 'Tasks', icon: 'lucide-check-square', to: '' },
        { label: 'Call Logs', icon: 'lucide-phone', to: '' },
        {
          label: 'Email Templates',
          icon: 'lucide-mail',
          to: '',
        },
      ],
    },
    {
      label: 'Views',
      collapsible: true,
      items: [
        { label: 'My Open Deals', icon: 'lucide-link', to: '' },
        { label: 'Partnership Deals', icon: 'lucide-link', to: '' },
        { label: 'Unassigned Deals', icon: 'lucide-link', to: '' },
        {
          label: 'Enterprise Pipeline',
          icon: 'lucide-link',
          to: '',
        },
      ],
    },
  ],
})
</script>

<template>
  <div class="w-full !-m-8">
    <Sidebar :header="crmSidebar.header" :sections="crmSidebar.sections" />
  </div>
</template>
