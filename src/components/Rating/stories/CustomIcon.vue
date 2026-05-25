<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from 'frappe-ui'
import LucideHeart from '~icons/lucide/heart'
import LucideFlame from '~icons/lucide/flame'

const heart = ref(4)
const flame = ref(3)
const zap = ref(3)
</script>

<template>
  <div class="w-full flex flex-col gap-4 items-start">
    <Rating v-model="heart" :icon="LucideHeart" label="Hearts (component)" />
    <Rating v-model="flame" :icon="LucideFlame" label="Flames (component)" />
    <Rating v-model="zap" icon="lucide-zap" label="Zap (lucide-* string)" />
  </div>
</template>
