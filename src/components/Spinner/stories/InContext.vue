<script setup lang="ts">
import { Button } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Button
      theme="gray"
      variant="solid"
      icon="lucide-save"
      :loading="true"
      size="xs"
    />
    <Button
      theme="gray"
      variant="solid"
      :loading="true"
      loading-text="Discover"
      size="xs"
    />
    <Button
      theme="gray"
      variant="solid"
      :loading="true"
      loading-text="Discover"
    />
    <Button
      theme="red"
      variant="subtle"
      :loading="true"
      loading-text="Deleting"
      size="md"
    />
    <Button
      theme="gray"
      variant="ghost"
      :loading="true"
      loading-text="Loading"
      size="md"
    />
    <Button
      theme="gray"
      variant="subtle"
      :loading="true"
      loading-text="Get app"
      size="lg"
    />
  </div>
</template>
