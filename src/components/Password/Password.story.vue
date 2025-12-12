<script setup lang="ts">
import { ref } from "vue";
import { Password } from "./index";
import Story from "../Story.vue";

const value = ref("");
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story>
      <Password v-model="value" placeholder="Enter password" />
    </Story>
  </div>
</template>
