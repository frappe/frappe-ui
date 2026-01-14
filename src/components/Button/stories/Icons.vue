<script setup>
import { Button } from 'frappe-ui'
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

  <Button :loading="true"> Fetching </Button>
</template>
