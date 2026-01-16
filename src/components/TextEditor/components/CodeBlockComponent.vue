<template>
  <node-view-wrapper>
    <div class="code-block-container">
      <select
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
      <pre><code><node-view-content /></code></pre>
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
  opacity: 0;
  z-index: 10;
  transition-property: opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: 0s;
  pointer-events: none;
}

.code-block-container:hover .language-selector {
  opacity: 1;
  transition-delay: 0s;
  pointer-events: auto;
}

.language-selector:focus-within {
  opacity: 1;
  transition-delay: 0s;
  pointer-events: auto;
}

/* When mouse leaves the code block, delay the hiding */
.code-block-container:not(:hover) .language-selector:not(:focus-within) {
  transition-delay: 1.5s;
}

.ProseMirror pre {
  background: #0d0d0d;
  color: #fff;
  font-family: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Mono', 'Source Code Pro', 'Fira Mono',
    'Droid Sans Mono', 'Consolas', 'Courier New', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  caret-color: #fff;
}

.ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 12px;
}

.ProseMirror pre .hljs-comment,
.ProseMirror pre .hljs-quote {
  color: #999;
}

.ProseMirror pre .hljs-variable,
.ProseMirror pre .hljs-template-variable,
.ProseMirror pre .hljs-attribute,
.ProseMirror pre .hljs-tag,
.ProseMirror pre .hljs-name,
.ProseMirror pre .hljs-regexp,
.ProseMirror pre .hljs-link,
.ProseMirror pre .hljs-selector-id,
.ProseMirror pre .hljs-selector-class {
  color: #f2777a;
}

.ProseMirror pre .hljs-number,
.ProseMirror pre .hljs-meta,
.ProseMirror pre .hljs-built_in,
.ProseMirror pre .hljs-builtin-name,
.ProseMirror pre .hljs-literal,
.ProseMirror pre .hljs-type,
.ProseMirror pre .hljs-params {
  color: #f99157;
}

.ProseMirror pre .hljs-string,
.ProseMirror pre .hljs-symbol,
.ProseMirror pre .hljs-bullet {
  color: #99cc99;
}

.ProseMirror pre .hljs-title,
.ProseMirror pre .hljs-section {
  color: #ffcc66;
}

.ProseMirror pre .hljs-keyword,
.ProseMirror pre .hljs-selector-tag {
  color: #6196cc;
}

.ProseMirror pre .hljs-emphasis {
  font-style: italic;
}

.ProseMirror pre .hljs-strong {
  font-weight: 700;
}
</style>
