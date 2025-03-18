<script setup lang="ts">
import { ref } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import TextEditor from './TextEditor.vue'
import TextEditorFixedMenu from './TextEditorFixedMenu.vue'
import { Button } from '../Button'

const value = ref(`
<div>
  <h2>Heading 2</h2>
  <p>
    This is a paragraph with <strong>bold</strong> and <em>italic</em> text.
  </p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  <p>
    <a href="https://frappe.io">Frappe</a>
  </p>
  <pre><code class="language-javascript">import { Button } from 'frappe-ui'
const value = ref(true);</code>
  </pre>
</div>
`)
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
  <Story :layout="{ width: 600, type: 'grid' }" autoPropsDisabled>
    <Variant title="Basic">
      <div class="p-2">
        <TextEditor
          editor-class="prose-sm min-h-[4rem] border rounded-b-lg border-t-0 p-2"
          :content="value"
          placeholder="Type something..."
          @change="(val) => (value = val)"
          :bubbleMenu="true"
          :fixed-menu="true"
        />
      </div>
    </Variant>
    <Variant title="Comment Editor">
      <div class="p-2">
        <TextEditor
          ref="textEditor"
          editor-class="prose-sm max-w-none min-h-[4rem]"
          :content="customValue"
          @change="(val) => (customValue = val)"
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
      </div>
    </Variant>
  </Story>
</template>
