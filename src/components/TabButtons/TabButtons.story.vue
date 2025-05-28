<script setup lang="ts">
import { ref } from 'vue'
import TabButtons from './TabButtons.vue'

const currentTab = ref('mytasks')
</script>

<template>
  <Story :layout="{ type: 'grid', width: '80%' }">
    <Variant title="Tab Buttons">
      <div class="flex">
        <TabButtons
          :buttons="[
            { label: 'Tasks assigned to me', value: 'mytasks' },
            { label: 'Tasks created by me', value: 'created' },
          ]"
          v-model="currentTab"
        />
      </div>
    </Variant>
  </Story>
</template>
