<script setup lang="ts">
// The Popover page: every popover type, one to a screen. The stage scrolls
// and snaps between them, so a scroll brings the next one up; the outline on
// the right names them and scrolls to them. (The old "Popover type" dropdown
// — playground/v2/TypeDropdown.vue — is parked, not deleted.)
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
    <div class="v2-sections" data-sections>
      <section
        id="default"
        class="v2-section"
        data-section
        data-label="Default"
      >
        <DefaultPopovers />
      </section>
      <section
        id="picker-grid"
        class="v2-section"
        data-section
        data-label="Picker grid"
      >
        <PickerPopovers
          layout="grid"
          @react="flying?.launch($event)"
          @raise-hand="onRaiseHand"
        />
      </section>
      <section
        id="picker-list"
        class="v2-section"
        data-section
        data-label="Picker list"
      >
        <PickerPopovers
          layout="list"
          @react="flying?.launch($event)"
          @raise-hand="onRaiseHand"
        />
      </section>
      <section id="form" class="v2-section" data-section data-label="Form">
        <FormPopovers />
      </section>
      <section
        id="onboarding"
        class="v2-section"
        data-section
        data-label="Onboarding"
      >
        <OnboardingPopover />
      </section>
      <section id="filter" class="v2-section" data-section data-label="Filter">
        <FilterPopover />
      </section>
      <section
        id="notifications"
        class="v2-section"
        data-section
        data-label="Notifications"
      >
        <NotificationPopovers />
      </section>
      <section
        id="comments"
        class="v2-section"
        data-section
        data-label="Comments"
      >
        <CommentPopover />
      </section>
      <section
        id="app-switcher"
        class="v2-section"
        data-section
        data-label="App switcher"
      >
        <AppSwitcherPopovers />
      </section>
      <section
        id="call-dialer"
        class="v2-section"
        data-section
        data-label="Call dialer"
      >
        <CallDialer />
      </section>
      <section
        id="voice-record"
        class="v2-section"
        data-section
        data-label="Voice record"
      >
        <VoiceRecorder />
      </section>
      <section
        id="embed-link"
        class="v2-section"
        data-section
        data-label="Embed link"
      >
        <EmbedPopovers />
      </section>
      <!-- xs over sm, all left-aligned; Card (floating) or Ghost (bare) for both -->
      <section
        id="toolbar"
        class="v2-section"
        data-section
        data-label="Toolbar"
      >
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
      </section>
    </div>

    <!-- meeting reactions fly up from the bottom-left corner, over the scroll -->
    <FlyingReactions ref="flying" side="left" />
  </div>
</template>
