<template>
  <node-view-wrapper>
    <div class="code-block-container group relative">
      <pre
        class="flex items-start gap-5 !pl-3"
      ><span class="flex flex-none select-none flex-col items-end border-outline-gray-2 text-ink-gray-4" aria-hidden="true" contenteditable="false"><span v-for="n in lineCount" :key="n" class="block">{{ n }}</span></span><code class="min-w-0 flex-1 overflow-x-auto"><node-view-content /></code></pre>
      <div
        class="absolute right-0 top-0 pr-2 pt-1.5 flex items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        :class="{ 'opacity-100': languageMenuOpen || props.selected }"
        contenteditable="false"
      >
        <Combobox
          v-if="isEditable"
          v-model="selectedLanguage"
          :options="languageOptions"
          trigger="button"
          variant="ghost"
          size="sm"
          placeholder="auto"
          @update:open="languageMenuOpen = $event"
        />
        <span v-else class="select-none px-1 text-xs text-ink-gray-4">{{
          props.node.attrs.language || 'auto'
        }}</span>
        <TooltipProvider :delay-duration="500">
          <TooltipRoot disable-closing-trigger>
            <TooltipTrigger as-child>
              <Button
                size="xs"
                variant="ghost"
                label="Copy code"
                :icon="copied ? 'lucide-check' : 'lucide-copy'"
                @mousedown.prevent
                @click.stop="copyCode"
              />
            </TooltipTrigger>
            <TooltipBubble :text="copied ? 'Copied!' : 'Copy code'" />
          </TooltipRoot>
        </TooltipProvider>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, onBeforeUnmount } from 'vue'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { createLowlight } from 'lowlight'
import { TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import Button from '#components/Button/Button.vue'
import Combobox from '#components/Combobox/Combobox.vue'
import type { ComboboxOption } from '#components/Combobox/types'
import TooltipBubble from '#components/Tooltip/TooltipBubble.vue'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'
import { listEditorLanguages } from '#molecules/editor/extensions/shared/lowlight-languages'
import './CodeBlockComponent.css'

type Lowlight = ReturnType<typeof createLowlight>

const props = defineProps(nodeViewProps)

// VueNodeViewRenderer passes a reactive-proxied editor; operate on the raw editor
// so any command/transaction dispatch is reference-safe. (See MediaNodeView.)
const editor = toRaw(props.editor)

const isEditable = useNodeViewEditable(editor)

// The combobox value is a string, but the node stores `null` for "auto". Map the
// two: `''` is the sentinel the "auto" option carries, round-tripped to `null`.
const selectedLanguage = computed<string | null>({
  get: () => (props.node.attrs.language as string | null) ?? '',
  set: (language) => {
    props.updateAttributes({ language: language || null })
  },
})

const languageOptions = computed<ComboboxOption[]>(() => {
  const lowlight = props.extension.options.lowlight as Lowlight
  return [
    { label: 'auto', value: '' },
    ...listEditorLanguages(lowlight).map(({ label, value }) => ({
      label,
      value,
    })),
  ]
})

const languageMenuOpen = ref(false)

// One gutter number per `\n`-delimited line. Rendered as discrete block lines
// (not a `\n`-joined string) so stacking never depends on `white-space`.
const lineCount = computed(() => props.node.textContent.split('\n').length)

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

const copyCode = async () => {
  const text = props.node.textContent
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      copyViaExecCommand(text)
    }
    markCopied()
  } catch (error) {
    // Async Clipboard API can reject in insecure contexts or when the document
    // lost focus; fall back to the legacy path before giving up.
    try {
      copyViaExecCommand(text)
      markCopied()
    } catch {
      console.error('Failed to copy code block', error)
    }
  }
}

function markCopied() {
  copied.value = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => (copied.value = false), 2000)
}

/**
 * Legacy clipboard path for contexts where `navigator.clipboard` is missing
 * (non-HTTPS origins, older webviews). Selects a detached textarea and copies.
 */
function copyViaExecCommand(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>
