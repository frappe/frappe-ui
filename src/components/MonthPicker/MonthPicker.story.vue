<script setup lang="ts">
import { ref } from 'vue'
import MonthPicker from './MonthPicker.vue'

const val = ref('')
</script>

<template>
  <div class="grid gap-4 w-[500px]">
    <div>
      <MonthPicker v-model="val" />
    </div>

    <div>
      <MonthPicker v-model="val" class="w-fit" />
    </div>
  </div>
</template>
