<script setup lang="ts">
// One of the File input page's examples (FileInputPage.vue), with its
// controls under the page's outline while it is the one in view:
//
// File input — the field — the file's variant properties (node
// 29788:20146): Variant (Subtle / Outline) and the four sizes as tabs,
// Preview — the file's cell, the preview card with the description (the
// user's call 2026-10-06: the bigger sizes look wrong without it, so the two
// go together) — and of the interaction column only the two a page sets,
// Error and Disabled. The rest happen on the field itself (the user's call
// 2026-10-06): hover under the pointer, focus from the keyboard, filled and
// loading from a chosen or dropped file. With Preview it is the file's cell,
// 700x140, the field's foot on the cell's foot after the card and its 12
// gap; without, the field alone, in the middle of the page — and of the
// same 140 box, so a size grows it about its middle and moves nothing below.
//
// File input area — the drop area, node 35825:65914 — with its own Variant,
// Orientation (how the files under it sit: cards down, or thumbnails
// across), Error and Disabled.
//
// CSV files — the area's other version: a CSV from the device, the library
// or a link (node 35856:51955) — with Error and Disabled.
import { computed, inject, ref, watch } from 'vue'
import { Switch, TabButtons } from '../../src'
import FileInput from './FileInput.vue'
import FileInputArea from './FileInputArea.vue'
import FileImportArea from './FileImportArea.vue'
import type { FileInputSize, FileInputVariant } from './FileInput.vue'
import { PATTERNS_ACTIVE } from '../patternsRail'

export type FileInputKind = 'field' | 'area' | 'sources'
const props = defineProps<{ type: FileInputKind }>()
const inputType = computed(() => props.type)
// the controls show under the outline while this example is in view
const active = inject(PATTERNS_ACTIVE, ref(''))
const inView = computed(() => active.value === props.type)
const orientation = ref<'vertical' | 'horizontal'>('vertical')
const orientationTabs = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
]
const variant = ref<FileInputVariant>('outline')
const size = ref<FileInputSize>('sm')
const preview = ref(false)
const error = ref(false)
const disabled = ref(false)
// a disabled field can't be in error: turning one on turns the other off
watch(error, (on) => on && (disabled.value = false))
watch(disabled, (on) => on && (error.value = false))

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
  <div>
    <!-- the multi-source area, the file's 700 wide -->
    <FileImportArea
      v-if="inputType === 'sources'"
      v-model:error="error"
      :disabled="disabled"
    />
    <!-- the area, in a box as tall as its tallest option makes it (Error's
         files, 270), so an option never moves what's below; files dropped
         in grow it downward -->
    <div v-else-if="inputType === 'area'" class="min-h-[270px]">
      <FileInputArea
        v-model:error="error"
        :variant="variant"
        :orientation="orientation"
        :disabled="disabled"
      />
    </div>
    <div
      v-else
      class="flex h-[140px]"
      :class="preview ? 'w-[700px] items-end' : 'items-center justify-center'"
    >
      <FileInput
        :variant="variant"
        :size="size"
        :preview="preview"
        :description="preview ? DESCRIPTION : ''"
        :error="error"
        :disabled="disabled"
      />
    </div>

    <!-- the controls, under the page's outline while this example is in
         view; rows 12 apart (the user found 8 cramped with tabs and selects
         in them) -->
    <Teleport v-if="inView" defer to="#patterns-rail">
      <div class="mt-10 text-base-medium text-ink-gray-8">Options</div>
      <div class="mt-3 flex flex-col gap-3">
        <!-- CSV files has one look -->
        <div
          v-if="inputType !== 'sources'"
          class="flex h-7 items-center justify-between"
        >
          <span class="text-base text-ink-gray-7">Variant</span>
          <TabButtons
            v-model="variant"
            :options="variantTabs"
            size="sm"
            aria-label="Variant"
            class="w-[148px] [&>div]:w-full [&_button]:flex-1 [&_button]:basis-0 [&_button>span]:w-full"
          />
        </div>
        <div
          v-if="inputType === 'area'"
          class="flex h-7 items-center justify-between"
        >
          <span class="text-base text-ink-gray-7">Orientation</span>
          <TabButtons
            v-model="orientation"
            :options="orientationTabs"
            size="sm"
            aria-label="Orientation"
            class="w-[148px] [&>div]:w-full [&_button]:flex-1 [&_button>span]:w-full"
          />
        </div>
        <div
          v-if="inputType === 'field'"
          class="flex h-7 items-center justify-between"
        >
          <span class="text-base text-ink-gray-7">Size</span>
          <TabButtons
            v-model="size"
            :options="sizeTabs"
            size="sm"
            aria-label="Size"
            class="w-[148px] [&>div]:w-full [&_button]:flex-1 [&_button]:basis-0 [&_button]:min-w-0 [&_button>span]:min-w-0 [&_button>span]:px-0 [&_button>span]:w-full"
          />
        </div>
        <div
          v-if="inputType === 'field'"
          class="flex h-7 items-center justify-between"
        >
          <span class="text-base text-ink-gray-7">Preview</span>
          <Switch v-model="preview" size="sm" aria-label="Preview" />
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
    </Teleport>
  </div>
</template>
