<script setup lang="ts">
import { ref } from 'vue'
import { Button, Textarea } from 'frappe-ui'

const comment = ref('')
const comments = ref<string[]>([])

function post() {
  comments.value.push(comment.value.trim())
  comment.value = ''
}
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <p
      v-for="(text, i) in comments"
      :key="i"
      class="rounded-4 bg-surface-gray-2 px-3 py-2 text-p-sm text-ink-gray-8"
    >
      {{ text }}
    </p>
    <Textarea
      v-model="comment"
      variant="outline"
      :rows="3"
      placeholder="Add a comment"
      aria-label="Comment"
    />
    <Button
      variant="solid"
      class="self-end"
      :disabled="!comment.trim()"
      @click="post"
    >
      Comment
    </Button>
  </div>
</template>
