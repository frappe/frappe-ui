<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, SplitButton } from 'frappe-ui'

// Frappe Builder's page header: Publish is one click, and the rarer ways to
// publish sit on the chevron. `condition` hides the ones that don't apply.
type Status = 'Draft' | 'Staging' | 'Published'
const status = ref<Status>('Draft')
const publishing = ref(false)

const themes = { Draft: 'gray', Staging: 'amber', Published: 'green' } as const

function publish(to: Status) {
  publishing.value = true
  setTimeout(() => {
    status.value = to
    publishing.value = false
  }, 900)
}

const options = computed(() => [
  {
    label: 'Publish to staging',
    icon: 'lucide-flask-conical',
    condition: () => status.value !== 'Staging',
    onClick: () => publish('Staging'),
  },
  {
    label: 'Unpublish',
    icon: 'lucide-cloud-off',
    condition: () => status.value !== 'Draft',
    onClick: () => publish('Draft'),
  },
])
</script>

<template>
  <div class="flex w-full max-w-md items-center gap-2 p-3">
    <span class="text-lg-medium text-ink-gray-9">Pricing</span>
    <Badge :label="status" :theme="themes[status]" />
    <div class="flex-1" />
    <Button variant="ghost" label="Preview" icon-left="lucide-eye" />
    <SplitButton
      label="Publish"
      menu-label="More ways to publish"
      variant="solid"
      :loading="publishing"
      :options="options"
      @click="publish('Published')"
    />
  </div>
</template>
