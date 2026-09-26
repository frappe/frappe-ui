<script setup lang="ts">
// Espresso "form-field new" (size sm): a 14px ink-gray-5 label with an
// optional red asterisk, 6px above the frappe-ui control in the slot.
// frappe-ui's built-in input label is 13px ink-gray-6, so it's left unset.
defineProps<{ label: string; required?: boolean }>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <span class="flex items-center gap-1 text-base text-ink-gray-5">
      {{ label }}
      <template v-if="required">
        <span class="text-sm text-ink-red-5" aria-hidden="true">*</span>
        <span class="sr-only">(required)</span>
      </template>
    </span>
    <slot />
  </div>
</template>
