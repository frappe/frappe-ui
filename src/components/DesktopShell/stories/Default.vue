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
  Avatar,
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

// Long enough to overflow the content area: the point of the story is that
// only this region scrolls while the rail, sidebar and header stay put.
const posts = [
  ['Design review: new onboarding flow', 'Priya Nair', 14, '2h'],
  ['Consolidate icon sizes to a 4px grid', 'Sam Rivera', 32, '5h'],
  ['Dark mode tokens are ready for review', 'Ana Costa', 21, '1d'],
  ['Hero copy for the marketing site', 'Liam Fischer', 5, '1d'],
  ['Illustration style guide, first draft', 'Mei Tanaka', 11, '2d'],
  ['Accessibility audit findings', 'Noah Berg', 27, '4d'],
  ['Retiring the old button variants', 'Ines Duarte', 9, '5d'],
  ['Naming conventions for new components', 'Tomas Ruiz', 16, '1w'],
  ['Figma library cleanup', 'Zara Ahmed', 4, '1w'],
  ['Empty states we still need to design', 'Priya Nair', 6, '2w'],
  ['Spacing scale: 4px or 8px base?', 'Sam Rivera', 19, '2w'],
  ['Archive: 2023 brand refresh', 'Ana Costa', 2, '3w'],
].map(([title, author, replies, time]) => ({ title, author, replies, time }))
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

      <div class="divide-y divide-outline-gray-1">
        <div
          v-for="post in posts"
          :key="post.title"
          class="flex items-center gap-3 px-5 py-3 hover:bg-surface-gray-1"
        >
          <Avatar :label="post.author" size="lg" />
          <div class="min-w-0 flex-1">
            <div class="truncate text-base-medium text-ink-gray-8">
              {{ post.title }}
            </div>
            <div class="mt-1 truncate text-sm text-ink-gray-5">
              {{ post.author }} · {{ post.replies }} replies
            </div>
          </div>
          <span class="shrink-0 text-sm text-ink-gray-4">{{ post.time }}</span>
        </div>
      </div>
    </DesktopShell>
  </div>
</template>
