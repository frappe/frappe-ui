<script setup lang="ts">
import { ref } from 'vue'
import { TextEditor } from 'frappe-ui'

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
const value = ref(true);</code></pre>
</div>
`)
</script>

<template>
  <TextEditor
    editor-class="prose-sm min-h-[4rem] border rounded-b-lg border-t-0 p-2"
    :content="value"
    placeholder="Type something..."
    @change="(val) => (value.value = val)"
    :bubbleMenu="true"
    :fixed-menu="true"
  />
</template>
