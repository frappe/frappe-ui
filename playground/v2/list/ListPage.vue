<script setup lang="ts">
// Figma: espresso-2.0 › List (34984:218610; Email compact / medium / large:
// 34984:225794 / 224389 / 224989, see the Email* lists; Task: 30989:24065;
// Notification: 34945:113760; Event: 30989:24929). Each list is a screen of
// its own, scrolled and snapped to; the File list is 960px wide:
//   row      p 12, 16px between the 140 × 82 thumbnail and the content;
//            12px-radius surface-gray-1 hover; outline-gray-1 rules between
//            rows, hidden around the hovered one
//   content  16px medium title · 4px · globe + 14/21 link · 20px ·
//            "Edited …" + status badge; 24px avatar and ⋯ on the right
import { ref } from 'vue'
import { Avatar, Badge, Button, Dropdown } from '../../../src'
import EmailCompactList from './EmailCompactList.vue'
import EventList from './EventList.vue'
import globeIcon from '../assets/cards/icons/globe.svg?raw'
import NotificationList from './NotificationList.vue'
import TaskList from './TaskList.vue'
import EmailLargeList from './EmailLargeList.vue'
import EmailMediumList from './EmailMediumList.vue'
import avatarCampsite from '../assets/list/avatar-campsite.png'
import avatarFledge from '../assets/list/avatar-fledge.png'
import avatarMishmash from '../assets/list/avatar-mishmash.png'
import avatarMountMedia from '../assets/list/avatar-mount-media.png'
import thumbCampsite from '../assets/list/thumb-campsite.png'
import thumbFledge from '../assets/list/thumb-fledge.png'
import thumbMishmash from '../assets/list/thumb-mishmash.png'
import thumbMountMedia from '../assets/list/thumb-mount-media.png'
import thumbSupermarket from '../assets/list/thumb-supermarket.png'

type Status = 'published' | 'draft' | 'archived'

interface FileRow {
  id: string
  title: string
  link: string
  edited: string
  status: Status
  /** the "· New" note the design shows beside the first title */
  hint?: string
  thumbnail: string
  owner: { name: string; image?: string }
}

const STATUS: Record<Status, { label: string; theme: 'green' | 'gray' }> = {
  published: { label: 'Published', theme: 'green' },
  draft: { label: 'Draft', theme: 'gray' },
  archived: { label: 'Archived', theme: 'gray' },
}

const files = ref<FileRow[]>([
  {
    id: 'campsite',
    title: 'Campsite',
    hint: 'New',
    link: 'Select what type all tickets get by default',
    edited: 'Edited 2 hours ago',
    status: 'published',
    thumbnail: thumbCampsite,
    owner: { name: 'Faris Ansari', image: avatarCampsite },
  },
  {
    id: 'mishmash',
    title: 'Mishmash',
    link: 'timeless.frappe.builder.io',
    edited: 'Edited 2 hours ago',
    status: 'draft',
    thumbnail: thumbMishmash,
    owner: { name: 'Samantha Lee', image: avatarMishmash },
  },
  {
    id: 'fledge',
    title: 'Fledge',
    link: 'tickets.fledge.builder.io',
    edited: 'Edited 1 hour ago',
    status: 'published',
    thumbnail: thumbFledge,
    owner: { name: 'Jayaprakash', image: avatarFledge },
  },
  {
    id: 'supermarket',
    title: 'Supermarket',
    link: 'cloud.supermarket.builder.io',
    edited: 'Edited 3 hours ago',
    status: 'archived',
    thumbnail: thumbSupermarket,
    owner: { name: 'Nina' },
  },
  {
    id: 'mount-media',
    title: 'Mount media',
    link: 'solstice.events.builder.io',
    edited: 'Edited 5 hours ago',
    status: 'draft',
    thumbnail: thumbMountMedia,
    owner: { name: 'Faris Ansari', image: avatarMountMedia },
  },
])

function rowActions(file: FileRow) {
  return [
    { label: 'Open', icon: 'lucide-external-link', onClick: () => {} },
    { label: 'Duplicate', icon: 'lucide-copy', onClick: () => duplicate(file) },
    file.status === 'archived'
      ? {
          label: 'Restore',
          icon: 'lucide-archive-restore',
          onClick: () => (file.status = 'draft'),
        }
      : {
          label: 'Archive',
          icon: 'lucide-archive',
          onClick: () => (file.status = 'archived'),
        },
    {
      label: 'Delete',
      icon: 'lucide-trash-2',
      theme: 'red' as const,
      onClick: () => (files.value = files.value.filter((f) => f !== file)),
    },
  ]
}

function duplicate(file: FileRow) {
  const at = files.value.indexOf(file)
  files.value.splice(at + 1, 0, {
    ...file,
    id: `${file.id}-copy-${Date.now()}`,
    title: `${file.title} copy`,
    edited: 'Edited just now',
    status: 'draft',
  })
}
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections" data-sections>
      <section id="file" class="v2-section" data-section data-label="File">
        <ul class="espresso-list w-[960px] max-w-full">
          <li
            v-for="file in files"
            :key="file.id"
            class="espresso-list-row relative flex gap-4 rounded-6 p-3 transition-colors hover:bg-surface-gray-1 dark:hover:bg-surface-gray-2"
          >
            <img
              :src="file.thumbnail"
              alt=""
              class="espresso-thumb h-[82px] w-[140px] shrink-0 rounded-4 object-cover"
            />

            <div class="flex min-w-0 flex-1 gap-2">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <p class="flex items-baseline gap-1">
                  <span class="truncate text-lg-medium text-ink-gray-7">{{
                    file.title
                  }}</span>
                  <span
                    v-if="file.hint"
                    class="shrink-0 text-base text-ink-gray-5"
                  >
                    · {{ file.hint }}
                  </span>
                </p>
                <div class="flex flex-col gap-5">
                  <p
                    class="flex items-center gap-2 text-p-base text-ink-gray-6"
                  >
                    <span
                      class="size-4 shrink-0 text-ink-gray-7"
                      v-html="globeIcon"
                    />
                    <span class="truncate">{{ file.link }}</span>
                  </p>
                  <p
                    class="flex h-6 items-center gap-2 text-base text-ink-gray-7"
                  >
                    {{ file.edited }}・
                    <Badge
                      :theme="STATUS[file.status].theme"
                      variant="subtle"
                      size="lg"
                    >
                      {{ STATUS[file.status].label }}
                    </Badge>
                  </p>
                </div>
              </div>

              <!-- 24px owner avatar · 8px · ⋯ -->
              <div class="flex h-6 shrink-0 items-center gap-2">
                <Avatar
                  size="md"
                  shape="circle"
                  :image="file.owner.image"
                  :label="file.owner.name"
                />
                <Dropdown :options="rowActions(file)" align="end">
                  <Button
                    variant="ghost"
                    size="xs"
                    :label="`More actions for ${file.title}`"
                  >
                    <template #icon>
                      <span class="lucide-ellipsis size-4 text-ink-gray-7" />
                    </template>
                  </Button>
                </Dropdown>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <!-- Email comes in three densities; each gets its own screen -->
      <section
        id="email-compact"
        class="v2-section"
        data-section
        data-label="Email compact"
      >
        <EmailCompactList />
      </section>
      <section
        id="email-medium"
        class="v2-section"
        data-section
        data-label="Email medium"
      >
        <EmailMediumList />
      </section>
      <section
        id="email-large"
        class="v2-section"
        data-section
        data-label="Email large"
      >
        <EmailLargeList />
      </section>

      <section id="task" class="v2-section" data-section data-label="Task">
        <TaskList />
      </section>
      <section
        id="notification"
        class="v2-section"
        data-section
        data-label="Notification"
      >
        <NotificationList />
      </section>
      <section id="event" class="v2-section" data-section data-label="Event">
        <EventList />
      </section>
    </div>
  </div>
</template>

<style>
/* the thumbnail's shadow, as the file draws it — three plain drops, no
   inset hairline (shadow-sm would ring the image) */
.espresso-thumb {
  box-shadow:
    0 2px 3px rgb(0 0 0 / 0.16),
    0 0.5px 2px rgb(0 0 0 / 0.15),
    0 0 1px rgb(0 0 0 / 0.12);
}

/* Rules sit between rows only, as straight lines over each row (a border
   would follow the rounded corners), and drop away around the hovered row
   so its fill reads as one rounded block. */
.espresso-list-row::before {
  @apply absolute inset-x-0 top-0 border-t border-outline-gray-1 transition-opacity content-[''] dark:border-outline-gray-2;
}
.espresso-list-row:first-child::before,
.espresso-list-row:hover::before,
.espresso-list-row:hover + .espresso-list-row::before {
  @apply opacity-0;
}
</style>
