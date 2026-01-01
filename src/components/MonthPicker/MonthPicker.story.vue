<script setup lang="ts">
import { ref } from "vue";
import { MonthPicker } from "frappe-ui";
import Story from "@/components/Story.vue";

const val = ref("");
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4">
    <Story title="Default MonthPicker">
      <MonthPicker v-model="val" />
    </Story>

    <Story title="MonthPicker fit">
      <MonthPicker v-model="val" class="w-fit" />
    </Story>
  </div>
</template>
