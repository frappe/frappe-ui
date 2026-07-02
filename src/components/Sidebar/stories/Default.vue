<script setup lang="ts">
import { ref } from 'vue'
import {
  Sidebar,
  SidebarItem,
  SidebarLabel,
  ScrollArea,
  Button,
  Dropdown,
} from 'frappe-ui'

// A faithful Gameplan sidebar: an app switcher up top, then a scrolling list of
// spaces with lucide icons, unread counts, private locks, and a hover-reveal
// options menu. Only <Sidebar>/<SidebarItem>/<SidebarLabel> come from the
// family — the header, the ScrollArea, and the spaces markup are the app's own.
const active = ref('product')
const sort = ref('Recent activity')

const spaces = [
  { id: 'product', title: 'Product', icon: 'lucide-rocket', unread: 0, private: false },
  { id: 'design', title: 'Design', icon: 'lucide-palette', unread: 3, private: false },
  { id: 'engineering', title: 'Engineering', icon: 'lucide-code', unread: 12, private: false },
  { id: 'marketing', title: 'Marketing', icon: 'lucide-megaphone', unread: 0, private: false },
  { id: 'sales', title: 'Sales', icon: 'lucide-trending-up', unread: 1, private: false },
  { id: 'support', title: 'Customer Support', icon: 'lucide-headphones', unread: 0, private: false },
  { id: 'people', title: 'People & Culture', icon: 'lucide-users', unread: 0, private: false },
  { id: 'finance', title: 'Finance', icon: 'lucide-wallet', unread: 0, private: true },
  { id: 'leadership', title: 'Leadership', icon: 'lucide-crown', unread: 2, private: true },
  { id: 'design-system', title: 'Design System', icon: 'lucide-component', unread: 0, private: false },
  { id: 'research', title: 'User Research', icon: 'lucide-microscope', unread: 5, private: false },
  { id: 'ops', title: 'Operations', icon: 'lucide-settings-2', unread: 0, private: false },
  { id: 'events', title: 'Events', icon: 'lucide-party-popper', unread: 0, private: false },
  { id: 'data', title: 'Data & Analytics', icon: 'lucide-database', unread: 8, private: false },
  { id: 'brand', title: 'Brand', icon: 'lucide-sparkles', unread: 0, private: false },
  { id: 'partnerships', title: 'Partnerships', icon: 'lucide-handshake', unread: 0, private: false },
  { id: 'security', title: 'Security', icon: 'lucide-shield', unread: 0, private: true },
  { id: 'onboarding', title: 'Onboarding', icon: 'lucide-graduation-cap', unread: 0, private: false },
  { id: 'random', title: 'Random', icon: 'lucide-shuffle', unread: 0, private: false },
]

const sortOptions = [
  {
    group: 'Sort by',
    options: ['Recent activity', 'Alphabetical'].map((label) => ({
      label,
      icon: sort.value === label ? 'lucide-check' : null,
      onClick: () => (sort.value = label),
    })),
  },
]
</script>

<template>
  <div class="flex h-[560px] w-fit overflow-hidden rounded-md border">
    <Sidebar disable-collapse width="14rem">
      <!-- App switcher — the app owns the header. -->
      <div class="flex shrink-0 items-center p-2">
        <button
          class="flex h-8 w-full items-center gap-2 rounded px-1 transition hover:bg-surface-gray-2"
        >
          <div
            class="grid size-6 shrink-0 place-items-center rounded bg-surface-gray-7 text-xs font-medium text-ink-white"
          >
            F
          </div>
          <span class="flex-1 truncate text-left text-base text-ink-gray-8">Frappe</span>
          <span class="lucide-chevrons-up-down size-4 shrink-0 text-ink-gray-5" />
        </button>
      </div>

      <!--
        The app owns the scroll region. frappe-ui's ScrollArea keeps the thin,
        auto-hiding overlay scrollbar; padding the viewport (px-2) gives the
        active row's shadow room so overflow-hidden doesn't clip it.
      -->
      <ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-10">
        <div class="flex h-7 items-center justify-between">
          <SidebarLabel>Spaces</SidebarLabel>
          <div class="flex items-center">
            <Dropdown :options="sortOptions" align="end">
              <template #trigger="{ open }">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide-arrow-up-down text-ink-gray-5"
                  label="Sort spaces"
                  tooltip="Sort spaces"
                  :active="open"
                />
              </template>
            </Dropdown>
            <Button
              variant="ghost"
              size="sm"
              icon="lucide-plus text-ink-gray-5"
              label="New space"
            />
          </div>
        </div>

        <nav class="mt-0.5 space-y-0.5">
          <SidebarItem
            v-for="space in spaces"
            :key="space.id"
            :icon="space.icon"
            :active="active === space.id"
            @click="active = space.id"
          >
            <span class="flex-1 inline-flex items-center gap-1 truncate text-sm">
              <span
                v-if="space.private"
                class="lucide-lock size-3 shrink-0 text-ink-gray-5"
              />
              {{ space.title }}
            </span>

            <template #suffix>
              <!--
                Count and options menu share one cell: the count fades out on row
                hover/focus while the "…" menu fades in. The group is
                SidebarItem's root (`group/sidebar-item`).
              -->
              <div class="relative mr-1 flex size-7 shrink-0 items-center justify-end">
                <span
                  v-if="space.unread > 0"
                  class="absolute right-1 text-xs text-ink-gray-5 transition-opacity group-hover/sidebar-item:opacity-0 group-focus-within/sidebar-item:opacity-0"
                >
                  {{ space.unread }}
                </span>
                <Dropdown
                  :options="[{ label: 'Mark all as read' }, { label: 'Leave space' }]"
                  align="start"
                  side="right"
                >
                  <template #default="{ open }">
                    <Button
                      :variant="open ? 'subtle' : 'ghost'"
                      size="xs"
                      icon="lucide-more-horizontal text-ink-gray-5"
                      :label="`${space.title} options`"
                      class="absolute right-0 -mr-0.5 opacity-0 group-hover/sidebar-item:opacity-100 group-focus-within/sidebar-item:opacity-100"
                      :class="open ? 'opacity-100' : ''"
                    />
                  </template>
                </Dropdown>
              </div>
            </template>
          </SidebarItem>
        </nav>
      </ScrollArea>
    </Sidebar>
  </div>
</template>
