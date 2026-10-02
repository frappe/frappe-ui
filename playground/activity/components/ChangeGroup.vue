<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  /** What is behind the label — "5+ activities from last week". */
  label: string
}>()

// Shut to begin with: the row is the control that opens the list.
const open = ref(false)
</script>

<template>
  <div class="flex flex-col">
    <button
      type="button"
      class="flex h-7 items-center gap-2 self-start text-base text-ink-gray-7"
      :aria-expanded="open"
      @click="open = !open"
    >
      {{ open ? 'Hide' : 'Show' }} {{ label }}
      <span
        class="lucide-chevrons-up-down size-4 text-ink-gray-5"
        aria-hidden="true"
      />
    </button>

    <!--
      The changes it opens out, 2px apart. The list grows from nothing rather
      than appearing: a grid row animated from `0fr` to `1fr` takes the height
      it needs without anyone having to measure it, and the fade keeps the
      first frame from reading as a jump. The 8px under the label rides along,
      so the closed state leaves no gap behind.
    -->
    <div
      class="grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none"
      :class="
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      "
    >
      <div class="overflow-hidden">
        <div class="flex flex-col gap-0.5 pt-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
