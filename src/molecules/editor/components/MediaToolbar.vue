<script setup lang="ts">
import { ref, computed, h } from 'vue'
import type { Node } from '@tiptap/pm/model'
import Dropdown from '#components/Dropdown/Dropdown.vue'
import type {
  DropdownOptions,
  DropdownOption,
} from '#components/Dropdown/types'
import { MEDIA_CHROME_BUTTON, type MediaAlign } from './media-node-view-utils'

const props = defineProps<{
  node: Node
  mediaType: 'image' | 'video' | 'embed'
  isEditable: boolean
  selected: boolean
  showCaption: boolean
}>()

/**
 * Media chrome, per the design (espresso-2.0, node 31403-45433): one
 * `MEDIA_CHROME_BUTTON` 10px in from the top-right corner, with every
 * action in the menu behind it. The design draws a pencil beside it; on a
 * picture or a video it was asked off, the caption being a row of the menu
 * already. On an embed (32354-128183) it stays, and asks for a new link —
 * the one thing an embed is.
 *
 * A video's menu is the design's one flat list: Caption (a check beside it
 * while it shows), Replace, Align, Video settings (Autoplay, Loop, Muted,
 * each with a check while on), Duplicate, Delete. An embed's is its own
 * six: Captions, Replace, Open in Browser, Align, Duplicate, Delete. An
 * image keeps its longer list — the size, the bytes (open, copy,
 * download) — grouped as before.
 *
 * They used to sit in the frame as six buttons sharing one 65%-black pill — a
 * slab of chrome across the top of every selected image, most of it rarely
 * used.
 */
const emit = defineEmits<{
  (e: 'toggle-caption'): void
  /** the pencil: an embed's link, to change */
  (e: 'edit'): void
  (e: 'set-align', align: MediaAlign): void
  /** `fraction` of the width the media has to fill */
  (e: 'resize', fraction: number): void
  (e: 'replace'): void
  (e: 'duplicate'): void
  (e: 'open'): void
  (e: 'copy'): void
  (e: 'download'): void
  (e: 'remove'): void
  (
    e: 'set-video-options',
    options: { autoplay?: boolean; loop?: boolean; muted?: boolean },
  ): void
}>()

const menuOpen = ref(false)

const alignOptions: Array<{
  value: MediaAlign
  label: string
  icon: string
}> = [
  { value: 'left', label: 'Left', icon: 'lucide-align-left' },
  { value: 'center', label: 'Center', icon: 'lucide-align-center' },
  { value: 'right', label: 'Right', icon: 'lucide-align-right' },
]

/** the sizes on offer, as a share of the width there is to fill */
const sizeOptions: Array<{ value: number; label: string }> = [
  { value: 1, label: 'Full width' },
  { value: 0.75, label: 'Large' },
  { value: 0.5, label: 'Medium' },
  { value: 0.25, label: 'Small' },
]

/** the video settings: one row a flag, toggled by picking it */
const videoOptions = [
  { key: 'autoplay', label: 'Autoplay', icon: 'lucide-play' },
  { key: 'loop', label: 'Loop', icon: 'lucide-repeat' },
  { key: 'muted', label: 'Muted', icon: 'lucide-volume-x' },
] as const

/** The design's check at the end of a row that is on. */
const check = () =>
  h('span', {
    class: 'lucide-check ml-auto size-4 shrink-0 text-ink-gray-7',
    'aria-hidden': 'true',
    'data-checked': '',
  })
const checked = (on: boolean): Pick<DropdownOption, 'slots'> =>
  on ? { slots: { suffix: check } } : {}

// An open menu keeps the button mounted even if the node loses its selection:
// the menu portals to the document, so a click inside it is a click outside
// the editor, and unmounting the trigger mid-interaction would close the menu
// under the pointer.
const isVisible = computed(
  () => (props.selected || menuOpen.value) && props.isEditable,
)
const isVideo = computed(() => props.mediaType === 'video')
const isImage = computed(() => props.mediaType === 'image')
const isEmbed = computed(() => props.mediaType === 'embed')

const replaceLabel = computed(
  () =>
    ({
      image: 'Replace image',
      video: 'Replace',
      embed: 'Change link',
    })[props.mediaType],
)

const captionItem = (label: string): DropdownOption => ({
  label,
  icon: 'lucide-captions',
  onClick: () => emit('toggle-caption'),
  ...checked(props.showCaption),
})

const alignItems = (): DropdownOption[] =>
  alignOptions.map((align) => ({
    label: align.label,
    icon: align.icon,
    onClick: () => emit('set-align', align.value),
    ...checked(props.node.attrs.align === align.value),
  }))

const deleteItem: DropdownOption = {
  label: 'Delete',
  icon: 'lucide-trash-2',
  onClick: () => emit('remove'),
}

/** The video's menu: the design's six rows, in its order, undivided. */
const videoMenu = (): DropdownOptions => [
  {
    group: 'video',
    hideLabel: true,
    options: [
      captionItem('Caption'),
      {
        label: replaceLabel.value,
        icon: 'lucide-refresh-cw',
        onClick: () => emit('replace'),
      },
      { label: 'Align', icon: 'lucide-align-left', submenu: alignItems() },
      {
        label: 'Video settings',
        icon: 'lucide-settings-2',
        submenu: videoOptions.map((option) => ({
          label: option.label,
          icon: option.icon,
          onClick: () =>
            emit('set-video-options', {
              [option.key]: !props.node.attrs[option.key],
            }),
          ...checked(Boolean(props.node.attrs[option.key])),
        })),
      },
      {
        label: 'Duplicate',
        icon: 'lucide-copy-plus',
        onClick: () => emit('duplicate'),
      },
      deleteItem,
    ],
  },
]

/** The embed's menu (espresso-2.0, 32480-13142): six rows, undivided. */
const embedMenu = (): DropdownOptions => [
  {
    group: 'embed',
    hideLabel: true,
    options: [
      captionItem('Captions'),
      {
        label: 'Replace',
        icon: 'lucide-refresh-cw',
        onClick: () => emit('replace'),
      },
      {
        label: 'Open in Browser',
        icon: 'lucide-external-link',
        onClick: () => emit('open'),
      },
      { label: 'Align', icon: 'lucide-align-left', submenu: alignItems() },
      {
        label: 'Duplicate',
        icon: 'lucide-copy-plus',
        onClick: () => emit('duplicate'),
      },
      deleteItem,
    ],
  },
]

const options = computed<DropdownOptions>(() => {
  if (isVideo.value) return videoMenu()
  if (isEmbed.value) return embedMenu()
  const groups: DropdownOptions = [
    {
      group: 'caption',
      hideLabel: true,
      options: [captionItem('Caption')],
    },
    { group: 'Align', options: alignItems() },
  ]
  if (!isEmbed.value) {
    groups.push({
      group: 'size',
      hideLabel: true,
      options: [
        {
          label: 'Resize',
          icon: 'lucide-scaling',
          submenu: sizeOptions.map((size) => ({
            label: size.label,
            onClick: () => emit('resize', size.value),
          })),
        },
      ],
    })
  }
  groups.push({
    group: 'media',
    hideLabel: true,
    options: [
      {
        label: replaceLabel.value,
        icon: isEmbed.value ? 'lucide-link' : 'lucide-refresh-cw',
        onClick: () => emit('replace'),
      },
      {
        label: 'Duplicate',
        icon: 'lucide-copy-plus',
        onClick: () => emit('duplicate'),
      },
    ],
  })
  groups.push({
    group: 'share',
    hideLabel: true,
    options: [
      {
        label: 'Open link',
        icon: 'lucide-external-link',
        onClick: () => emit('open'),
      },
      ...(isImage.value
        ? [
            {
              label: 'Copy image',
              icon: 'lucide-copy',
              onClick: () => emit('copy'),
            },
          ]
        : []),
      ...(isEmbed.value
        ? []
        : [
            {
              label: 'Download',
              icon: 'lucide-download',
              onClick: () => emit('download'),
            },
          ]),
    ],
  })
  groups.push({ group: 'remove', hideLabel: true, options: [deleteItem] })
  return groups
})
</script>

<template>
  <div
    class="absolute top-2.5 right-2.5 z-20 items-center gap-1.5"
    :class="isVisible ? 'flex' : 'hidden'"
  >
    <button
      v-if="isEmbed"
      type="button"
      :class="MEDIA_CHROME_BUTTON"
      aria-label="Change link"
      @click.stop="emit('edit')"
      @pointerdown.stop
      @mousedown.prevent.stop
    >
      <span class="lucide-pencil size-4" aria-hidden="true" />
    </button>
    <!-- Not modal: a modal menu marks everything around its trigger
         aria-hidden as it opens, and its trigger is inside the document — so
         every block beside the picture took the attribute, ProseMirror read
         that as an edit and re-parsed them, and the menu never opened.
         Not modal, it closes when focus leaves it, so the press on the ⋯
         keeps its mousedown from the editor (`mousedown.prevent.stop`):
         let through, ProseMirror took focus back into the document on the
         release and the menu shut as soon as it had opened. -->
    <Dropdown
      v-model:open="menuOpen"
      :options="options"
      :modal="false"
      align="end"
    >
      <template #trigger>
        <button
          type="button"
          :class="MEDIA_CHROME_BUTTON"
          aria-label="Media options"
          @click.stop
          @pointerdown.stop
          @mousedown.prevent.stop
        >
          <span class="lucide-ellipsis size-4" aria-hidden="true" />
        </button>
      </template>
    </Dropdown>
  </div>
</template>
