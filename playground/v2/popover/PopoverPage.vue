<script setup lang="ts">
// The Popover page: every popover type stacked down one scrolling column,
// as the Table tab stacks its patterns — a heading over each, 64 apart —
// and the outline on the right names them and scrolls to them. (The old
// "Popover type" dropdown — playground/v2/TypeDropdown.vue — is parked, not
// deleted.)
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import DefaultPopovers from './DefaultPopovers.vue'
import FlyingReactions from './FlyingReactions.vue'
import FormPopovers from './FormPopovers.vue'
import OnboardingPopover from './OnboardingPopover.vue'
import FilterPopover from './FilterPopover.vue'
import NotificationPopovers from './NotificationPopovers.vue'
import CommentPopover from './CommentPopover.vue'
import AppSwitcherPopovers from './AppSwitcherPopovers.vue'
import VoiceRecorder from './VoiceRecorder.vue'
import CallDialer from './CallDialer.vue'
import EmbedPopovers from './EmbedPopovers.vue'
import FormattingToolbar from './FormattingToolbar.vue'
import PickerPopovers from './PickerPopovers.vue'

// Reactions from the Picker grid popover fly up from the stage's corner,
// as they would over a meeting; raising a hand sends a ✋ up too.
const flying = useTemplateRef<InstanceType<typeof FlyingReactions>>('flying')
function onRaiseHand(raised: boolean) {
  if (raised) flying.value?.launch('✋')
}

// Toolbar: one switch picks the card (floating) or ghost (bare) style
const TOOLBAR_MODES = [
  { value: 'card', label: 'Card' },
  { value: 'ghost', label: 'Ghost' },
] as const
const toolbarMode = ref<'card' | 'ghost'>('card')

// The raised chip is one element that glides to the pick.
const modeRow = ref<HTMLElement | null>(null)
const modeChip = ref<{
  left: number
  top: number
  width: number
  height: number
} | null>(null)

async function placeModeChip() {
  await nextTick()
  const el = modeRow.value?.querySelector<HTMLElement>('[aria-checked="true"]')
  modeChip.value = el
    ? {
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
      }
    : null
}

watch(toolbarMode, placeModeChip)
onMounted(placeModeChip)
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections is-flow" data-sections>
      <header class="v2-flow-head">
        <h1 class="text-4xl-semibold text-ink-gray-9">Popovers</h1>
        <p class="text-p-base text-ink-gray-6">
          Every popover type, down the page.
        </p>
      </header>
      <section
        id="default"
        class="v2-section"
        data-section
        data-label="Default"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Default</h2>
        <div class="v2-frame">
          <DefaultPopovers />
        </div>
      </section>
      <section
        id="picker-grid"
        class="v2-section"
        data-section
        data-label="Picker grid"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Picker grid</h2>
        <div class="v2-frame">
          <PickerPopovers
            layout="grid"
            @react="flying?.launch($event)"
            @raise-hand="onRaiseHand"
          />
        </div>
      </section>
      <section
        id="picker-list"
        class="v2-section"
        data-section
        data-label="Picker list"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Picker list</h2>
        <div class="v2-frame">
          <PickerPopovers
            layout="list"
            @react="flying?.launch($event)"
            @raise-hand="onRaiseHand"
          />
        </div>
      </section>
      <section id="form" class="v2-section" data-section data-label="Form">
        <h2 class="text-3xl-semibold text-ink-gray-8">Form</h2>
        <div class="v2-frame">
          <FormPopovers />
        </div>
      </section>
      <section
        id="onboarding"
        class="v2-section"
        data-section
        data-label="Onboarding"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Onboarding</h2>
        <div class="v2-frame">
          <OnboardingPopover />
        </div>
      </section>
      <section id="filter" class="v2-section" data-section data-label="Filter">
        <h2 class="text-3xl-semibold text-ink-gray-8">Filter</h2>
        <div class="v2-frame">
          <FilterPopover />
        </div>
      </section>
      <section
        id="notifications"
        class="v2-section"
        data-section
        data-label="Notifications"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Notifications</h2>
        <div class="v2-frame">
          <NotificationPopovers />
        </div>
      </section>
      <section
        id="comments"
        class="v2-section"
        data-section
        data-label="Comments"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Comments</h2>
        <div class="v2-frame">
          <CommentPopover />
        </div>
      </section>
      <section
        id="app-switcher"
        class="v2-section"
        data-section
        data-label="App switcher"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">App switcher</h2>
        <div class="v2-frame">
          <AppSwitcherPopovers />
        </div>
      </section>
      <section
        id="call-dialer"
        class="v2-section"
        data-section
        data-label="Call dialer"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Call dialer</h2>
        <div class="v2-frame">
          <CallDialer />
        </div>
      </section>
      <section
        id="voice-record"
        class="v2-section"
        data-section
        data-label="Voice record"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Voice record</h2>
        <div class="v2-frame">
          <VoiceRecorder />
        </div>
      </section>
      <section
        id="embed-link"
        class="v2-section"
        data-section
        data-label="Embed link"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Embed link</h2>
        <div class="v2-frame">
          <EmbedPopovers />
        </div>
      </section>
      <!-- xs over sm, all left-aligned; Card (floating) or Ghost (bare) for both.
           The group is left-aligned within itself and centred in its frame. -->
      <section
        id="toolbar"
        class="v2-section"
        data-section
        data-label="Toolbar"
      >
        <h2 class="text-3xl-semibold text-ink-gray-8">Toolbar</h2>
        <div class="v2-frame">
          <div class="flex flex-col items-start gap-10">
            <div
              ref="modeRow"
              class="relative flex h-7 w-44 gap-1 rounded-4 bg-surface-gray-2 p-px dark:bg-surface-gray-1"
              role="radiogroup"
              aria-label="Toolbar style"
            >
              <span
                v-if="modeChip"
                class="v2-glide-chip absolute rounded-[7px] bg-surface-elevation-3 shadow-sm"
                :style="{
                  left: `${modeChip.left}px`,
                  top: `${modeChip.top}px`,
                  width: `${modeChip.width}px`,
                  height: `${modeChip.height}px`,
                }"
                aria-hidden="true"
              />
              <button
                v-for="m in TOOLBAR_MODES"
                :key="m.value"
                type="button"
                role="radio"
                :aria-checked="toolbarMode === m.value"
                class="relative flex-1 rounded-[7px] text-base transition-colors duration-200"
                :class="
                  toolbarMode === m.value
                    ? 'text-ink-gray-8'
                    : 'text-ink-gray-5 hover:text-ink-gray-7'
                "
                @click="toolbarMode = m.value"
              >
                {{ m.label }}
              </button>
            </div>

            <div class="flex flex-col items-start gap-8">
              <div
                v-for="size in ['xs', 'sm'] as const"
                :key="size"
                class="flex flex-col items-start gap-2"
              >
                <span class="text-sm text-ink-gray-5">{{ size }}</span>
                <FormattingToolbar
                  :size="size"
                  :floating="toolbarMode === 'card'"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- meeting reactions fly up from the bottom-left corner, over the scroll -->
    <FlyingReactions ref="flying" side="left" />
  </div>
</template>
