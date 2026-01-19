<script setup lang="ts">
import { ref } from "vue";
import { MonthPicker } from "frappe-ui";

const val = ref("");
</script>

<template>
  <MonthPicker v-model="val" />
</template>
