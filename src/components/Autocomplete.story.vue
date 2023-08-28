<script setup lang="ts">
import { ref } from 'vue'
import Autocomplete from './Autocomplete.vue'

const value = ref('')
const options = [
  { label: 'John Doe', value: 'john-doe' },
  { label: 'Jane Doe', value: 'jane-doe' },
  { label: 'John Smith', value: 'john-smith' },
  { label: 'Jane Smith', value: 'jane-smith' },
  { label: 'John Wayne', value: 'john-wayne' },
  { label: 'Jane Wayne', value: 'jane-wayne' },
]
</script>
<template>
  <Story :layout="{ width: 500, type: 'grid' }" autoPropsDisabled>
    <div class="p-2">
      <Autocomplete
        :options="options"
        v-model="value"
        placeholder="Select person"
      />
    </div>
  </Story>
</template>
