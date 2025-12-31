<script setup lang="ts">
const chartBars = [40, 65, 45, 80, 30, 55, 90, 70, 85, 40, 70, 95];
</script>

<template>
  <div class="bg-surface-cards border rounded-xl p-5 h-fit shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-xs text-ink-gray-6">Revenue</p>
        <p class="text-2xl font-bold text-ink-gray-9">$48,352</p>
      </div>

      <div
        class="w-10 h-10 rounded-full bg-surface-gray-2 flex items-center justify-center"
      >
        <LucideTrendingUp class="size-5" />
      </div>
    </div>

    <div class="flex items-end gap-1.5 h-16 mb-3">
      <div
        v-for="(h, i) in chartBars"
        :key="i"
        class="flex-1 rounded-sm bg-surface-gray-3"
        :class='{ "bg-surface-gray-7": h > 90, "bg-red-700": h <= 40 }'
        :style='{ height: h + "%" }'
      />
    </div>

    <p class="text-xs flex items-center gap-1">
      <LucideArrowUpRight class="size-4" />
      +32.5% from last month
    </p>
  </div>
</template>
