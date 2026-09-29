<template>
  <div
    data-slot="root"
    :data-variant="variant"
    :data-size="size"
    class="inline-flex"
  >
    <!-- Every variant joins the same way, so switching variants moves
         nothing: both halves have a 1px border and the chevron overlaps
         the action by it. Outline shows that border as the seam; the
         others keep it transparent and paint the shared edge in the page
         color, like a 1px gap. Both halves paint it, so it shows whichever
         half is on top. `relative` with `z-10` on hover and focus draws
         the active half's border and ring on top. -->
    <Button
      data-slot="action"
      :label="label"
      :icon-left="iconLeft"
      :variant="variant"
      :size="size"
      :tooltip="tooltip"
      :loading="loading"
      :loading-text="loadingText"
      :disabled="disabled"
      class="relative rounded-r-none hover:z-10 focus-visible:z-10"
      :class="
        variant === 'outline'
          ? ''
          : [transparentBorder, 'border-r-[var(--surface-base)]']
      "
      @click="emit('click', $event)"
    />
    <Dropdown :options="options" :align="align" :disabled="isMenuDisabled">
      <Button
        icon="lucide-chevron-down"
        :aria-label="menuLabel"
        :variant="variant"
        :size="size"
        :disabled="isMenuDisabled"
        class="relative -ml-px rounded-l-none hover:z-10 focus-visible:z-10"
        :class="
          variant === 'outline'
            ? ''
            : [transparentBorder, 'border-l-[var(--surface-base)]']
        "
      />
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '../Button'
import { Dropdown } from '../Dropdown'
import type { SplitButtonEmits, SplitButtonProps } from './types'

const props = withDefaults(defineProps<SplitButtonProps>(), {
  menuLabel: 'More options',
  variant: 'subtle',
  size: 'sm',
  loading: false,
  disabled: false,
  align: 'end',
})

const emit = defineEmits<SplitButtonEmits>()

// A busy main action locks the menu too: its actions are other ways to do
// the same thing, and starting one mid-request would race the first.
// Outline already draws a 1px border on both halves. The others get a
// transparent one, so both halves are the same size in every variant.
const transparentBorder = 'border border-transparent'

const isMenuDisabled = computed(() => props.disabled || props.loading)
</script>
