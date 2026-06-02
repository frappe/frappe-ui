<template>
  <NodeViewWrapper>
    <div class="w-full">
      <div v-if="isEditable" class="flex items-center mb-2 gap-2">
        <Button @click="edit">
          <template #prefix>
            <span class="lucide-edit size-4" />
          </template>
          Edit
        </Button>
        <Select
          :options="columnOptions"
          v-model="columnsModel"
          size="sm"
          variant="subtle"
          class="w-28"
        />
      </div>
      <div class="grid gap-px" :style="gridStyle">
        <div
          v-for="(img, idx) in images"
          :key="(img.attrs.uploadId ?? img.attrs.src) + '-' + idx"
          class="relative aspect-square w-full h-full overflow-hidden bg-surface-white group"
        >
          <button
            v-if="isEditable"
            type="button"
            class="absolute top-1 right-1 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Remove image"
            @click.stop="removeImage(idx)"
          >
            <span class="lucide-x w-4 h-4 text-gray-700" />
          </button>
          <img
            v-if="!isEditable"
            :src="img.attrs.src"
            :alt="img.attrs.alt || ''"
            class="object-cover w-full h-full not-prose cursor-pointer rounded-[2px]"
            @click="openViewer(idx)"
          />
          <img
            v-else
            :src="img.attrs.src"
            :alt="img.attrs.alt || ''"
            class="object-cover w-full h-full not-prose rounded-[2px]"
          />

          <div
            v-if="img.attrs.alt"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
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
import Button from '#components/Button/Button.vue'
import Select from '#components/Select/Select.vue'
import ImageViewerModal from '#molecules/editor/components/ImageViewerModal.vue'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'
import ImageGroupUploadDialog from './ImageGroupUploadDialog.vue'
import { clampColumns, columnSelectOptions } from './image-group-utils'
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

const columnOptions = columnSelectOptions()
const columnsModel = computed({
  get: () => String(columns.value),
  set: (val) => setImageGroupColumns(editor, props.getPos, +val),
})

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
