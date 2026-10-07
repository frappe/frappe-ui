<script setup lang="ts">
// The file input area with sources (node 35856:51955 — the "Import Deals"
// screens; this is the 700x300 area in them). A file comes from the
// device, the library, or a link.
//
//   area        700x300, radius 12, a 1px dashed outline-gray-3 line (4 on,
//               4 off, pixel-checked); surface-gray-1 while it waits, white
//               in the link and library views
//   default     centred: the 24px cloud-upload glyph in ink-gray-6, 10, and
//               "Drag and drop a CSV file, or upload from your Device,
//               Library or a Link." at 14/21 ink-gray-7, 284 wide — the
//               three sources semibold (tracked 0.015em), underlined under
//               the pointer, each a way in
//   uploading   a white card, 320 wide, radius 10, the base shadow, 10
//               inside: the name at 14 medium ink-gray-8, 2, "0.4 KB of
//               10.2 KB" at 14 ink-gray-6, the 16px close glyph in
//               ink-gray-5 at the right; 10 under, a md (4px) Progress
//   uploaded    the card in a 320 tray — surface-gray-2, radius 14, a 1px
//               outline-gray-1 line, 4 inside (8 at the foot), 10 apart —
//               its size where the progress was, the red bin (ink-red-5) in
//               place of the close; under it "Rows found" / "Column found"
//               (14 ink-gray-6) over their counts (16 medium ink-gray-7),
//               8 in, 16 apart with a 1px outline-gray-1 rule between
//   link        "‹ Link" 16 in from the top-left (back to the start); a md
//               outline TextInput 400 wide with the link glyph, its
//               placeholder in ink-gray-5, and 6 under it a note at 14
//               ink-gray-5; once there is a link, a solid md "Add link"
//               Button 8 to its right, the pair centred
//   library     "‹ Library"; 14 under, a sm outline search 668 wide; 16
//               under, the folders as full-width sm ghost Buttons — Home 8
//               in, a folder 24, its files 52 — hover surface-gray-2
//
// Error (none in the file — proposed, in the language of the file input
// area's failed card): the card in a 1px outline-red-5 line, no shadow,
// "Something went wrong" at 13 ink-red-6 under the name (the area card's
// longer line doesn't fit the file's 320 beside the button), and
// a sm red subtle "Try again" Button at the right, which uploads it again.
//
// There is no server here: a file "uploads" over a couple of seconds; a
// CSV from the device is read for its real row and column counts, the rest
// show the design's 239 and 18.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Button, Progress, TextInput } from '../../src'
import FileInputIcon from './FileInputIcon.vue'

const props = withDefaults(
  defineProps<{ disabled?: boolean; error?: boolean }>(),
  { disabled: false, error: false },
)
const emit = defineEmits<{ 'update:error': [value: boolean] }>()

type View = 'start' | 'link' | 'library' | 'uploading' | 'uploaded' | 'error'
const view = ref<View>('start')
const file = ref<{ name: string; size: number; rows: number; cols: number }>({
  name: '',
  size: 0,
  rows: 0,
  cols: 0,
})
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
const stop = () => {
  if (timer) clearInterval(timer)
  timer = null
}
onBeforeUnmount(stop)

function upload(name: string, size: number, rows = 239, cols = 18) {
  stop()
  file.value = { name, size, rows, cols }
  progress.value = 0
  view.value = 'uploading'
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 4)
    if (progress.value >= 100) {
      stop()
      view.value = 'uploaded'
    }
  }, 96)
}
/** The Error switch: the file's own failed upload, or back to the start. */
watch(
  () => props.error,
  (on) => {
    if (on) {
      stop()
      file.value = {
        name: 'Email template.CSV',
        size: 10.2 * 1024,
        rows: 239,
        cols: 18,
      }
      view.value = 'error'
    } else if (view.value === 'error') view.value = 'start'
  },
  { immediate: true },
)
function retry() {
  emit('update:error', false)
  upload(file.value.name, file.value.size, file.value.rows, file.value.cols)
}
function reset() {
  if (view.value === 'error') emit('update:error', false)
  stop()
  view.value = 'start'
  link.value = ''
  query.value = ''
}

/** A CSV from the device: counted for real. */
async function take(f: File) {
  let rows = 239
  let cols = 18
  if (/\.csv$/i.test(f.name) || f.type === 'text/csv') {
    const text = await f.text()
    const lines = text.split(/\r?\n/).filter((l) => l.trim())
    rows = Math.max(0, lines.length - 1)
    cols = lines[0] ? lines[0].split(',').length : 0
  }
  upload(f.name, f.size, rows, cols)
}

const picker = ref<HTMLInputElement | null>(null)
function fromDevice() {
  if (!props.disabled) picker.value?.click()
}
function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) take(input.files[0])
  input.value = ''
}
const dragging = ref(false)
function onDrop(e: DragEvent) {
  dragging.value = false
  if (props.disabled || view.value !== 'start') return
  const f = e.dataTransfer?.files?.[0]
  if (f) take(f)
}

function kb(n: number) {
  return `${(n / 1024).toFixed(1)} KB`
}
const sizeLine = computed(() =>
  view.value === 'uploading'
    ? `${kb((file.value.size * progress.value) / 100)} of ${kb(file.value.size)}`
    : `${Math.round(file.value.size / 1024)}kb`,
)

// ---- link
const link = ref('')
function addLink() {
  const url = link.value.trim()
  if (!url) return
  let name = url
  try {
    const u = new URL(url)
    name = u.hostname.includes('docs.google.com')
      ? 'Google sheet.csv'
      : u.pathname.split('/').filter(Boolean).pop() || u.hostname
  } catch {
    /* not a URL: its text names the file */
  }
  upload(name, 10.2 * 1024)
}

// ---- library: the design's folders, and a search over the files
type Entry = { name: string; files: string[] }
const folders: Entry[] = [
  {
    name: 'My Folder',
    files: ['Item Price.xlsx', 'Companies.csv', 'Untitled.csv'],
  },
  { name: 'Reports', files: ['Deals Q3.csv', 'Leads.csv'] },
]
const open = ref<string[]>(['My Folder'])
const query = ref('')
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return folders
  return folders
    .map((f) => ({
      ...f,
      files: f.files.filter((n) => n.toLowerCase().includes(q)),
    }))
    .filter((f) => f.files.length)
})
function toggle(name: string) {
  open.value = open.value.includes(name)
    ? open.value.filter((n) => n !== name)
    : [...open.value, name]
}
const isOpen = (name: string) =>
  !!query.value.trim() || open.value.includes(name)
</script>

<template>
  <div
    class="fima relative h-[300px] w-[700px] overflow-hidden rounded-6"
    :class="[
      view === 'link' || view === 'library'
        ? 'bg-surface-base'
        : 'bg-surface-gray-1',
      disabled && 'pointer-events-none opacity-50',
      dragging && 'is-dragging',
    ]"
    @dragenter.prevent="dragging = view === 'start'"
    @dragover.prevent="dragging = view === 'start'"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <input
      ref="picker"
      type="file"
      accept=".csv,.xlsx,.xls,text/csv"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <!-- the dashed line: 1px, 4 on and 4 off -->
    <svg
      class="pointer-events-none absolute inset-0 size-full"
      aria-hidden="true"
    >
      <rect class="fima-line" x="0.5" y="0.5" rx="11.5" ry="11.5" />
    </svg>

    <!-- the start -->
    <div
      v-if="view === 'start'"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2.5 pb-0.5"
    >
      <FileInputIcon name="cloud-upload" class="size-6 text-ink-gray-6" />
      <p class="w-[284px] text-center text-base leading-[21px] text-ink-gray-7">
        Drag and drop a CSV file, or upload from your
        <button type="button" class="fima-source" @click="fromDevice">
          Device</button
        >,
        <button type="button" class="fima-source" @click="view = 'library'">
          Library
        </button>
        or a
        <button type="button" class="fima-source" @click="view = 'link'">
          Link</button
        >.
      </p>
    </div>

    <!-- link and library: a way back, top-left -->
    <button
      v-if="view === 'link' || view === 'library'"
      type="button"
      class="absolute left-4 top-4 z-10 flex items-center gap-2 text-base leading-4 text-ink-gray-7"
      @click="reset"
    >
      <FileInputIcon name="left-chevron" class="size-4 text-ink-gray-6" />
      {{ view === 'link' ? 'Link' : 'Library' }}
    </button>

    <!-- link -->
    <div
      v-if="view === 'link'"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="flex items-start gap-2">
        <div class="flex w-[400px] flex-col gap-1.5">
          <TextInput
            v-model="link"
            size="md"
            variant="outline"
            placeholder="Add web link or Google sheet link"
            class="fima-link"
            aria-label="Link"
            @keydown.enter="addLink"
          >
            <template #prefix>
              <FileInputIcon name="link" class="size-4 text-ink-gray-4" />
            </template>
          </TextInput>
          <p class="text-base leading-4 text-ink-gray-5">
            Make sure the link is publicly accessible to fetch the data.
          </p>
        </div>
        <Button v-if="link.trim()" variant="solid" size="md" @click="addLink">
          Add link
        </Button>
      </div>
    </div>

    <!-- library -->
    <div
      v-if="view === 'library'"
      class="absolute inset-x-4 bottom-4 top-[46px] flex flex-col gap-4"
    >
      <TextInput
        v-model="query"
        size="sm"
        variant="outline"
        placeholder="Search by filename or extension"
        aria-label="Search the library"
      >
        <template #prefix>
          <FileInputIcon name="search" class="size-4 text-ink-gray-6" />
        </template>
      </TextInput>
      <!-- the rows step out 8 either side, so their icons and labels sit on
           the area's 16 line with the search above (their own 8 inside
           would put Home at 24); the hover fill takes that 8 of margin -->
      <div class="fima-tree -mx-2 min-h-0 flex-1 overflow-y-auto">
        <Button
          variant="ghost"
          size="sm"
          class="fima-row"
          style="padding-left: 8px"
        >
          <template #prefix>
            <FileInputIcon name="home" class="size-4" />
          </template>
          Home
        </Button>
        <template v-for="f in shown" :key="f.name">
          <Button
            variant="ghost"
            size="sm"
            class="fima-row"
            style="padding-left: 24px"
            :aria-expanded="isOpen(f.name)"
            @click="toggle(f.name)"
          >
            <template #prefix>
              <FileInputIcon name="folder" class="size-4" />
            </template>
            {{ f.name }}
          </Button>
          <template v-if="isOpen(f.name)">
            <Button
              v-for="n in f.files"
              :key="n"
              variant="ghost"
              size="sm"
              class="fima-row"
              style="padding-left: 52px"
              @click="upload(n, 10.2 * 1024)"
            >
              <template #prefix>
                <FileInputIcon name="lib-file" class="size-4" />
              </template>
              {{ n }}
            </Button>
          </template>
        </template>
      </div>
    </div>

    <!-- uploading -->
    <div
      v-if="view === 'uploading'"
      class="absolute left-[190px] top-[98px] flex w-[320px] flex-col gap-2.5 rounded-5 bg-surface-elevation-1 p-2.5 shadow"
    >
      <div class="flex gap-3">
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <p
            class="truncate text-base font-medium leading-[16.1px] text-ink-gray-8"
          >
            {{ file.name }}
          </p>
          <p class="text-base leading-[21px] text-ink-gray-6">
            {{ sizeLine }}
          </p>
        </div>
        <button
          type="button"
          class="size-4 shrink-0 text-ink-gray-5"
          aria-label="Cancel upload"
          @click="reset"
        >
          <FileInputIcon name="close" class="size-4" />
        </button>
      </div>
      <Progress :value="progress" size="md" />
    </div>

    <!-- error (proposed): the card in red, the reason, and a way to retry -->
    <div
      v-if="view === 'error'"
      data-slot="error"
      class="absolute left-[190px] top-[113.5px] flex w-[320px] items-start gap-3 rounded-5 border border-outline-red-5 bg-surface-elevation-1 p-[9px]"
    >
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <p
          class="truncate text-base font-medium leading-[16.1px] text-ink-gray-8"
        >
          {{ file.name }}
        </p>
        <p class="truncate text-sm leading-[21px] text-ink-red-6">
          Something went wrong
        </p>
      </div>
      <Button size="sm" variant="subtle" theme="red" @click="retry">
        Try again
      </Button>
    </div>

    <!-- uploaded -->
    <div
      v-if="view === 'uploaded'"
      class="absolute left-[190px] top-[92px] flex w-[320px] flex-col gap-2.5 rounded-[14px] border border-outline-gray-1 bg-surface-gray-2 px-[3px] pb-[7px] pt-[3px]"
    >
      <div class="flex gap-3 rounded-5 bg-surface-elevation-1 p-2.5 shadow">
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <p
            class="truncate text-base font-medium leading-[16.1px] text-ink-gray-8"
          >
            {{ file.name }}
          </p>
          <p class="text-base leading-[21px] text-ink-gray-6">
            {{ sizeLine }}
          </p>
        </div>
        <button
          type="button"
          class="size-4 shrink-0 text-ink-red-5"
          aria-label="Remove file"
          @click="reset"
        >
          <FileInputIcon name="delete" class="size-4" />
        </button>
      </div>
      <div class="flex items-stretch gap-4 px-2">
        <div class="flex flex-1 flex-col gap-0.5">
          <span class="text-base leading-[16.1px] text-ink-gray-6"
            >Rows found</span
          >
          <span class="text-lg font-medium leading-[18.4px] text-ink-gray-7">{{
            file.rows
          }}</span>
        </div>
        <span class="w-px bg-outline-gray-1" aria-hidden="true" />
        <div class="flex flex-1 flex-col gap-0.5">
          <span class="text-base leading-[16.1px] text-ink-gray-6"
            >Column found</span
          >
          <span class="text-lg font-medium leading-[18.4px] text-ink-gray-7">{{
            file.cols
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fima-line {
  width: calc(100% - 1px);
  height: calc(100% - 1px);
  fill: none;
  stroke: var(--outline-gray-3);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}
.fima.is-dragging .fima-line {
  stroke: var(--outline-gray-4);
}
/* the three ways in: semibold, underlined under the pointer */
.fima-source {
  font-weight: 600;
  letter-spacing: 0.015em;
  text-underline-offset: 2px;
}
.fima-source:hover,
.fima-source:focus-visible {
  text-decoration: underline;
}
/* the link field's placeholder is the file's ink-gray-5; a long link ends
   in an ellipsis, as the file's does */
.fima-link :deep([data-slot='control']::placeholder) {
  color: var(--ink-gray-5);
}
.fima-link :deep([data-slot='control']) {
  text-overflow: ellipsis;
}
/* the library's rows: full-width ghost Buttons, left-aligned, 28 tall,
   the label in ink-gray-7 */
.fima-tree :deep(.fima-row) {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  color: var(--ink-gray-7);
}
.fima-tree :deep(.fima-row:hover) {
  background: var(--surface-gray-2);
}
</style>
