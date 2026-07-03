<script setup lang="ts">
import { Button, PageHeaderMobile, PageHeaderMobileTitle } from 'frappe-ui'
</script>

<template>
  <div class="w-80 overflow-hidden border border-b-0 bg-surface-base">
    <PageHeaderMobile>
      <template #left>
        <Button
          variant="ghost"
          size="md"
          icon="lucide-chevron-left"
          label="Back"
        />
      </template>
      <PageHeaderMobileTitle
        title="A discussion title that is long enough to need centering"
      />
      <template #right>
        <Button variant="ghost" icon="lucide-more-horizontal" label="Options" />
      </template>
    </PageHeaderMobile>
  </div>
</template>
