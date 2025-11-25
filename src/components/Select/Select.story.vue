<script setup lang="ts">
import { ref } from 'vue'
import Select from './Select.vue'
import LucideUser from '~icons/lucide/user'

const value = ref('')
const options = [
  { label: 'John Doe', value: 'john-doe' },
  { label: 'Jane Doe', value: 'jane-doe' },
  { label: 'John Smith', value: 'john-smith' },
  { label: 'Jane Smith', value: 'jane-smith', disabled: true },
  { label: 'John Wayne', value: 'john-wayne' },
  { label: 'Jane Wayne', value: 'jane-wayne' },
]
</script>
<template>
  <Story :layout="{ width: 500, type: 'grid' }">
    <Variant title="Default">
      <div class="p-2">
        <Select :options="options" v-model="value" />
      </div>
    </Variant>

    <Variant title="With prefix">
      <div class="p-2">
        <Select :options="options" v-model="value">
          <template #prefix>
            <LucideUser class="size-4 text-ink-gray-9" />
          </template>
        </Select>
      </div>
    </Variant>
  </Story>
</template>
