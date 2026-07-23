<script setup lang="ts">
import { ref } from 'vue'
import {
  MobileShell,
  MobileNav,
  MobileNavItem,
  PageHeaderMobile,
  Avatar,
} from 'frappe-ui'

const tab = ref('home')

// Long enough to overflow the content area: the point of the story is that
// only this region scrolls while the header and tab bar stay put.
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
].map(([title, author, replies, time]) => ({ title, author, replies, time }))
</script>

<template>
  <!--
    MobileShell is `fixed inset-0`. The `transform` on this wrapper makes it the
    containing block for that fixed positioning, so the shell stays inside the
    preview box instead of covering the page. (A story-only concern.)
  -->
  <div
    class="mx-auto h-[600px] w-[360px] transform-gpu overflow-hidden border bg-surface-white"
  >
    <MobileShell>
      <PageHeaderMobile>
        <span class="text-base font-semibold text-ink-gray-8">Home</span>
      </PageHeaderMobile>

      <div class="divide-y divide-outline-gray-1">
        <div
          v-for="post in posts"
          :key="post.title"
          class="flex items-center gap-3 px-4 py-3 active:bg-surface-gray-1"
        >
          <Avatar :label="post.author" size="md" />
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

      <template #nav>
        <MobileNav>
          <MobileNavItem
            label="Home"
            icon="lucide-house"
            :active="tab === 'home'"
            @click="tab = 'home'"
          />
          <MobileNavItem
            label="Notifications"
            icon="lucide-bell"
            :active="tab === 'notifications'"
            @click="tab = 'notifications'"
          />
          <MobileNavItem
            label="Search"
            icon="lucide-search"
            :active="tab === 'search'"
            @click="tab = 'search'"
          />
          <MobileNavItem
            label="You"
            :active="tab === 'you'"
            @click="tab = 'you'"
          >
            <template #default="{ active }">
              <Avatar
                label="Jane Doe"
                size="md"
                :class="active ? 'ring-2 ring-outline-gray-4' : ''"
              />
            </template>
          </MobileNavItem>
        </MobileNav>
      </template>
    </MobileShell>
  </div>
</template>
