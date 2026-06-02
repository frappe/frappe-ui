<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'frappe-ui'

const item = ref({
  disabled: false,
  allowAlternative: false,
  maintainStock: true,
  hasVariants: true,
  fixedAsset: false,
})
</script>

<template>
  <div class="w-72 rounded-lg border border-outline-gray-2 bg-surface-white p-1.5">
    <p class="px-2.5 pb-1.5 pt-1 text-sm text-ink-gray-5">Details</p>
    <Switch
      v-model="item.disabled"
      variant="padded"
      label="Disabled"
      class="w-full"
    />
    <Switch
      v-model="item.allowAlternative"
      variant="padded"
      label="Allow alternative item"
      class="w-full"
    />
    <Switch
      v-model="item.maintainStock"
      variant="padded"
      label="Maintain stock"
      class="w-full"
    />
    <Switch
      v-model="item.hasVariants"
      variant="padded"
      label="Has variants"
      class="w-full"
    />
    <Switch
      v-model="item.fixedAsset"
      variant="padded"
      label="Is fixed asset"
      disabled
      class="w-full"
    />
  </div>
</template>
