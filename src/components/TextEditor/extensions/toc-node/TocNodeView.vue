<template>
  <NodeViewWrapper
    class="table-of-contents-node my-4"
    contenteditable="false"
  >
    <div v-if="anchors.length === 0" class="text-sm text-ink-gray-5 italic">
      No headings found in this document.
    </div>
    <div v-else class="toc-list">
      <div
        v-for="anchor in anchors"
        :key="anchor.id"
        class="toc-item block py-1.5 text-sm leading-relaxed"
        :class="{
          'text-ink-gray-8': !anchor.isScrolledOver,
          'text-ink-gray-5': anchor.isScrolledOver,
        }"
        :style="{ 
          paddingLeft: `${(anchor.level - minLevel) * 1.5}rem`,
        }"
      >
        <span v-if="anchor.index" class="toc-number font-medium mr-2 text-ink-gray-7">
          {{ anchor.index }}.
        </span>
        <span class="toc-text">{{ anchor.textContent }}</span>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const anchors = ref<any[]>([])
const minLevel = computed(() =>
  anchors.value.length
    ? Math.min(...anchors.value.map((a) => a.level))
    : 1,
)

const extractAnchors = () => {
  if (!props.editor?.state?.doc) {
    return []
  }

  const headings: any[] = []
  const scrollParent = document.querySelector('#editorScrollContainer')
  
  props.editor.state.doc.descendants((node, pos) => {
    if (!node || !node.type || node.type.name === 'tocNode') return false
    
    if (node.type.name === 'heading') {
      if (!node.attrs) return false
      
      let id = node.attrs.id
      const level = node.attrs.level
      const textContent = node.textContent?.trim() || ''
      
      if (!textContent || !level || level < 1 || level > 6) return false
      
      if (!id && props.editor?.view?.dom) {
          const domPos = props.editor.view.domAtPos(pos)
          const domNode = domPos.node
          if (domNode && domNode.nodeType === Node.ELEMENT_NODE) {
            const headingEl = (domNode as Element).closest('h1, h2, h3, h4, h5, h6, [data-toc-id]')
            if (headingEl) {
              id = headingEl.getAttribute('data-toc-id') || headingEl.getAttribute('id')
            }
          }
      }
      
      headings.push({
        id: String(id || `heading-${pos}`),
        level: Number(level),
        textContent: String(textContent),
        pos: Number(pos),
      })
    }
  })

  if (headings.length === 0) return []
  const minLevel = Math.min(...headings.map(h => h.level))
  
  const counters: number[] = [0, 0, 0, 0, 0, 0, 0]
  const indexedHeadings = headings.map((heading) => {
    const level = heading.level
    for (let l = level + 1; l <= 6; l++) {
      counters[l] = 0
    }
    counters[level]++
    
    const parts: number[] = []
    for (let l = minLevel; l <= level; l++) {
      parts.push(counters[l])
    }
    
    return {
      ...heading,
      index: parts.join('.'),
    }
  })

  if (scrollParent && props.editor?.view?.dom) {
    const scrollTop = scrollParent.scrollTop

    indexedHeadings.forEach((heading) => {
      if (!heading) return
      
      const element = props.editor.view.dom.querySelector(
        `[data-toc-id="${heading.id}"]`,
      )

      if (element) {
        const elementTop = element.getBoundingClientRect().top
        const containerTop = scrollParent.getBoundingClientRect().top
        const relativeTop = elementTop - containerTop + scrollTop

        heading.isActive = relativeTop >= scrollTop - 50 && relativeTop <= scrollTop + 100
        heading.isScrolledOver = relativeTop < scrollTop - 50
      }
    })
  }

  return indexedHeadings
}

const updateAnchors = () => {
  try {
    anchors.value = extractAnchors()
  } catch (error) {
    console.error('Error updating anchors:', error)
    anchors.value = []
  }
}


let updateInterval: any = null

watch(
  () => props.editor?.state?.doc,
  () => {
    if (props.editor && props.node) {
      updateAnchors()
    }
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    if (!props.editor || !props.node) return
    
    updateAnchors()
    
    props.editor.on('update', updateAnchors)
    props.editor.on('selectionUpdate', updateAnchors)
    props.editor.on('create', updateAnchors)
    props.editor.on('focus', updateAnchors)

    const scrollParent = document.querySelector('#editorScrollContainer')
    if (scrollParent) {
      scrollParent.addEventListener('scroll', updateAnchors, { passive: true })
    }

    updateInterval = setInterval(() => {
      if (props.editor && props.node) {
        updateAnchors()
      }
    }, 300)
  })
})

onBeforeUnmount(() => {
  if (!props.editor) return
  
  props.editor.off('update', updateAnchors)
  props.editor.off('selectionUpdate', updateAnchors)
  props.editor.off('create', updateAnchors)
  props.editor.off('focus', updateAnchors)

  const scrollParent = document.querySelector('#editorScrollContainer')
  if (scrollParent) {
    scrollParent.removeEventListener('scroll', updateAnchors)
  }

  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
})
</script>

<style scoped>
.toc-list {
  line-height: 1.8;
}

.toc-item {
  display: block;
  transition: color 0.2s ease;
}

.toc-number {
  display: inline-block;
  min-width: 2rem;
  font-weight: 500;
}

.toc-text {
  display: inline;
}
</style>

