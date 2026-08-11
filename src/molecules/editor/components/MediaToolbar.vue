<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Node } from '@tiptap/pm/model'
import Dropdown from '#components/Dropdown/Dropdown.vue'
import type { DropdownOptions } from '#components/Dropdown/types'
import { MEDIA_CHROME_BUTTON, type MediaAlign } from './media-node-view-utils'

const props = defineProps<{
  node: Node
  mediaType: 'image' | 'video' | 'embed'
  isEditable: boolean
  selected: boolean
  showCaption: boolean
}>()

/**
 * Media chrome, per the design (espresso-2.0, node 31403-45433): a single
 * `MEDIA_CHROME_BUTTON` 10px in from the top-right corner, with every action
 * in the menu behind it.
 *
 * They used to sit in the frame as six buttons sharing one 65%-black pill — a
 * slab of chrome across the top of every selected image, most of it rarely
 * used.
 */
const emit = defineEmits<{
  (e: 'toggle-caption'): void
  (e: 'set-align', align: MediaAlign): void
  (e: 'replace'): void
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

const videoOptions = [
  { key: 'autoplay', label: 'Autoplay' },
  { key: 'loop', label: 'Loop' },
  { key: 'muted', label: 'Muted' },
] as const

// An open menu keeps the button mounted even if the node loses its selection:
// the menu portals to the document, so a click inside it is a click outside
// the editor, and unmounting the trigger mid-interaction would close the menu
// under the pointer.
const isVisible = computed(
  () => (props.selected || menuOpen.value) && props.isEditable,
)
const isVideo = computed(() => props.mediaType === 'video')

const replaceLabel = computed(
  () =>
    ({
      image: 'Replace image',
      video: 'Replace video',
      embed: 'Change link',
    })[props.mediaType],
)

const options = computed<DropdownOptions>(() => [
  {
    group: 'caption',
    hideLabel: true,
    options: [
      {
        label: 'Caption',
        icon: 'lucide-captions',
        switch: true,
        switchValue: props.showCaption,
        onClick: () => emit('toggle-caption'),
      },
    ],
  },
  {
    group: 'Align',
    options: alignOptions.map((align) => ({
      label: align.label,
      icon: align.icon,
      selected: props.node.attrs.align === align.value,
      onClick: () => emit('set-align', align.value),
    })),
  },
  ...(isVideo.value
    ? [
        {
          group: 'Playback',
          options: videoOptions.map((option) => ({
            label: option.label,
            switch: true as const,
            switchValue: Boolean(props.node.attrs[option.key]),
            onClick: (value: boolean) =>
              emit('set-video-options', { [option.key]: value }),
          })),
        },
      ]
    : []),
  {
    group: 'media',
    hideLabel: true,
    options: [
      {
        label: replaceLabel.value,
        icon: props.mediaType === 'embed' ? 'lucide-link' : 'lucide-refresh-cw',
        onClick: () => emit('replace'),
      },
    ],
  },
])
</script>

<template>
  <div
    class="absolute top-2.5 right-2.5 z-20 items-center"
    :class="isVisible ? 'flex' : 'hidden'"
  >
    <Dropdown v-model:open="menuOpen" :options="options" align="end">
      <template #trigger>
        <button
          type="button"
          :class="MEDIA_CHROME_BUTTON"
          aria-label="Media options"
          @click.stop
          @pointerdown.stop
        >
          <span class="lucide-ellipsis size-4" aria-hidden="true" />
        </button>
      </template>
    </Dropdown>
  </div>
</template>
