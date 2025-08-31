<template>
  <div>
    <slot v-bind="{ onClick: openIframeDialog }"></slot>

    <!-- Iframe URL Input Dialog -->
    <Dialog v-model="showDialog" :options="{ title: 'Insert Embed', size: 'md' }">
      <template #body-content>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-ink-gray-7 mb-2">
              URL or Embed Code
            </label>
            <Textarea
              ref="urlInput"
              v-model="embedUrl"
              placeholder="https://youtube.com/watch?v=... or <iframe src=...>"
              @keydown.enter="insertIframe"
              @input="validateUrl"
            />
            <p v-if="urlError" class="text-red-500 text-sm mt-1">{{ urlError }}</p>
            <p v-else-if="embedUrl && isValidUrl" class="text-ink-green-3 text-sm mt-1">
              ✓ Valid {{ platformInfo.platform }} URL
            </p>
          </div>
        </div>
      </template>

      <template #actions>
        <div class="flex justify-end space-x-2">
          <Button variant="subtle" @click="showDialog = false">Cancel</Button>
          <Button
            variant="solid"
            :disabled="!embedUrl || !isValidUrl"
            @click="insertIframe"
          >
            Insert Embed
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { Dialog, Button, TextInput, Textarea } from '../../../..'

import {
  validateURL,
  processURL,
  detectPlatform,
  calculateAspectRatio,
  getOptimalDimensions,
  ALLOWED_DOMAINS
} from './utils'


const props = defineProps<{
  editor: Editor
}>()

const showDialog = ref(false)
const embedUrl = ref('')
const urlError = ref('')
const title = ref('')
const alignment = ref<'left' | 'center' | 'right'>('center')
const customWidth = ref<number>(640)
const customHeight = ref<number>(360)

const urlInput = ref<HTMLInputElement>()

const isValidUrl = computed(() => {
  if (!embedUrl.value) return false

  try {
    // Handle iframe embed code
    if (embedUrl.value.trim().startsWith('<iframe')) {
      const srcMatch = embedUrl.value.match(/src=["']([^"']+)["']/)
      if (srcMatch?.[1]) {
        return validateURL(srcMatch[1], {
          allowedDomains: ALLOWED_DOMAINS,
          HTMLAttributes: {}
        })
      }
      return false
    }

    // Handle direct URLs
    return validateURL(embedUrl.value, {
      allowedDomains: ALLOWED_DOMAINS,
      HTMLAttributes: {}
    })
  } catch {
    return false
  }
})

const processedUrl = computed(() => {
  if (!embedUrl.value) return ''

  // Extract URL from iframe code if needed
  if (embedUrl.value.trim().startsWith('<iframe')) {
    const srcMatch = embedUrl.value.match(/src=["']([^"']+)["']/)
    if (srcMatch?.[1]) {
      return processURL(srcMatch[1])
    }
    return embedUrl.value
  }

  return processURL(embedUrl.value)
})

const platformInfo = computed(() => {
  if (!embedUrl.value || !isValidUrl.value) return { platform: 'Generic', aspectRatio: 9/16 }

  const platform = detectPlatform(processedUrl.value)
  const aspectInfo = calculateAspectRatio(processedUrl.value)

  return {
    platform: platform?.name || 'Generic',
    aspectRatio: aspectInfo.ratio
  }
})

const optimalDimensions = computed(() => {
  if (!embedUrl.value || !isValidUrl.value) return { width: 640, height: 360 }

  return getOptimalDimensions(processedUrl.value, 800) // Assume 800px editor width
})

function validateUrl() {
  urlError.value = ''

  if (!embedUrl.value) return

  if (!isValidUrl.value) {
    urlError.value = 'Please enter a supported URL or iframe embed code'
  }
}

function openIframeDialog() {
  showDialog.value = true
  embedUrl.value = ''
  urlError.value = ''
  title.value = ''
  alignment.value = 'center'

  // Set initial dimensions
  customWidth.value = 640
  customHeight.value = 360

  nextTick(() => {
    urlInput.value?.el?.focus()
  })
}

// Update custom dimensions when URL changes
computed(() => {
  if (embedUrl.value && isValidUrl.value) {
    const dimensions = optimalDimensions.value
    customWidth.value = dimensions.width
    customHeight.value = dimensions.height
  }
})

function insertIframe() {
  if (!embedUrl.value || !isValidUrl.value) return

  const success = props.editor.commands.setIframe({
    src: processedUrl.value,
    width: customWidth.value,
    height: customHeight.value,
    title: title.value,
    align: alignment.value
  })

  if (success) {
    showDialog.value = false
    props.editor.commands.focus()
  } else {
    urlError.value = 'Failed to insert embed. Please check the URL and try again.'
  }
}

function handleSlashCommandInsert(event: CustomEvent) {
  if (event.detail?.editor === props.editor) {
    openIframeDialog()
  }
}

onMounted(() => {
  props.editor.view.dom.addEventListener('iframe:open-dialog', handleSlashCommandInsert as EventListener)
})

onUnmounted(() => {
  props.editor.view.dom.removeEventListener('iframe:open-dialog', handleSlashCommandInsert as EventListener)
})
</script>
