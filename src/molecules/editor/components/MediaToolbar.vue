<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Node } from '@tiptap/pm/model'
import Tooltip from '@components/Tooltip/Tooltip.vue'
import { alignIcon, type MediaAlign } from './media-node-view-utils'

const props = defineProps<{
  node: Node
  isVideo: boolean
  isEditable: boolean
  selected: boolean
  showCaption: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-caption'): void
  (e: 'set-align', align: MediaAlign): void
}>()

const showAlignPopper = ref(false)
const alignPopperRef = ref<HTMLElement | null>(null)

const currentAlignIcon = computed(() => alignIcon(props.node.attrs.align))
const isVisible = computed(() => props.selected && props.isEditable)

function toggleAlignPopper(event: MouseEvent) {
  event.stopPropagation()
  showAlignPopper.value = !showAlignPopper.value
}

function chooseAlign(align: MediaAlign) {
  emit('set-align', align)
  showAlignPopper.value = false
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (alignPopperRef.value && !alignPopperRef.value.contains(target)) {
    showAlignPopper.value = false
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
    class="absolute top-2 right-2 items-center bg-black/65 px-1.5 py-1 gap-2 rounded"
    :class="isVisible ? 'flex' : 'hidden'"
  >
    <button @click.stop="emit('toggle-caption')">
      <span
        class="lucide-captions size-4"
        :class="[showCaption ? 'text-ink-white' : 'text-ink-gray-4']"
      />
    </button>

    <button
      v-if="!isVideo"
      class="hover:text-ink-white"
      :class="[node.attrs.align ? 'text-ink-white' : 'text-ink-gray-4']"
      @click.stop="toggleAlignPopper"
    >
      <span :class="[currentAlignIcon, 'size-4']" />
    </button>

    <div
      v-if="showAlignPopper && !isVideo"
      ref="alignPopperRef"
      class="absolute top-full mt-1 right-6 bg-black/65 rounded shadow-lg px-1.5 py-1 z-50 gap-2.5 flex items-center"
    >
      <Tooltip text="Align left" class="h-5">
        <button
          class="hover:text-ink-white"
          :class="node.attrs.align === 'left' ? 'text-ink-white' : 'text-ink-gray-4'"
          @click="chooseAlign('left')"
        >
          <span class="lucide-align-left size-4" />
        </button>
      </Tooltip>
      <Tooltip text="Align center" class="h-5">
        <button
          class="hover:text-ink-white"
          :class="node.attrs.align === 'center' ? 'text-ink-white' : 'text-ink-gray-4'"
          @click="chooseAlign('center')"
        >
          <span class="lucide-align-center size-4" />
        </button>
      </Tooltip>
      <Tooltip text="Align right" class="h-5">
        <button
          class="hover:text-ink-white"
          :class="node.attrs.align === 'right' ? 'text-ink-white' : 'text-ink-gray-4'"
          @click="chooseAlign('right')"
        >
          <span class="lucide-align-right size-4" />
        </button>
      </Tooltip>
    </div>
  </div>
</template>
