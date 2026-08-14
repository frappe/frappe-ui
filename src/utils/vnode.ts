import {
  Comment,
  Fragment,
  Text,
  isVNode,
  type VNode,
  type VNodeChild,
} from 'vue'

// `VNodeChild`, not `VNode | VNode[]`: menu slots are declared as
// `(props) => VNodeChild` (see Menu/types.ts), so a render function may hand
// back a string, a number, `null`, or a nested array.
function normalizeNodes(nodes?: VNodeChild): VNodeChild[] {
  if (nodes == null || typeof nodes === 'boolean') return []
  return Array.isArray(nodes) ? nodes : [nodes]
}

export function hasRenderableContent(nodes?: VNodeChild): boolean {
  return normalizeNodes(nodes).some((node) => {
    if (node == null || typeof node === 'boolean') return false

    if (Array.isArray(node)) return hasRenderableContent(node)

    if (typeof node === 'string') return node.trim().length > 0

    if (typeof node === 'number') return true

    if (!isVNode(node)) return false

    if (node.type === Comment) return false

    if (node.type === Text) {
      return String(node.children ?? '').trim().length > 0
    }

    if (node.type === Fragment) {
      return hasRenderableContent(node.children as VNodeChild)
    }

    return true
  })
}

export function getFirstRenderableElement(content?: VNodeChild): VNode | null {
  for (const node of normalizeNodes(content)) {
    if (Array.isArray(node)) {
      const renderableChild = getFirstRenderableElement(node)
      if (renderableChild) {
        return renderableChild
      }

      continue
    }

    // Strings and numbers have no element to clone onto, so they are skipped
    // here exactly as they were before this helper accepted them.
    if (!isVNode(node)) {
      continue
    }

    if (node.type === Comment) {
      continue
    }

    if (node.type === Text) {
      if (String(node.children ?? '').trim().length > 0) {
        return node
      }

      continue
    }

    if (node.type === Fragment) {
      const renderableChild = getFirstRenderableElement(
        node.children as VNodeChild,
      )
      if (renderableChild) {
        return renderableChild
      }

      continue
    }

    return node
  }

  return null
}
