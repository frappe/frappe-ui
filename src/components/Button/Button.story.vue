<script setup lang="ts">
import { reactive } from "vue";
import Button from "./Button.vue";
import Story from "../Story.vue";
import LucideBell from "~icons/lucide/bell-ring";

const state = reactive({
  theme: "gray",
  size: "sm",
  label: "Button",
  loading: false,
  loadingText: null,
  disabled: false,
  link: null,
  tooltip: "Hover for more!",
});

const variants = ["solid", "subtle", "outline", "ghost"];
const themes = ["gray", "blue", "green", "red"];
const sizes = ["sm", "md", "lg", "xl", "2xl"];
</script>

<template>
  <div class="grid gap-6">
    <Story
      :title="variant"
      v-for="variant in variants"
      :key="variant"
    >
      <Button :variant="variant" size="md">{{ state.label }}</Button>
    </Story>

    <Story title="sizes">
      <div
        class="p-1 flex flex-wrap gap-3 items-center"
      >
        <Button v-for="size in sizes" :size="size">{{ state.label }}</Button>
      </div>
    </Story>

    <Story
      :title="theme"
      v-for="theme in themes"
      preview-css="flex gap-3"
    >
      <Button
        size="md"
        v-for="variant in variants"
        :theme="theme"
        :variant="variant"
      >
        {{ variant }}
      </Button>
    </Story>
  </div>
</template>
