<script setup lang="ts">
import { ref } from 'vue'
import { Button, Switch } from 'frappe-ui'

const showActivity = ref(true)
</script>

<template>
  <div class="flex items-center gap-2">
    <Switch
      v-model="showActivity"
      variant="padded"

      label="Show activity"
    />
    <Button variant="subtle" icon-left="lucide-settings-2" label="Customize" />
    <Button variant="solid" icon-right="lucide-chevron-down" label="New" />
  </div>
</template>
