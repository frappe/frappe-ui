<script setup lang="ts">
// The file input area (node 35825:65914): a drop area 400 wide, radius 16,
// a 1px dashed outline-gray-2 line (2 on, 2 off), 24 inside. In it, centred:
// the 24px upload glyph in ink-gray-7, 12, the title "Drag files here or
// click to browse" at 14/21 medium ink-gray-7 (tracked 0.035em — the
// file's title runs 224.5 wide where the library's 0.02em gives 218, at the
// same cap height), 4, the note at 14/21
// ink-gray-6; on the outline variant 16 more and a sm subtle "Select file"
// Button. Outline: no fill, the line outline-gray-3 on hover. Subtle: no
// button, surface-gray-1, surface-gray-2 on hover. The area is 174 tall
// either way, its contents centred in it — the file draws the horizontal
// one 200, but the user wanted switching orientation to keep its size.
//
// Files, two ways (`orientation`):
//   vertical    a card per file, 400 wide, 16 under the area and 12 apart —
//               white, radius 12, the sm shadow, 14 inside: the 30x40 file
//               glyph, 14, the name at 14/16 medium ink-gray-7 (tracked
//               0.035em, like the title), 4, "1.5 MB • 100%" at 13/20
//               (ink-gray-7, 5, a 4px gray-3 dot, 5, ink-green-7), the 16px
//               close glyph at the right. While a file goes up its card sits
//               inside the area, 34 under the title, the Select file button
//               gone, a 4px Progress across the card's body, 8 under it.
//   horizontal  60x60 thumbnails, radius 10, 8 apart, 6 under the area; a
//               14px white badge with the 10px close glyph 4 over the top,
//               2 past the right; one going up wears a 63% black veil with a
//               12px spinner.
// An error (vertical, the file's): the card in a 1px outline-red-5 line, no
// shadow, the note "Something went wrong" at 13 ink-red-6 and a
// sm red subtle "Try again" Button. Horizontal has no error in the file —
// this one is proposed for review: the tile on surface-red-1 in the same
// red line, the design's reload glyph in its middle (it retries), and a
// line of ink-red-6 text under the row naming the file.
//
// There is no server here: picked or dropped files "upload" over a couple
// of seconds each. Disabled is the default look at half opacity.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, Progress, Spinner } from '../../src'
import FileInputIcon from './FileInputIcon.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'outline' | 'subtle'
    orientation?: 'vertical' | 'horizontal'
    error?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'outline',
    orientation: 'vertical',
    error: false,
    disabled: false,
  },
)
const emit = defineEmits<{ 'update:error': [value: boolean] }>()

type Item = {
  id: number
  name: string
  size: number
  url: string
  progress: number
  status: 'loading' | 'done' | 'error'
}
const items = ref<Item[]>([])
let nextId = 1
const timers = new Map<number, ReturnType<typeof setInterval>>()

function upload(item: Item) {
  item.status = 'loading'
  item.progress = 0
  clearInterval(timers.get(item.id))
  timers.set(
    item.id,
    setInterval(() => {
      const live = items.value.find((i) => i.id === item.id)
      if (!live) return clearInterval(timers.get(item.id))
      live.progress = Math.min(100, live.progress + 4)
      if (live.progress >= 100) {
        clearInterval(timers.get(item.id))
        timers.delete(item.id)
        live.status = 'done'
      }
    }, 96),
  )
}
function add(files: FileList | File[]) {
  for (const file of Array.from(files)) {
    const item: Item = {
      id: nextId++,
      name: file.name,
      size: file.size,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      progress: 0,
      status: 'loading',
    }
    items.value.push(item)
    upload(items.value[items.value.length - 1])
  }
}
function remove(item: Item) {
  clearInterval(timers.get(item.id))
  timers.delete(item.id)
  if (item.url) URL.revokeObjectURL(item.url)
  items.value = items.value.filter((i) => i.id !== item.id)
  if (item.status === 'error') emit('update:error', false)
}
function retry(item: Item) {
  emit('update:error', false)
  upload(item)
}
onBeforeUnmount(() => {
  timers.forEach((t) => clearInterval(t))
  items.value.forEach((i) => i.url && URL.revokeObjectURL(i.url))
})

/** The Error switch: the file's own failed upload, in or out of the list. */
const FAILED = 'Final_screens.zip'
watch(
  () => props.error,
  (on) => {
    const failed = items.value.find((i) => i.status === 'error')
    if (on && !failed)
      items.value.push({
        id: nextId++,
        name: FAILED,
        size: 1.5 * 1024 * 1024,
        url: '',
        progress: 0,
        status: 'error',
      })
    if (!on && failed) items.value = items.value.filter((i) => i !== failed)
  },
  { immediate: true },
)

const uploading = computed(() =>
  items.value.filter((i) => i.status === 'loading'),
)
const listed = computed(() =>
  props.orientation === 'vertical'
    ? items.value.filter((i) => i.status !== 'loading')
    : items.value,
)
const failed = computed(() => items.value.find((i) => i.status === 'error'))
/** Vertical uploads show inside the area, in place of the button. */
const inArea = computed(() =>
  props.orientation === 'vertical' ? uploading.value : [],
)

function bytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
/** The design's glyphs carry PNG and ZIP; other types get the blank page
 * with their extension set on it in the same place. */
function glyphFor(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'png' || ext === 'zip')
    return { icon: `filetype-${ext}`, label: '' }
  return { icon: 'filetype-blank', label: ext.slice(0, 4).toUpperCase() }
}

const picker = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
function open() {
  if (!props.disabled) picker.value?.click()
}
function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) add(input.files)
  input.value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  if (!props.disabled && e.dataTransfer?.files?.length)
    add(e.dataTransfer.files)
}
</script>

<template>
  <div
    class="fia w-[400px]"
    :class="[`is-${variant}`, `is-${orientation}`, disabled && 'is-disabled']"
  >
    <input
      ref="picker"
      type="file"
      multiple
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <!-- the area -->
    <div
      data-slot="area"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      class="fia-area relative flex cursor-pointer flex-col items-center justify-center rounded-7 px-6 outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
      :class="[
        dragging && 'is-dragging',
        'min-h-[174px]',
        inArea.length ? 'justify-between py-6' : '',
      ]"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <!-- the dashed line: 1px, 2 on and 2 off, which a CSS border can't set -->
      <svg
        class="pointer-events-none absolute inset-0 size-full"
        aria-hidden="true"
      >
        <rect class="fia-line" x="0.5" y="0.5" rx="15.5" ry="15.5" />
      </svg>
      <div class="flex w-full flex-col items-center gap-4">
        <div class="flex w-full flex-col items-center gap-3">
          <FileInputIcon name="upload" class="size-6 text-ink-gray-7" />
          <div class="flex flex-col items-center gap-1 text-center">
            <p
              class="text-base font-medium leading-[21px] tracking-[0.035em] text-ink-gray-7"
            >
              Drag files here or click to browse
            </p>
            <p class="text-base leading-[21px] text-ink-gray-6">
              Supports JPEG, PNG, PDF, and MP4 up to 5 MB.
            </p>
          </div>
        </div>
        <Button
          v-if="variant === 'outline' && !inArea.length"
          size="sm"
          variant="subtle"
          class="!text-ink-gray-7"
          tabindex="-1"
          @click.stop="open"
        >
          Select file
        </Button>
      </div>
      <!-- a vertical upload in progress, in the area -->
      <div v-if="inArea.length" class="mt-[34px] flex w-full flex-col gap-3">
        <div
          v-for="item in inArea"
          :key="item.id"
          data-slot="file"
          class="flex w-full cursor-default gap-3.5 rounded-6 bg-surface-elevation-1 p-3.5 shadow-sm"
          @click.stop
        >
          <span class="fia-glyph">
            <FileInputIcon
              :name="glyphFor(item.name).icon"
              class="fia-glyph-art"
            />
            <span v-if="glyphFor(item.name).label" class="fia-glyph-label">{{
              glyphFor(item.name).label
            }}</span>
          </span>
          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex gap-2">
              <div class="flex min-w-0 flex-1 flex-col gap-1">
                <p
                  class="truncate text-base font-medium leading-[16px] tracking-[0.035em] text-ink-gray-7"
                >
                  {{ item.name }}
                </p>
                <p class="flex items-center gap-[5px] text-sm leading-[20px]">
                  <span class="text-ink-gray-7">{{ bytes(item.size) }}</span>
                  <span class="size-1 rounded-full bg-surface-gray-5" />
                  <span class="text-ink-green-7">{{ item.progress }}%</span>
                </p>
              </div>
              <button
                type="button"
                class="size-4 shrink-0 text-ink-gray-7"
                aria-label="Cancel upload"
                @click="remove(item)"
              >
                <FileInputIcon name="close" class="size-4" />
              </button>
            </div>
            <Progress
              :value="item.progress"
              size="md"
              class="mt-2 !w-[calc(100%-24px)]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- vertical: a card per file under the area -->
    <div
      v-if="orientation === 'vertical' && listed.length"
      class="mt-4 flex flex-col gap-3"
    >
      <div
        v-for="item in listed"
        :key="item.id"
        data-slot="file"
        class="flex h-[68px] w-full items-start gap-3.5 rounded-6 bg-surface-elevation-1 p-3.5"
        :class="
          item.status === 'error'
            ? 'border border-outline-red-5 !p-[13px]'
            : 'shadow-sm'
        "
      >
        <span class="fia-glyph">
          <FileInputIcon
            :name="glyphFor(item.name).icon"
            class="fia-glyph-art"
          />
          <span v-if="glyphFor(item.name).label" class="fia-glyph-label">{{
            glyphFor(item.name).label
          }}</span>
        </span>
        <div class="flex min-w-0 flex-1 gap-2">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p
              class="truncate text-base font-medium leading-[16px] tracking-[0.035em] text-ink-gray-7"
            >
              {{ item.name }}
            </p>
            <p
              v-if="item.status === 'error'"
              class="truncate text-sm leading-[20px] text-ink-red-6"
            >
              Something went wrong
            </p>
            <p
              v-else
              class="flex items-center gap-[5px] text-sm leading-[20px]"
            >
              <span class="text-ink-gray-7">{{ bytes(item.size) }}</span>
              <span class="size-1 rounded-full bg-surface-gray-5" />
              <span class="text-ink-green-7">100%</span>
            </p>
          </div>
          <Button
            v-if="item.status === 'error'"
            size="sm"
            variant="subtle"
            theme="red"
            class="shrink-0"
            @click="retry(item)"
          >
            Try again
          </Button>
          <button
            v-else
            type="button"
            class="size-4 shrink-0 text-ink-gray-7"
            aria-label="Remove file"
            @click="remove(item)"
          >
            <FileInputIcon name="close" class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- horizontal: thumbnails under the area -->
    <div v-if="orientation === 'horizontal' && listed.length" class="mt-1.5">
      <div class="flex flex-wrap gap-2 pt-1">
        <div
          v-for="item in listed"
          :key="item.id"
          data-slot="thumb"
          class="relative size-[60px] shrink-0"
        >
          <div
            class="relative size-full overflow-hidden rounded-[10px]"
            :class="
              item.status === 'error'
                ? 'border border-outline-red-5 bg-surface-red-1'
                : 'bg-surface-gray-1'
            "
          >
            <img
              v-if="item.url && item.status !== 'error'"
              :src="item.url"
              alt=""
              class="size-full object-cover"
            />
            <span
              v-else-if="item.status !== 'error'"
              class="fia-glyph absolute inset-0 m-auto"
            >
              <FileInputIcon
                :name="glyphFor(item.name).icon"
                class="fia-glyph-art"
              />
              <span v-if="glyphFor(item.name).label" class="fia-glyph-label">{{
                glyphFor(item.name).label
              }}</span>
            </span>
            <!-- proposed: a failed upload retries from its tile -->
            <button
              v-if="item.status === 'error'"
              type="button"
              class="absolute inset-0 flex items-center justify-center text-ink-red-6"
              :aria-label="`Retry ${item.name}`"
              :title="`${item.name} — try again`"
              @click="retry(item)"
            >
              <FileInputIcon name="reload" class="size-4" />
            </button>
            <!-- going up: the file's veil and spinner -->
            <div
              v-if="item.status === 'loading'"
              class="absolute inset-0 flex items-center justify-center bg-black/[.63]"
            >
              <Spinner size="xs" class="text-ink-gray-3" />
            </div>
          </div>
          <button
            v-if="item.status !== 'loading'"
            type="button"
            data-slot="badge"
            class="absolute -right-0.5 -top-1 flex size-3.5 items-center justify-center rounded-full bg-surface-elevation-1 text-ink-gray-6 shadow-md"
            :aria-label="`Remove ${item.name}`"
            @click="remove(item)"
          >
            <FileInputIcon name="small-close" class="size-2.5" />
          </button>
        </div>
      </div>
      <!-- proposed: what went wrong, under the row -->
      <p
        v-if="failed"
        data-slot="error-note"
        class="mt-1.5 text-sm leading-[1.5] text-ink-red-6"
      >
        {{ failed.name }} couldn't be uploaded. Select it to try again.
      </p>
    </div>
  </div>
</template>

<style scoped>
.fia-line {
  width: calc(100% - 1px);
  height: calc(100% - 1px);
  fill: none;
  stroke: var(--outline-gray-2);
  stroke-width: 1;
  stroke-dasharray: 2 2;
  transition: stroke 75ms;
}
.fia-area {
  transition: background-color 75ms;
}
.fia.is-subtle .fia-area {
  background: var(--surface-gray-1);
}
.fia.is-outline .fia-area:hover .fia-line,
.fia.is-outline .fia-area.is-dragging .fia-line {
  stroke: var(--outline-gray-3);
}
.fia.is-subtle .fia-area:hover,
.fia.is-subtle .fia-area.is-dragging {
  background: var(--surface-gray-2);
}
/* the file glyph: the design's art is 34x44 with its shadow's room; the
   page itself is the slot's 30x40 */
.fia-glyph {
  position: relative;
  display: block;
  width: 30px;
  height: 40px;
  flex-shrink: 0;
}
.fia-glyph :deep(.fia-glyph-art) {
  position: absolute;
  left: -2px;
  top: 0;
  width: 34px;
  height: 44px;
}
.fia-glyph-label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  text-align: center;
  font-size: 6.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgb(0 0 0 / 0.2);
}
.fia.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
