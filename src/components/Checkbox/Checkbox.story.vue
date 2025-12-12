<script setup lang="ts">
import { reactive } from "vue";
import Checkbox from "./Checkbox.vue";
import Story from "../Story.vue";

const state = reactive({
  size: "sm",
  value: false,
});

const sizes = ["sm", "md"];
</script>

<template>
  <div class="p-2">
    <Story>
      <Checkbox v-bind="state" v-model="state.value" label="Enable feature" />
    </Story>
  </div>
</template>
