<template>
  <NodeViewWrapper>
    <div class="w-full">
      <div v-if="isEditable" class="mb-2 flex items-center gap-2">
        <Button @click="edit">
          <template #prefix>
            <LucideEdit class="size-4" />
          </template>
          Edit
        </Button>
        <Select
          :options="selectOptions"
          v-model="internalColumns"
          size="sm"
          variant="subtle"
          class="w-28"
        />
      </div>
      <div class="grid gap-px" :style="gridStyle">
        <div
          v-for="(img, idx) in images"
          :key="img.attrs.src + idx"
          class="group relative aspect-square h-full w-full overflow-hidden bg-surface-white"
        >
          <button
            v-if="isEditable"
            type="button"
            class="absolute right-1 top-1 z-10 rounded-full bg-white/80 p-1 opacity-0 shadow transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100"
            aria-label="Remove image"
            @click.stop="removeImage(idx)"
          >
            <LucideX class="h-4 w-4 text-gray-700" />
          </button>
          <img
            :src="img.attrs.src"
            :alt="img.attrs.alt || ''"
            class="not-prose h-full w-full cursor-pointer rounded-[2px] object-cover"
            v-if="!isEditable"
            @click="openViewer(idx)"
          />
          <img
            v-else
            :src="img.attrs.src"
            :alt="img.attrs.alt || ''"
            class="not-prose h-full w-full rounded-[2px] object-cover"
          />

          <!-- Caption overlay (visible when there's alt text) -->
          <div
            v-if="img.attrs.alt"
            class="absolute bottom-0 left-0 right-0 rounded-b-[2px] bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          >
            <div class="p-2">
              <div class="truncate text-xs text-white" :title="img.attrs.alt">
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
        :editor="props.editor"
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
import { NodeViewWrapper, type Editor } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import LucideEdit from '~icons/lucide/edit'
import LucideX from '~icons/lucide/x'

import Button from '../../../Button/Button.vue'
import Select from '../../../Select/Select.vue'
import ImageViewerModal from '../../components/ImageViewerModal.vue'
import ImageGroupUploadDialog from './ImageGroupUploadDialog.vue'

const props = defineProps<NodeViewProps & { editor: Editor }>()

const columns = computed(() => props.node.attrs.columns || 4)
const images = computed(() => props.node.content.content || [])
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))`,
}))
const isEditable = ref(props.editor.isEditable)

const selectOptions = [
  { label: '2 columns', value: '2' },
  { label: '3 columns', value: '3' },
  { label: '4 columns', value: '4' },
]

const internalColumns = computed({
  get: () => String(columns.value),
  set: (val) => props.updateAttributes({ columns: +val }),
})

const showViewer = ref(false)
const viewerIndex = ref(0)
const viewerImages = computed(() =>
  images.value.map((img: any) => ({
    src: img.attrs.src,
    alt: img.attrs.alt || '',
  })),
)

const showEditModal = ref(false)
const editFiles = ref<File[]>([])

interface ExistingImage {
  src: string
  alt: string
}

const existingImages = computed(() =>
  images.value.map((img: any) => ({
    src: img.attrs.src,
    alt: img.attrs.alt || '',
  })),
)

onMounted(() => {
  const updateEditable = () => {
    isEditable.value = props.editor.isEditable
  }
  props.editor.on('update', updateEditable)
  onUnmounted(() => {
    props.editor.off('update', updateEditable)
  })
})

function edit() {
  editFiles.value = []
  showEditModal.value = true
}

function handleEditModalClose() {
  showEditModal.value = false
  editFiles.value = []
}

async function handleEditSave(data: { images: ExistingImage[]; columns: number }) {
  // Update the node with the final images and columns from the modal
  props.editor.commands.command(({ tr, state }) => {
    const pos = props.getPos()
    if (typeof pos === 'number') {
      const node = state.doc.nodeAt(pos)
      if (node && node.type.name === 'imageGroup') {
        const newContent = data.images.map((img) =>
          state.schema.nodes.image.create({ src: img.src, alt: img.alt }),
        )

        const newAttrs = { ...node.attrs, columns: data.columns }
        const newNode = node.type.create(newAttrs, newContent)
        tr.replaceWith(pos, pos + node.nodeSize, newNode)
        return true
      }
    }
    return false
  })

  showEditModal.value = false
}

function openViewer(idx: number) {
  if (props.editor.isEditable) return
  viewerIndex.value = idx
  showViewer.value = true
}

function removeImage(idx: number) {
  // Remove the image at the specified index and update the node
  const newImages = images.value.slice()
  newImages.splice(idx, 1)
  if (newImages.length === 0) {
    // Remove the whole node if no images left
    props.editor.commands.deleteNode('imageGroup')
  } else {
    // Update the node content with remaining images
    props.updateAttributes({})
    props.editor.commands.command(({ tr, state }) => {
      const pos = props.getPos()
      if (typeof pos === 'number') {
        const node = state.doc.nodeAt(pos)
        if (node && node.type.name === 'imageGroup') {
          const newContent = newImages.map((img) => state.schema.nodes.image.create(img.attrs))
          tr.replaceWith(pos + 1, pos + 1 + node.content.size, newContent)
          return true
        }
      }
      return false
    })
  }
}
</script>
