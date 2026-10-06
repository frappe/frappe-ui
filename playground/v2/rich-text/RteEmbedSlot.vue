<script setup lang="ts">
// Figma: espresso-2.0 › Embed (32354:128183) — the row /embed lays down
// (32354:128378): the file's 700×36 slot, surface-gray-1 on a 6px radius,
// 10px in, the 16px code glyph and the 14px ink-gray-5 "Embed any link"
// 10px apart — the picture's slot, with the embed's word and glyph.
//
// A press raises RteEmbedSource. The link that comes back, already read,
// takes the slot's own place in one step, laid the width of the column
// in its platform's shape.
import { toRaw } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { Popover } from '../../../src'
import { useNodeViewEditable } from '../../../src/molecules/editor/composables/useNodeViewEditable'
import { getIframeAllowlist } from '../../../src/molecules/editor/extensions/iframe'
import RteEmbedSource from './RteEmbedSource.vue'

const props = defineProps(nodeViewProps)

// the raw editor for commands: the proxied one throws on a transaction
const editor = toRaw(props.editor)
const editable = useNodeViewEditable(editor)
const allowlist = getIframeAllowlist(editor)

/** the slot's own range, or null once it has gone from the document */
function range() {
  const pos = props.getPos()
  if (typeof pos !== 'number') return null
  return { from: pos, to: pos + props.node.nodeSize }
}

function takeLink(embed: { src: string; aspectRatio: number }) {
  const r = range()
  if (!r) return
  editor
    .chain()
    .focus()
    .insertContentAt(r, {
      type: 'iframe',
      attrs: { ...embed, width: null, height: null },
    })
    .run()
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="rte-slot"
    data-type="embed-slot"
    contenteditable="false"
  >
    <Popover side="bottom" align="start" :offset="6" bare>
      <template #trigger="{ open }">
        <button
          type="button"
          class="rte-slot-face"
          :class="open && 'is-open'"
          :disabled="!editable"
        >
          <span class="lucide-code-xml size-4 shrink-0" aria-hidden="true" />
          <span>Embed any link</span>
        </button>
      </template>
      <template #default="{ close }">
        <RteEmbedSource
          :allowlist="allowlist"
          @link="(e) => (close(), takeLink(e))"
          @close="close()"
        />
      </template>
    </Popover>
  </NodeViewWrapper>
</template>

<style scoped>
.rte-slot {
  margin: 8px 0;
}
.rte-slot-face {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 10px;
  height: 36px;
  border-radius: 6px;
  background: var(--surface-gray-1);
  color: var(--ink-gray-5);
  font-size: 14px;
  line-height: 16px;
  text-align: start;
}
.rte-slot-face:hover:not(:disabled),
.rte-slot-face.is-open {
  background: var(--surface-gray-2);
}
.rte-slot-face:disabled {
  cursor: default;
}
</style>
