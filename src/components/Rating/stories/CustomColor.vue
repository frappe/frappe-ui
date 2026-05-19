<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'
import LucideHeart from '~icons/lucide/heart'
import LucideFlame from '~icons/lucide/flame'

const heart = ref(4)
const flame = ref(3)
</script>

<template>
  <div class="w-full flex flex-col gap-4 items-start">
    <Rating
      v-model="heart"
      :icon="LucideHeart"
      label="Hearts"
      class="rating-red"
    />
    <Rating
      v-model="flame"
      :icon="LucideFlame"
      label="Flames"
      class="rating-orange"
    />
  </div>
</template>

<style scoped>
/* `filled` stays saturated in both themes so it reads on either surface.
   `preview` / `removing` are intentionally a shade lighter than filled in
   light mode and a shade darker in dark mode — the lightness relationship
   inverts because the previewing/removing states should always sit *next*
   to the filled color on the contrast scale relative to the background. */

.rating-red {
  --rating-filled: theme(colors.red.500);
  --rating-preview: theme(colors.red.300);
  --rating-removing: theme(colors.red.200);
}

:global([data-theme='dark'] .rating-red) {
  --rating-preview: theme(colors.red.700);
  --rating-removing: theme(colors.red.800);
}

.rating-orange {
  --rating-filled: theme(colors.orange.500);
  --rating-preview: theme(colors.orange.300);
  --rating-removing: theme(colors.orange.200);
}

:global([data-theme='dark'] .rating-orange) {
  --rating-preview: theme(colors.orange.700);
  --rating-removing: theme(colors.orange.800);
}
</style>
