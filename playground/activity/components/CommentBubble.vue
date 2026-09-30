<script setup lang="ts">
defineProps<{
  /** The person the comment opens with, set in medium. */
  mention: string
  /** The rest of it. */
  text: string
}>()
</script>

<template>
  <!--
    The bubble hugs its text and stops there — it never runs the width of the
    entry. Grey, unlike the message cards, which sit on elevation-1.
  -->
  <div class="w-fit rounded-6 bg-surface-gray-1 px-3 py-[7.5px]">
    <p class="text-p-base text-ink-gray-6">
      <span class="font-medium text-ink-gray-7">{{ mention }}</span
      >{{ text }}
    </p>
  </div>
</template>
