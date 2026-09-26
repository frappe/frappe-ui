<script setup lang="ts">
import { ProportionBar } from 'frappe-ui/charts'
import type { ProportionBarProps } from 'frappe-ui/charts'

const traffic = [
  { source: 'Organic', sessions: 4820 },
  { source: 'Referral', sessions: 2140 },
  { source: 'Paid', sessions: 980 },
]

const sizes: ProportionBarProps['size'][] = ['sm', 'md']
</script>

<template>
  <div class="flex h-full min-h-52 w-full items-center justify-center">
    <div class="flex w-full max-w-md flex-col gap-8">
      <div v-for="size in sizes" :key="size" class="flex flex-col gap-2">
        <span class="text-p-xs text-ink-gray-5">size="{{ size }}"</span>
        <ProportionBar
          :data="traffic"
          category="source"
          value="sessions"
          :size="size"
        />
      </div>
    </div>
  </div>
</template>
