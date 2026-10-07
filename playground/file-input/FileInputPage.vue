<script setup lang="ts">
// The File input page: one input on the left and its controller on the
// right. The controller leads with Input type (the user's call 2026-10-06):
// File input — the field — or File input area — the drop area, node
// 35825:65914, with its own Variant, Orientation (how the files under it
// sit: cards down, or thumbnails across), Error and Disabled.
//
// File input:  — the file's variant properties (node 29788:20146): Variant
// (Subtle / Outline) and the four sizes as tabs, Preview — the file's cell,
// the preview card with the description (the user's call 2026-10-06: the
// bigger sizes look wrong without it, so the two go together) — and of the
// interaction column only the two a page sets, Error and Disabled. The rest happen on the field itself (the user's call
// 2026-10-06): hover under the pointer, focus from the keyboard, filled and
// loading from a chosen or dropped file.
//
// The input's box is a constant 700x140 — the file's cell with a preview.
// The field keeps its place whether Preview is on or off: its left edge 272
// in (after the card and the 12 gap) and its foot on the box's foot, as in
// the cell; Preview only adds the card and the description around it.
import { ref, watch } from 'vue'
import { Select, Switch, TabButtons } from '../../src'
import FileInput from './FileInput.vue'
import FileInputArea from './FileInputArea.vue'
import FileImportArea from './FileImportArea.vue'
import type { FileInputSize, FileInputVariant } from './FileInput.vue'

// `?variant=subtle&size=lg&error&disabled&preview` opens the page on that
// combination
const q = new URLSearchParams(window.location.search)
const pick = <T extends string>(key: string, allowed: T[], fallback: T): T =>
  allowed.includes(q.get(key) as T) ? (q.get(key) as T) : fallback
type InputType = 'field' | 'area' | 'sources'
const inputType = ref<InputType>(
  pick('type', ['field', 'area', 'sources'], 'field'),
)
const inputTypes = [
  { label: 'File input', value: 'field' },
  { label: 'File input area', value: 'area' },
  // the area's other version: a CSV from the device, the library or a link
  // (node 35856:51955); the user named it
  { label: 'CSV files', value: 'sources' },
]
const orientation = ref<'vertical' | 'horizontal'>(
  pick('orientation', ['vertical', 'horizontal'], 'vertical'),
)
// coming back to the field, it starts at its default size, sm
watch(inputType, (type) => {
  if (type === 'field') size.value = 'sm'
})
const orientationTabs = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
]
const variant = ref<FileInputVariant>(
  pick('variant', ['outline', 'subtle'], 'outline'),
)
const size = ref<FileInputSize>(pick('size', ['xs', 'sm', 'md', 'lg'], 'sm'))
const preview = ref(q.has('preview'))
const error = ref(q.has('error'))
const disabled = ref(q.has('disabled') && !error.value)
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
  <div class="flex h-full items-center justify-center px-5 py-10">
    <div class="flex items-start gap-10">
      <!-- one box for both input types, so switching between them moves
           nothing: the controller stays put, the field and the area share a
           left edge, 272 in (where the field sits after the preview card);
           the area's top is the controller's, the field sits at the foot of
           its 140 row as before. The box is tall enough for the field's row
           and the area with four files under it -->
      <div class="h-[612px] w-[700px]">
        <!-- the multi-source area is the box's full 700 width, at its top -->
        <FileImportArea
          v-if="inputType === 'sources'"
          v-model:error="error"
          :disabled="disabled"
        />
        <div v-else-if="inputType === 'area'" class="pl-[272px]">
          <FileInputArea
            v-model:error="error"
            :variant="variant"
            :orientation="orientation"
            :disabled="disabled"
          />
        </div>
        <div
          v-else
          class="flex h-[140px] w-[700px] items-end"
          :class="!preview && 'pl-[272px]'"
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
      </div>
      <!-- the controller, as the tree's: 274 wide, 16 inside, radius 16; its rows 12 apart (the user found 8 cramped with tabs and selects in them) -->
      <div
        class="flex w-[274px] shrink-0 flex-col gap-3 rounded-7 border border-outline-gray-1 bg-surface-elevation-2 px-4 pb-[13px] pt-4"
      >
        <p class="text-lg-semibold leading-[1.15] text-ink-gray-9">
          Preview control
        </p>
        <div class="flex flex-col gap-3">
          <div class="flex h-7 items-center justify-between">
            <span class="text-base text-ink-gray-7">Input type</span>
            <Select
              v-model="inputType"
              :options="inputTypes"
              size="sm"
              variant="subtle"
              class="w-[140px]"
              aria-label="Input type"
            />
          </div>
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
      </div>
    </div>
  </div>
</template>
