<script setup lang="ts">
// Figma: espresso-2.0 › Image (32243:108985) — the empty slot /image lays
// down. Across the document it is the file's 700×36 row (32251:109424):
// surface-gray-1 on a 6px radius, 10px in, the 16px glyph and the 14px
// ink-gray-5 word 10px apart. In a column it becomes the file's cell
// (23800:8107): 342×170 on the same radius, drawn in a 1px dashed
// outline-gray-3 with no fill, holding a surface-gray-1 panel 8px inside
// whose glyph and word sit in the middle. The dash goes the moment a
// picture lands, because the picture takes the slot's place.
//
// A press on either raises RteImageSource. What comes back takes the
// slot's own place in one step, so there is never a moment with nothing
// in the cell: a file goes through the library's upload — its progress,
// its error, its try-again — standing in for the selected slot, and a
// link, already read, goes straight in over the slot's range.
import { toRaw } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { Popover } from '../../../src'
import { useNodeViewEditable } from '../../../src/molecules/editor/composables/useNodeViewEditable'
import RteIcon from './RteIcon.vue'
import RteImageSource from './RteImageSource.vue'

const props = defineProps(nodeViewProps)

// the raw editor for commands: the proxied one throws on a transaction
const editor = toRaw(props.editor)
const editable = useNodeViewEditable(editor)

/** the slot's own range, or null once it has gone from the document */
function range() {
  const pos = props.getPos()
  if (typeof pos !== 'number') return null
  return { from: pos, to: pos + props.node.nodeSize }
}

function takeFile(file: File) {
  const r = range()
  if (!r) return
  // the upload replaces the selection, and the selection is the slot —
  // carried along should the document move. Selected first, on its own:
  // a file turned away at the door is written back before any chain it
  // was part of would have been dispatched.
  editor.chain().focus().setNodeSelection(r.from).run()
  editor.commands.uploadImage(file)
}

function takeLink(image: { src: string; width: number; height: number }) {
  const r = range()
  if (!r) return
  editor
    .chain()
    .focus()
    .insertContentAt(r, { type: 'image', attrs: image })
    .run()
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="rte-slot"
    data-type="image-slot"
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
          <RteIcon name="image" class="size-4 shrink-0" />
          <span>Add Image</span>
        </button>
      </template>
      <template #default="{ close }">
        <RteImageSource
          @file="(f: File) => (close(), takeFile(f))"
          @link="(i) => (close(), takeLink(i))"
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

/* in a column the slot is the file's cell: the dashed outline holds the
   342 × 170 shape and the panel sits 8px inside it. The column itself says
   so — a slot dragged in or out changes shape with no attribute to keep */
[data-type='column'] .rte-slot {
  margin: 0;
  border: 1px dashed var(--outline-gray-3);
  border-radius: 6px;
  padding: 8px;
  aspect-ratio: 342 / 170;
}
[data-type='column'] .rte-slot .rte-slot-face {
  height: 100%;
  justify-content: center;
  border-radius: 6px;
}
</style>
