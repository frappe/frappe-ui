<template>
  <NodeViewWrapper>
    <!-- A picture's chrome, as the single image draws it (MediaNodeView,
         MediaToolbar): selected, the gallery takes the picture's ring and one
         ⋯ button in its corner with every gallery action behind it. A click
         on a picture of a selected gallery picks that picture: the ring and
         the ⋯ move to it, with what a picture offers — open, copy, download,
         delete. The 65%-black pills — a toolbar for the gallery, a cross on
         every picture — are gone with it. The menus are not modal: a modal
         menu marks everything else on the page aria-hidden as it opens, the
         document's own blocks included, and ProseMirror read that storm of
         attribute changes as an edit and re-parsed the gallery into one
         picture with no source. -->
    <div
      class="group/gallery relative isolate w-full not-prose my-2 rounded-4"
      :class="{
        [SELECTED_IMAGE_RING]: selected && isEditable && activeIdx === null,
        'cursor-pointer': isEditable && !selected,
      }"
      @click="onContainerClick"
    >
      <div
        v-if="
          isEditable && (galleryMenuOpen || (selected && activeIdx === null))
        "
        class="absolute top-2.5 right-2.5 z-20 flex"
        @pointerdown.prevent.stop
      >
        <Dropdown
          v-model:open="galleryMenuOpen"
          :modal="false"
          :options="galleryOptions"
          align="end"
        >
          <template #trigger>
            <button
              type="button"
              :class="MEDIA_CHROME_BUTTON"
              aria-label="Gallery options"
              @click.stop
            >
              <span class="lucide-ellipsis size-4" aria-hidden="true" />
            </button>
          </template>
        </Dropdown>
      </div>

      <div class="grid gap-2" :style="gridStyle">
        <div
          v-for="(img, idx) in images"
          :key="(img.attrs.uploadId ?? img.attrs.src) + '-' + idx"
          class="relative aspect-square w-full h-full rounded-4 bg-surface-gray-1 group"
          :class="{
            [SELECTED_IMAGE_RING]: selected && isEditable && activeIdx === idx,
          }"
          @click="onImageClick(idx, $event)"
        >
          <div class="size-full overflow-hidden rounded-4">
            <img
              :src="img.attrs.src"
              :alt="img.attrs.alt || ''"
              class="object-cover w-full h-full not-prose"
              :class="!isEditable && 'cursor-pointer'"
            />
          </div>

          <div
            v-if="
              isEditable &&
              (pictureMenuOpen === idx || (selected && activeIdx === idx))
            "
            class="absolute top-2.5 right-2.5 z-20 flex"
            @pointerdown.prevent.stop
          >
            <Dropdown
              :open="pictureMenuOpen === idx"
              :modal="false"
              :options="pictureOptions(idx)"
              align="end"
              @update:open="(open) => (pictureMenuOpen = open ? idx : null)"
            >
              <template #trigger>
                <button
                  type="button"
                  :class="MEDIA_CHROME_BUTTON"
                  aria-label="Image options"
                  @click.stop
                >
                  <span class="lucide-ellipsis size-4" aria-hidden="true" />
                </button>
              </template>
            </Dropdown>
          </div>

          <div
            v-if="img.attrs.alt"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-4 opacity-0 transition-opacity group-hover:opacity-100 [@media(hover:none)]:opacity-100"
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
import { computed, h, ref, toRaw, watch } from 'vue'
import { NodeViewWrapper, type Editor } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import Dropdown from '#components/Dropdown/Dropdown.vue'
import type { DropdownOptions } from '#components/Dropdown/types'
import ImageViewerModal from '#molecules/editor/components/ImageViewerModal.vue'
import {
  MEDIA_CHROME_BUTTON,
  SELECTED_IMAGE_RING,
} from '#molecules/editor/components/media-node-view-utils'
import {
  copyImageToClipboard,
  downloadMedia,
  duplicateMedia,
  removeMedia,
} from '#molecules/editor/components/media-node-view-controller'
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

/**
 * The picture a click on a selected gallery picked, whose ring and ⋯ the
 * gallery's give way to; `null` is the gallery as a whole. It lets go when
 * the gallery does.
 */
const activeIdx = ref<number | null>(null)
watch(
  () => props.selected,
  (on) => {
    if (!on) activeIdx.value = null
  },
)
// An open menu keeps its button mounted while the node loses its selection:
// the menu portals out of the editor, so a click in it is a click outside.
const galleryMenuOpen = ref(false)
const pictureMenuOpen = ref<number | null>(null)

/** The design's check at the end of a row that is on (as MediaToolbar). */
const check = () =>
  h('span', {
    class: 'lucide-check ml-auto size-4 shrink-0 text-ink-gray-7',
    'aria-hidden': 'true',
  })

const galleryOptions = computed<DropdownOptions>(() => [
  {
    group: 'gallery',
    hideLabel: true,
    options: [
      { label: 'Edit gallery', icon: 'lucide-pencil', onClick: edit },
      {
        label: 'Columns',
        icon: 'lucide-columns-3',
        submenu: ALLOWED_COLUMNS.map((n) => ({
          label: `${n} columns`,
          onClick: () => setColumns(n),
          ...(columns.value === n ? { slots: { suffix: check } } : {}),
        })),
      },
    ],
  },
  {
    group: 'media',
    hideLabel: true,
    options: [
      {
        label: 'Duplicate',
        icon: 'lucide-copy-plus',
        onClick: () => duplicateMedia(editor, () => props.getPos()),
      },
    ],
  },
  {
    group: 'remove',
    hideLabel: true,
    options: [
      {
        label: 'Delete',
        icon: 'lucide-trash-2',
        onClick: () => removeMedia(editor, () => props.getPos()),
      },
    ],
  },
])

/** A picture's own: what MediaToolbar offers a single image's bytes. */
function pictureOptions(idx: number): DropdownOptions {
  const src = () => images.value[idx]?.attrs.src as string | undefined
  return [
    {
      group: 'share',
      hideLabel: true,
      options: [
        {
          label: 'Open link',
          icon: 'lucide-external-link',
          onClick: () => {
            const url = src()
            if (url) window.open(url, '_blank', 'noopener')
          },
        },
        {
          label: 'Copy image',
          icon: 'lucide-copy',
          onClick: () => {
            const url = src()
            if (url) void copyImageToClipboard(url)
          },
        },
        {
          label: 'Download',
          icon: 'lucide-download',
          onClick: () => {
            const url = src()
            if (url) void downloadMedia(url, 'image')
          },
        },
      ],
    },
    {
      group: 'remove',
      hideLabel: true,
      options: [
        {
          label: 'Delete',
          icon: 'lucide-trash-2',
          onClick: () => removeImage(idx),
        },
      ],
    },
  ]
}

/**
 * A picture of a gallery that is already selected is picked by a click; a
 * click on any part of an unselected gallery selects the gallery. Read-only,
 * a picture opens the viewer.
 */
function onImageClick(idx: number, event: MouseEvent) {
  if (!isEditable.value) return openViewer(idx)
  if (!props.selected) return
  event.stopPropagation()
  activeIdx.value = activeIdx.value === idx ? null : idx
}

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
  activeIdx.value = null
  removeImageAt(editor, props.getPos, idx)
}
</script>
