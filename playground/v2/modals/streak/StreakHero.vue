<script setup lang="ts">
// Flame + "You rock! you are on a / N days streak", centered.
import flame from '../../assets/flame.png'

withDefaults(
  defineProps<{
    days: number
    /** Learning consistency sets the lead-in at 500; Streak at 420. */
    leadWeight?: 'regular' | 'medium'
  }>(),
  { leadWeight: 'regular' },
)
</script>

<template>
  <div class="flex flex-col items-center">
    <img :src="flame" alt="" class="size-[38px]" />
    <!-- Streak spaces the two lines 2px apart; Learning consistency sets them flush -->
    <div
      class="mt-3 flex flex-col items-center text-center"
      :class="{ 'gap-0.5': leadWeight === 'regular' }"
    >
      <p
        class="text-ink-gray-5"
        :class="leadWeight === 'medium' ? 'text-base-medium' : 'text-base'"
      >
        You rock! you are on a
      </p>
      <p class="text-4xl-bold text-ink-gray-9">{{ days }} days streak</p>
    </div>
  </div>
</template>
