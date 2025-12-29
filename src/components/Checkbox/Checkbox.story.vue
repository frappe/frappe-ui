<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "frappe-ui";
import Story from "@/components/Story.vue";

const state = reactive({
  size: "sm",
  value: false,
});

const sizes = ["sm", "md"];
</script>

<template>
  <Story>
    <Checkbox v-bind="state" v-model="state.value" label="Enable feature" />
  </Story>
</template>
