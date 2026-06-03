<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'frappe-ui'

const notify = ref('all')
</script>

<template>
  <div class="flex w-96 flex-col gap-6">
    <div class="flex flex-col gap-2">
      <p class="text-base font-medium text-ink-gray-8">
        Notification preferences
      </p>
      <Radio
        v-model="notify"
        name="notify-pref"
        value="all"
        label="All new emails"
      />
      <Radio
        v-model="notify"
        name="notify-pref"
        value="important"
        label="Important emails only"
        description="Only emails where you're mentioned or assigned."
      />
      <Radio
        v-model="notify"
        name="notify-pref"
        value="off"
        label="Mail notifications off"
        disabled
      />
    </div>
  </div>
</template>
