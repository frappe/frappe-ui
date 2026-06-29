<script setup lang="ts">
import { computed, toRaw } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { formatBytes } from '#utils/fileSize'
import {
  abortUpload,
  getUploadProgress,
} from '#molecules/editor/extensions/shared/media-upload-state'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'

const props = defineProps(nodeViewProps)

// Operate on the raw editor for commands (see MediaNodeView for the rationale:
// the proxied editor throws "Applying a mismatched transaction").
const editor = toRaw(props.editor)
const isEditable = useNodeViewEditable(editor)

const fileName = computed(() => props.node.attrs.fileName || 'Attachment')
const fileSize = computed(() => {
  const size = Number(props.node.attrs.fileSize)
  return Number.isFinite(size) && size > 0 ? formatBytes(size) : ''
})
const href = computed(() => props.node.attrs.src || undefined)
const isLoading = computed(() => Boolean(props.node.attrs.loading))
const error = computed(() => props.node.attrs.error as string | null)
const isUploaded = computed(() => Boolean(props.node.attrs.src))

const uploadId = computed(() => props.node.attrs.uploadId as string | undefined)
const progress = computed(() =>
  uploadId.value ? getUploadProgress(uploadId.value) : undefined,
)
const percent = computed(() => progress.value?.percent ?? 0)

function cancel() {
  if (uploadId.value) abortUpload(uploadId.value)
}

function retry() {
  if (uploadId.value) editor.commands.reuploadAttachment(uploadId.value)
}

// Plain link is non-interactive while a chip is loading/errored.
const isLink = computed(() => isUploaded.value && !isLoading.value)
</script>

<template>
  <!-- Gray-only chip (frappe-ui / Gameplan rule: never color shades). -->
  <NodeViewWrapper
    as="span"
    class="inline-flex max-w-full items-center gap-1 align-baseline"
    data-drag-handle
    draggable="true"
  >
    <component
      :is="isLink ? 'a' : 'span'"
      class="inline-flex h-6 max-w-full items-center gap-1.5 rounded-lg border bg-surface-gray-2 px-2 text-sm no-underline"
      :class="[
        error
          ? 'border-dashed border-outline-gray-2 text-ink-gray-6'
          : 'border-outline-gray-2 text-ink-gray-8',
        isLink ? 'cursor-pointer hover:bg-surface-gray-3' : 'cursor-default',
      ]"
      :href="isLink ? href : undefined"
      :target="isLink ? '_blank' : undefined"
      :rel="isLink ? 'noopener noreferrer' : undefined"
      :download="isLink ? fileName : undefined"
      contenteditable="false"
    >
      <span
        v-if="isLoading"
        class="lucide-loader-circle size-3.5 shrink-0 animate-spin text-ink-gray-6"
        aria-hidden="true"
      />
      <span
        v-else-if="error"
        class="lucide-triangle-alert size-3.5 shrink-0 text-ink-gray-6"
        aria-hidden="true"
      />
      <span
        v-else
        class="lucide-paperclip size-3.5 shrink-0 text-ink-gray-6"
        aria-hidden="true"
      />

      <span class="max-w-64 truncate">{{ fileName }}</span>
      <span v-if="fileSize && !error" class="shrink-0 text-ink-gray-5">
        {{ fileSize }}
      </span>
      <span v-if="isLoading && percent > 0" class="shrink-0 text-ink-gray-5">
        {{ percent }}%
      </span>
    </component>

    <button
      v-if="isLoading && isEditable"
      type="button"
      class="inline-flex items-center justify-center rounded p-0.5 text-ink-gray-6 hover:bg-surface-gray-3"
      title="Cancel upload"
      contenteditable="false"
      @click="cancel"
    >
      <span class="lucide-x size-3.5 shrink-0" aria-hidden="true" />
    </button>
    <button
      v-else-if="error && isEditable"
      type="button"
      class="inline-flex items-center justify-center rounded p-0.5 text-ink-gray-6 hover:bg-surface-gray-3"
      title="Try again"
      contenteditable="false"
      @click="retry"
    >
      <span class="lucide-rotate-cw size-3.5 shrink-0" aria-hidden="true" />
    </button>
  </NodeViewWrapper>
</template>
