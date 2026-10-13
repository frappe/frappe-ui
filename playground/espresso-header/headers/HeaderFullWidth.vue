<template>
  <EHeader>
    <template #left>
      <button
        type="button"
        class="flex items-center gap-2"
        aria-label="Switch app"
      >
        <EIcon name="logo-drive-md" class="size-8" />
        <EIcon name="small-down" class="size-4 text-ink-gray-6" />
      </button>
      <div class="flex items-center gap-1">
        <Button
          v-for="tool in tools"
          :key="tool.icon"
          variant="ghost"
          size="sm"
          :aria-label="tool.label"
          :class="tool.icon === activeTool && '!bg-surface-gray-3'"
          @click="activeTool = tool.icon"
        >
          <template #icon>
            <EIcon :name="tool.icon" class="size-4 text-ink-gray-6" />
          </template>
        </Button>
      </div>
    </template>
    <template #middle>
      <HeaderSelect
        label="Untitled"
        variant="ghost"
        size="md"
        text-class="text-base-medium"
        ink-class="text-ink-gray-5"
      />
    </template>
    <template #right>
      <Button variant="ghost" size="sm" aria-label="Settings">
        <template #icon>
          <EIcon name="settings" class="size-4 text-ink-gray-7" />
        </template>
      </Button>
      <Button variant="ghost" size="sm" aria-label="Preview">
        <template #icon>
          <EIcon name="play" class="size-4 text-ink-gray-7" />
        </template>
      </Button>
      <Button variant="ghost" size="sm" class="!text-ink-gray-7">Share</Button>
      <Button variant="solid" size="sm">
        <template #prefix>
          <EIcon name="web" class="size-4" />
        </template>
        Publish
      </Button>
      <img :src="avatar" alt="Sandeep" class="size-7 rounded-full" />
    </template>
  </EHeader>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import avatar from '../../espresso-sidebar/avatars/header-4.png'
import EHeader from '../EHeader.vue'
import HeaderSelect from '../HeaderSelect.vue'

const tools = [
  { icon: 'square', label: 'Frame' },
  { icon: 'move-tool', label: 'Move' },
  { icon: 'text', label: 'Text' },
  { icon: 'image', label: 'Image' },
  { icon: 'template', label: 'Templates' },
]

// The design shows the move tool picked.
const activeTool = ref('move-tool')
</script>
