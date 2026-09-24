<script setup lang="ts">
// Figma: espresso-2.0 › Popover › form — both 256px on the raised popover
// surface, 12px radius, lg shadow, with a ghost xs × in the 24px header.
//   sm  (31731:24634) "Transitions": pt 8 · pr 8 · pb 8 · pl 12, 8px gaps;
//       14 medium title; 28px rows 8px apart of a 14 gray-500 label and,
//       on the right, a ghost select (Trigger, Delay) or a 118px segmented
//       control of four arrows (Direction: gray-2 track, p 1, the pick
//       raised)
//   md  (30867:37579) "My page": pt 8, 12px gaps; 16 medium title (pl 12 ·
//       pr 8); px 12 fields 12px apart — 13 gray-600 label · 6px · outline
//       input with a ghost × to clear (in dark, filled like the card, not
//       sunk a shade below it, as in the modals); px 12 · pb 12 footer, 6px apart:
//       subtle sm "Open in desk ↗" and solid sm "View published page"
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { Button, Select, TextInput } from '../../../src'

type Direction = 'up' | 'down' | 'left' | 'right'

const emit = defineEmits<{
  close: []
  openInDesk: [route: string]
  viewPage: [route: string]
}>()

// ---- sm: transitions
const TRIGGERS = ['On click', 'On hover', 'While pressing', 'After delay'].map(
  (t) => ({ label: t, value: t }),
)
const DELAYS = ['0s', '0.25s', '0.50s', '0.75s', '1.00s', '1.50s', '2.00s'].map(
  (d) => ({ label: d, value: d }),
)
const DIRECTIONS: { value: Direction; label: string; icon: string }[] = [
  { value: 'up', label: 'Up', icon: 'lucide-arrow-up' },
  { value: 'down', label: 'Down', icon: 'lucide-arrow-down' },
  { value: 'left', label: 'Left', icon: 'lucide-arrow-left' },
  { value: 'right', label: 'Right', icon: 'lucide-arrow-right' },
]

const transition = reactive({
  trigger: 'On click',
  delay: '0.50s',
  direction: 'down' as Direction,
})

// The raised chip is one element that glides to the picked arrow, rather
// than a background lighting up in place — the same motion the List page's
// picker uses. It is measured from the button, so it keeps up with the
// track's own sizing.
const dirRow = ref<HTMLElement | null>(null)
const dirChip = ref<{ left: number; top: number; width: number; height: number } | null>(null)

async function placeChip() {
  await nextTick()
  const el = dirRow.value?.querySelector<HTMLElement>('[aria-checked="true"]')
  dirChip.value = el
    ? { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight }
    : null
}

watch(() => transition.direction, placeChip)
onMounted(placeChip)

// ---- md: page settings
const page = reactive({ title: 'Frappe Technologies', route: 'pages/frappe' })
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-10">
    <!-- sm: transitions -->
    <div
      class="flex w-64 flex-col gap-2 rounded-6 bg-surface-elevation-2 py-2 pl-3 pr-2 shadow-lg"
      role="dialog"
      aria-label="Transitions"
    >
      <div class="flex h-6 items-center gap-2">
        <p class="flex-1 truncate text-base-medium text-ink-gray-7">Transitions</p>
        <Button variant="ghost" size="xs" label="Close" @click="emit('close')">
          <template #icon><span class="lucide-x size-3.5 text-ink-gray-7" /></template>
        </Button>
      </div>

      <div class="flex flex-col gap-2">
        <div class="form-pop-row">
          <span>Trigger</span>
          <Select
            v-model="transition.trigger"
            variant="ghost"
            :options="TRIGGERS"
            class="w-auto"
            aria-label="Trigger"
          />
        </div>
        <div class="form-pop-row">
          <span>Delay</span>
          <Select
            v-model="transition.delay"
            variant="ghost"
            :options="DELAYS"
            class="w-auto"
            aria-label="Delay"
          />
        </div>
        <div class="form-pop-row">
          <span id="transition-direction">Direction</span>
          <div
            ref="dirRow"
            class="relative flex h-7 w-[118px] items-center gap-1 rounded-4 bg-surface-gray-2 p-px dark:bg-surface-gray-1"
            role="radiogroup"
            aria-labelledby="transition-direction"
          >
            <span
              v-if="dirChip"
              class="v2-glide-chip absolute rounded-[7px] bg-surface-elevation-3 shadow-sm"
              :style="{
                left: `${dirChip.left}px`,
                top: `${dirChip.top}px`,
                width: `${dirChip.width}px`,
                height: `${dirChip.height}px`,
              }"
              aria-hidden="true"
            />
            <button
              v-for="d in DIRECTIONS"
              :key="d.value"
              type="button"
              role="radio"
              :aria-checked="transition.direction === d.value"
              :aria-label="d.label"
              class="relative flex h-[26px] flex-1 items-center justify-center rounded-[7px] transition-colors duration-200"
              :class="
                transition.direction === d.value
                  ? 'text-ink-gray-8'
                  : 'text-ink-gray-5 hover:text-ink-gray-7'
              "
              @click="transition.direction = d.value"
            >
              <span :class="d.icon" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- md: page settings -->
    <div
      class="flex w-64 flex-col gap-3 rounded-6 bg-surface-elevation-2 pt-2 shadow-lg dark:[--surface-base:var(--surface-elevation-2)]"
      role="dialog"
      aria-label="My page"
    >
      <div class="flex h-6 items-center gap-2 pl-3 pr-2">
        <p class="flex-1 truncate text-lg-medium text-ink-gray-7">My page</p>
        <Button variant="ghost" size="xs" label="Close" @click="emit('close')">
          <template #icon><span class="lucide-x size-3.5 text-ink-gray-7" /></template>
        </Button>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3 px-3">
          <label class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-6">Page title</span>
            <TextInput v-model="page.title" variant="outline" placeholder="Untitled page">
              <template v-if="page.title" #suffix>
                <Button
                  variant="ghost"
                  size="xs"
                  class="-mr-1.5"
                  label="Clear page title"
                  @click="page.title = ''"
                >
                  <template #icon>
                    <span class="lucide-x size-3.5 text-ink-gray-7" />
                  </template>
                </Button>
              </template>
            </TextInput>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm text-ink-gray-6">Route</span>
            <TextInput v-model="page.route" variant="outline" placeholder="pages/my-page">
              <template v-if="page.route" #suffix>
                <Button
                  variant="ghost"
                  size="xs"
                  class="-mr-1.5"
                  label="Clear route"
                  @click="page.route = ''"
                >
                  <template #icon>
                    <span class="lucide-x size-3.5 text-ink-gray-7" />
                  </template>
                </Button>
              </template>
            </TextInput>
          </label>
        </div>

        <div class="flex flex-col gap-1.5 px-3 pb-3">
          <Button
            variant="subtle"
            size="sm"
            class="w-full dark:!bg-surface-gray-3"
            @click="emit('openInDesk', page.route)"
          >
            Open in desk
            <template #suffix>
              <span class="lucide-arrow-up-right size-4" />
            </template>
          </Button>
          <Button
            variant="solid"
            size="sm"
            class="w-full"
            :disabled="!page.route.trim()"
            @click="emit('viewPage', page.route)"
          >
            View published page
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* a 28px row: 14 gray-500 label on the left, the control on the right */
.form-pop-row {
  @apply flex h-7 items-center justify-between gap-2;
}
.form-pop-row > span:first-child {
  @apply truncate text-base text-ink-gray-5;
}
</style>
