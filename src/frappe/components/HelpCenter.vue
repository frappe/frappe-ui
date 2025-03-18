<template>
  <div class="flex flex-col gap-2.5">
    <div class="p-1">
      <FormControl class="-m-1" :placeholder="'Search'">
        <template #prefix>
          <FeatherIcon name="search" class="h-4 text-ink-gray-5" />
        </template>
      </FormControl>
    </div>
    <div class="text-base text-ink-gray-5 my-1.5 mx-2">All articles</div>
    <div v-for="a in articles" :key="a.title" class="flex flex-col gap-1.5">
      <div class="flex flex-col gap-1.5">
        <div
          class="flex items-center justify-between p-1.5 hover:bg-surface-gray-1 rounded cursor-pointer"
          @click="a.opened = !a.opened"
        >
          <div class="flex items-center gap-2">
            <FeatherIcon
              :name="a.opened ? 'chevron-down' : 'chevron-right'"
              class="h-4 text-ink-gray-5"
            />
            <div class="text-base text-ink-gray-8">{{ a.title }}</div>
          </div>
        </div>
        <div v-show="a.opened" class="flex flex-col gap-1.5 ml-10">
          <div
            v-for="subArticle in a.subArticles"
            :key="subArticle.title"
            class="flex gap-2 p-1.5 hover:bg-surface-gray-1 rounded cursor-pointer"
          >
            <FeatherIcon name="file-text" class="h-4 text-ink-gray-5" />
            <div class="text-base text-ink-gray-8">{{ subArticle.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import FormControl from '../../../src/components/FormControl.vue'
import { ref } from 'vue'

const articles = ref([
  {
    title: 'Introduction',
    opened: false,
    subArticles: [{ title: 'Introduction' }, { title: 'Setting up' }],
  },
  {
    title: 'Settings',
    opened: false,
    subArticles: [
      { title: 'Profile' },
      { title: 'Custom branding' },
      { title: 'Home actions' },
      { title: 'Invite members' },
    ],
  },
  {
    title: 'Masters',
    opened: false,
    subArticles: [
      { title: 'Lead' },
      { title: 'Deal' },
      { title: 'Contact' },
      { title: 'Organization' },
      { title: 'Note' },
      { title: 'Task' },
      { title: 'Call log' },
      { title: 'Email template' },
    ],
  },
  {
    title: 'Views',
    opened: false,
    subArticles: [
      { title: 'Saved views' },
      { title: 'Public views' },
      { title: 'Pinned views' },
    ],
  },
  {
    title: 'Other features',
    opened: false,
    subArticles: [
      { title: 'Email communication' },
      { title: 'Comment' },
      { title: 'Data' },
      { title: 'Service level agreement' },
      { title: 'Assignment rule' },
      { title: 'Notification' },
    ],
  },
  {
    title: 'Customization',
    opened: false,
    subArticles: [
      { title: 'Custom fields' },
      { title: 'Custom actions' },
      { title: 'Custom statuses' },
      { title: 'Custom list actions' },
      { title: 'Quick entry layout' },
    ],
  },
  {
    title: 'Integration',
    opened: false,
    subArticles: [
      { title: 'Twilio' },
      { title: 'Exotel' },
      { title: 'WhatsApp' },
      { title: 'ERPNext' },
    ],
  },
  {
    title: 'Frappe CRM mobile',
    opened: false,
    subArticles: [{ title: 'Mobile app installation' }],
  },
])
</script>
