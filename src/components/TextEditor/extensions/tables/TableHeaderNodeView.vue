<template>
  <node-view-wrapper as="th" :class="cellClasses">
    <node-view-content />
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

export default {
  name: 'TableHeaderNodeView',
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
  props: nodeViewProps,
  computed: {
    cellClasses() {
      const classes = []
      if (this.node.attrs.backgroundColor) {
        classes.push(this.node.attrs.backgroundColor)
      }
      if (this.node.attrs.borderColor) {
        classes.push(`${this.node.attrs.borderColor}-border`)
      }
      if (this.node.attrs.borderWidth) {
        classes.push(`border-${this.node.attrs.borderWidth}`)
      }
      return classes.join(' ')
    },
  },
  methods: {
    selectRow() {
      const pos = this.getPos()
      if (pos !== undefined && pos !== null) {
        this.editor.chain().focus().selectRow(pos).run()
      }
    },
    selectColumn() {
      const pos = this.getPos()
      if (pos !== undefined && pos !== null) {
        this.editor.chain().focus().selectColumn(pos).run()
      }
    },
  },
}
</script>
