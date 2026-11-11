<script setup lang="ts">
/**
 * Espresso's `icon/solid/dot-lg`, exported from the design file — a 14px disc
 * in a 32px box, so it draws at 7px inside a 16px icon.
 *
 * `token` is the theme variable the dot takes its colour from, e.g.
 * `--surface-green-6`. It is set as `color` and the path fills with
 * `currentColor`, which is the one way to reach every family: some families
 * (violet among them) have no text utility, but every one has its variable.
 */
defineProps<{ token: string }>()
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    class="size-4 shrink-0"
    :style="{ color: `var(${token})` }"
    aria-hidden="true"
  >
    <path
      d="M16 9C19.866 9 23 12.134 23 16C23 19.866 19.866 23 16 23C12.134 23 9 19.866 9 16C9 12.134 12.134 9 16 9Z"
      fill="currentColor"
    />
  </svg>
</template>
