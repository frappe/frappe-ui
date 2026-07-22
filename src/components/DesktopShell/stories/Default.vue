<script setup lang="ts">
import { ref } from 'vue'
import {
  DesktopShell,
  Rail,
  RailItem,
  Sidebar,
  SidebarItem,
  SidebarLabel,
  PageHeader,
  Button,
  SidebarHeader,
} from 'frappe-ui'

const community = ref('design')
const communities = [
  { id: 'design', initials: 'DE' },
  { id: 'engineering', initials: 'EN' },
  { id: 'marketing', initials: 'MK' },
]

const space = ref('Website')
const spaces = [
  'Website',
  'Brand',
  'Illustration',
  'Design System',
  'Marketing Site',
  'Mobile App',
  'Research',
  'Archive',
]
</script>

<template>
  <!-- Bounded height so the shell's `h-full` has something to fill in the preview. -->
  <div
    class="h-[560px] overflow-hidden rounded-md border w-full bg-surface-white"
  >
    <DesktopShell>
      <template #rail>
        <Rail class="border-r">
          <RailItem
            label="Home"
            variant="ghost"
            icon="lucide-house"
            :active="community === ''"
            @click="community = ''"
          />
          <div class="flex w-full flex-1 flex-col items-center gap-3 pt-3">
            <RailItem
              v-for="c in communities"
              :key="c.id"
              :label="c.id"
              :active="community === c.id"
              @click="community = c.id"
            >
              <span class="text-2xs-medium uppercase text-ink-gray-5">{{
                c.initials
              }}</span>
            </RailItem>
          </div>
          <RailItem label="Search" variant="ghost" icon="lucide-search" />
        </Rail>
      </template>

      <template #sidebar>
        <Sidebar class="border-r" disable-collapse width="14rem">
          <SidebarHeader
            title="Acme Design"
            subtitle="v1.0.0-beta"
            :menu-items="[{ label: 'Log out', icon: 'lucide-log-out' }]"
          />
          <div class="flex-1 overflow-y-auto space-y-0.5 px-2 pb-2">
            <SidebarLabel class="px-2">Spaces</SidebarLabel>
            <SidebarItem
              v-for="s in spaces"
              :key="s"
              :active="s === space"
              @click="space = s"
            >
              <template #prefix
                ><span class="lucide-hash size-4" aria-hidden="true"
              /></template>
              {{ s }}
            </SidebarItem>
          </div>
        </Sidebar>
      </template>

      <!-- Declared in the page; teleports to the target the shell pins on top. -->
      <PageHeader>
        <span class="text-lg font-semibold text-ink-gray-8">{{ space }}</span>
        <Button variant="subtle" icon-left="lucide-plus" label="New post" />
      </PageHeader>

      <div class="p-5">Lorem ipsum dolor</div>
    </DesktopShell>
  </div>
</template>
