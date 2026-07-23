<script setup lang="ts">
import { computed, ref } from 'vue'
import { CodeEditor, CodePreview } from 'frappe-ui/code-editor'
import type { Knob } from 'frappe-ui/vitepress'

const seeds: Record<string, string> = {
  javascript: `function greet(name) {\n  return \`Hello, \${name}!\`\n}`,
  json: `{\n  "name": "frappe-ui",\n  "private": true\n}`,
  python: `def greet(name):\n    return f"Hello, {name}!"`,
  html: `<h2>Title</h2>\n<p>Edit me.</p>`,
  markdown: `# Notes\n\nSome **bold** text.`,
  plain: `Plain text — no highlighting.`,
}

const language = ref('javascript')
const code = ref(seeds.javascript)

const knobs: Knob[] = [
  {
    name: 'language',
    type: 'tabs',
    default: 'javascript',
    options: [
      { label: 'javascript', value: 'javascript' },
      { label: 'json', value: 'json' },
      { label: 'python', value: 'python' },
      { label: 'html', value: 'html' },
      { label: 'markdown', value: 'markdown' },
      { label: 'plain', value: 'plain' },
    ],
  },
  {
    name: 'variant',
    type: 'tabs',
    default: 'subtle',
    options: [
      { label: 'subtle', value: 'subtle' },
      { label: 'outline', value: 'outline' },
    ],
  },
  {
    name: 'size',
    type: 'tabs',
    default: 'md',
    options: [
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
      { label: 'xl', value: 'xl' },
    ],
  },
  { name: 'placeholder', type: 'text', default: '', width: '12rem' },
  { name: 'disabled', type: 'switch', default: false },
]

// Reseed the editor when the language knob changes so each language shows
// representative code instead of carrying the previous snippet across.
function syncLanguage(next: string) {
  if (next !== language.value) {
    language.value = next
    code.value = seeds[next] ?? ''
  }
  return next
}

// CodePreview only renders meaningful output for html / markdown.
const hasPreview = computed(
  () => language.value === 'html' || language.value === 'markdown',
)

function buildCode(v: Record<string, any>) {
  const attrs = ['v-model="value"', `language="${v.language}"`]
  if (v.variant !== 'subtle') attrs.push(`variant="${v.variant}"`)
  if (v.size !== 'md') attrs.push(`size="${v.size}"`)
  if (v.placeholder) attrs.push(`placeholder="${v.placeholder}"`)
  if (v.disabled) attrs.push('disabled')
  return ['<CodeEditor', ...attrs.map((a) => '  ' + a), '/>'].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode" preview-min-height="180px">
    <template #preview="{ values }">
      <div class="w-full max-w-xl space-y-3">
        <CodeEditor
          v-model="code"
          :language="syncLanguage(values.language)"
          :variant="values.variant"
          :size="values.size"
          :placeholder="values.placeholder || undefined"
          :disabled="values.disabled"
        />
        <CodePreview
          v-if="hasPreview"
          :model-value="code"
          :language="language"
          class="min-h-[4.5rem] rounded-md border border-surface-gray-2 p-3"
        />
      </div>
    </template>
  </PlaygroundFrame>
</template>
