<script setup lang="ts">
// The Rich text editor page: the file's WYSIWYG editor on the white
// stage, and a row above it for the states the editor can be in —
// editable or read-only, the article or an empty document.
import { ref } from 'vue'
import { Switch } from '../../../src'
import RichTextEditor from './RichTextEditor.vue'

const editable = ref(true)
const empty = ref(false)
</script>

<template>
  <div class="v2-scroll h-full overflow-y-auto bg-surface-base">
    <!-- 1348 = the 1300px card plus the 24px gutter either side -->
    <div
      class="mx-auto flex w-full max-w-[1348px] flex-col gap-4 px-4 py-6 sm:px-6"
    >
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Switch v-model="editable" size="sm" label="Editable" />
        <Switch v-model="empty" size="sm" label="Empty document" />
      </div>
      <RichTextEditor :editable="editable" :empty="empty" />
    </div>
  </div>
</template>
