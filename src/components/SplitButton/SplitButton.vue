<template>
  <div
    data-slot="root"
    :data-variant="variant"
    :data-size="size"
    :data-color="theme"
    class="inline-flex"
    :class="variant === 'outline' ? '' : 'gap-px'"
  >
    <!-- `relative` and `focus-visible:z-10` keep each half's focus ring
         drawn above its neighbor. -->
    <Button
      data-slot="action"
      :label="label"
      :icon-left="iconLeft"
      :variant="variant"
      :theme="theme"
      :size="size"
      :tooltip="tooltip"
      :loading="loading"
      :loading-text="loadingText"
      :disabled="disabled"
      class="relative rounded-r-none focus-visible:z-10"
      @click="emit('click', $event)"
    />
    <Dropdown :options="options" :align="align" :disabled="isMenuDisabled">
      <!-- Outline halves overlap by 1px so the seam is one border wide,
           and the hovered half's darker border draws on top. -->
      <Button
        icon="lucide-chevron-down"
        :aria-label="menuLabel"
        :variant="variant"
        :theme="theme"
        :size="size"
        :disabled="isMenuDisabled"
        class="relative rounded-l-none focus-visible:z-10"
        :class="variant === 'outline' ? '-ml-px hover:z-10' : ''"
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
  theme: 'gray',
  size: 'sm',
  loading: false,
  disabled: false,
  align: 'end',
})

const emit = defineEmits<SplitButtonEmits>()

// A busy main action locks the menu too: its actions are other ways to do
// the same thing, and starting one mid-request would race the first.
const isMenuDisabled = computed(() => props.disabled || props.loading)
</script>
