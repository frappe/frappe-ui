<script setup lang="ts">
import { reactive } from 'vue'
import { Tabs } from 'frappe-ui'

const state = reactive({
  tab: 'github',
  tabs: [
    {
      value: 'github',
      label: 'Github',
      content:
        'Github is a code hosting platform for version control and collaboration',
    },
    {
      value: 'twitter',
      label: 'Twitter',
      content:
        'Twitter is an American microblogging and social networking service on which users post',
    },
    {
      value: 'linkedin',
      label: 'Linkedin',
      content:
        'LinkedIn is an American business and employment-oriented online service',
    },
  ],
})
</script>

<template>
  <div class="w-full items-center grid gap-5">
    <Tabs class="border rounded" v-model="state.tab" :tabs="state.tabs">
      <template #panel="{ tab }">
        <div class="p-5">{{ tab.content }}</div>
      </template>
    </Tabs>

    <Tabs
      class="border rounded"
      v-model="state.tab"
      :tabs="state.tabs"
      :vertical="true"
    >
      <template #panel="{ tab }">
        <div class="p-5">{{ tab.content }}</div>
      </template>
    </Tabs>
  </div>
</template>
