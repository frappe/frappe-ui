<script setup lang="ts">
// Figma: espresso-2.0 › Popover › embed link (30878:37811) — stacked, both
// 380px on the raised popover surface, 12px radius, lg shadow:
//   default  (30878:37810) pt 8 · pb 14, 16px gaps: a 28px tab row (px 16,
//            24px apart, the active tab 14 regular gray-800 and underlined,
//            the rest gray-500, ruled beneath) with a ghost xs × · px 16:
//            the subtle input, its 14 gray-400 placeholder · 16px · a solid
//            md button whose label is regular, not medium · 8px · the
//            13/19.5 gray-600 help line, centred. Upload and Library are
//            live too: a file drop, and the links embedded so far
//   compact  p 4, 4px gap: subtle input with a solid sm "Add embed"
import { computed, ref } from 'vue'
import { Button, TextInput } from '../../../src'

const emit = defineEmits<{ embed: [url: string]; upload: [file: File]; close: [] }>()

type Tab = 'link' | 'upload' | 'library'
const TABS: { value: Tab; label: string }[] = [
  { value: 'link', label: 'Embed link' },
  { value: 'upload', label: 'Upload' },
  { value: 'library', label: 'Library' },
]
const tab = ref<Tab>('link')

interface Embed {
  url: string
  host: string
}
const library = ref<Embed[]>([
  { url: 'https://www.figma.com/design/espresso-2.0', host: 'figma.com' },
  { url: 'https://codepen.io/frappe/pen/ui-kit', host: 'codepen.io' },
])

function parse(raw: string): Embed | null {
  const text = raw.trim()
  if (!text) return null
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
    if (!url.hostname.includes('.')) return null
    return { url: url.href, host: url.hostname.replace(/^www\./, '') }
  } catch {
    return null
  }
}

function add(raw: string) {
  const e = parse(raw)
  if (!e) return false
  library.value = [e, ...library.value.filter((x) => x.url !== e.url)]
  emit('embed', e.url)
  return true
}

// ---- default: embed link
const link = ref('')
const linkError = ref('')
const justEmbedded = ref(false)

function embedLink() {
  if (!add(link.value)) {
    linkError.value = link.value.trim()
      ? 'Paste a full link, like https://figma.com/…'
      : 'Paste a link to embed'
    return
  }
  linkError.value = ''
  link.value = ''
  justEmbedded.value = true
  setTimeout(() => (justEmbedded.value = false), 1400)
}

// ---- default: upload
const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const uploaded = ref<string | null>(null)

function takeFile(file: File | undefined) {
  if (!file) return
  uploaded.value = file.name
  emit('upload', file)
}
function onDrop(e: DragEvent) {
  dragging.value = false
  takeFile(e.dataTransfer?.files?.[0])
}

// ---- compact
const compactLink = ref('https://www.youtube.com/@frappetech')
const compactValid = computed(() => parse(compactLink.value) !== null)
const compactAdded = ref(false)

function addCompact() {
  if (!add(compactLink.value)) return
  compactAdded.value = true
  setTimeout(() => (compactAdded.value = false), 1400)
}
</script>

<template>
  <div class="flex flex-col items-center gap-10">
    <!-- default -->
    <div
      class="flex w-[380px] flex-col gap-4 rounded-6 bg-surface-elevation-2 pb-3.5 pt-2 shadow-lg"
      role="dialog"
      aria-label="Embed"
    >
      <div
        class="flex h-7 items-end justify-between border-b border-outline-gray-1 pl-4 pr-2 dark:border-outline-gray-2"
      >
        <div class="flex h-7 gap-6" role="tablist" aria-label="Embed from">
          <button
            v-for="t in TABS"
            :key="t.value"
            type="button"
            role="tab"
            :aria-selected="tab === t.value"
            class="-mb-px h-7 border-b pb-1.5 text-base transition-colors"
            :class="
              tab === t.value
                ? 'border-current text-ink-gray-8'
                : 'border-transparent text-ink-gray-5 hover:text-ink-gray-7'
            "
            @click="tab = t.value"
          >
            {{ t.label }}
          </button>
        </div>
        <Button variant="ghost" size="xs" label="Close" class="mb-1.5" @click="emit('close')">
          <template #icon><span class="lucide-x size-3.5 text-ink-gray-7" /></template>
        </Button>
      </div>

      <!-- embed link -->
      <form v-if="tab === 'link'" class="flex flex-col gap-4 px-4" @submit.prevent="embedLink">
        <div class="flex flex-col gap-1.5">
          <TextInput
            v-model="link"
            placeholder="Paste in https://"
            aria-label="Link to embed"
            :aria-invalid="!!linkError || undefined"
            @update:model-value="linkError = ''"
          />
          <p v-if="linkError" class="text-sm text-ink-red-5">{{ linkError }}</p>
        </div>
        <div class="flex flex-col gap-2">
          <!-- the file sets the label regular (420); Button md is medium -->
          <Button type="submit" variant="solid" size="md" class="w-full !text-base">
            <template v-if="justEmbedded" #prefix><span class="lucide-check size-4" /></template>
            {{ justEmbedded ? 'Embedded' : 'Embed link' }}
          </Button>
          <p class="text-center text-p-sm text-ink-gray-6">
            Works with links of PDFs, Google Drive, Google Maps, Codepen, Figma, Notion etc.
          </p>
        </div>
      </form>

      <!-- upload -->
      <div v-else-if="tab === 'upload'" class="px-4">
        <button
          type="button"
          class="flex h-[124px] w-full flex-col items-center justify-center gap-2 rounded-5 border border-dashed text-center transition-colors"
          :class="
            dragging
              ? 'border-outline-gray-4 bg-surface-gray-2'
              : 'border-outline-gray-3 hover:bg-surface-gray-1'
          "
          @click="fileInput?.click()"
          @dragover.prevent="dragging = true"
          @dragleave="dragging = false"
          @drop.prevent="onDrop"
        >
          <span class="lucide-upload size-5 text-ink-gray-6" />
          <span class="text-base text-ink-gray-8">
            {{ uploaded ?? 'Choose a file or drop it here' }}
          </span>
          <span class="text-sm text-ink-gray-5">
            {{ uploaded ? 'Ready to embed' : 'Images, videos and PDFs up to 25MB' }}
          </span>
        </button>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept="image/*,video/*,application/pdf"
          @change="takeFile(($event.target as HTMLInputElement).files?.[0])"
        />
      </div>

      <!-- library -->
      <ul v-else class="flex max-h-[124px] flex-col gap-1 overflow-y-auto px-2">
        <li v-for="e in library" :key="e.url">
          <a
            :href="e.url"
            target="_blank"
            rel="noopener"
            class="flex h-8 items-center gap-2 rounded-4 px-2 transition-colors hover:bg-surface-gray-2"
          >
            <span class="lucide-link size-4 shrink-0 text-ink-gray-6" />
            <span class="shrink-0 text-base text-ink-gray-8">{{ e.host }}</span>
            <span class="truncate text-sm text-ink-gray-5">{{ e.url }}</span>
          </a>
        </li>
        <li v-if="!library.length" class="px-2 py-3 text-base text-ink-gray-5">
          Nothing embedded yet
        </li>
      </ul>
    </div>

    <!-- compact -->
    <form
      class="flex w-[380px] items-center gap-1 rounded-6 bg-surface-elevation-2 p-1 shadow-lg"
      aria-label="Add embed"
      @submit.prevent="addCompact"
    >
      <TextInput
        v-model="compactLink"
        class="min-w-0 flex-1"
        placeholder="Paste in https://"
        aria-label="Link to embed"
      />
      <Button type="submit" variant="solid" size="sm" :disabled="!compactValid">
        {{ compactAdded ? 'Added' : 'Add embed' }}
      </Button>
    </form>
  </div>
</template>
