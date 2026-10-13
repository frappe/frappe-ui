<script setup lang="ts">
// An expand/collapse block: the chevron turns and the content folds, as the
// file's product list does. The summary and the content are both editable;
// the chevron alone toggles. The block's grip is the document's
// (RteBlockHandle), as every block's is.
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

function toggle() {
  props.updateAttributes({ open: !props.node.attrs.open })
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="rte-details"
    :class="node.attrs.open && 'is-open'"
    data-type="details"
  >
    <button
      type="button"
      class="rte-details-toggle"
      contenteditable="false"
      :aria-expanded="node.attrs.open"
      :aria-label="node.attrs.open ? 'Collapse' : 'Expand'"
      @mousedown.prevent
      @click="toggle"
    >
      <span class="lucide-chevron-right size-4" aria-hidden="true" />
    </button>
    <NodeViewContent as="div" class="rte-details-body" />
  </NodeViewWrapper>
</template>
