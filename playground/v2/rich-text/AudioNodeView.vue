<script setup lang="ts">
// Figma: espresso-2.0 › Recording (31403:45371). A 42px bar on gray-50,
// ruled and on a 12px radius, 2px/6px in: a 28px ghost play button, an 8px
// gap, the slider, the time as 0:15 / 32:48 in 14px gray-500, then volume
// and ⋯ as two more 28px ghost buttons 4px apart. The bar is the library's
// Button, Slider and Dropdown over a hidden <audio>; the slider is drawn
// to the file's 2px track and 14px knob.
import { computed, h, onBeforeUnmount, ref, watch, type Component } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { Button, Dropdown, Slider } from '../../../src'
import type { DropdownOptions } from '../../../src/components/Dropdown/types'
import RteIcon from './RteIcon.vue'

const props = defineProps(nodeViewProps)

const icon =
  (name: string): Component =>
  () =>
    h(RteIcon, { name })
const lucide =
  (name: string): Component =>
  () =>
    h('span', { class: `lucide-${name} size-4`, 'aria-hidden': 'true' })

const audio = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const muted = ref(false)
const duration = ref(0)
const current = ref(0)
const rate = ref(1)
// the slider holds the position while a drag is under way, so the clip's
// own ticks do not pull the knob back until the drag lands
const scrubbing = ref(false)
const position = ref([0])

watch(current, (t) => {
  if (!scrubbing.value) position.value = [t]
})

function onSlide(value: number[]) {
  scrubbing.value = true
  position.value = value
}
function onCommit(value: number[]) {
  scrubbing.value = false
  seek(value[0])
}
function seek(t: number) {
  const el = audio.value
  if (!el) return
  el.currentTime = t
  current.value = t
}

function toggle() {
  const el = audio.value
  if (!el) return
  if (el.paused) void el.play()
  else el.pause()
}
function toggleMute() {
  const el = audio.value
  if (!el) return
  el.muted = !el.muted
  muted.value = el.muted
}
function setRate(r: number) {
  rate.value = r
  if (audio.value) audio.value.playbackRate = r
}

function onLoaded() {
  duration.value = audio.value?.duration ?? 0
}
function onTime() {
  current.value = audio.value?.currentTime ?? 0
}
function onEnded() {
  playing.value = false
}
onBeforeUnmount(() => audio.value?.pause())

// 0:15, and 1:02:03 past the hour, as the file's 0:15 / 32:48
function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds || 0))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}
const time = computed(
  () => `${clock(current.value)} / ${clock(duration.value)}`,
)

const RATES = [0.5, 1, 1.5, 2]
const moreOptions = computed<DropdownOptions>(() => [
  {
    group: 'Speed',
    options: RATES.map((r) => ({
      label: `${r}×`,
      selected: rate.value === r,
      onClick: () => setRate(r),
    })),
  },
  {
    group: 'Clip',
    options: [
      {
        label: 'Download',
        icon: lucide('download'),
        onClick: () => {
          const a = document.createElement('a')
          a.href = props.node.attrs.src
          a.download = props.node.attrs.title || 'audio'
          a.click()
        },
      },
      {
        label: 'Remove',
        icon: lucide('trash-2'),
        onClick: () => props.deleteNode(),
      },
    ],
  },
])
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="rte-player flex h-[42px] w-full items-center gap-2 rounded-6 border border-outline-gray-1 bg-surface-gray-1 px-[5px] py-0.5"
    data-type="audio"
    :aria-label="node.attrs.title || 'Audio'"
  >
    <audio
      ref="audio"
      :src="node.attrs.src"
      preload="metadata"
      @loadedmetadata="onLoaded"
      @durationchange="onLoaded"
      @timeupdate="onTime"
      @play="playing = true"
      @pause="playing = false"
      @ended="onEnded"
    />
    <!-- 5px in, not 6: the file's 6px is measured inside the 1px rule -->
    <!-- 38px for the 28px button, so the knob's 14px clears the button -->
    <div class="flex w-[38px] shrink-0 justify-center">
      <Button
        variant="ghost"
        size="sm"
        :icon="playing ? lucide('pause') : icon('play')"
        :label="playing ? 'Pause' : 'Play'"
        @click="toggle"
      />
    </div>
    <Slider
      :model-value="position"
      :max="duration || 1"
      :step="0.1"
      size="sm"
      class="rte-player-slider min-w-0 flex-1"
      aria-label="Position"
      @update:model-value="onSlide"
      @value-commit="onCommit"
    />
    <span
      class="shrink-0 text-base tabular-nums text-ink-gray-5"
      aria-live="off"
      >{{ time }}</span
    >
    <div class="flex shrink-0 items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        :icon="muted ? lucide('volume-x') : icon('volume-min')"
        :label="muted ? 'Unmute' : 'Mute'"
        :aria-pressed="muted"
        @click="toggleMute"
      />
      <!-- non-modal: a modal menu hides every other block of the document
           from assistive tech, which ProseMirror reads as an edit -->
      <Dropdown :options="moreOptions" side="bottom" align="end" :modal="false">
        <template #default="{ open }">
          <Button
            variant="ghost"
            size="sm"
            :icon="icon('dot-horizontal')"
            label="More"
            :class="open && 'bg-surface-gray-3'"
          />
        </template>
      </Dropdown>
    </div>
  </NodeViewWrapper>
</template>
