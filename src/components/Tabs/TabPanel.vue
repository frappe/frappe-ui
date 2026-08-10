<script setup lang="ts">
import { TabsContent } from 'reka-ui'
import type { TabPanelProps } from './types'

const props = defineProps<TabPanelProps>()

defineSlots<{
  default?: () => any
}>()
</script>

<template>
  <!-- Mounts when its value is selected, unmounts otherwise (reka default). -->
  <TabsContent :value="props.value" data-slot="tab-panel">
    <slot />
  </TabsContent>
</template>
