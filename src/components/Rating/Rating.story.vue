<script setup lang="ts">
import { reactive } from "vue";
import Rating from "./Rating.vue";
import Story from "../Story.vue";

const state = reactive({
  size: "md",
  label: "Rating",
});
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story><Rating v-bind="state" /></Story>

    <Story
      v-for='size in ["sm", "md", "lg", "xl"]'
      :key="size"
      :title='"Size: " + size'
    >
      <Rating v-bind="state" :size="size" />
    </Story>
  </div>
</template>
