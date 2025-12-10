<script setup>
import CircularProgressBar from './CircularProgressBar.vue'
</script>

<template>
  <div class="grid gap-4">
    <div class="p-2 w-full h-full">
      <CircularProgressBar :step="1" :totalSteps="4" />
    </div>

    <div class="p-2 w-full h-full">
      <CircularProgressBar
        :step="1"
        :totalSteps="4"
        size="lg"
        :showPercentage="true"
      />
    </div>

    <div class="p-2 w-full h-full">
      <CircularProgressBar :step="3" :totalSteps="4" theme="orange" />
    </div>

    <div class="p-2 w-full h-full">
      <CircularProgressBar
        :step="2"
        :totalSteps="6"
        :theme="{ primary: '#2376f5', secondary: '#ddd5d5' }"
      />
    </div>

    <div class="p-2 w-full h-full">
      <CircularProgressBar
        :step="9"
        :totalSteps="9"
        variant="solid"
        themeComplete="lightgreen"
      />
    </div>

    <div class="p-2 w-full h-full">
      <CircularProgressBar
        :step="9"
        :totalSteps="9"
        variant="outline"
        themeComplete="lightgreen"
      />
    </div>
  </div>
</template>
