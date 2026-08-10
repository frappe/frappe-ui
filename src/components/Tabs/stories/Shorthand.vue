<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, Switch } from 'frappe-ui'

const tab = ref('discussions')
const showTasks = ref(true)

const tabs = [
  {
    value: 'discussions',
    label: 'Discussions',
    data: { content: 'Discussions for this project show up here.' },
  },
  {
    value: 'pages',
    label: 'Pages',
    data: { content: 'Pages for this project show up here.' },
  },
  {
    value: 'tasks',
    label: 'Tasks',
    data: { content: 'Tasks for this project show up here.' },
    condition: () => showTasks.value,
  },
]
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <Tabs
      v-model="tab"
      :tabs="tabs"
      variant="subtle"
      class="rounded-4 border p-2"
    >
      <template #tab-panel="{ tab: t }">
        <div class="p-4 text-base text-ink-gray-7">{{ t.data?.content }}</div>
      </template>
    </Tabs>
    <Switch v-model="showTasks" label="Show the Tasks tab" />
  </div>
</template>
