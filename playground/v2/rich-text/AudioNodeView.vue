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

// Each glyph is made once. A component built inside the template would be a
// new one on every render, and while the clip plays the bar renders every
// frame: the glyph would be torn down and remade under the pointer, and a
// press that begins on one glyph and ends on its replacement is no click at
// all — the pause button would not answer.
const icon =
  (name: string): Component =>
  () =>
    h(RteIcon, { name })
const playIcon = icon('play')
const pauseIcon = icon('pause')
const volumeIcon = icon('volume-min')
const mutedIcon = icon('volume-off')
const moreIcon = icon('dot-horizontal')
// a class string written out in full: Tailwind's scanner only generates
// the glyph for a name it can read in the source
const lucide =
  (classes: string): Component =>
  () =>
    h('span', { class: classes, 'aria-hidden': 'true' })
const downloadIcon = lucide('lucide-download size-4')
const removeIcon = lucide('lucide-trash-2 size-4')

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

// the clip's own `timeupdate` comes only four or so times a second, which
// walks the knob along in visible steps; while the clip plays, the position
// is read every frame instead. `timeupdate` stays on for a background tab,
// where frames stop but the clip does not.
let frame = 0
function tick() {
  const el = audio.value
  if (!el || el.paused) {
    frame = 0
    return
  }
  current.value = el.currentTime
  frame = requestAnimationFrame(tick)
}
function onPlay() {
  playing.value = true
  if (!frame) frame = requestAnimationFrame(tick)
}
function onPause() {
  playing.value = false
  cancelAnimationFrame(frame)
  frame = 0
  onTime()
}
function onEnded() {
  onPause()
}
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  audio.value?.pause()
})

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
        icon: downloadIcon,
        onClick: () => {
          const a = document.createElement('a')
          a.href = props.node.attrs.src
          a.download = props.node.attrs.title || 'audio'
          a.click()
        },
      },
      {
        label: 'Remove',
        icon: removeIcon,
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
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    />
    <!-- 5px in, not 6: the file's 6px is measured inside the 1px rule -->
    <!-- 38px for the 28px button, so the knob's 14px clears the button -->
    <div class="flex w-[38px] shrink-0 justify-center">
      <Button
        variant="ghost"
        size="sm"
        :icon="playing ? pauseIcon : playIcon"
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
        :icon="muted ? mutedIcon : volumeIcon"
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
            :icon="moreIcon"
            label="More"
            :class="open && 'bg-surface-gray-3'"
          />
        </template>
      </Dropdown>
    </div>
  </NodeViewWrapper>
</template>
