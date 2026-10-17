<script setup lang="ts">
// Figma: espresso-2.0 › Image (32243:108985) — the card an image slot
// raises (embed-link new, 30878:37810): 380 across on a 12px radius under
// the xl shadow, 8px over its tab row and 14 under its last line, 16
// between, 16 in from either side. The tabs are the library's underline
// tabs, their line sliding over the rule the row ends on.
//
// Two ways in, as the file draws them: a file off the disk, or a link to
// one anywhere on the web. A link is read before it is taken — the editor
// turns away anything but http(s) (url-safety.ts), and a URL that does not
// load as a picture never reaches the document.
import { computed, ref, watch } from 'vue'
import { Button, TabList, Tabs, TabTrigger, TextInput } from '../../../src'
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
    class="rte-source relative flex w-[380px] flex-col gap-4 rounded-6 bg-surface-elevation-1 pb-3.5 pt-2 shadow-xl"
  >
    <!-- the library's underline tabs, as the embed card's and the emoji
         picker's: their line slides from tab to tab over the row's rule -->
    <div class="flex h-7 items-end border-b border-outline-gray-1 px-4">
      <Tabs v-model="tab">
        <TabList
          variant="underline"
          size="sm"
          class="h-7 !border-b-0"
          aria-label="Add an image from"
        >
          <TabTrigger value="upload" label="Upload" />
          <TabTrigger value="link" label="Link" />
        </TabList>
      </Tabs>
      <!-- the file's close (31845:37452): an xs ghost button, its 14px
           cross in gray-700, pinned 4px from the card's corner -->
      <Button
        variant="ghost"
        size="xs"
        label="Close"
        class="absolute right-1 top-1"
        @click="emit('close')"
      >
        <template #icon>
          <RteIcon name="small-close" class="size-3.5 text-ink-gray-7" />
        </template>
      </Button>
    </div>

    <div v-if="tab === 'upload'" class="px-4">
      <Button
        variant="solid"
        size="sm"
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
          size="sm"
          class="w-full"
          label="Embed image"
          :loading="checking"
          @click="embed"
        />
      </div>
      <p
        class="mt-2 text-center text-[13px] leading-5 tracking-[0.015em]"
        :class="error ? 'text-ink-red-4' : 'text-ink-gray-6'"
        :role="error ? 'alert' : undefined"
      >
        {{ hint }}
      </p>
    </form>
  </div>
</template>
