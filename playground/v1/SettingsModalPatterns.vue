<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, TabButtons, useColorScheme } from '../../src'
import MyProfilePattern from './MyProfilePattern.vue'
import DeleteAccountPattern from './DeleteAccountPattern.vue'
import NotificationsPattern from './NotificationsPattern.vue'
import MembersPattern from './MembersPattern.vue'
import CalendarPattern from './CalendarPattern.vue'
import HolidayListPattern from './HolidayListPattern.vue'

// `useColorScheme` owns `<html data-theme>` and persists the choice, so the
// modal — which portals out to <body> — repaints with the rest of the page.
const { colorScheme, setColorScheme } = useColorScheme()

const schemeOptions = [
  { label: 'Light', value: 'light', iconLeft: 'lucide-sun' },
  { label: 'Dark', value: 'dark', iconLeft: 'lucide-moon' },
  { label: 'System', value: 'system', iconLeft: 'lucide-monitor' },
]

// `colorScheme` is readonly by design — writes go through `setColorScheme` so
// the ref, the attribute and localStorage move together.
const scheme = computed({
  get: () => colorScheme.value,
  set: (value) => setColorScheme(value),
})

// One entry per variant of the Espresso 2.0 `settings-modal new` component set
// (node 31740:30768): my-profile, delete-account, notifications.
const myProfileOpen = ref(false)
const deleteAccountOpen = ref(false)
const notificationsOpen = ref(false)
const membersOpen = ref(false)
const calendarOpen = ref(false)
const holidayOpen = ref(false)

const patterns = [
  {
    id: 'my-profile',
    title: 'My profile',
    description:
      'Profile form, account & security, appearance, sessions and a danger zone — the full-height scrolling body.',
    node: '31740:30767',
    done: true,
    open: () => (myProfileOpen.value = true),
  },
  {
    id: 'delete-account',
    title: 'Delete account',
    description:
      'Short confirmation body — the modal hugs its content instead of filling the viewport.',
    node: '31740:30765',
    done: true,
    open: () => (deleteAccountOpen.value = true),
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description:
      'Notification preferences grouped by channel, at a mid-height body.',
    node: '31740:30766',
    done: true,
    open: () => (notificationsOpen.value = true),
  },
  {
    id: 'members',
    title: 'Members',
    description:
      'App members table — search, filter, per-row role select and an actions menu. Rebuilt from an older Espresso page into the modal shell.',
    node: '34665:36569',
    done: true,
    open: () => (membersOpen.value = true),
  },
  {
    id: 'calendar',
    title: 'Calendar',
    description:
      'Radio-card view picker, segmented controls, and repeatable reminder rows. Also rebuilt from an older Espresso page.',
    node: '34665:38828',
    done: true,
    open: () => (calendarOpen.value = true),
  },
  {
    id: 'holiday-list',
    title: 'Holiday list',
    description:
      'Schedule form plus a year-at-a-glance calendar, built in the language of Espresso 2.0\u2019s inline date-picker.',
    node: '34708:45580',
    done: true,
    open: () => (holidayOpen.value = true),
  },
]
</script>

<template>
  <div class="min-h-screen bg-surface-gray-1 px-6 py-12">
    <div class="mx-auto flex max-w-3xl flex-col gap-8">
      <header class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-1">
          <h1 class="text-2xl-semibold text-ink-gray-9">
            Settings modal patterns
          </h1>
          <p class="text-p-base text-ink-gray-6">
            Built from frappe-ui's <code>SettingsDialog</code> family, with
            geometry taken from the Espresso 2.0
            <code>settings-modal new</code> component set.
          </p>
        </div>
        <TabButtons
          v-model="scheme"
          class="shrink-0"
          :options="schemeOptions"
        />
      </header>

      <ol class="flex flex-col gap-3">
        <li
          v-for="(pattern, index) in patterns"
          :key="pattern.id"
          class="flex items-center gap-4 rounded-5 border border-outline-gray-2 bg-surface-elevation-1 p-4"
        >
          <span
            class="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-gray-2 text-sm-medium text-ink-gray-6"
          >
            {{ index + 1 }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h2 class="text-base-medium text-ink-gray-8">
                {{ pattern.title }}
              </h2>
              <Badge
                v-if="!pattern.done"
                theme="gray"
                variant="subtle"
                label="Not implemented"
              />
            </div>
            <p class="mt-1 text-p-base text-ink-gray-6">
              {{ pattern.description }}
            </p>
            <p class="mt-1 text-sm text-ink-gray-4">
              Figma node {{ pattern.node }}
            </p>
          </div>
          <Button
            :disabled="!pattern.done"
            label="Open"
            @click="pattern.open?.()"
          />
        </li>
      </ol>
    </div>

    <MyProfilePattern v-model:open="myProfileOpen" />
    <DeleteAccountPattern v-model:open="deleteAccountOpen" />
    <NotificationsPattern v-model:open="notificationsOpen" />
    <MembersPattern v-model:open="membersOpen" />
    <CalendarPattern v-model:open="calendarOpen" />
    <HolidayListPattern v-model:open="holidayOpen" />
  </div>
</template>
