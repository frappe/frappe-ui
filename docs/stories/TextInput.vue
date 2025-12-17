<script setup lang="ts">
import Story from "@/components/Story.vue";
import { Avatar, TextInput } from "frappe-ui";
import LucideSearch from "~icons/lucide/search";

const inputTypes = [
  "text",
  "number",
  "email",
  "date",
  "datetime-local",
  "password",
  "search",
  "tel",
  "time",
  "url",
];
const sizes = ["sm", "md", "lg", "xl"];
const variants = ["subtle", "outline"];
</script>

<template>
  <div class="grid grid-cols-2 gap-5">
    <Story
      v-for="inputType in inputTypes"
      :key="inputType"
      :title="inputType"
    >
      <TextInput :type="inputType" placeholder="Enter input" />
    </Story>

    <Story title="prefix slot icon">
      <TextInput placeholder="Enter Input">
        <template #prefix>
          <LucideSearch class="w-4" name="search" />
        </template>
      </TextInput>
    </Story>

    <Story title="suffix slot icon">
      <TextInput placeholder="Enter Input">
        <template #suffix>
          <LucideSearch class="w-4" name="search" />
        </template>
      </TextInput>
    </Story>

    <Story title="prefix slot avatar">
      <TextInput placeholder="Enter Name">
        <template #prefix>
          <Avatar
            size="sm"
            image="https://avatars.githubusercontent.com/u/499550?s=60&v=4"
          />
        </template>
      </TextInput>
    </Story>

    <Story title="Sizes" class="col-span-2" preview-css="flex gap-3">
      <TextInput v-for="size in sizes" :size="size" placeholder="Enter input" />
    </Story>

    <Story title="Variants" class="col-span-2" preview-css="flex gap-3">
      <TextInput
        v-for="variant in variants"
        :variant="variant"
        placeholder="Enter input"
      />
    </Story>
  </div>
</template>
