<script setup lang="ts">
import { ref } from "vue";
import { Slider } from "frappe-ui";
import Story from "@/components/Story.vue";

const val = ref([10])
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story>
      <Slider v-model="val" />
    </Story>
  </div>
</template>
