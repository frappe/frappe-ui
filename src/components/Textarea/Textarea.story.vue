<script setup lang="ts">
import { reactive } from "vue";
import { Textarea } from "frappe-ui";
import Story from "@/components/Story.vue";

const state = reactive({
  size: "sm",
  placeholder: "Placeholder",
  disabled: false,
  modelValue: "",
  label: "Label",
});

const variants = ["subtle", "outline"];
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <Story v-for="type in variants" :key="type" :title="`Variant: ${type}`">
      <Textarea :variant="type" v-bind="state" />
    </Story>
  </div>
</template>
