<script setup lang="ts">
import { reactive } from "vue";
import Progress from "./Progress.vue";
import Story from "../Story.vue";

const state = reactive({
  size: "sm",
  value: 50,
});

const sizes = ["sm", "md", "lg", "xl"];
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story title="Default Progress">
      <Progress v-bind="state" label="Progress" />
    </Story>

    <Story title="With Hint">
      <Progress v-bind="state" label="Progress" :hint="true" />
    </Story>

    <Story title="With Intervals">
      <Progress
        v-bind="state"
        label="Progress"
        :intervals="true"
        :interval-count="5"
      />
    </Story>

    <Story v-for="size in sizes" :key="size" :title='"Size: " + size'>
      <Progress v-bind="state" :size="size" label="Progress" />
    </Story>
  </div>
</template>
