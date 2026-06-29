<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '../../../src/components/Avatar/Avatar.vue'
import { MultiEmailInput } from '..'

const emails = ref<string[]>(['ada@example.com'])
const options = [
  {
    label: 'Ada Lovelace',
    value: 'ada@example.com',
    image: 'https://i.pravatar.cc/80?u=ada@example.com',
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
          v-if="option?.image"
          :image="option.image"
          :label="option?.label ?? value"
          size="xs"
        />
        <span class="truncate">{{ option?.label ?? value }}</span>
        <button
          type="button"
          :aria-label="`Remove ${value}`"
          class="-mr-0.5 grid size-4 place-items-center rounded-sm text-ink-gray-5 hover:text-ink-gray-7"
          @click="removeTag"
        >
          <span class="lucide-x size-3" />
        </button>
      </template>
    </MultiEmailInput>
  </div>
</template>
