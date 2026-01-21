<script setup lang="ts">
import { ref } from "vue";
import { MultiSelect } from "frappe-ui";

const state = ref();

const options = [
  { value: "red-apple", label: "Red Apple" },
  { value: "blueberry-burst", label: "Blueberry Burst" },
  { value: "orange-grove", label: "Orange Grove" },
  { value: "banana-split", label: "Banana Split" },
  { value: "grapes-cluster", label: "Grapes Cluster" },
  { value: "kiwi-slice", label: "Kiwi Slice" },
  { value: "mango-fusion", label: "Mango Fusion" },
];
</script>

<template>
  <MultiSelect
    :options="options"
    v-model="state"
    placeholder="Select fruit"
  />
</template>
