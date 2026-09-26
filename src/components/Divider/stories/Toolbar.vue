<script setup lang="ts">
import { Button, Divider } from 'frappe-ui'
</script>

<template>
  <div
    class="flex items-center gap-1 rounded-5 border border-outline-gray-2 bg-surface-base p-1"
  >
    <Button variant="ghost" icon="lucide-bold" label="Bold" />
    <Button variant="ghost" icon="lucide-italic" label="Italic" />
    <Button variant="ghost" icon="lucide-underline" label="Underline" />
    <Divider orientation="vertical" flex-item class="mx-1" />
    <Button variant="ghost" icon="lucide-list" label="Bullet list" />
    <Button variant="ghost" icon="lucide-list-ordered" label="Numbered list" />
    <Divider orientation="vertical" flex-item class="mx-1" />
    <Button variant="ghost" icon="lucide-link" label="Link" />
    <Button variant="ghost" icon="lucide-image" label="Image" />
  </div>
</template>
