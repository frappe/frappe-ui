<script setup lang="ts">
import { TabButtons } from 'frappe-ui'
import { ref } from 'vue'

import Story from '@/components/Story.vue'
const currentTab = ref('mytasks')
</script>

<template>
  <div class="flex w-4/5">
    <Story>
      <TabButtons
        :buttons="[
          { label: 'Tasks assigned to me', value: 'mytasks' },
          { label: 'Tasks created by me', value: 'created' },
        ]"
        v-model="currentTab"
      />
    </Story>
  </div>
</template>
