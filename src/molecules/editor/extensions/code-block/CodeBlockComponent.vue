<template>
  <node-view-wrapper>
    <div class="code-block-container">
      <pre><code><node-view-content /></code></pre>
      <select
        v-if="isEditable"
        class="language-selector form-select py-0"
        contenteditable="false"
        v-model="selectedLanguage"
      >
        <option :value="null">auto</option>
        <option disabled>—</option>
        <option
          v-for="language in languages"
          :value="language.value"
          :key="language.value"
        >
          {{ language.label }}
        </option>
      </select>
      <span v-else class="language-label">{{ selectedLanguage || 'auto' }}</span>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed, toRaw } from 'vue'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { createLowlight } from 'lowlight'
import { useNodeViewEditable } from '@molecules/editor/composables/useNodeViewEditable'
import { listEditorLanguages } from '@molecules/editor/extensions/shared/lowlight-languages'
import './CodeBlockComponent.css'

type Lowlight = ReturnType<typeof createLowlight>

const props = defineProps(nodeViewProps)

// VueNodeViewRenderer passes a reactive-proxied editor; operate on the raw editor
// so any command/transaction dispatch is reference-safe. (See MediaNodeView.)
const editor = toRaw(props.editor)

const isEditable = useNodeViewEditable(editor)

const selectedLanguage = computed<string | null>({
  get: () => props.node.attrs.language as string | null,
  set: (language) => {
    props.updateAttributes({ language })
  },
})

const languages = computed(() => {
  const lowlight = props.extension.options.lowlight as Lowlight
  return listEditorLanguages(lowlight)
})
</script>
