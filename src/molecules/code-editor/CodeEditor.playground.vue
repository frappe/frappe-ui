<script setup lang="ts">
import { onMounted, reactive, shallowReactive } from 'vue'
import type { Extension } from '@codemirror/state'
import {
  CodeEditor,
  CodeEditorContent,
  CodeKit,
  loadLanguage,
} from 'frappe-ui/code-editor'
import type { Knob } from 'frappe-ui/vitepress'

type Language = 'json' | 'javascript' | 'python' | 'sql' | 'text'

// One document per language, so switching the knob shows a matching snippet
// and keeps your edits to the others. Each stays under the box's min height.
const docs = reactive<Record<Language, string>>({
  json: `{
  "doctype": "Task",
  "subject": "Ship the release",
  "status": "Open",
  "priority": "High"
}`,
  javascript: `frappe.ui.form.on('Task', {
  refresh(frm) {
    frm.add_custom_button('Ping', () => frm.save())
  },
})`,
  python: `def get_open_tasks(project):
    return frappe.get_all(
        "Task",
        filters={"project": project, "status": "Open"},
        fields=["name", "subject"],
    )`,
  sql: `SELECT name, subject, priority
FROM tabTask
WHERE status = 'Open'
ORDER BY modified DESC
LIMIT 20`,
  text: `Plain text: no language extension, so nothing is coloured.`,
})

const languageKeys = ['json', 'javascript', 'python', 'sql'] as const

// Loaded once, on the client. Each extension keeps its identity, so a
// re-render hands the editor the same array members and costs nothing.
const languages = shallowReactive<Partial<Record<Language, Extension>>>({})
onMounted(() => {
  for (const key of languageKeys) {
    loadLanguage(key)
      .then((extension) => {
        if (extension) languages[key] = extension
      })
      .catch((error) => console.error(error))
  }
})

// Built once for the same reason: `.configure()` returns a new kit.
const numberedKit = CodeKit.configure({ lineNumbers: {} })

function extensionsFor(values: Record<string, any>): Extension[] {
  const kit = values.lineNumbers ? numberedKit : CodeKit
  const language = languages[values.language as Language]
  return language ? [kit, language] : [kit]
}

const knobs: Knob[] = [
  {
    name: 'language',
    type: 'tabs',
    default: 'json',
    options: [
      { label: 'json', value: 'json' },
      { label: 'javascript', value: 'javascript' },
      { label: 'python', value: 'python' },
      { label: 'sql', value: 'sql' },
      { label: 'plain text', value: 'text' },
    ],
  },
  { name: 'lineNumbers', type: 'switch', default: false },
  { name: 'editable', type: 'switch', default: true },
]

function buildCode(v: Record<string, any>) {
  const language: Language = v.language
  const kit = v.lineNumbers
    ? 'CodeKit.configure({ lineNumbers: {} })'
    : 'CodeKit'
  const imports = [
    "import { ref } from 'vue'",
    "import { CodeEditor, CodeEditorContent, CodeKit } from 'frappe-ui/code-editor'",
  ]
  const members = [kit]
  if (language !== 'text') {
    imports.push(`import { ${language} } from '@codemirror/lang-${language}'`)
    members.push(`${language}()`)
  }
  const attrs = ['v-model="code"', ':extensions="extensions"']
  if (!v.editable) attrs.push(':editable="false"')

  return [
    '<script setup>',
    ...imports,
    '',
    "const code = ref('')",
    `const extensions = [${members.join(', ')}]`,
    '</' + 'script>',
    '',
    '<template>',
    `  <CodeEditor ${attrs.join(' ')}>`,
    '    <CodeEditorContent class="min-h-40" />',
    '  </CodeEditor>',
    '</template>',
  ].join('\n')
}
</script>

<template>
  <PlaygroundFrame :knobs="knobs" :code="buildCode">
    <template #preview="{ values }">
      <div class="w-full max-w-2xl">
        <CodeEditor
          v-model="docs[values.language as Language]"
          :extensions="extensionsFor(values)"
          :editable="values.editable"
        >
          <CodeEditorContent class="min-h-40" />
        </CodeEditor>
      </div>
    </template>
  </PlaygroundFrame>
</template>
