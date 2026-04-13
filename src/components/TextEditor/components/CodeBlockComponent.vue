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

/* ── pre shell ────────────────────────────────────────────────── */
.ProseMirror pre {
  background: #f6f8fa;
  color: #24292e;
  font-family:
    ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Mono', 'Source Code Pro', 'Fira Mono',
    'Droid Sans Mono', 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.7;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--outline-gray-2);
  caret-color: #24292e;
}

.ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: inherit;
}

/* ── highlight.js — GitHub light ─────────────────────────────── */
.ProseMirror pre .hljs-doctag,
.ProseMirror pre .hljs-keyword,
.ProseMirror pre .hljs-meta .hljs-keyword,
.ProseMirror pre .hljs-template-tag,
.ProseMirror pre .hljs-template-variable,
.ProseMirror pre .hljs-type,
.ProseMirror pre .hljs-variable.language_ {
  color: #d73a49;
}

.ProseMirror pre .hljs-title,
.ProseMirror pre .hljs-title.class_,
.ProseMirror pre .hljs-title.class_.inherited__,
.ProseMirror pre .hljs-title.function_ {
  color: #6f42c1;
}

.ProseMirror pre .hljs-attr,
.ProseMirror pre .hljs-attribute,
.ProseMirror pre .hljs-literal,
.ProseMirror pre .hljs-meta,
.ProseMirror pre .hljs-number,
.ProseMirror pre .hljs-operator,
.ProseMirror pre .hljs-variable,
.ProseMirror pre .hljs-selector-attr,
.ProseMirror pre .hljs-selector-class,
.ProseMirror pre .hljs-selector-id {
  color: #005cc5;
}

.ProseMirror pre .hljs-regexp,
.ProseMirror pre .hljs-string,
.ProseMirror pre .hljs-meta .hljs-string {
  color: #032f62;
}

.ProseMirror pre .hljs-built_in,
.ProseMirror pre .hljs-symbol {
  color: #e36209;
}

.ProseMirror pre .hljs-comment,
.ProseMirror pre .hljs-code,
.ProseMirror pre .hljs-formula {
  color: #6a737d;
}

.ProseMirror pre .hljs-name,
.ProseMirror pre .hljs-quote,
.ProseMirror pre .hljs-selector-tag,
.ProseMirror pre .hljs-selector-pseudo {
  color: #22863a;
}

.ProseMirror pre .hljs-subst {
  color: #24292e;
}
.ProseMirror pre .hljs-section {
  color: #005cc5;
  font-weight: bold;
}
.ProseMirror pre .hljs-bullet {
  color: #735c0f;
}
.ProseMirror pre .hljs-emphasis {
  color: #24292e;
  font-style: italic;
}
.ProseMirror pre .hljs-strong {
  color: #24292e;
  font-weight: 700;
}
.ProseMirror pre .hljs-addition {
  color: #22863a;
  background-color: #f0fff4;
}
.ProseMirror pre .hljs-deletion {
  color: #b31d28;
  background-color: #ffeef0;
}

/* ── pre shell — dark mode ───────────────────────────────────── */
[data-theme='dark'] .ProseMirror pre {
  background: #0d1117;
  color: #c9d1d9;
  caret-color: #c9d1d9;
}

/* ── highlight.js — GitHub dark ──────────────────────────────── */
[data-theme='dark'] .ProseMirror pre .hljs-doctag,
[data-theme='dark'] .ProseMirror pre .hljs-keyword,
[data-theme='dark'] .ProseMirror pre .hljs-meta .hljs-keyword,
[data-theme='dark'] .ProseMirror pre .hljs-template-tag,
[data-theme='dark'] .ProseMirror pre .hljs-template-variable,
[data-theme='dark'] .ProseMirror pre .hljs-type,
[data-theme='dark'] .ProseMirror pre .hljs-variable.language_ {
  color: #ff7b72;
}

[data-theme='dark'] .ProseMirror pre .hljs-title,
[data-theme='dark'] .ProseMirror pre .hljs-title.class_,
[data-theme='dark'] .ProseMirror pre .hljs-title.class_.inherited__,
[data-theme='dark'] .ProseMirror pre .hljs-title.function_ {
  color: #d2a8ff;
}

[data-theme='dark'] .ProseMirror pre .hljs-attr,
[data-theme='dark'] .ProseMirror pre .hljs-attribute,
[data-theme='dark'] .ProseMirror pre .hljs-literal,
[data-theme='dark'] .ProseMirror pre .hljs-meta,
[data-theme='dark'] .ProseMirror pre .hljs-number,
[data-theme='dark'] .ProseMirror pre .hljs-operator,
[data-theme='dark'] .ProseMirror pre .hljs-variable,
[data-theme='dark'] .ProseMirror pre .hljs-selector-attr,
[data-theme='dark'] .ProseMirror pre .hljs-selector-class,
[data-theme='dark'] .ProseMirror pre .hljs-selector-id {
  color: #79c0ff;
}

[data-theme='dark'] .ProseMirror pre .hljs-regexp,
[data-theme='dark'] .ProseMirror pre .hljs-string,
[data-theme='dark'] .ProseMirror pre .hljs-meta .hljs-string {
  color: #a5d6ff;
}

[data-theme='dark'] .ProseMirror pre .hljs-built_in,
[data-theme='dark'] .ProseMirror pre .hljs-symbol {
  color: #ffa657;
}

[data-theme='dark'] .ProseMirror pre .hljs-comment,
[data-theme='dark'] .ProseMirror pre .hljs-code,
[data-theme='dark'] .ProseMirror pre .hljs-formula {
  color: #8b949e;
}

[data-theme='dark'] .ProseMirror pre .hljs-name,
[data-theme='dark'] .ProseMirror pre .hljs-quote,
[data-theme='dark'] .ProseMirror pre .hljs-selector-tag,
[data-theme='dark'] .ProseMirror pre .hljs-selector-pseudo {
  color: #7ee787;
}

[data-theme='dark'] .ProseMirror pre .hljs-subst {
  color: #c9d1d9;
}
[data-theme='dark'] .ProseMirror pre .hljs-section {
  color: #1f6feb;
  font-weight: bold;
}
[data-theme='dark'] .ProseMirror pre .hljs-bullet {
  color: #f2cc60;
}
[data-theme='dark'] .ProseMirror pre .hljs-emphasis {
  color: #c9d1d9;
  font-style: italic;
}
[data-theme='dark'] .ProseMirror pre .hljs-strong {
  color: #c9d1d9;
  font-weight: 700;
}
[data-theme='dark'] .ProseMirror pre .hljs-addition {
  color: #aff5b4;
  background-color: #033a16;
}
[data-theme='dark'] .ProseMirror pre .hljs-deletion {
  color: #ffdcd7;
  background-color: #67060c;
}
</style>
