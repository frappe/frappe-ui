<script setup lang="ts">
// Figma: espresso-2.0 › Embed (32354:128183) — the card an embed slot
// raises, and the pencil and "Replace" on an embed's menu (embed-link new,
// 32354:128789): 380 across on a 12px radius under the xl shadow, 8px over
// its tab row and 14 under its last line, 16 between, 16 in from either
// side. Three tabs, as the file draws them: Embed link, Upload, Library.
//
// Embed link: a link is read before it is taken — the editor turns away
// anything but http(s) and anything off its allowlist (iframe-allowlist.ts),
// and says so under the field in place of the hint. Upload: a file off the
// disk, sent up by the editor's own upload and framed by the URL it comes
// back as — a PDF, which a browser shows in a frame. Library: what has been
// uploaded already, newest first; the file draws no body for this tab, so
// it is a plain list of rows.
import { computed, ref, watch } from 'vue'
import { Button, TextInput } from '../../../src'
import { pickFiles } from '../../../src/molecules/editor/extensions/shared/file-picker'
import {
  processEmbedUrl,
  calculateAspectRatio,
  validateIframeUrl,
} from '../../../src/molecules/editor/extensions/iframe'
import RteIcon from './RteIcon.vue'

export interface LibraryFile {
  file_url: string
  file_name: string
  type: string
}

const props = defineProps<{
  /** the editor's own allowlist, when it has one of its own */
  allowlist?: readonly string[]
  /** the link already in place, when one is being replaced */
  initial?: string
  /** sends a file up and answers with the URL it is served from */
  upload?: (file: File) => Promise<string>
  /** what the library holds; the dev store's list when absent */
  library?: () => Promise<LibraryFile[]>
}>()

const emit = defineEmits<{
  link: [{ src: string; aspectRatio: number }]
  close: []
}>()

type Tab = 'link' | 'upload' | 'library'
const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'link', label: 'Embed link' },
  { key: 'upload', label: 'Upload' },
  { key: 'library', label: 'Library' },
]
const tab = ref<Tab>('link')

const url = ref(props.initial ?? '')
const error = ref('')
const uploading = ref(false)

const HINT =
  'Works with links of PDFs, Google Drive, Google Maps, Codepen, Figma, Notion etc.'
const hint = computed(() => error.value || HINT)

watch(tab, () => (error.value = ''))

/** the link, read: off to the editor if it will take it, else the word why */
function take(raw: string): boolean {
  const src = processEmbedUrl(raw)
  if (!validateIframeUrl(src, { allowlist: props.allowlist })) {
    error.value = 'That link is not one the editor can embed'
    return false
  }
  error.value = ''
  emit('link', { src, aspectRatio: calculateAspectRatio(src).ratio })
  return true
}

function embed() {
  const raw = url.value.trim()
  if (!raw) return
  take(raw)
}

async function chooseFile() {
  if (uploading.value) return
  const [file] = await pickFiles({ accept: 'application/pdf,.pdf' })
  if (!file) return
  if (!props.upload) {
    error.value = 'This editor has nowhere to upload to'
    return
  }
  uploading.value = true
  error.value = ''
  try {
    const src = new URL(await props.upload(file), window.location.origin).href
    take(src)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'The upload failed'
  } finally {
    uploading.value = false
  }
}

/** the library's rows, read when the tab is first opened */
const files = ref<LibraryFile[] | null>(null)
async function loadLibrary() {
  try {
    const list = props.library
      ? await props.library()
      : ((await (await fetch('/__uploads')).json()) as LibraryFile[])
    files.value = list
  } catch {
    files.value = []
    error.value = 'The library could not be read'
  }
}
watch(tab, (t) => t === 'library' && files.value === null && loadLibrary())

function pickFromLibrary(file: LibraryFile) {
  take(new URL(file.file_url, window.location.origin).href)
}
</script>

<template>
  <div
    class="rte-source flex w-[380px] flex-col gap-4 rounded-6 bg-surface-elevation-2 pb-3.5 pt-2 shadow-xl"
  >
    <div
      class="flex h-7 items-center gap-6 border-b border-outline-gray-1 px-4"
    >
      <button
        v-for="t in TABS"
        :key="t.key"
        type="button"
        class="rte-source-tab"
        :class="tab === t.key ? 'is-on text-ink-gray-8' : 'text-ink-gray-5'"
        :aria-selected="tab === t.key"
        role="tab"
        @click="tab = t.key"
      >
        {{ t.label }}
      </button>
      <button
        type="button"
        class="-mr-3 ml-auto flex size-5 items-center justify-center text-ink-gray-5 hover:text-ink-gray-7"
        aria-label="Close"
        @click="emit('close')"
      >
        <RteIcon name="small-close" class="size-4" />
      </button>
    </div>

    <form
      v-if="tab === 'link'"
      class="flex flex-col gap-4 px-4"
      @submit.prevent="embed"
    >
      <TextInput
        v-model="url"
        placeholder="https://www.youtube.com/@frappetech"
        aria-label="Embed link"
        autofocus
        @input="error = ''"
        @keydown.enter.prevent="embed"
      />
      <div class="flex flex-col gap-2">
        <Button type="submit" variant="solid" size="md" class="w-full">
          Embed link
        </Button>
        <p
          class="text-center text-[13px] leading-[1.5] tracking-[0.015em]"
          :class="error ? 'text-ink-red-4' : 'text-ink-gray-6'"
          :role="error ? 'alert' : undefined"
        >
          {{ hint }}
        </p>
      </div>
    </form>

    <div v-else-if="tab === 'upload'" class="flex flex-col gap-2 px-4">
      <Button
        variant="solid"
        size="md"
        class="w-full"
        label="Upload file"
        :loading="uploading"
        @click="chooseFile"
      />
      <p
        class="text-center text-[13px] leading-[1.5] tracking-[0.015em]"
        :class="error ? 'text-ink-red-4' : 'text-ink-gray-6'"
        :role="error ? 'alert' : undefined"
      >
        {{ error || 'A PDF off your disk, shown in the page' }}
      </p>
    </div>

    <div v-else class="flex flex-col gap-2 px-2">
      <ul
        v-if="files && files.length"
        class="flex max-h-[220px] flex-col gap-0.5 overflow-y-auto"
        role="listbox"
        aria-label="Library"
      >
        <li v-for="file in files" :key="file.file_url">
          <button
            type="button"
            class="flex h-8 w-full items-center gap-2.5 rounded-4 px-2 text-left text-sm text-ink-gray-8 hover:bg-surface-gray-2"
            role="option"
            @click="pickFromLibrary(file)"
          >
            <span
              class="size-4 shrink-0 text-ink-gray-6"
              :class="
                file.type.startsWith('image/')
                  ? 'lucide-image'
                  : file.type.startsWith('video/')
                    ? 'lucide-video'
                    : 'lucide-file-text'
              "
              aria-hidden="true"
            />
            <span class="truncate">{{ file.file_name }}</span>
          </button>
        </li>
      </ul>
      <p
        v-else
        class="px-2 py-3 text-center text-[13px] leading-[1.5] tracking-[0.015em]"
        :class="error ? 'text-ink-red-4' : 'text-ink-gray-6'"
        :role="error ? 'alert' : undefined"
      >
        {{ error || (files ? 'Nothing uploaded yet' : 'Reading the library…') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* the tab in hand takes the rule's place: a 2px ink-gray-8 line the width
   of the word, one pixel over the card's rule */
.rte-source-tab {
  position: relative;
  height: 100%;
  font-size: 14px;
  line-height: 16px;
}
.rte-source-tab.is-on::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 2px;
  background: var(--ink-gray-8);
}
</style>
