<script setup lang="ts">
import { reactive } from "vue";
import Avatar from "./Avatar.vue";
import Story from "../Story.vue";

const state = reactive({
  image: "https://avatars.githubusercontent.com/u/499550?s=60&v=4",
  label: "EY",
  size: "md",
});

const shapes = ["circle", "square"];
const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-2 grid-cols-2">
      <Story
        :title="shape"
        v-for="shape in shapes"
        :key="shape"
        class="grid gap-2"
        preview-css="flex gap-3"
      >
        <Avatar :shape="shape" v-bind="state" size="xl" />
        <Avatar :shape="shape" v-bind="state" image="null" size="xl" />
      </Story>
    </div>

    <Story preview-css="flex gap-3 items-center" title='Sizes'>
      <Avatar
        v-for="size in sizes"
        :shape="shape"
        v-bind="state"
        :size="size"
      />
    </Story>
  </div>
</template>
