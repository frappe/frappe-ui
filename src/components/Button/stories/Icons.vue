<script setup>
import { Button, KeyboardShortcut } from 'frappe-ui'
</script>

<template>
  <Button>
    <template #icon>
      <LucideBolt class="size-4" />
    </template>
  </Button>

  <Button>
    <template #prefix>
      <LucideDownload class="size-4" />
    </template>
    Download
  </Button>

  <Button>
    <template #suffix>
      <LucideArrowRight class="size-4" />
    </template>
    Get Started
  </Button>

  <Button>
    Discover
    <template #suffix>
      <KeyboardShortcut combo="Mod+K" :show-plus="false" />
    </template>
  </Button>

  <Button :loading="true"> Fetching </Button>
</template>
