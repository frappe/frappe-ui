<template>
  <NodeViewWrapper
    class="table-of-contents-node"
    contenteditable="false"
  >
    <div v-if="anchorTree.length === 0" class="text-sm text-ink-gray-5 italic">
  <NodeViewWrapper class="table-of-contents-node" contenteditable="false">
    <div v-if="anchors.length === 0" class="text-sm text-ink-gray-5 italic">
      No headings found in this document.
    </div>
    <ol v-else v-bind="orderedListHTMLAttrs">
      <TocRecursiveItem
        v-for="anchor in anchorTree"
        :key="anchor.id"
        :node="anchor"
        :ordered-attrs="orderedListHTMLAttrs"
        :list-attrs="listItemHTMLAttrs"
      />
    </ol>
        class="toc-item block py-1 text-sm leading-relaxed"
        :class="{
          'text-ink-gray-8': !anchor.isScrolledOver,
          'text-ink-gray-5': anchor.isScrolledOver,
        }"
        :style="{
          paddingLeft: `${(anchor.level - minLevel) * 1.5}rem`,
        }"
      >
        <span
          v-if="anchor.index"
          class="toc-number font-medium mr-2 text-ink-gray-7"
        >
          {{ anchor.index }}.
        </span>
        <span class="toc-text">{{ anchor.textContent }}</span>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  defineComponent,
  h,
} from 'vue'
import type { PropType, VNode } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

type HeadingAnchor = {
  id: string
  level: number
  textContent: string
  pos: number
  isActive?: boolean
  isScrolledOver?: boolean
}

type AnchorNode = HeadingAnchor & {
  children?: AnchorNode[]
}

const anchors = ref<HeadingAnchor[]>([])
const anchorTree = computed(() => buildAnchorTree(anchors.value))

const orderedListHTMLAttrs = computed(
  () => getExtensionHTMLAttributes('orderedList') ?? {},
)
const listItemHTMLAttrs = computed(
  () => getExtensionHTMLAttributes('listItem') ?? {},
const anchors = ref<any[]>([])
const minLevel = computed(() =>
  anchors.value.length ? Math.min(...anchors.value.map((a) => a.level)) : 1,
)

const TocRecursiveItem = defineComponent({
  props: {
    node: {
      type: Object as PropType<AnchorNode>,
      required: true,
    },
    orderedAttrs: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    listAttrs: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  setup(props) {
    return (): VNode =>
      h(
        'li',
        {
          ...props.listAttrs,
          class: [
            props.listAttrs?.class,
            props.node.isScrolledOver ? 'text-ink-gray-5' : 'text-ink-gray-8',
            props.node.isActive && !props.node.isScrolledOver ? 'font-medium' : '',
          ]
            .filter(Boolean)
            .join(' '),
        },
        [
          h('p', { style: { margin: 0 } }, props.node.textContent),
          props.node.children?.length
            ? h(
                'ol',
                props.orderedAttrs,
                props.node.children.map((child) =>
                  h(TocRecursiveItem, {
                    key: child.id,
                    node: child,
                    orderedAttrs: props.orderedAttrs,
                    listAttrs: props.listAttrs,
                  }),
                ),
              )
            : null,
        ],
      )
  },
})

const getExtensionHTMLAttributes = (name: string) => {
  return props.editor?.extensionManager?.extensions.find(
    (ext: any) => ext.name === name,
  )?.options?.HTMLAttributes
}

const buildAnchorTree = (items: HeadingAnchor[]): AnchorNode[] => {
  if (!items.length) return []

  const roots: AnchorNode[] = []
  const stack: AnchorNode[] = []

  items.forEach((item) => {
    const node: AnchorNode = {
      ...item,
      children: [],
    }

    while (stack.length && stack[stack.length - 1].level >= node.level) {
      stack.pop()
    }

    if (!stack.length) {
      roots.push(node)
    } else {
      stack[stack.length - 1].children?.push(node)
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
          const headingEl = (domNode as Element).closest(
            'h1, h2, h3, h4, h5, h6, [data-toc-id]',
          )
          if (headingEl) {
            id =
              headingEl.getAttribute('data-toc-id') ||
              headingEl.getAttribute('id')
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
  const minLevel = Math.min(...headings.map((h) => h.level))

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

    stack.push(node)
  })

  return roots
}
    indexedHeadings.forEach((heading) => {
      if (!heading) return

      const element = props.editor.view.dom.querySelector(
        `[data-toc-id="${heading.id}"]`,
      )

const extractAnchors = (): HeadingAnchor[] => {
  if (!props.editor?.state?.doc) return []

  const headings: HeadingAnchor[] = []
  
  props.editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'tocNode') return false
    if (node.type.name !== 'heading') return false
    
    const level = node.attrs?.level
    const textContent = node.textContent?.trim()
    if (!textContent || !level || level < 1 || level > 6) return false
    
    let id = node.attrs.id
    if (!id && props.editor?.view?.dom) {
      const domPos = props.editor.view.domAtPos(pos)
      const domNode = domPos.node
      if (domNode?.nodeType === Node.ELEMENT_NODE) {
        const headingEl = (domNode as Element).closest('h1, h2, h3, h4, h5, h6, [data-toc-id]')
        id = headingEl?.getAttribute('data-toc-id') || headingEl?.getAttribute('id') || undefined
        heading.isActive =
          relativeTop >= scrollTop - 50 && relativeTop <= scrollTop + 100
        heading.isScrolledOver = relativeTop < scrollTop - 50
      }
    }
    
    headings.push({
      id: id || `heading-${pos}`,
      level,
      textContent,
      pos,
    })
  })

  if (!headings.length || !scrollParent || !props.editor?.view?.dom) return headings

  const scrollTop = scrollParent.scrollTop
  headings.forEach((heading) => {
    const element = props.editor.view.dom.querySelector(`[data-toc-id="${heading.id}"]`)
    if (element) {
      const relativeTop = element.getBoundingClientRect().top - scrollParent.getBoundingClientRect().top + scrollTop
      heading.isActive = relativeTop >= scrollTop - 50 && relativeTop <= scrollTop + 100
      heading.isScrolledOver = relativeTop < scrollTop - 50
    }
  })

  return headings
}

const updateAnchors = () => {
  try {
    anchors.value = extractAnchors()
  } catch (error) {
    console.error('Error updating anchors:', error)
    anchors.value = []
  }
}

let updateInterval: ReturnType<typeof setInterval> | null = null
const scrollParent = document.querySelector('#editorScrollContainer')

watch(
  () => props.editor?.state?.doc,
  updateAnchors,
  { deep: true }
let updateInterval: any = null

watch(
  () => props.editor?.state?.doc,
  () => {
    if (props.editor && props.node) {
      updateAnchors()
    }
  },
  { deep: true },
)

onMounted(() => {
  nextTick(() => {
    if (!props.editor || !props.node) return

    updateAnchors()

    props.editor.on('update', updateAnchors)
    props.editor.on('selectionUpdate', updateAnchors)
    props.editor.on('create', updateAnchors)
    props.editor.on('focus', updateAnchors)
    
    if (scrollParent) {
      scrollParent.addEventListener('scroll', updateAnchors, { passive: true })
    }
    
    updateInterval = setInterval(updateAnchors, 300)
  })
})

onBeforeUnmount(() => {
  if (!props.editor) return

  props.editor.off('update', updateAnchors)
  props.editor.off('selectionUpdate', updateAnchors)
  props.editor.off('create', updateAnchors)
  props.editor.off('focus', updateAnchors)
  
  if (scrollParent) {
    scrollParent.removeEventListener('scroll', updateAnchors)
  }
  
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.table-of-contents-node li {
  transition: color 0.2s ease;
}
</style>

