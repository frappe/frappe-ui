<template>
  <NodeViewWrapper>
    <!-- Selectable like every other media node: click selects, controls live
         in the on-selection dark toolbar (same pattern as MediaToolbar). -->
    <div
      class="group/gallery relative isolate w-full not-prose my-2 rounded-md"
      :class="{
        'ring-2 ring-outline-gray-3 ring-offset-2': selected && isEditable,
        'cursor-pointer': isEditable && !selected,
      }"
      @click="onContainerClick"
    >
      <div
        v-if="selected && isEditable"
        class="absolute top-2 right-2 z-20 flex items-center gap-2 rounded bg-black/65 px-1.5 py-1"
        @pointerdown.prevent.stop
      >
        <Tooltip text="Edit gallery" class="h-5">
          <button type="button" aria-label="Edit gallery" @click.stop="edit">
            <span
              class="lucide-pencil size-4 text-ink-gray-4 hover:text-ink-white"
            />
          </button>
        </Tooltip>
        <span class="h-4 w-px bg-white/25" aria-hidden="true" />
        <Tooltip
          v-for="n in ALLOWED_COLUMNS"
          :key="n"
          :text="`${n} columns`"
          class="h-5"
        >
          <button
            type="button"
            class="px-0.5 text-xs font-medium tabular-nums hover:text-ink-white"
            :class="columns === n ? 'text-ink-white' : 'text-ink-gray-4'"
            :aria-label="`${n} columns`"
            :aria-pressed="columns === n"
            @click.stop="setColumns(n)"
          >
            {{ n }}
          </button>
        </Tooltip>
      </div>

      <div class="grid gap-2" :style="gridStyle">
        <div
          v-for="(img, idx) in images"
          :key="(img.attrs.uploadId ?? img.attrs.src) + '-' + idx"
          class="relative aspect-square w-full h-full overflow-hidden rounded-md bg-surface-gray-1 group"
        >
          <button
            v-if="isEditable && selected"
            type="button"
            class="absolute top-1 right-1 z-10 rounded bg-black/65 p-1 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
            aria-label="Remove image"
            @click.stop="removeImage(idx)"
          >
            <span
              class="lucide-x size-4 text-ink-gray-4 hover:text-ink-white"
            />
          </button>
          <img
            v-if="!isEditable"
            :src="img.attrs.src"
            :alt="img.attrs.alt || ''"
            class="object-cover w-full h-full not-prose cursor-pointer"
            @click="openViewer(idx)"
          />
          <img
            v-else
            :src="img.attrs.src"
            :alt="img.attrs.alt || ''"
            class="object-cover w-full h-full not-prose"
          />

          <div
            v-if="img.attrs.alt"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-md opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
          >
            <div class="p-2">
              <div class="text-white text-xs truncate" :title="img.attrs.alt">
                {{ img.attrs.alt }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageViewerModal
        v-if="showViewer"
        v-model:show="showViewer"
        :images="viewerImages"
        :initialIndex="viewerIndex"
      />
      <ImageGroupUploadDialog
        v-if="showEditModal"
        v-model="showEditModal"
        :files="editFiles"
        :editor="editor"
        mode="edit"
        :existingImages="existingImages"
        :initialColumns="columns"
        @close="handleEditModalClose"
        @save="handleEditSave"
      />
      <slot />
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'
import { NodeViewWrapper, type Editor } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import Tooltip from '#components/Tooltip/Tooltip.vue'
import ImageViewerModal from '#molecules/editor/components/ImageViewerModal.vue'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'
import ImageGroupUploadDialog from './ImageGroupUploadDialog.vue'
import { ALLOWED_COLUMNS, clampColumns } from './image-group-utils'
import {
  removeImageAt,
  replaceImageGroup,
  setImageGroupColumns,
} from './image-group-commands'
import type { ExistingImage } from '#molecules/editor/extensions/shared/upload-types'

const props = defineProps<NodeViewProps & { editor: Editor }>()

// VueNodeViewRenderer passes a reactive-proxied editor; dispatching a
// transaction through it trips ProseMirror's by-reference doc check
// ("Applying a mismatched transaction"). Use the raw editor for all commands and
// pass it (not the proxy) to child components. (See MediaNodeView.)
const editor = toRaw(props.editor)

const isEditable = useNodeViewEditable(editor)

const columns = computed(() => clampColumns(props.node.attrs.columns))
const images = computed<ProseMirrorNode[]>(() => {
  const out: ProseMirrorNode[] = []
  props.node.content.forEach((child) => out.push(child))
  return out
})
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))`,
}))

function setColumns(n: number) {
  setImageGroupColumns(editor, props.getPos, n)
  // Keep the node selected so the toolbar stays up while comparing layouts.
  onContainerClick()
}

function onContainerClick() {
  if (!isEditable.value) return
  const pos = props.getPos()
  if (typeof pos === 'number') editor.commands.setNodeSelection(pos)
}

const showViewer = ref(false)
const viewerIndex = ref(0)
const viewerImages = computed(() =>
  images.value.map((img) => ({
    src: img.attrs.src as string,
    alt: (img.attrs.alt as string) || '',
  })),
)

const showEditModal = ref(false)
const editFiles = ref<File[]>([])

const existingImages = computed<ExistingImage[]>(() =>
  images.value.map((img) => ({
    src: img.attrs.src as string,
    alt: (img.attrs.alt as string) || '',
  })),
)

function edit() {
  editFiles.value = []
  showEditModal.value = true
}

function handleEditModalClose() {
  showEditModal.value = false
  editFiles.value = []
}

function handleEditSave(data: { images: ExistingImage[]; columns: number }) {
  replaceImageGroup(editor, props.getPos, data)
  showEditModal.value = false
}

function openViewer(idx: number) {
  if (editor.isEditable) return
  viewerIndex.value = idx
  showViewer.value = true
}

function removeImage(idx: number) {
  removeImageAt(editor, props.getPos, idx)
}
</script>
