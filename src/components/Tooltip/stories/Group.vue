<script setup lang="ts">
import { Button, Tooltip, TooltipProvider } from 'frappe-ui'
</script>

<template>
  <!--
    Hover any button to open its tooltip after `hover-delay`. Sweeping the
    pointer to a neighbour within `skip-delay` opens the next tooltip
    instantly — no per-button flicker — because the whole row shares one
    tooltip context.
  -->
  <TooltipProvider :hover-delay="500" :skip-delay="300">
    <div class="flex items-center gap-1">
      <Button icon="lucide-bold" tooltip="Bold" />
      <Button icon="lucide-italic" tooltip="Italic" />
      <Button icon="lucide-underline" tooltip="Underline" />
      <Tooltip text="Strikethrough">
        <Button icon="lucide-strikethrough" />
      </Tooltip>
    </div>
  </TooltipProvider>
</template>
