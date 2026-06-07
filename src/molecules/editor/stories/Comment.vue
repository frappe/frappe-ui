<script setup>
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import {
  Editor,
  EditorContent,
  EditorFixedMenu,
  EditorBubbleMenu,
  CommentKit,
  commentToolbar,
} from 'frappe-ui/editor'

const people = [
  { id: 'faris', label: 'Faris Ansari' },
  { id: 'mary', label: 'Mary Thomas' },
  { id: 'alex', label: 'Alex Kim' },
]

const tags = [
  { id: 'launch', label: 'launch' },
  { id: 'design', label: 'design' },
]

const extensions = [
  CommentKit.configure({
    mention: { items: people },
    tag: { items: tags },
  }),
]

const draft = ref('')
const submitted = ref('')

function submit() {
  submitted.value = draft.value
  draft.value = ''
}
</script>

<template>
  <div class="w-full max-w-2xl">
    <div class="flex gap-3">
      <div
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-gray-3 text-sm font-medium text-ink-gray-7"
      >
        FA
      </div>
      <Editor
        v-model="draft"
        :extensions="extensions"
        placeholder="Write a comment… use @ to mention and # to tag"
      >
        <template #default="{ isEmpty }">
          <div
            class="min-w-0 flex-1 rounded-lg border border-outline-gray-2 bg-surface-base focus-within:border-outline-gray-3"
          >
            <EditorBubbleMenu :items="commentToolbar" />
            <EditorContent
              class="max-h-56 min-h-20 overflow-y-auto px-3 py-2 text-ink-gray-8"
            />
            <div
              class="flex items-center justify-between gap-2 border-t border-outline-gray-1 px-2 py-1.5"
            >
              <EditorFixedMenu :items="commentToolbar" />
              <div class="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  :disabled="isEmpty"
                  @click="draft = ''"
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  :disabled="isEmpty"
                  @click="submit"
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </template>
      </Editor>
    </div>

    <div v-if="submitted" class="mt-4 flex gap-3">
      <div
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-gray-3 text-sm font-medium text-ink-gray-7"
      >
        FA
      </div>
      <div class="min-w-0 flex-1 rounded-lg bg-surface-gray-1 px-3 py-2">
        <div class="mb-0.5 text-sm font-medium text-ink-gray-8">Faris Ansari</div>
        <Editor v-model="submitted" :extensions="extensions" :editable="false">
          <template #default>
            <EditorContent class="text-ink-gray-8" />
          </template>
        </Editor>
      </div>
    </div>
  </div>
</template>
