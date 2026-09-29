<script setup lang="ts">
import { ref } from 'vue'
import { TabButtons } from 'frappe-ui'

// Card 1: unlike Tabs, which falls back to its first tab, TabButtons with no
// value selects nothing, so every pill looks the same. The "don't" side is
// unbound; click a pill and it selects as usual.
const sections = [
  { label: 'Inbox', value: 'inbox', iconLeft: 'lucide-inbox' },
  { label: 'Comments', value: 'comments', iconLeft: 'lucide-message-circle' },
  { label: 'Upcoming events', value: 'events', iconLeft: 'lucide-calendar' },
]
const section = ref('inbox')

// Card 2: past about six pills, the row gets too long to scan and runs out
// of room on a narrow screen.
const few = [
  { label: 'All', value: 'all' },
  { label: 'Teams', value: 'teams' },
  { label: 'Home', value: 'home' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Others', value: 'others' },
]
const many = [
  { label: 'All', value: 'all' },
  { label: 'Teams', value: 'teams' },
  { label: 'Home', value: 'home' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Deals', value: 'deals' },
  { label: 'Leads', value: 'leads' },
  { label: 'Email', value: 'email' },
  { label: 'Chats', value: 'chats' },
  { label: 'Others', value: 'others' },
]
const fewValue = ref('teams')
const manyValue = ref('teams')

// Card 3: an icon on one pill and not the others makes that pill look
// different in kind, not just in label.
const withIcons = [
  { label: 'Day', value: 'day', iconLeft: 'lucide-calendar-1' },
  { label: 'Week', value: 'week', iconLeft: 'lucide-calendar-range' },
  { label: 'Month', value: 'month', iconLeft: 'lucide-calendar-days' },
]
const mixedIcons = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month', iconLeft: 'lucide-calendar-days' },
]
const range = ref('week')
const mixedRange = ref('week')
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. A starting value, so one pill is selected before anyone clicks. -->
    <Guideline
      layout="stack"
      caption="Give TabButtons a starting value, usually the first option. Without one, nothing is selected."
    >
      <template #do>
        <TabButtons v-model="section" :options="sections" />
      </template>
      <template #dont>
        <TabButtons :options="sections" />
      </template>
    </Guideline>

    <!-- 2. A short row of pills. For more options, a Select fits. -->
    <Guideline
      layout="stack"
      caption="Keep TabButtons to about six options. For more, use a Select."
    >
      <template #do>
        <TabButtons v-model="fewValue" :options="few" />
      </template>
      <template #dont>
        <TabButtons v-model="manyValue" :options="many" />
      </template>
    </Guideline>

    <!-- 3. Icons on every pill or on none. -->
    <Guideline
      layout="stack"
      caption="Give every option an icon, or none of them."
    >
      <template #do>
        <TabButtons v-model="range" :options="withIcons" />
      </template>
      <template #dont>
        <TabButtons v-model="mixedRange" :options="mixedIcons" />
      </template>
    </Guideline>
  </div>
</template>
