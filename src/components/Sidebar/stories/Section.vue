<script setup lang="ts">
import { ref } from 'vue'
import { Sidebar, SidebarSection, SidebarItem } from 'frappe-ui'

// SidebarSection is a plain collapsible group: compose SidebarItem (or
// anything else) as its children. `viewsCollapsed` is app state the section's
// `v-model:collapsed` writes back to, so the app can persist the choice.
const active = ref('leads')
const viewsCollapsed = ref(false)
</script>

<template>
  <div class="flex h-[360px] w-fit overflow-hidden rounded-md border">
    <Sidebar disable-collapse width="14rem">
      <div class="flex-1 overflow-y-auto px-2 pt-2">
        <SidebarSection>
          <SidebarItem
            label="Leads"
            icon="lucide-user-plus"
            :active="active === 'leads'"
            @click="active = 'leads'"
          />
          <SidebarItem
            label="Deals"
            icon="lucide-handshake"
            :active="active === 'deals'"
            @click="active = 'deals'"
          />
        </SidebarSection>

        <SidebarSection
          label="Views"
          collapsible
          v-model:collapsed="viewsCollapsed"
        >
          <SidebarItem
            label="My Open Deals"
            icon="lucide-flame"
            :active="active === 'my-open-deals'"
            @click="active = 'my-open-deals'"
          />
          <SidebarItem
            label="Unassigned"
            icon="lucide-circle-dashed"
            :active="active === 'unassigned'"
            @click="active = 'unassigned'"
          />
        </SidebarSection>
      </div>
    </Sidebar>
  </div>
</template>
