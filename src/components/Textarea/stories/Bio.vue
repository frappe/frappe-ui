<script setup lang="ts">
import { computed, ref } from 'vue'
import { Textarea } from 'frappe-ui'

const limit = 160
const bio = ref('Designer at a small studio. I write about type and layout.')

const left = computed(() => limit - bio.value.length)
const error = computed(() =>
  left.value < 0 ? `Shorten your bio by ${-left.value} characters.` : '',
)
</script>

<template>
  <Textarea
    v-model="bio"
    label="Bio"
    :description="`${left} characters left`"
    :error="error"
    :rows="4"
    class="w-full max-w-md"
  />
</template>
