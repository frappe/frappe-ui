<script setup>
import CircularProgressBar from "./CircularProgressBar.vue";
import Story from "../Story.vue";

// 'black' | 'red' | 'green' | 'blue' | 'orange'

const themes = ["black", "red", "green", "blue", "orange"];
const sizes = ["xs", "sm", "md", "lg", "xl"];
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story>
      <CircularProgressBar :step="1" :totalSteps="4" />
    </Story>

    <Story title="Solid Variant (Complete)">
      <CircularProgressBar
        :step="9"
        :totalSteps="9"
        variant="solid"
        themeComplete="lightgreen"
      />
    </Story>

    <Story title="Outline Variant (Complete)">
      <CircularProgressBar
        :step="9"
        :totalSteps="9"
        variant="outline"
        themeComplete="lightgreen"
      />
    </Story>

    <Story title="Custom Theme">
      <CircularProgressBar
        :step="2"
        :totalSteps="6"
        :theme='{ primary: "#2376f5", secondary: "#ddd5d5" }'
      />
    </Story>

    <Story title="Themes" preview-css="flex gap-4" class="col-span-2">
      <CircularProgressBar
        v-for="theme in themes"
        :step="3"
        :totalSteps="4"
        :theme="theme"
      />
    </Story>

    <Story
      title="Sizes"
      preview-css="flex gap-3 items-center"
			class="col-span-2"
    >
      <CircularProgressBar
        v-for="size in sizes"
        :step="3"
        :totalSteps="4"
        :size="size"
      />
    </Story>
  </div>
</template>
