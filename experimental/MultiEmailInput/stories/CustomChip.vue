<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '../../../src/components/Avatar/Avatar.vue'
import { MultiEmailInput } from '..'

const emails = ref<string[]>(['ada@example.com'])
const options = [
  {
    label: 'Ada Lovelace',
    value: 'ada@example.com',
    avatar: 'https://i.pravatar.cc/80?u=ada@example.com',
  },
  { label: 'Grace Hopper', value: 'grace@example.com' },
]
</script>

<template>
  <div class="max-w-md">
    <!-- The #tag slot fully replaces a chip's inner content. -->
    <MultiEmailInput v-model="emails" :options="options">
      <template #tag="{ value, option, removeTag }">
        <Avatar
          class="size-3"
          :image="option?.avatar"
          :label="option?.label ?? value"
          size="xs"
        />
        <span class="truncate">{{ option?.label ?? value }}</span>
        <button
          type="button"
          :aria-label="`Remove ${value}`"
          class="inline-flex shrink-0 items-center justify-center rounded-1 text-ink-gray-7 hover:text-ink-gray-9"
          @click="removeTag"
        >
          <span class="lucide-x size-3" />
        </button>
      </template>
    </MultiEmailInput>
  </div>
</template>
