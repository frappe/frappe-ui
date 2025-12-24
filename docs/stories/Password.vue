<script setup lang="ts">
import { ref } from "vue";
import { Password } from "frappe-ui";
import Story from "@/components/Story.vue";

const value = ref("");
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story>
      <Password v-model="value" placeholder="Enter password" />
    </Story>
  </div>
</template>
