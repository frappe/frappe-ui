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
    <Rating v-model="heart" :icon="LucideHeart" label="Hearts" />
    <Rating v-model="flame" :icon="LucideFlame" label="Flames" />
  </div>
</template>
