<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Node } from '@tiptap/pm/model'
import Tooltip from '#components/Tooltip/Tooltip.vue'
import type { MediaAlign } from './media-node-view-utils'

const props = defineProps<{
  node: Node
  mediaType: 'image' | 'video' | 'embed'
  isEditable: boolean
  selected: boolean
  showCaption: boolean
}>()

/**
 * Media chrome buttons, per the design (espresso-2.0, node 31403-45433): each
 * action is its OWN 28px button — `black-overlay-300` (the 36% black the frame
 * specifies), `rounded-4` (8px), a 16px white icon — spaced 4px apart, 10px in
 * from the media's top-right corner. They used to share one 65%-black pill,
 * which drew a single slab over the picture and dimmed its icons to 60% white.
 *
 * Fixed white/black scales rather than `ink-*` / `surface-*` tokens: the row is
 * painted over the media, so it holds one appearance in both themes.
 */
const BUTTON =
  'flex h-7 items-center justify-center rounded-4 text-white transition-colors'
/** Resting / hover / pressed fills follow the design's subtle-button ramp. */
const REST = 'bg-black-overlay-300 hover:bg-black-overlay-400'
const PRESSED = 'bg-black-overlay-500 hover:bg-black-overlay-500'

const emit = defineEmits<{
  (e: 'toggle-caption'): void
  (e: 'set-align', align: MediaAlign): void
  (e: 'replace'): void
  (
    e: 'set-video-options',
    options: { autoplay?: boolean; loop?: boolean; muted?: boolean },
  ): void
}>()

const showVideoOptions = ref(false)
const videoOptionsRef = ref<HTMLElement | null>(null)
const videoOptionKeys = ['autoplay', 'loop', 'muted'] as const

const alignOptions: Array<{
  value: MediaAlign
  label: string
  icon: string
}> = [
  { value: 'left', label: 'Align left', icon: 'lucide-align-left' },
  { value: 'center', label: 'Align center', icon: 'lucide-align-center' },
  { value: 'right', label: 'Align right', icon: 'lucide-align-right' },
]

const isVisible = computed(() => props.selected && props.isEditable)
const isVideo = computed(() => props.mediaType === 'video')

const replaceLabel = computed(
  () =>
    ({
      image: 'Replace image',
      video: 'Replace video',
      embed: 'Change link',
    })[props.mediaType],
)

const captionLabel = computed(() =>
  props.showCaption ? 'Remove caption' : 'Add a caption below the media',
)

function toggleVideoOptions(event: MouseEvent) {
  event.stopPropagation()
  showVideoOptions.value = !showVideoOptions.value
}

function toggleVideoOption(key: 'autoplay' | 'loop' | 'muted') {
  emit('set-video-options', { [key]: !props.node.attrs[key] })
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (videoOptionsRef.value && !videoOptionsRef.value.contains(target)) {
    showVideoOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    class="absolute top-2.5 right-2.5 z-20 max-w-[calc(100%-1.25rem)] flex-wrap items-center justify-end gap-1"
    :class="isVisible ? 'flex' : 'hidden'"
  >
    <!-- The caption toggle carries a visible word, not just an icon: it is the
         only way to discover that images can be captioned at all. It keeps the
         button style and takes the width the label needs. -->
    <Tooltip :text="captionLabel" class="flex h-7">
      <button
        type="button"
        :class="[BUTTON, showCaption ? PRESSED : REST, 'gap-1 px-2 text-p-xs']"
        :aria-label="captionLabel"
        :aria-pressed="showCaption"
        @click.stop="emit('toggle-caption')"
      >
        <span class="lucide-captions size-4" aria-hidden="true" />
        <span>Caption</span>
      </button>
    </Tooltip>

    <Tooltip :text="replaceLabel" class="flex h-7">
      <button
        type="button"
        :class="[BUTTON, REST, 'w-7']"
        :aria-label="replaceLabel"
        @click.stop="emit('replace')"
      >
        <span
          class="size-4"
          :class="mediaType === 'embed' ? 'lucide-link' : 'lucide-refresh-cw'"
        />
      </button>
    </Tooltip>

    <Tooltip
      v-for="align in alignOptions"
      :key="align.value"
      :text="align.label"
      class="flex h-7"
    >
      <button
        type="button"
        :class="[
          BUTTON,
          node.attrs.align === align.value ? PRESSED : REST,
          'w-7',
        ]"
        :aria-label="align.label"
        :aria-pressed="node.attrs.align === align.value"
        @click.stop="emit('set-align', align.value)"
      >
        <span :class="[align.icon, 'size-4']" />
      </button>
    </Tooltip>

    <button
      v-if="isVideo"
      type="button"
      :class="[BUTTON, showVideoOptions ? PRESSED : REST, 'w-7']"
      aria-label="Video options"
      @click.stop="toggleVideoOptions"
    >
      <span class="lucide-settings-2 size-4" />
    </button>

    <div
      v-if="showVideoOptions && isVideo"
      ref="videoOptionsRef"
      class="absolute top-full right-0 z-50 mt-1 w-40 rounded-4 bg-black/80 p-1 shadow-lg"
    >
      <button
        v-for="option in videoOptionKeys"
        :key="option"
        type="button"
        class="flex w-full items-center justify-between rounded-4 px-2 py-1 text-left text-xs text-white/80 hover:bg-white/10 hover:text-white"
        :aria-pressed="Boolean(node.attrs[option])"
        @click.stop="toggleVideoOption(option)"
      >
        <span class="capitalize">{{ option }}</span>
        <span
          v-if="node.attrs[option]"
          class="lucide-check size-3"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>
