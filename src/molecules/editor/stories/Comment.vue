<script setup>
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import { CommentEditor } from 'frappe-ui/editor'

const comment = ref('<p>This is a comment draft.</p>')

function submit() {
  comment.value = ''
}
</script>

<template>
  <div class="w-full max-w-2xl">
    <CommentEditor v-model="comment" placeholder="Write a comment…" max-height="180px">
      <template #actions="{ isEmpty }">
        <Button size="sm" variant="subtle">Discard</Button>
        <Button size="sm" variant="solid" :disabled="isEmpty" @click="submit">
          Comment
        </Button>
      </template>
    </CommentEditor>
  </div>
</template>
