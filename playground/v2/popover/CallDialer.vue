<script setup lang="ts">
// Figma: espresso-2.0 › Popover › call dialer (30880:35364) — its five
// variants as one live call. Always dark (a `data-theme="dark"` scope, so
// the dark tokens apply whatever the page theme), 280px, lg shadow:
//   compact    a 32px pill (px 8 · pr 6): 20px avatar · name · "· 00:38"
//              · a ghost end-call icon; click it to open the call again
//   default    16px radius, p 16, 40px gaps: 32px avatar · name over
//              "+91 … · 00:48" with a ghost ×; then four 28px gray actions
//              (mute · record · keypad · more), 8px apart, and a red end
//   recording  as default, under a red-dot "Recording" line
//   dial       20px radius, pt 16 · px 16 · pb 20: a small caller line, the
//              typed number with a caret, a 3 × 4 pad of 56px round keys
//              20px apart, and a 96 × 48 red end
//   notes      as default, with the live transcript between header and
//              actions
// × minimises to the pill. Ending the call leaves a "Call ended" card.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Dropdown } from '../../../src'
import carter from '../assets/popover/av-carter.png'

type View = 'default' | 'dial' | 'notes'

const emit = defineEmits<{ end: [seconds: number] }>()

const CALLER = { name: 'Carter Tanner', number: '+91 9994445770' }

const view = ref<View>('default')
const compact = ref(false)
const muted = ref(false)
const recording = ref(false)
const ended = ref(false)
const seconds = ref(38)
const dialled = ref('9486')

let clock: ReturnType<typeof setInterval> | undefined
function startClock() {
  clearInterval(clock)
  clock = setInterval(() => seconds.value++, 1000)
}
onMounted(startClock)
onBeforeUnmount(() => {
  clearInterval(clock)
  clearInterval(typing)
})

const time = computed(() => {
  const s = seconds.value
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})

function endCall() {
  clearInterval(clock)
  ended.value = true
  compact.value = false
  recording.value = false
  emit('end', seconds.value)
}
function callAgain() {
  ended.value = false
  view.value = 'default'
  seconds.value = 0
  muted.value = false
  startClock()
}

// ---- dial pad
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '⌫']
function press(key: string) {
  if (key === '⌫') dialled.value = dialled.value.slice(0, -1)
  else if (dialled.value.length < 15) dialled.value += key
}
function onKey(e: KeyboardEvent) {
  if (view.value !== 'dial' || ended.value || compact.value) return
  if (/^[0-9.]$/.test(e.key)) press(e.key)
  else if (e.key === 'Backspace') press('⌫')
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// ---- notes: the transcript types itself out while the view is open
const TRANSCRIPT =
  "It involves managing customer data, automating processes, and providing insights to make informed decisions. The morning dew glistens on blades of grass, a reminder of the night's tender embrace. As the world stirs, a sense of possibility hangs in the air, a blank canvas awaiting the strokes of life's experiences to shape another chapter in the ever-unfolding story of existence."
const words = TRANSCRIPT.split(' ')
const shownWords = ref(0)
let typing: ReturnType<typeof setInterval> | undefined
watch(view, (v) => {
  clearInterval(typing)
  if (v !== 'notes') return
  typing = setInterval(() => {
    if (shownWords.value >= words.length) return clearInterval(typing)
    shownWords.value++
  }, 120)
})
const transcript = computed(() => words.slice(0, shownWords.value).join(' '))

const moreActions = computed(() => [
  {
    label: view.value === 'notes' ? 'Hide notes' : 'Show notes',
    icon: 'lucide-notebook-pen',
    onClick: () => (view.value = view.value === 'notes' ? 'default' : 'notes'),
  },
  { label: 'Minimise', icon: 'lucide-minimize-2', onClick: () => (compact.value = true) },
])

const actionClass = (on = false) => [
  'flex size-7 items-center justify-center rounded-4 transition-colors',
  on ? 'bg-surface-gray-5 text-ink-gray-9' : 'bg-surface-gray-3 text-ink-gray-8 hover:bg-surface-gray-4',
]
</script>

<template>
  <div data-theme="dark" class="text-ink-gray-8">
    <Transition name="call-morph" mode="out-in">
      <!-- compact pill -->
      <div
        v-if="compact"
        key="compact"
        class="flex h-8 w-[220px] cursor-pointer items-center gap-1.5 rounded-full bg-surface-elevation-1 py-0.5 pl-2 pr-1.5 shadow-lg"
        role="button"
        tabindex="0"
        :aria-label="`Call with ${CALLER.name}, ${time}. Open`"
        @click="compact = false"
        @keydown.enter="compact = false"
      >
        <img :src="carter" alt="" class="size-5 rounded-full" />
        <p class="min-w-0 flex-1 truncate text-sm">
          <span class="text-ink-gray-9">{{ CALLER.name }}</span>
          <span class="text-ink-gray-5"> · {{ time }}</span>
        </p>
        <button
          type="button"
          class="flex size-6 items-center justify-center rounded-4 text-ink-gray-8 hover:bg-surface-gray-3"
          aria-label="End call"
          @click.stop="endCall"
        >
          <span class="lucide-phone size-3.5 rotate-[135deg]" />
        </button>
      </div>

      <!-- ended -->
      <div
        v-else-if="ended"
        key="ended"
        class="flex w-[280px] flex-col gap-4 rounded-7 bg-surface-elevation-1 p-4 shadow-lg"
        role="dialog"
        aria-label="Call ended"
      >
        <div class="flex items-center gap-2">
          <img :src="carter" alt="" class="size-8 rounded-full grayscale" />
          <div class="min-w-0">
            <p class="text-base-medium text-ink-gray-9">Call ended</p>
            <p class="text-sm text-ink-gray-5">{{ CALLER.name }} · {{ time }}</p>
          </div>
        </div>
        <button
          type="button"
          class="flex h-7 items-center justify-center gap-2 rounded-4 bg-surface-gray-3 text-base text-ink-gray-9 hover:bg-surface-gray-4"
          @click="callAgain"
        >
          <span class="lucide-phone size-4" />
          Call again
        </button>
      </div>

      <!-- dial pad -->
      <div
        v-else-if="view === 'dial'"
        key="dial"
        class="relative flex w-[280px] flex-col items-center gap-6 rounded-[20px] bg-surface-elevation-1 px-4 pb-5 pt-4 shadow-lg"
        role="dialog"
        aria-label="Keypad"
      >
        <div class="flex w-full flex-col gap-6">
          <button
            type="button"
            class="flex h-4 items-center gap-1.5 self-start text-base"
            @click="view = 'default'"
          >
            <img :src="carter" alt="" class="size-4 rounded-full" />
            <span class="text-ink-gray-9">{{ CALLER.name }}</span>
            <span class="text-ink-gray-5">· {{ time }}</span>
          </button>
          <p
            class="flex h-7 items-center justify-center text-[26px] tabular-nums tracking-wide text-ink-gray-9"
            aria-live="polite"
          >
            {{ dialled }}<span class="call-caret ml-0.5 h-7 w-px bg-current" />
          </p>
        </div>

        <div class="grid grid-cols-3 gap-5">
          <button
            v-for="k in KEYS"
            :key="k"
            type="button"
            class="flex size-14 items-center justify-center rounded-full bg-surface-gray-3 text-2xl text-ink-gray-9 transition-[background-color,transform] duration-100 hover:bg-surface-gray-4 active:scale-95"
            :aria-label="k === '⌫' ? 'Delete' : k"
            @click="press(k)"
          >
            <span v-if="k === '⌫'" class="lucide-delete size-5" />
            <template v-else>{{ k }}</template>
          </button>
        </div>

        <button
          type="button"
          class="flex h-12 w-24 items-center justify-center rounded-full bg-surface-red-7 transition-colors hover:bg-surface-red-8"
          aria-label="End call"
          @click="endCall"
        >
          <span class="lucide-phone size-5 rotate-[135deg] text-[#fff]" />
        </button>

        <button
          type="button"
          class="absolute right-3 top-3 flex size-6 items-center justify-center rounded-4 text-ink-gray-8 hover:bg-surface-gray-3"
          aria-label="Minimise"
          @click="compact = true"
        >
          <span class="lucide-x size-3.5" />
        </button>
      </div>

      <!-- default · recording · notes -->
      <div
        v-else
        key="call"
        class="relative flex w-[280px] flex-col gap-10 rounded-7 bg-surface-elevation-1 p-4 shadow-lg"
        role="dialog"
        :aria-label="`Call with ${CALLER.name}`"
      >
        <div class="flex flex-col gap-3">
          <Transition name="call-line">
            <p v-if="recording" class="flex h-4 items-center gap-1 text-base text-ink-gray-9">
              <span class="flex size-4 items-center justify-center">
                <span class="size-2.5 animate-pulse rounded-full bg-current text-ink-red-5" />
              </span>
              Recording
            </p>
          </Transition>

          <div class="flex items-center gap-2 pr-6">
            <img :src="carter" alt="" class="size-8 rounded-full" />
            <div class="min-w-0">
              <p class="truncate text-base-medium text-ink-gray-9">{{ CALLER.name }}</p>
              <p class="truncate text-base text-ink-gray-5">
                {{ CALLER.number }}<template v-if="!recording"> · {{ time }}</template>
              </p>
            </div>
          </div>

          <p
            v-if="view === 'notes'"
            class="mt-1 max-h-[231px] overflow-y-auto text-p-base text-ink-gray-8"
            aria-live="polite"
          >
            {{ transcript }}<span v-if="shownWords < words.length" class="call-caret ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-current" />
          </p>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <button
              type="button"
              :class="actionClass(muted)"
              :aria-pressed="muted"
              :aria-label="muted ? 'Unmute' : 'Mute'"
              @click="muted = !muted"
            >
              <span :class="muted ? 'lucide-mic-off' : 'lucide-volume-off'" class="size-4" />
            </button>
            <button
              type="button"
              :class="actionClass()"
              :aria-pressed="recording"
              :aria-label="recording ? 'Stop recording' : 'Record call'"
              @click="recording = !recording"
            >
              <span v-if="recording" class="size-3.5 rounded-full bg-current text-ink-red-5" />
              <span v-else class="lucide-circle-stop size-4" />
            </button>
            <button type="button" :class="actionClass()" aria-label="Keypad" @click="view = 'dial'">
              <span class="lucide-grip size-4" />
            </button>
            <Dropdown :options="moreActions" align="start">
              <button type="button" :class="actionClass()" aria-label="More">
                <span class="lucide-ellipsis size-4" />
              </button>
            </Dropdown>
          </div>
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-4 bg-surface-red-7 transition-colors hover:bg-surface-red-8"
            aria-label="End call"
            @click="endCall"
          >
            <span class="lucide-phone size-4 rotate-[135deg] text-[#fff]" />
          </button>
        </div>

        <button
          type="button"
          class="absolute right-3 top-3 flex size-6 items-center justify-center rounded-4 text-ink-gray-8 hover:bg-surface-gray-3"
          aria-label="Minimise"
          @click="compact = true"
        >
          <span class="lucide-x size-3.5" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style>
.call-morph-enter-active,
.call-morph-leave-active {
  transition:
    opacity 160ms ease,
    transform 200ms cubic-bezier(0.32, 0.72, 0, 1);
}
.call-morph-enter-from,
.call-morph-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
.call-line-enter-active,
.call-line-leave-active {
  transition: opacity 160ms ease;
}
.call-line-enter-from,
.call-line-leave-to {
  opacity: 0;
}
@keyframes call-caret {
  50% {
    opacity: 0;
  }
}
.call-caret {
  animation: call-caret 1s steps(1) infinite;
}
</style>
