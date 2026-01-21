<script setup lang="ts">
import { ref } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { Button, TextEditor, TextEditorFixedMenu } from 'frappe-ui'

const customValue = ref('')
const customButtons = [
  'Paragraph',
  ['Heading 2', 'Heading 3', 'Heading 4'],
  'Separator',
  'Bold',
  'Italic',
  'Separator',
  'Bullet List',
  'Numbered List',
  'Separator',
  'Link',
  'Image',
]
</script>

<template>
  <TextEditor
    ref="textEditor"
    editor-class="prose-sm max-w-none min-h-[4rem]"
    :content="customValue"
    @change="(val) => (customValue.value = val)"
    :starterkit-options="{ heading: { levels: [2, 3, 4] } }"
    placeholder="Write something amazing..."
  >
    <template v-slot:editor="{ editor }">
      <EditorContent
        class="max-h-[50vh] overflow-y-auto border rounded-lg p-4"
        :editor="editor"
      />
    </template>

    <template v-slot:bottom>
      <div
        class="mt-2 flex flex-col justify-between sm:flex-row sm:items-center"
      >
        <TextEditorFixedMenu
          class="-ml-1 overflow-x-auto"
          :buttons="customButtons"
        />
        <div class="mt-2 flex items-center justify-end space-x-2 sm:mt-0">
          <Button>Cancel</Button>
          <Button variant="solid">Submit</Button>
        </div>
      </div>
    </template>
  </TextEditor>
</template>
