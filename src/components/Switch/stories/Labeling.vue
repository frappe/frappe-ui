<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, Switch } from 'frappe-ui'

const enabled = ref(false)
const required = ref(true)
const showError = ref(false)

const error = computed(() =>
  showError.value ? 'You must enable this to continue.' : '',
)
</script>

<template>
  <div class="flex gap-8 items-start">
    <Switch
      v-model="enabled"
      label="Enable notifications"
      description="Get notified when something happens."
      :error="error"
      :required="required"
      class="w-72"
    />
    <div
      class="flex flex-col gap-2 items-start border-l border-outline-gray-2 pl-6"
    >
      <Checkbox v-model="required" label="required" />
      <Checkbox v-model="showError" label="show error" />
    </div>
  </div>
</template>
