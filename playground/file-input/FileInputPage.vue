<script setup lang="ts">
// The File input page: one file input on the left and its controller on
// the right — the file's variant properties (node 29788:20146): Variant
// (Outline / Subtle), the four sizes, Preview, Description, and the
// Interaction column (Default, Hover, Active, Focus, Filled, Disabled,
// Loading, Error) pinned for review. Default is live: the field follows
// the pointer, opens the picker, takes a dropped file, "uploads" it.
//
// The input's box is a constant 700x140 — the file's cell with a preview —
// so switching Preview or Description off moves nothing: the smaller
// field sits at the box's top-left.
import { ref } from 'vue'
import { Select, Switch } from '../../src'
import FileInput from './FileInput.vue'
import type {
  FileInputSize,
  FileInputState,
  FileInputVariant,
} from './FileInput.vue'

// `?variant=subtle&size=lg&state=error&preview&description` opens the page
// on that combination
const q = new URLSearchParams(window.location.search)
const pick = <T extends string>(key: string, allowed: T[], fallback: T): T =>
  allowed.includes(q.get(key) as T) ? (q.get(key) as T) : fallback
const variant = ref<FileInputVariant>(
  pick('variant', ['outline', 'subtle'], 'outline'),
)
const size = ref<FileInputSize>(pick('size', ['xs', 'sm', 'md', 'lg'], 'sm'))
const preview = ref(q.has('preview'))
const description = ref(q.has('description'))
const state = ref<FileInputState>(
  pick(
    'state',
    [
      'auto',
      'hover',
      'active',
      'focus',
      'filled',
      'disabled',
      'loading',
      'error',
    ],
    'auto',
  ),
)

const variantOptions = [
  { label: 'Outline', value: 'outline' },
  { label: 'Subtle', value: 'subtle' },
]
const sizeOptions = [
  { label: 'Extra small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
]
// the file's column, top to bottom
const stateOptions = [
  { label: 'Default', value: 'auto' },
  { label: 'Hover', value: 'hover' },
  { label: 'Active', value: 'active' },
  { label: 'Focus', value: 'focus' },
  { label: 'Filled', value: 'filled' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Loading', value: 'loading' },
  { label: 'Error', value: 'error' },
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
          :state="state"
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
            <Select
              v-model="variant"
              :options="variantOptions"
              size="sm"
              variant="subtle"
              class="w-[120px]"
              aria-label="Variant"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Size</span>
            <Select
              v-model="size"
              :options="sizeOptions"
              size="sm"
              variant="subtle"
              class="w-[120px]"
              aria-label="Size"
            />
          </div>
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Interaction</span>
            <Select
              v-model="state"
              :options="stateOptions"
              size="sm"
              variant="subtle"
              class="w-[120px]"
              aria-label="Interaction"
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
        </div>
      </div>
    </div>
  </div>
</template>
