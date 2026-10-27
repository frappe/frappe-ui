<script setup lang="ts">
import { ref } from 'vue'
import { TabButtons, Tabs, TabList, TabTrigger } from 'frappe-ui'

// Card 1: Gameplan's space and profile pages, LMS's profile and Press's role
// settings switch pages with TabButtons, then sync the route by hand. Tabs
// is built for it: a trigger with `route` is a link, and the selected tab
// follows the URL. TabButtons picks a value, like a filter. Both are live.
const pages = [
  { value: 'profile', label: 'Profile' },
  { value: 'posts', label: 'Posts' },
  { value: 'replies', label: 'Replies' },
]
const tabPage = ref('posts')
const buttonPage = ref('posts')

// Card 2: CRM's deal page has nine tabs and hides the scrollbar, so the last
// tabs sit out of view with nothing to say they're there. Both rows are the
// same width; "don't" is clipped to it.
const recordTabs = [
  { value: 'activity', label: 'Activity', icon: 'lucide-activity' },
  { value: 'emails', label: 'Emails', icon: 'lucide-mail' },
  { value: 'calls', label: 'Calls', icon: 'lucide-phone' },
  { value: 'tasks', label: 'Tasks', icon: 'lucide-circle-check' },
  { value: 'notes', label: 'Notes', icon: 'lucide-file-text' },
]
const tooManyTabs = [
  ...recordTabs,
  { value: 'comments', label: 'Comments', icon: 'lucide-message-circle' },
  { value: 'files', label: 'Files', icon: 'lucide-paperclip' },
  { value: 'data', label: 'Data', icon: 'lucide-database' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'lucide-message-square' },
]
const fitTab = ref('activity')
const overflowTab = ref('activity')
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Tabs for switching pages or panels; TabButtons for picking a
         value. -->
    <Guideline
      layout="stack"
      caption="Switch pages or panels with Tabs, not TabButtons. With a route on each tab, Tabs keeps the URL in sync."
    >
      <template #do>
        <Tabs v-model="tabPage" class="w-72">
          <TabList variant="underline">
            <TabTrigger
              v-for="p in pages"
              :key="p.value"
              :value="p.value"
              :label="p.label"
            />
          </TabList>
        </Tabs>
      </template>
      <template #dont>
        <div class="w-72">
          <TabButtons v-model="buttonPage" :options="pages" />
        </div>
      </template>
    </Guideline>

    <!-- 2. The same width on both sides. The "don't" row hides its
         scrollbar, as CRM's does, so the last tabs are out of sight. -->
    <Guideline
      layout="stack"
      caption="Keep tabs to what fits in one row. A tab scrolled out of view is one people won't find."
    >
      <template #do>
        <Tabs v-model="fitTab" class="w-[480px]">
          <TabList variant="underline">
            <TabTrigger
              v-for="t in recordTabs"
              :key="t.value"
              :value="t.value"
              :label="t.label"
              :icon-left="t.icon"
            />
          </TabList>
        </Tabs>
      </template>
      <template #dont>
        <!-- Clipped at the same width as "do", as a hidden scrollbar
             leaves it: "Comments" is cut in half, and three more tabs are out of sight. -->
        <div class="w-[480px] overflow-hidden">
          <Tabs v-model="overflowTab">
            <TabList variant="underline">
              <TabTrigger
                v-for="t in tooManyTabs"
                :key="t.value"
                :value="t.value"
                :label="t.label"
                :icon-left="t.icon"
              />
            </TabList>
          </Tabs>
        </div>
      </template>
    </Guideline>
  </div>
</template>
