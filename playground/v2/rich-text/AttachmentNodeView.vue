<script setup lang="ts">
// Figma: espresso-2.0 › 31457:33634. An attachment is a row: the library's
// 28px ghost Button with the file glyph before the name and, while the
// pointer is on it, a small close after — 8px in, 8px between, on an 8px
// radius. The row is the link to the file; the close takes the row out of
// the document. A grip stands to its left on hover, the handle that drags
// it. In a read-only document the close and the grip stay away.
import { computed, h, toRaw, type Component } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { Button } from '../../../src'
import { useNodeViewEditable } from '../../../src/molecules/editor/composables/useNodeViewEditable'
import RteIcon from './RteIcon.vue'

const props = defineProps(nodeViewProps)

// the raw editor for commands: the proxied one throws on a transaction
const editor = toRaw(props.editor)
const editable = useNodeViewEditable(editor)

// made once, not per render: a glyph remade under the pointer swallows the click
const icon =
  (name: string, cls?: string): Component =>
  () =>
    h(RteIcon, { name, class: cls })
const fileIcon = icon('file')
const closeIcon = icon('small-close', 'rte-attachment-close')

const fileName = computed(() => props.node.attrs.fileName || 'Attachment')
const href = computed(() => props.node.attrs.src || undefined)

// the close lives inside the row, as the file draws it; a press on it is
// the row's one action that is not the link
function onClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest?.('.rte-attachment-close')) return
  e.preventDefault()
  e.stopPropagation()
  props.deleteNode()
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="rte-attachment relative flex"
    data-type="attachment"
  >
    <Button
      variant="ghost"
      size="sm"
      class="max-w-full"
      :label="fileName"
      :icon-left="fileIcon"
      :icon-right="editable ? closeIcon : undefined"
      :href="href"
      :download="fileName"
      contenteditable="false"
      @click="onClick"
    />
  </NodeViewWrapper>
</template>
