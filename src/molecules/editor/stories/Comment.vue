<script setup>
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import { TextEditor, CommentKit, commentToolbar } from 'frappe-ui/editor'

// A comment editor is built from a kit + a preset — no ready-made component.
const extensions = [CommentKit]
const comment = ref('<p>This is a comment draft.</p>')

function submit() {
  comment.value = ''
}
</script>

<template>
  <div class="w-full max-w-2xl">
    <TextEditor
      v-model="comment"
      :extensions="extensions"
      :fixed-menu="commentToolbar"
      fixed-menu-position="bottom"
      :bubble-menu="commentToolbar"
      placeholder="Write a comment…"
      max-height="180px"
    >
      <template #actions="{ isEmpty }">
        <Button size="sm" variant="subtle">Discard</Button>
        <Button size="sm" variant="solid" :disabled="isEmpty" @click="submit">
          Comment
        </Button>
      </template>
    </TextEditor>
  </div>
</template>
