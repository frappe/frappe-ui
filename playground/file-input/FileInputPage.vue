<script setup lang="ts">
// The File input page: one file input on the left and its controller on
// the right — the file's variant properties (node 29788:20146): Variant
// (Subtle / Outline) and the four sizes as tabs, Preview and Description,
// and of the interaction column only the two a page sets, Error and
// Disabled. The rest happen on the field itself (the user's call
// 2026-10-06): hover under the pointer, focus from the keyboard, filled and
// loading from a chosen or dropped file.
//
// The input's box is a constant 700x140 — the file's cell with a preview —
// so switching Preview or Description off moves nothing: the smaller
// field sits at the box's top-left.
import { ref } from 'vue'
import { Switch, TabButtons } from '../../src'
import FileInput from './FileInput.vue'
import type { FileInputSize, FileInputVariant } from './FileInput.vue'

// `?variant=subtle&size=lg&error&disabled&preview&description` opens the
// page on that combination
const q = new URLSearchParams(window.location.search)
const pick = <T extends string>(key: string, allowed: T[], fallback: T): T =>
  allowed.includes(q.get(key) as T) ? (q.get(key) as T) : fallback
const variant = ref<FileInputVariant>(
  pick('variant', ['outline', 'subtle'], 'outline'),
)
const size = ref<FileInputSize>(pick('size', ['xs', 'sm', 'md', 'lg'], 'sm'))
const preview = ref(q.has('preview'))
const description = ref(q.has('description'))
const error = ref(q.has('error'))
const disabled = ref(q.has('disabled'))

const variantTabs = [
  { label: 'Subtle', value: 'subtle' },
  { label: 'Outline', value: 'outline' },
]
// the sizes by their own names
const sizeTabs = [
  { label: 'xs', value: 'xs' },
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
]

/** The file's description, word for word. */
const DESCRIPTION =
  'Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750×422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.'
</script>

<template>
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <div class="h-[140px] w-[700px]">
        <FileInput
          :variant="variant"
          :size="size"
          :preview="preview"
          :description="description ? DESCRIPTION : ''"
          :error="error"
          :disabled="disabled"
        />
      </div>
      <!-- the controller, as the tree's: 274 wide, 16 inside, radius 16 -->
      <div
        class="flex w-[274px] shrink-0 flex-col gap-3 rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 pb-[13px] pt-4"
      >
        <p class="text-lg-semibold leading-[1.15] text-ink-gray-9">
          File input
        </p>
        <div class="flex flex-col gap-2">
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Variant</span>
            <TabButtons
              v-model="variant"
              :options="variantTabs"
              size="sm"
              aria-label="Variant"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Size</span>
            <TabButtons
              v-model="size"
              :options="sizeTabs"
              size="sm"
              aria-label="Size"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Preview</span>
            <Switch v-model="preview" size="sm" aria-label="Preview" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Description</span>
            <Switch v-model="description" size="sm" aria-label="Description" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Error</span>
            <Switch v-model="error" size="sm" aria-label="Error" />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Disabled</span>
            <Switch v-model="disabled" size="sm" aria-label="Disabled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
