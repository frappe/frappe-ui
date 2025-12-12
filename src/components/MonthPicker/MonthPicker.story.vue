<script setup lang="ts">
import { ref } from "vue";
import MonthPicker from "./MonthPicker.vue";
import Story from "../Story.vue";

const val = ref("");
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story title="Default MonthPicker">
      <MonthPicker v-model="val" />
    </Story>

    <Story title="MonthPicker fit">
      <MonthPicker v-model="val" class="w-fit" />
    </Story>
  </div>
</template>
