<script setup lang="ts">
import { reactive } from "vue";
import Badge from "./Badge.vue";
import Story from "../Story.vue";

const state = reactive({
  theme: "gray",
  size: "sm",
  label: "Badge",
});

const variants = ["solid", "subtle", "outline", "ghost"];
const themes = ["gray", "blue", "green", "orange", "red"];
// const sizes = ["sm", "md", "lg"];
</script>

<template>
  <div class="grid gap-4">
    <div class="grid grid-cols-2 gap-3">
      <Story v-for="variant in variants" :title="variant">
        <Badge
          :key="variant"
          :variant="variant"
          v-bind="state"
        >
          {{ state.label }}
        </Badge>
      </Story>

      <Story title="Themes" preview-css="flex gap-3" class="col-span-full">
        <Badge
          :key="theme"
          :theme="theme"
          v-for="theme in themes"
          size="lg"
        >
          {{ state.label }}
        </Badge>
      </Story>
    </div>
  </div>
</template>
