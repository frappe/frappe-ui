<script setup lang="ts">
// Figma: espresso-2.0 › Image (32243:108985) — the card an image slot
// raises (embed-link new, 30878:37810): 380 across on a 12px radius under
// the xl shadow, 8px over its tab row and 14 under its last line, 16
// between, 16 in from either side. The row is ruled across the card and
// the tab in hand carries the rule's weight in ink-gray-8.
//
// Two ways in, as the file draws them: a file off the disk, or a link to
// one anywhere on the web. A link is read before it is taken — the editor
// turns away anything but http(s) (url-safety.ts), and a URL that does not
// load as a picture never reaches the document.
import { computed, ref, watch } from 'vue'
import { Button, TextInput } from '../../../src'
import { pickFiles } from '../../../src/molecules/editor/extensions/shared/file-picker'
import { isSafeUrl } from '../../../src/molecules/editor/extensions/shared/url-safety'
import { probeImageDimensions } from '../../../src/molecules/editor/extensions/shared/media-dimensions'
import RteIcon from './RteIcon.vue'

const emit = defineEmits<{
  file: [File]
  link: [{ src: string; width: number; height: number }]
  close: []
}>()

const tab = ref<'upload' | 'link'>('upload')
const url = ref('')
const checking = ref(false)
const error = ref('')

const hint = computed(() =>
  error.value ? error.value : 'Works with any image from the web',
)

watch(tab, () => (error.value = ''))

async function chooseFile() {
  const [file] = await pickFiles({ accept: 'image/*' })
  if (file) emit('file', file)
}

async function embed() {
  const src = url.value.trim()
  if (!src || checking.value) return
  if (!isSafeUrl(src, { base: window.location.origin })) {
    error.value = 'That link is not a web address the editor can take'
    return
  }
  checking.value = true
  error.value = ''
  try {
    const { width, height } = await probeImageDimensions(src)
    emit('link', { src, width, height })
  } catch {
    error.value = 'That link did not load as an image'
  } finally {
    checking.value = false
  }
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
        v-for="t in ['upload', 'link'] as const"
        :key="t"
        type="button"
        class="rte-source-tab"
        :class="tab === t ? 'is-on text-ink-gray-8' : 'text-ink-gray-5'"
        :aria-selected="tab === t"
        role="tab"
        @click="tab = t"
      >
        {{ t === 'upload' ? 'Upload' : 'Link' }}
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

    <div v-if="tab === 'upload'" class="px-4">
      <Button
        variant="solid"
        size="md"
        class="w-full"
        label="Upload file"
        @click="chooseFile"
      />
    </div>

    <form v-else class="px-4" @submit.prevent="embed">
      <div class="flex flex-col gap-4">
        <TextInput
          v-model="url"
          size="sm"
          type="url"
          placeholder="Paste image link"
          aria-label="Image link"
          autofocus
          @input="error = ''"
        />
        <Button
          variant="solid"
          size="md"
          class="w-full"
          label="Embed image"
          :loading="checking"
          @click="embed"
        />
      </div>
      <p
        class="mt-3 text-center text-xs"
        :class="error ? 'text-ink-red-5' : 'text-ink-gray-5'"
        :role="error ? 'alert' : undefined"
      >
        {{ hint }}
      </p>
    </form>
  </div>
</template>

<style scoped>
/* the tab in hand takes the rule's place: a 2px ink-gray-8 line the width
   of its own label, laid over the hairline the row ends on */
.rte-source-tab {
  position: relative;
  font-size: 14px;
  line-height: 20px;
}
.rte-source-tab.is-on::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -4px;
  height: 2px;
  background: var(--ink-gray-8);
}
</style>
