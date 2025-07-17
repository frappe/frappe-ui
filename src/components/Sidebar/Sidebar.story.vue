<script setup lang="ts">
import { reactive } from 'vue';
import Sidebar from './Sidebar.vue';

import Notifications from '~icons/lucide/bell';
import Deals from '~icons/lucide/briefcase';
import Organizations from '~icons/lucide/building';
import Tasks from '~icons/lucide/check-square';
import Notes from '~icons/lucide/clipboard';
import Link from '~icons/lucide/link';
import EmailTemplates from '~icons/lucide/mail';
import Moon from '~icons/lucide/moon';
import CallLogs from '~icons/lucide/phone';
import Settings from '~icons/lucide/settings';
import User from '~icons/lucide/user';
import Contacts from '~icons/lucide/user-check';
import Leads from '~icons/lucide/users';

const crmSidebar = reactive({
  header: {
    title: 'Frappe CRM',
    subtitle: 'Jane Doe',
    logo: 'https://raw.githubusercontent.com/frappe/crm/develop/.github/logo.svg',
    menuItems: [
      { label: 'Toggle Theme', icon: Moon, onClick: toggleTheme },
      { label: 'Help', to: '/help', icon: Settings, onClick: () => alert('Help clicked!') },
      { label: 'Logout', to: '/logout', icon: User, onClick: () => alert('Logging out...') },
    ]
  },
  sections: [
    {
      label: '',
      items: [
        { label: 'Notifications', icon: Notifications, to: '' },
      ],
    },
    {
      label: '',
      items: [
        { label: 'Leads', icon: Leads, to: '/leads' },
        { label: 'Deals', icon: Deals, to: '/deals' },
        { label: 'Contacts', icon: Contacts, to: '/contacts' },
        { label: 'Organizations', icon: Organizations, to: '/organizations' },
        { label: 'Notes', icon: Notes, to: '/notes' },
        { label: 'Tasks', icon: Tasks, to: '/tasks' },
        { label: 'Call Logs', icon: CallLogs, to: '/call-logs' },
        { label: 'Email Templates', icon: EmailTemplates, to: '/email-templates' },
      ]
    },
    {
      label: 'Views',
      collapsible: true,
      items: [
        { label: 'My Open Deals', icon: Link, to: '/my-open-deals' },
        { label: 'Partnership Deals', icon: Link, to: '/partnership-deals' },
        { label: 'Unassigned Deals', icon: Link, to: '/unassigned-deals' },
        { label: 'Enterprise Pipeline', icon: Link, to: '/enterprise-pipeline' },
      ]
    }
  ]
})
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
}
</script>

<template>
  <Story>
    <Variant title="Sidebar">
      <div class="flex h-screen w-full flex-col bg-surface-white shadow">
        <Sidebar
          :header="crmSidebar.header"
          :sections="crmSidebar.sections"
        />
      </div>
    </Variant>
  </Story>
</template>
