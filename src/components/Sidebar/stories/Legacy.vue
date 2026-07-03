<script setup lang="ts">
// The deprecated config-object API, kept working for one release on top of the
// new sub-components. Prefer the composition API (see Default) for new code.
import { Sidebar } from 'frappe-ui'

const header = {
  title: 'Frappe CRM',
  subtitle: 'crm.frappe.io',
  menuItems: [{ label: 'Settings' }, { label: 'Log out' }],
}

const sections = [
  {
    label: '',
    items: [
      { label: 'Leads', to: '/leads', icon: 'lucide-user-plus' },
      { label: 'Deals', to: '/deals', icon: 'lucide-handshake' },
      { label: 'Contacts', to: '/contacts', icon: 'lucide-contact' },
    ],
  },
  {
    label: 'Views',
    collapsible: true,
    items: [
      { label: 'My Open Deals', to: '/my-open-deals', icon: 'lucide-flame' },
      { label: 'Unassigned', to: '/unassigned', icon: 'lucide-circle-dashed' },
    ],
  },
]
</script>

<template>
  <div class="flex h-[420px] w-fit overflow-hidden rounded-md border">
    <Sidebar :header="header" :sections="sections" disable-collapse />
  </div>
</template>
