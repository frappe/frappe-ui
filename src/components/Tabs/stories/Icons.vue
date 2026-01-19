<script setup lang="ts">
import { reactive } from 'vue'
import { Tabs } from 'frappe-ui'
import LucideGithub from '~icons/lucide/github'
import LucideTwitter from '~icons/lucide/twitter'
import LucideLinkedin from '~icons/lucide/linkedin'

const state = reactive({
  index: 0,

  tabs: [
    {
      label: 'Github',
      content:
        'Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.',
      icon: LucideGithub,
    },
    {
      label: 'Twitter',
      content:
        'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
      icon: LucideTwitter,
    },
    {
      label: 'Linkedin',
      content:
        'LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.',
      icon: LucideLinkedin,
    },
  ],
})
</script>

<template>
  <Tabs class="border rounded" v-model="state.index" :tabs="state.tabs">
    <template #tab-panel="{ tab }">
      <div class="p-5">{{ tab.content }}</div>
    </template>
  </Tabs>
</template>
