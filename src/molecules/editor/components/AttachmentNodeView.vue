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
  <NodeViewWrapper
    as="span"
    class="gp-attachment"
    :class="{ 'gp-attachment--error': error }"
    data-drag-handle
    draggable="true"
  >
    <component
      :is="isLink ? 'a' : 'span'"
      class="gp-attachment__chip"
      :href="isLink ? href : undefined"
      :target="isLink ? '_blank' : undefined"
      :rel="isLink ? 'noopener noreferrer' : undefined"
      :download="isLink ? fileName : undefined"
      contenteditable="false"
    >
      <span
        v-if="isLoading"
        class="lucide-loader-circle gp-attachment__icon gp-attachment__icon--spin"
        aria-hidden="true"
      />
      <span
        v-else-if="error"
        class="lucide-triangle-alert gp-attachment__icon"
        aria-hidden="true"
      />
      <span
        v-else
        class="lucide-paperclip gp-attachment__icon"
        aria-hidden="true"
      />

      <span class="gp-attachment__name">{{ fileName }}</span>
      <span v-if="fileSize && !error" class="gp-attachment__size">
        {{ fileSize }}
      </span>
      <span v-if="isLoading && percent > 0" class="gp-attachment__size">
        {{ percent }}%
      </span>
    </component>

    <button
      v-if="isLoading && isEditable"
      type="button"
      class="gp-attachment__action"
      title="Cancel upload"
      contenteditable="false"
      @click="cancel"
    >
      <span class="lucide-x gp-attachment__icon" aria-hidden="true" />
    </button>
    <button
      v-else-if="error && isEditable"
      type="button"
      class="gp-attachment__action"
      title="Try again"
      contenteditable="false"
      @click="retry"
    >
      <span class="lucide-rotate-cw gp-attachment__icon" aria-hidden="true" />
    </button>
  </NodeViewWrapper>
</template>

<style scoped>
/* Gray-only chip (frappe-ui / Gameplan rule: never color shades). */
.gp-attachment {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  vertical-align: baseline;
  max-width: 100%;
}

.gp-attachment__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 100%;
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--outline-gray-2, #e2e2e2);
  border-radius: 0.5rem;
  background-color: var(--surface-gray-2, #f4f4f4);
  color: var(--ink-gray-8, #1f272e);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  text-decoration: none;
  cursor: default;
}

a.gp-attachment__chip {
  cursor: pointer;
}

a.gp-attachment__chip:hover {
  background-color: var(--surface-gray-3, #ebebeb);
}

.gp-attachment--error .gp-attachment__chip {
  border-style: dashed;
  color: var(--ink-gray-6, #4f5a64);
}

.gp-attachment__icon {
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  color: var(--ink-gray-6, #4f5a64);
}

.gp-attachment__icon--spin {
  animation: gp-attachment-spin 0.8s linear infinite;
}

.gp-attachment__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 16rem;
}

.gp-attachment__size {
  flex: none;
  color: var(--ink-gray-5, #7c7c7c);
}

.gp-attachment__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem;
  border-radius: 0.25rem;
  color: var(--ink-gray-6, #4f5a64);
  background: transparent;
}

.gp-attachment__action:hover {
  background-color: var(--surface-gray-3, #ebebeb);
}

@keyframes gp-attachment-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
