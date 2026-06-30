<template>
  <node-view-wrapper>
    <div class="code-block-container">
      <pre class="hljs-pre"><code><node-view-content /></code></pre>
      <select
        v-if="isEditable"
        class="language-selector form-select py-0"
        contenteditable="false"
        v-model="selectedLanguage"
      >
        <option :value="null">auto</option>
        <option disabled>—</option>
        <option
          v-for="(language, index) in languages"
          :value="language.value"
          :key="language.value"
        >
          {{ language.label }}
        </option>
      </select>
      <span v-else class="language-label">{{
        selectedLanguage || 'auto'
      }}</span>
    </div>
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
  props: nodeViewProps,
  data() {
    return {
      isEditable: this.editor.isEditable,
    }
  },
  mounted() {
    this.editor.on('update', () => {
      this.isEditable = this.editor.isEditable
    })
  },
  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language
      },
      set(language) {
        this.updateAttributes({ language })
      },
    },
    languages() {
      let supportedLanguages = this.extension.options.lowlight.listLanguages()
      return supportedLanguages
        .map((language) => {
          return {
            label: language,
            value: language,
          }
        })
        .concat([{ label: 'html', value: 'xml' }])
        .sort((a, b) => a.label.localeCompare(b.label))
    },
  },
}
</script>

<style>
@import '../hljs-github.css';

/* CodeBlock styles */
.code-block {
  position: relative;
}

.code-block-container {
  position: relative;
}

.language-selector {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  padding-top: 0;
  padding-bottom: 0;
}

.language-label {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 12px;
  color: var(--ink-gray-4);
  pointer-events: none;
  user-select: none;
}

/* ── pre shell (editor-specific overrides) ──────────────────── */
</style>
