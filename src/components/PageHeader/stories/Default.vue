<script setup lang="ts">
import { Breadcrumbs, Button, PageHeader } from 'frappe-ui'
</script>

<template>
  <div
    class="w-full overflow-hidden border-t border-l border-r bg-surface-base"
  >
    <PageHeader>
      <Breadcrumbs
        :items="[
          { label: 'Spaces', route: '#' },
          { label: 'Engineering', route: '#' },
        ]"
      />
      <Button label="New discussion" variant="solid" />
    </PageHeader>
  </div>
</template>
