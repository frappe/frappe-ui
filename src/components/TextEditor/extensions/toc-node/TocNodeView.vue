<template>
  <NodeViewWrapper class="table-of-contents-node" contenteditable="false">
    <div v-if="anchors.length === 0" class="text-sm text-ink-gray-5 italic">
  <NodeViewWrapper
    class="table-of-contents-node"
    contenteditable="false"
  >
    <div v-if="anchorTree.length === 0" class="text-sm text-ink-gray-5 italic">
      No headings found in this document.
    </div>
    <ol v-else v-bind="orderedListHTMLAttrs">
      <TocRecursiveItem
        v-for="anchor in anchorTree"
        :key="anchor.id"
        :node="anchor"
        :ordered-attrs="orderedListHTMLAttrs"
        :list-attrs="listItemHTMLAttrs"
        :on-heading-click="scrollToHeading"
      />
    </ol>
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
import { TextSelection } from '@tiptap/pm/state'

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
)

const scrollToHeading = (heading: HeadingAnchor) => {
  if (!props.editor) {
    return
  }

  const view = props.editor.view
  const pos = heading.pos

    if (pos < 0 || pos > view.state.doc.content.size) {
      return
    }

    let element: Element | null = null
    const editorDom = view.dom

    element =
      editorDom.querySelector(`[data-toc-id="${heading.id}"]`) ||
      editorDom.querySelector(`#${heading.id}`) ||
      null

    if (!element) {
      const domPos = view.domAtPos(pos)
      if (domPos.node && domPos.node.nodeType === Node.ELEMENT_NODE) {
        const node = domPos.node as Element
        if (node.matches('h1, h2, h3, h4, h5, h6')) {
          element = node
        } else {
          element = node.closest('h1, h2, h3, h4, h5, h6')
        }
      }
    }

    if (!element) {
      const allHeadings = Array.from(
        editorDom.querySelectorAll('h1, h2, h3, h4, h5, h6'),
      )
      element = allHeadings.find(
        (el) => el.textContent?.trim() === heading.textContent,
      ) || null
    }

    const tr = view.state.tr
    tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
    view.dispatch(tr)
    view.focus()

    const editorContainer = document.querySelector('#editorScrollContainer')
    if (element && editorContainer) {
      const elementRect = element.getBoundingClientRect()
      const containerRect = editorContainer.getBoundingClientRect()

      const currentScrollTop = editorContainer.scrollTop
      const elementTopRelativeToContainer =
        elementRect.top - containerRect.top + currentScrollTop

      editorContainer.scrollTo({
        top: Math.max(0, elementTopRelativeToContainer - 20),
        behavior: 'smooth',
      })
    } else if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    } else {
      const domPos = view.domAtPos(pos)
      if (domPos.node && domPos.node.nodeType === Node.ELEMENT_NODE) {
        const node = domPos.node as Element
        const editorContainer = document.querySelector('#editorScrollContainer')
        if (editorContainer) {
          const nodeRect = node.getBoundingClientRect()
          const containerRect = editorContainer.getBoundingClientRect()
          const currentScrollTop = editorContainer.scrollTop
          const nodeTopRelativeToContainer =
            nodeRect.top - containerRect.top + currentScrollTop

          editorContainer.scrollTo({
            top: Math.max(0, nodeTopRelativeToContainer - 20),
            behavior: 'smooth',
          })
        }
      }
    }
}

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
    onHeadingClick: {
      type: Function as PropType<(heading: HeadingAnchor) => void>,
      default: () => {},
    },
  },
  setup(props) {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (props.onHeadingClick && typeof props.onHeadingClick === 'function') {
        props.onHeadingClick(props.node)
      }
    }

    return (): VNode =>
      h(
        'li',
        {
          ...props.listAttrs,
          class: [
            props.listAttrs?.class,
            'toc-item',
            props.node.isScrolledOver ? 'text-ink-gray-5' : 'text-ink-gray-8',
            props.node.isActive && !props.node.isScrolledOver ? 'font-medium' : '',
          ]
            .filter(Boolean)
            .join(' '),
          style: { cursor: 'pointer' },
          onClick: handleClick,
        },
        [
          h('p', { style: { margin: 0 } }, props.node.textContent),
          props.node.children?.length
            ? h(
                'ol',
                {
                  ...props.orderedAttrs,
                  onClick: (e: MouseEvent) => {
                    e.stopPropagation()
                  },
                },
                props.node.children.map((child) =>
                  h(TocRecursiveItem, {
                    key: child.id,
                    node: child,
                    orderedAttrs: props.orderedAttrs,
                    listAttrs: props.listAttrs,
                    onHeadingClick: props.onHeadingClick,
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
    }

    stack.push(node)
  })

  return roots
}

const extractAnchors = (): HeadingAnchor[] => {
  if (!props.editor?.state?.doc) return []

  const headings: HeadingAnchor[] = []
  const scrollParent = document.querySelector('#editorScrollContainer')

  // Get the current active tab ID
  let activeTabId: string | null = null
  let tabStart: number | null = null
  let tabEnd: number | null = null

  try {
    activeTabId = props.editor.commands.getCurrentTab() || null
  } catch (e) {
    // If getCurrentTab doesn't exist, continue without tab filtering
  }

  // Find the active tab's position range if tabs exist
  if (activeTabId) {
    props.editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'tab' && node.attrs?.id === activeTabId) {
        tabStart = pos
        tabEnd = pos + node.nodeSize
        return false
      }
    })
  }

  props.editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'tocNode') return false
    if (node.type.name !== 'heading') return false

    // Filter by tab: only include headings within the active tab
    if (tabStart !== null && tabEnd !== null) {
      if (pos < tabStart || pos >= tabEnd) {
        return false
      }
    }

    const level = node.attrs?.level
    const textContent = node.textContent?.trim()
    if (!textContent || !level || level < 1 || level > 6) return false

    let id = node.attrs.id
    if (!id && props.editor?.view?.dom) {
      const domPos = props.editor.view.domAtPos(pos)
      const domNode = domPos.node
      if (domNode?.nodeType === Node.ELEMENT_NODE) {
        const headingEl = (domNode as Element).closest(
          'h1, h2, h3, h4, h5, h6, [data-toc-id]',
        )
        id =
          headingEl?.getAttribute('data-toc-id') ||
          headingEl?.getAttribute('id') ||
          undefined
      }
    }

    headings.push({
      id: id || `heading-${pos}`,
      level,
      textContent,
      pos,
    })
  })

  if (!headings.length || !scrollParent || !props.editor?.view?.dom)
    return headings

  const scrollTop = scrollParent.scrollTop
  headings.forEach((heading) => {
    const element = props.editor.view.dom.querySelector(
      `[data-toc-id="${heading.id}"]`,
    )
    if (element) {
      const relativeTop =
        element.getBoundingClientRect().top -
        scrollParent.getBoundingClientRect().top +
        scrollTop
      heading.isActive =
        relativeTop >= scrollTop - 50 && relativeTop <= scrollTop + 100
      heading.isScrolledOver = relativeTop < scrollTop - 50
    }
  })

  return headings
}

const updateAnchors = () => {
    anchors.value = extractAnchors()
}

let updateInterval: ReturnType<typeof setInterval> | null = null
const scrollParent = document.querySelector('#editorScrollContainer')

watch(
  () => props.editor?.state?.doc,
  updateAnchors,
  { deep: true },
)

// Watch for tab changes
watch(
  () => {
    try {
      return props.editor?.commands?.getCurrentTab?.() || null
    } catch {
      return null
    }
  },
  () => {
    updateAnchors()
  },
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

.toc-item p {
  transition: all 0.2s ease;
}

.toc-item p:hover {
  color: var(--ink-gray-9);
  text-decoration: underline;
}
</style>

