<script setup lang="ts">
import { reactive } from 'vue';
import AppSidebar from './AppSidebar.vue';

import Home from '~icons/lucide/home';
import Settings from '~icons/lucide/settings';
import User from '~icons/lucide/user';
import Moon from '~icons/lucide/moon';

const state = reactive({
  header: {
    title: 'Frappe UI',
    subtitle: 'John Doe',
    menuItems: [
      { label: 'Toggle Theme', icon: Moon, onClick: toggleTheme },
      { label: 'Help', to: '/help', icon: Settings, onClick: () => alert('Help clicked!') },
      { label: 'Logout', to: '/logout', icon: User, onClick: () => alert('Logging out...') },
    ]
  },
  items: [
    {
      group: '',
      items: [
        { label: 'Dashboard', icon: Home, to: '' },
        { label: 'Settings', icon: Settings, to: '/settings' },
        { label: 'Profile', icon: User, to: '/profile' },
      ],
    },
    {
      group: 'Core',
      items: [
        { label: 'Users', icon: User, to: '/users' },
        { label: 'Roles', icon: Settings, to: '/roles' },
      ],
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
        <AppSidebar
          :header="state.header"
          :items="state.items"
        />
      </div>
    </Variant>
  </Story>
</template>
