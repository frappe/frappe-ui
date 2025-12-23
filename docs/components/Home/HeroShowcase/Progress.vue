<script setup lang="ts">
import { Progress } from "frappe-ui";
import LucideSparkles from "~icons/lucide/sparkles";
</script>

<template>
  <div
    class="bg-surface-cards rounded-xl p-5 w-72 border border-outline-gray-2 grid gap-5 h-fit  shadow-lg"
  >
    <span class="flex gap-3">
      <LucideSparkles class="w-4 h-4 text-ink-amber-3" />
      <b>Activity</b>
    </span>

    <Progress
      label="Tasks Done"
      :value="85"
      :hint="true"
      size="md"
      class="[&_[role=progressbar]>:first-child]:bg-surface-blue-3"
    />
    <Progress
      label="In Progress"
      :value="60"
      :hint="true"
      size="md"
      class="[&_[role=progressbar]>:first-child]:bg-surface-amber-3"
    />
    <Progress
      label="Pending"
      :value="25"
      :hint="true"
      size="md"
      class="[&_[role=progressbar]>:first-child]:bg-surface-red-5"
    />
  </div>
</template>
