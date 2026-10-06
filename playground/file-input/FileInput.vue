<script setup lang="ts">
// The file input (node 29788:20146), built from frappe-ui's own parts: a
// read-only `TextInput` is the field — its placeholder "Choose file or drag
// here", its sizes, radii, side paddings and its hover / focus looks are
// the file's — with the file's Browse in the suffix slot: on the outline
// variant a 1px outline-gray-2 rule the field's full height and the word
// in ink-gray-7, padded by the size's own side padding (8 / 8 / 10 / 12);
// on the subtle variant a white Button with the sm shadow, inset 2 (4 on
// lg) and one step smaller than the field (20 / 24 / 28 / 32 tall). A
// chosen file puts the 16px image glyph before its name, 6 apart; while it
// uploads a 16px ink-gray-5 Spinner stands on the Browse (which keeps its
// room); an error turns the outline outline-red-3 (the file's #fdc2c2), or
// the subtle fill surface-red-1; disabled is
// the whole thing at half opacity. The field is 280 wide, as the file draws
// every one of its 64.
//
// With a preview (the file's 700x140 cell) a 260x140 card stands before the
// field, 12 apart: a 1px outline-gray-1 line, radius 8, the 24px image-add
// glyph in ink-gray-4 while empty; "Uploading" at 13 over a 150-wide sm
// Progress while the file goes up; the picture itself, covering the card,
// once it is there, with a 24px subtle close Button 4 in from its top-right
// corner. A description is 14/21 ink-gray-6 above the field, the field
// pinned to the cell's foot.
//
// There is no server here: a chosen file "uploads" over a couple of
// seconds and is then shown. `state` pins a look for review — the file's
// interaction column — else the field follows the pointer and the file.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Button, Progress, Spinner, TextInput } from '../../src'
import FileInputIcon from './FileInputIcon.vue'

export type FileInputVariant = 'outline' | 'subtle'
export type FileInputSize = 'xs' | 'sm' | 'md' | 'lg'
export type FileInputState =
  | 'auto'
  | 'hover'
  | 'active'
  | 'focus'
  | 'filled'
  | 'disabled'
  | 'loading'
  | 'error'

const props = withDefaults(
  defineProps<{
    variant?: FileInputVariant
    size?: FileInputSize
    preview?: boolean
    description?: string
    state?: FileInputState
  }>(),
  {
    variant: 'outline',
    size: 'sm',
    preview: false,
    description: '',
    state: 'auto',
  },
)

type Phase = 'empty' | 'loading' | 'filled' | 'error'
const phase = ref<Phase>('empty')
const progress = ref(0)
const fileName = ref('')
const imageUrl = ref('')
const dragging = ref(false)

/** The file's own sample, for the pinned looks that need a file. */
const SAMPLE_NAME = 'Course_image.jpg'
const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 140"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9d4cc"/><stop offset="1" stop-color="#8c8780"/></linearGradient></defs><rect width="260" height="140" fill="url(#g)"/><circle cx="196" cy="42" r="18" fill="#f3efe8" opacity=".9"/><path d="M0 140 L70 78 L120 118 L165 92 L260 140 Z" fill="#5e5953"/></svg>`,
  )

/** What is shown: the pinned state, else where the file is. */
const shown = computed<Exclude<FileInputState, 'auto'> | 'default'>(() => {
  if (props.state !== 'auto') return props.state
  if (phase.value === 'loading') return 'loading'
  if (phase.value === 'filled') return 'filled'
  if (phase.value === 'error') return 'error'
  return dragging.value ? 'active' : 'default'
})
const hasFile = computed(() =>
  ['filled', 'loading', 'error'].includes(shown.value),
)
const shownName = computed(() =>
  hasFile.value ? fileName.value || SAMPLE_NAME : '',
)
const shownImage = computed(() =>
  shown.value === 'filled' ? imageUrl.value || SAMPLE_IMAGE : '',
)
const disabled = computed(() => shown.value === 'disabled')

let timer: ReturnType<typeof setInterval> | null = null
function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}
function take(file: File) {
  stopTimer()
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  fileName.value = file.name
  imageUrl.value = file.type.startsWith('image/')
    ? URL.createObjectURL(file)
    : ''
  phase.value = 'loading'
  progress.value = 0
  // the pretend upload: ~2.4s to the top, then the file is shown
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 4)
    if (progress.value >= 100) {
      stopTimer()
      phase.value = 'filled'
    }
  }, 96)
}
function clear() {
  stopTimer()
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  fileName.value = ''
  imageUrl.value = ''
  phase.value = 'empty'
  progress.value = 0
}
onBeforeUnmount(() => {
  stopTimer()
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})

const picker = ref<HTMLInputElement | null>(null)
function open() {
  if (disabled.value || props.state !== 'auto') return
  picker.value?.click()
}
function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) take(file)
  input.value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  if (disabled.value || props.state !== 'auto') return
  const file = e.dataTransfer?.files?.[0]
  if (file) take(file)
}

/** The Button one step under the field: 20 / 24 / 28 / 32 tall. */
const buttonSize = computed(
  () =>
    ({ xs: 'xs', sm: 'xs', md: 'sm', lg: 'md' })[props.size] as
      | 'xs'
      | 'sm'
      | 'md',
)

// the field's right padding clears whatever the suffix measures
const suffixEl = ref<HTMLElement | null>(null)
const suffixWidth = ref(0)
let observer: ResizeObserver | null = null
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    suffixWidth.value = Math.ceil(entry.contentRect.width)
  })
  if (suffixEl.value) observer.observe(suffixEl.value)
})
watch(suffixEl, (el, old) => {
  if (old) observer?.unobserve(old)
  if (el) observer?.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())

const progressValue = computed(() =>
  props.state === 'loading' ? 13 : progress.value,
)
</script>

<template>
  <div
    class="file-input flex items-stretch gap-3"
    :class="[
      `is-${variant}`,
      `is-${size}`,
      `is-${shown}`,
      preview && 'has-preview',
      disabled && 'is-disabled',
    ]"
    :style="{ '--suffix-w': `${suffixWidth}px` }"
  >
    <input
      ref="picker"
      type="file"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <!-- the preview card -->
    <div
      v-if="preview"
      data-slot="preview"
      class="relative h-[140px] w-[260px] shrink-0 overflow-hidden rounded-4 border border-outline-gray-1 bg-surface-elevation-1"
    >
      <template v-if="shown === 'filled' || (shown === 'error' && shownImage)">
        <img :src="shownImage" alt="" class="size-full object-cover" />
        <Button
          size="xs"
          variant="subtle"
          class="absolute right-[3px] top-[3px]"
          aria-label="Remove file"
          :disabled="disabled"
          @click="clear"
        >
          <template #icon>
            <FileInputIcon name="close" class="size-4 text-ink-gray-7" />
          </template>
        </Button>
      </template>
      <div
        v-else-if="shown === 'loading'"
        class="flex h-full flex-col items-center justify-center gap-2"
      >
        <span class="text-sm text-ink-gray-6">Uploading</span>
        <Progress :value="progressValue" size="sm" class="!w-[150px]" />
      </div>
      <FileInputIcon
        v-else
        name="image-add"
        class="absolute inset-0 m-auto size-6 text-ink-gray-4"
      />
    </div>

    <div
      class="flex min-w-0 flex-col justify-between gap-2"
      :class="preview ? 'flex-1' : 'w-[280px]'"
    >
      <p
        v-if="description"
        data-slot="description"
        class="text-base leading-[1.5] text-ink-gray-6"
      >
        {{ description }}
      </p>
      <!-- the field: the library's TextInput, read-only, opened by a click,
           Enter or Space, or by dropping a file on it -->
      <div
        data-slot="field"
        :class="dragging && 'is-dragging'"
        @dragenter.prevent="dragging = true"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      >
        <TextInput
          :size="size"
          :variant="variant"
          :model-value="shownName"
          placeholder="Choose file or drag here"
          readonly
          :aria-disabled="disabled || undefined"
          :tabindex="disabled ? -1 : 0"
          @click="open"
          @keydown.enter.prevent="open"
          @keydown.space.prevent="open"
        >
          <template v-if="hasFile" #prefix>
            <FileInputIcon name="image" class="size-4 text-ink-gray-7" />
          </template>
          <template #suffix>
            <span
              ref="suffixEl"
              data-slot="browse"
              class="flex h-full items-center"
            >
              <template v-if="variant === 'outline'">
                <span
                  class="relative flex h-full items-center border-l border-outline-gray-2 text-ink-gray-7"
                  :class="
                    size === 'lg'
                      ? 'px-3 text-lg'
                      : size === 'md'
                        ? 'px-2.5 text-base'
                        : 'px-2 text-base'
                  "
                >
                  <!-- the word keeps its room while a spinner stands in for it -->
                  <span :class="shown === 'loading' && 'invisible'"
                    >Browse</span
                  >
                  <Spinner
                    v-if="shown === 'loading'"
                    size="md"
                    class="absolute inset-0 m-auto text-ink-gray-5"
                  />
                </span>
              </template>
              <Button
                v-else
                :size="buttonSize"
                variant="outline"
                class="relative !border-0 !text-ink-gray-7 shadow-sm"
                :class="size === 'xs' && '!h-5'"
                tabindex="-1"
                @click.stop="open"
              >
                <span :class="shown === 'loading' && 'invisible'">Browse</span>
                <Spinner
                  v-if="shown === 'loading'"
                  size="md"
                  class="absolute inset-0 m-auto text-ink-gray-5"
                />
              </Button>
            </span>
          </template>
        </TextInput>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* the field's value in the file's ink-gray-7, and room for the suffix */
.file-input :deep([data-slot='control']) {
  color: var(--ink-gray-7);
  padding-inline-end: var(--suffix-w);
  cursor: pointer;
}
.file-input.is-xs :deep([data-slot='control']) {
  /* the file's xs is 8 in and 14 tall, like sm */
  padding-inline-start: 8px;
  font-size: 14px;
}
/* a file's name sits 6 after its glyph (the library leaves 8) */
.file-input.is-xs :deep([data-slot='control']:not(:placeholder-shown)),
.file-input.is-sm :deep([data-slot='control']:not(:placeholder-shown)) {
  padding-inline-start: 30px;
}
.file-input.is-md :deep([data-slot='control']:not(:placeholder-shown)) {
  padding-inline-start: 32px;
}
.file-input.is-lg :deep([data-slot='control']:not(:placeholder-shown)) {
  padding-inline-start: 34px;
}
/* the suffix slot's wrapper: no padding of its own on the outline (the
   rule meets the field's edge), the file's 2 (4 on lg) on the subtle */
.file-input :deep([data-slot='control'] ~ div) {
  padding-inline-end: 0;
}
.file-input.is-subtle :deep([data-slot='control'] ~ div) {
  padding-inline-end: 2px;
}
.file-input.is-subtle.is-lg :deep([data-slot='control'] ~ div) {
  padding-inline-end: 4px;
}
.file-input :deep([data-slot='browse']) {
  color: var(--ink-gray-7);
}

/* the pinned looks, and a file held over the field: the library's own
   hover / focus declarations, forced */
.file-input.is-outline.is-hover :deep([data-slot='control']) {
  border-color: var(--outline-gray-3);
  box-shadow: var(--elevation-sm);
}
.file-input.is-subtle.is-hover :deep([data-slot='control']) {
  background: var(--surface-gray-3);
  border-color: var(--surface-gray-3);
}
.file-input.is-active :deep([data-slot='control']),
.file-input.is-focus :deep([data-slot='control']),
.file-input .is-dragging :deep([data-slot='control']) {
  background: var(--surface-base);
  border-color: var(--outline-gray-4);
  box-shadow: var(--elevation-sm);
}
/* error: the outline in red, or the subtle fill */
.file-input.is-outline.is-error :deep([data-slot='control']) {
  border-color: var(--outline-red-3);
}
.file-input.is-subtle.is-error :deep([data-slot='control']) {
  background: var(--surface-red-1);
  border-color: var(--surface-red-1);
}
/* disabled: the whole thing at half, nothing under the pointer */
.file-input.is-disabled {
  opacity: 0.5;
}
.file-input.is-disabled :deep([data-slot='control']),
.file-input.is-disabled :deep([data-slot='browse']) {
  pointer-events: none;
}
/* while uploading, Browse is a spinner; in the cell the word stays, greyed */
.file-input.has-preview.is-loading :deep([data-slot='browse']) {
  color: var(--ink-gray-4);
}
</style>
