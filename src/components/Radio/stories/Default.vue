<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'frappe-ui'

const value = ref('reply-all')
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <Radio v-model="value" name="reply" value="reply" label="Reply" />
    <Radio v-model="value" name="reply" value="reply-all" label="Reply all" />
  </div>
</template>
