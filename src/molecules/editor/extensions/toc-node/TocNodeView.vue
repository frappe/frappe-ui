<template>
  <NodeViewWrapper
    class="table-of-contents-node group relative"
    contenteditable="false"
  >
    <p v-if="anchorTree.length === 0" class="text-sm text-ink-gray-5 py-3">
      There are no headings in this document.
    </p>
    <ol v-else v-bind="orderedListHTMLAttrs">
      <TocItem
        v-for="node in anchorTree"
        :key="node.value.id || node.value.pos"
        :node="node"
        :ordered-attrs="orderedListHTMLAttrs"
        :list-attrs="listItemHTMLAttrs"
        @select="onSelect"
      />
    </ol>

    <button
      v-if="isEditable"
      @click="removeNode"
      class="absolute top-2 right-2 bg-black/65 hover:bg-black/80 text-ink-gray-4 hover:text-ink-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      title="Remove table of contents"
    >
      <span class="lucide-x size-4" />
    </button>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed, toRaw } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'
import {
  safeGetPos,
  getExtensionHTMLAttributes,
  dispatchIfAlive,
} from '#molecules/editor/extensions/shared/node-view'
import { foldHeadings } from '#molecules/editor/extensions/shared/heading-tree-utils'
import { useScrollContainer } from '#molecules/editor/composables/useScrollContainer'
import { useTocAnchors } from '#molecules/editor/composables/useTocAnchors'
import {
  useTocActiveHeading,
  type EnrichedAnchor,
} from '#molecules/editor/composables/useTocActiveHeading'
import { scrollToHeading } from './toc-scroll-controller'
import TocItem from './TocItem.vue'

const props = defineProps(nodeViewProps)

// VueNodeViewRenderer passes a reactive-proxied editor; dispatching a
// transaction through it trips ProseMirror's by-reference doc check
// ("Applying a mismatched transaction"). Use the raw editor. (See MediaNodeView.)
const editor = toRaw(props.editor)

const isEditable = useNodeViewEditable(editor)
const container = useScrollContainer()
const { anchors } = useTocAnchors(editor)
const { enrichedAnchors } = useTocActiveHeading(editor, anchors, container)

const anchorTree = computed(() =>
  foldHeadings<EnrichedAnchor>(
    enrichedAnchors.value,
    (item) => item as EnrichedAnchor,
  ),
)

const orderedListHTMLAttrs = computed(() =>
  getExtensionHTMLAttributes(editor, 'orderedList'),
)
const listItemHTMLAttrs = computed(() =>
  getExtensionHTMLAttributes(editor, 'listItem'),
)

function removeNode(): void {
  if (!isEditable.value) return
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  const view = editor.view
  const tr = view.state.tr.delete(pos, pos + props.node.nodeSize)
  dispatchIfAlive(view, tr)
}

function onSelect(anchor: EnrichedAnchor): void {
  scrollToHeading(editor, anchor, container.value)
}
</script>

<style scoped>
.table-of-contents-node li {
  transition: color 0.2s ease;
}

.toc-item p {
  transition: all 0.2s ease;
}

.toc-item p:hover {
  color: var(--ink-gray-9);
  text-decoration: underline;
}
</style>
