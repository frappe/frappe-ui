import { Comment, Fragment, Text, type VNode } from 'vue'

function normalizeNodes(nodes?: VNode | VNode[] | null): VNode[] {
  if (!nodes) return []
  return Array.isArray(nodes) ? nodes : [nodes]
}

export function hasRenderableContent(nodes?: VNode | VNode[] | null): boolean {
  return normalizeNodes(nodes).some((node) => {
    if (node.type === Comment) return false

    if (node.type === Text) {
      return String(node.children ?? '').trim().length > 0
    }

    if (node.type === Fragment) {
      return hasRenderableContent(
        Array.isArray(node.children) ? (node.children as VNode[]) : [],
      )
    }

    return true
  })
}

export function getFirstRenderableElement(
  content?: VNode | VNode[] | null,
): VNode | null {
  for (const node of normalizeNodes(content)) {
    if (!node || typeof node !== 'object') {
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
      const children = Array.isArray(node.children)
        ? (node.children as VNode[])
        : []
      const renderableChild = getFirstRenderableElement(children)
      if (renderableChild) {
        return renderableChild
      }

      continue
    }

    return node
  }

  return null
}
