<template>
  <!--
    Espresso 2.0 `cell new` (component 29412:63906 and siblings): a horizontal
    row with an optional leading slot, a title/description stack that takes the
    remaining width, and a trailing control. 8px between the three regions, and
    — unlike frappe-ui's `SettingsRow` — no vertical padding: a section's
    `gap-6` supplies the 24px rhythm between cells instead.
  -->
  <div class="flex items-center gap-2">
    <div v-if="$slots.prefix" class="flex shrink-0 items-center justify-center">
      <slot name="prefix" />
    </div>
    <div class="min-w-0 flex-1">
      <!-- `primary`: title and any inline hint, 4px apart on a shared baseline. -->
      <div class="flex items-center gap-1">
        <component
          :is="labelFor ? 'label' : 'div'"
          :for="labelFor"
          class="text-ink-gray-8"
          :class="[
            emphasis ? 'text-lg-semibold' : 'text-base-medium',
            { 'cursor-pointer': labelFor },
          ]"
        >
          {{ title }}
        </component>
        <slot name="badge" />
      </div>
      <!--
        The `avatar` cell's description is the 13px caption under a person's
        name, 6px below it; every other cell uses the 14px/21px paragraph
        style, 4px below the title.
      -->
      <div
        v-if="description || $slots.description"
        class="text-ink-gray-6"
        :class="emphasis ? 'mt-1.5 text-sm' : 'mt-1 text-p-base'"
      >
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
    <!-- `suffix-slot`: trailing controls sit 4px apart. -->
    <div class="flex shrink-0 items-center justify-end gap-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Cell title, rendered on the left. */
  title: string
  /** Optional helper text under the title. */
  description?: string
  /** Id of the trailing control, so the title acts as its `<label>`. */
  labelFor?: string
  /**
   * Renders the title at the 16px/600 the `avatar` cell uses for a person's
   * name, instead of the 14px/500 every other cell variant uses.
   */
  emphasis?: boolean
}>()

defineSlots<{
  /** Trailing control (button, switch, select). */
  default?: () => any
  /** Leading icon or avatar. */
  prefix?: () => any
  /** Badge rendered inline after the title. */
  badge?: () => any
  /** Rich description markup, in place of the plain `description` prop. */
  description?: () => any
}>()
</script>
