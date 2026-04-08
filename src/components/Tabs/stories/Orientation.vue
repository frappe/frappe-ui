<script setup lang="ts">
import { Tabs } from 'frappe-ui'
import { reactive } from 'vue'

const state = reactive({
  index: 0,
  tabs: [
    {
      label: 'Github',
      content: 'Github is a code hosting platform for version control and collaboration',
    },
    {
      label: 'Twitter',
      content:
        'Twitter is an American microblogging and social networking service on which users post',
    },
    {
      label: 'Linkedin',
      content: 'LinkedIn is an American business and employment-oriented online service',
    },
  ],
})
</script>

<template>
  <Tabs class="rounded border" v-model="state.index" :tabs="state.tabs">
    <template #tab-panel="{ tab }">
      <div class="p-5">{{ tab.content }}</div>
    </template>
  </Tabs>

  <Tabs class="rounded border" v-model="state.index" :tabs="state.tabs" :vertical="true">
    <template #tab-panel="{ tab }">
      <div class="p-5">{{ tab.content }}</div>
    </template>
  </Tabs>
</template>
