<script setup>
import { ref } from 'vue'
import {
  Avatar,
  Badge,
  BottomSheet,
  Button,
  MobileNav,
  MobileNavItem,
  MobileShell,
  PageHeaderMobile,
  Tooltip,
} from 'frappe-ui'
import { List, ListCell, ListRow } from 'frappe-ui/list'

const tab = ref('home')

// Spaces live in the desktop sidebar; on mobile they surface in a bottom sheet.
const showSpaces = ref(false)
const activeSpace = ref('Design System')
const spaces = [
  { name: 'Announcements', icon: 'lucide-megaphone', unread: 2 },
  { name: 'Design System', icon: 'lucide-shapes', unread: 3 },
  { name: 'Website', icon: 'lucide-globe', unread: 0 },
  { name: 'Brand', icon: 'lucide-sparkles', unread: 0 },
  { name: 'Illustrations', icon: 'lucide-pen-tool', unread: 1 },
  { name: 'Research', icon: 'lucide-flask-conical', unread: 0 },
  { name: 'Archive', icon: 'lucide-archive', unread: 0 },
]
function selectSpace(name) {
  activeSpace.value = name
  showSpaces.value = false
}

const pinned = [
  {
    title: 'Welcome! Start here',
    author: 'Rhea Kapoor',
    image: 'https://i.pravatar.cc/150?img=1',
    excerpt: 'House rules, useful links, and how we work asynchronously.',
    comments: 42,
    lastActivity: '1w',
    unread: 0,
  },
]

const discussions = [
  {
    title: 'Design review: new onboarding flow',
    author: 'Evan You',
    image: 'https://avatars.githubusercontent.com/u/499550?v=4',
    excerpt: 'I went through the latest prototype and left comments…',
    comments: 14,
    lastActivity: '2h',
    unread: 3,
  },
  {
    title: 'Proposal: consolidate icon sizes to a 4px grid',
    author: 'Priya Nair',
    image: 'https://i.pravatar.cc/150?img=2',
    excerpt: 'We currently ship icons in 7 sizes. I propose we standardize…',
    comments: 32,
    lastActivity: '5h',
    unread: 1,
  },
  {
    title: 'Dark mode tokens are ready for review',
    author: 'Sam Rivera',
    image: 'https://i.pravatar.cc/150?img=3',
    excerpt: 'All semantic tokens now have dark values. The contrast checks…',
    comments: 21,
    lastActivity: '1d',
    unread: 5,
  },
  {
    title: 'Q3 roadmap discussion',
    author: 'Ana Costa',
    image: 'https://i.pravatar.cc/150?img=4',
    excerpt: 'Carrying over from the planning call — here are the themes…',
    comments: 8,
    lastActivity: '2d',
    unread: 0,
  },
  {
    title: 'Weekly design crit — notes and action items',
    author: 'Maya Iyer',
    image: 'https://i.pravatar.cc/150?img=5',
    excerpt: 'Thanks everyone for joining. Summary of the feedback…',
    comments: 5,
    lastActivity: '3d',
    unread: 0,
  },
]
</script>

<template>
  <MobileShell>
    <PageHeaderMobile title="Home">
      <template #left>
        <Button
          variant="ghost"
          icon="lucide-panel-left"
          label="Spaces"
          @click="showSpaces = true"
        />
      </template>
      <template #right>
        <Button
          variant="ghost"
          icon="lucide-square-pen"
          label="New discussion"
        />
      </template>
    </PageHeaderMobile>

    <div class="pb-6 pt-3">
      <div class="mb-5">
        <div class="mb-2 flex items-center space-x-1 px-4">
          <span class="lucide-pin size-4 text-ink-gray-4" aria-hidden="true" />
          <span class="text-base text-ink-gray-8">Pinned</span>
        </div>
        <List class="list-gap-3 list-row-px-4">
          <ListRow
            v-for="discussion in pinned"
            :key="discussion.title"
            class="h-17"
            @click="() => {}"
          >
            <ListCell>
              <Avatar
                :image="discussion.image"
                :label="discussion.author"
                size="2xl"
              />
            </ListCell>
            <ListCell>
              <div class="min-w-0 flex-1">
                <!-- The sized text lives in an inner span so it keeps its own
                     line-height. Putting `leading-none` on the same element as
                     `truncate` (overflow-hidden) would shear off descenders like
                     the tail of "g". -->
                <div class="truncate leading-none text-ink-gray-8">
                  <span class="text-lg">{{ discussion.title }}</span>
                </div>
                <div
                  class="mt-1.5 flex min-w-0 items-center text-md text-ink-gray-5"
                >
                  <span class="shrink-0">{{ discussion.author }}:&nbsp;</span>
                  <span class="truncate">{{ discussion.excerpt }}</span>
                </div>
              </div>
            </ListCell>
            <ListCell class="justify-end">
              <div>
                <div
                  class="whitespace-nowrap text-right text-sm text-ink-gray-5"
                >
                  {{ discussion.lastActivity }}
                </div>
                <div class="mt-1.5 flex items-center justify-end">
                  <Badge>{{ discussion.comments + 1 }}</Badge>
                </div>
              </div>
            </ListCell>
          </ListRow>
        </List>
      </div>

      <List class="list-gap-3 list-row-px-4">
        <ListRow
          v-for="discussion in discussions"
          :key="discussion.title"
          class="h-17"
          @click="() => {}"
        >
          <ListCell>
            <Avatar
              :image="discussion.image"
              :label="discussion.author"
              size="2xl"
            />
          </ListCell>
          <ListCell>
            <div class="min-w-0 flex-1">
              <!-- The sized text lives in an inner span so it keeps its own
                   line-height. Putting `leading-none` on the same element as
                   `truncate` (overflow-hidden) would shear off descenders like
                   the tail of "g". -->
              <div class="truncate leading-none text-ink-gray-8">
                <span
                  :class="discussion.unread ? 'text-lg-semibold' : 'text-lg'"
                >
                  {{ discussion.title }}
                </span>
              </div>
              <div
                class="mt-1.5 flex min-w-0 items-center text-md text-ink-gray-5"
              >
                <span
                  class="lucide-reply mr-1 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span class="shrink-0">{{ discussion.author }}:&nbsp;</span>
                <span class="truncate">{{ discussion.excerpt }}</span>
              </div>
            </div>
          </ListCell>
          <ListCell class="justify-end">
            <div>
              <div class="whitespace-nowrap text-right text-sm text-ink-gray-5">
                {{ discussion.lastActivity }}
              </div>
              <div class="mt-1.5 flex items-center justify-end">
                <Tooltip
                  v-if="discussion.unread"
                  :text="`${discussion.unread} unread`"
                >
                  <Badge theme="amber" variant="solid" size="sm">
                    {{ discussion.unread }}
                  </Badge>
                </Tooltip>
                <Badge v-else>{{ discussion.comments + 1 }}</Badge>
              </div>
            </div>
          </ListCell>
        </ListRow>
      </List>
    </div>

    <BottomSheet v-model:open="showSpaces" title="Spaces">
      <!-- v-model:active highlights the current space; the List's default
           `auto minmax(0,1fr) auto` columns lay out icon / label / count. -->
      <List v-model:active="activeSpace" class="px-2 pb-4">
        <ListRow
          v-for="space in spaces"
          :key="space.name"
          :value="space.name"
          class="h-11 rounded-md"
          @click="selectSpace(space.name)"
        >
          <ListCell>
            <span
              :class="space.icon"
              class="size-5 shrink-0 text-ink-gray-5"
              aria-hidden="true"
            />
          </ListCell>
          <ListCell>
            <span class="truncate text-lg text-ink-gray-8">
              {{ space.name }}
            </span>
          </ListCell>
          <ListCell class="justify-end">
            <Badge v-if="space.unread">{{ space.unread }}</Badge>
          </ListCell>
        </ListRow>
      </List>
    </BottomSheet>

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
        <MobileNavItem label="You" :active="tab === 'you'" @click="tab = 'you'">
          <template #default="{ active }">
            <Avatar
              image="https://i.pravatar.cc/150?img=1"
              label="Rhea Kapoor"
              size="md"
              :class="active ? 'ring-2 ring-outline-gray-4' : ''"
            />
          </template>
        </MobileNavItem>
      </MobileNav>
    </template>
  </MobileShell>
</template>
