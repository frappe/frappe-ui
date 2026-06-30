<template>
  <div class="flex items-center gap-8 py-3.5">
    <div class="min-w-0 flex-1">
      <component
        :is="resolvedFor ? 'label' : 'div'"
        :for="resolvedFor"
        class="text-base-medium block text-ink-gray-8"
        :class="{ 'cursor-pointer': resolvedFor }"
      >
        {{ title }}
      </component>
      <div v-if="description" class="mt-1 text-base leading-5 text-ink-gray-6">
        {{ description }}
      </div>
    </div>
    <div ref="control" class="flex shrink-0 items-start justify-end">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue'

const props = defineProps<{
  /** Setting name, rendered on the left. */
  title: string
  /** Optional helper text under the title. */
  description?: string
  /** Explicit id to associate the title label with. Overrides auto-detection. */
  labelFor?: string
}>()

// frappe-ui form controls (Switch, Checkbox, …) render their interactive
// element with `data-slot="control"` and an auto-generated id. Detect it so the
// title acts as a clickable <label> without the caller wiring up an id.
const CONTROL_SELECTOR =
  '[data-slot="control"], [role="switch"], [role="checkbox"], input, select, textarea'

const control = ref<HTMLElement | null>(null)
const detectedFor = ref<string | undefined>()
const resolvedFor = computed(() => props.labelFor ?? detectedFor.value)

function syncControlId() {
  if (props.labelFor) return
  detectedFor.value =
    control.value?.querySelector<HTMLElement>(CONTROL_SELECTOR)?.id || undefined
}

onMounted(syncControlId)
onUpdated(syncControlId)
</script>
