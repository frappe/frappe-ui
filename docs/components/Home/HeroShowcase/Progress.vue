<script setup lang="ts">
import { Progress } from "frappe-ui";
import LucideSparkles from "~icons/lucide/sparkles";
</script>

<template>
  <div
    class="bg-surface-cards rounded-xl p-5 md:w-72 border border-outline-gray-2 grid gap-5 h-fit  shadow-lg"
  >
    <span class="flex gap-3">
      <LucideSparkles class="size-4" />
      <b>Activity</b>
    </span>

    <Progress
      label="Tasks Done"
      :value="70"
      :hint="true"
      size="md"
    />
    <Progress
      label="In Progress"
      :value="50"
      :hint="true"
      size="md"
    />
    <Progress
      label="Pending"
      :value="25"
      :hint="true"
      size="md"
    />
  </div>
</template>
