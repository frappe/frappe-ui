/**
 * Tab-aware heading collection — the single typed surface for the host app's
 * `getCurrentTab` command.
 *
 * The `tab` node and the `getCurrentTab` command are injected by the host app
 * (gameplan), NOT defined in this repo. This module is the ONLY place that
 * reaches for `getCurrentTab`; every consumer goes through `collectHeadings`.
 *
 * Reads the STABLE `node.attrs.id` produced by `extensions/heading/heading-ids.ts`.
 * It never synthesizes `heading-${pos}` ids (those break across edits).
 */
import type { Editor } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'

const HEADING = 'heading'
const TAB = 'tab'
const TOC = 'tocNode'

export interface HeadingInfo {
  id: string
  level: number
  text: string
  pos: number
}

/**
 * The host editor optionally augments `commands` with `getCurrentTab`. We type
 * it as an optional method so consumers can optional-chain it without `any`.
 */
export interface EditorWithTabCommands extends Editor {
  commands: Editor['commands'] & {
    getCurrentTab?: () => string | null | undefined
  }
}

/**
 * Read the active tab id via the host-injected `getCurrentTab` command.
 * Returns `null` when the command is absent or throws (no tabs in this host).
 */
export function getActiveTabId(editor: Editor): string | null {
  const commands = (editor as EditorWithTabCommands).commands
  if (typeof commands?.getCurrentTab !== 'function') return null
  try {
    return commands.getCurrentTab() || null
  } catch {
    return null
  }
}

/**
 * Resolve the document range `{ start, end }` of the active tab node, or `null`
 * when there is no active tab (so headings are collected document-wide).
 */
export function getActiveTabRange(
  editor: Editor,
): { start: number; end: number } | null {
  const activeTabId = getActiveTabId(editor)
  if (!activeTabId) return null

  const doc = editor.state?.doc
  if (!doc) return null

  let range: { start: number; end: number } | null = null
  doc.descendants((node: Node, pos: number) => {
    if (range !== null) return false
    if (node.type.name === TAB && node.attrs?.id === activeTabId) {
      range = { start: pos, end: pos + node.nodeSize }
      return false
    }
    return true
  })
  return range
}

/**
 * Collect headings (level 1–6, non-empty text) in document order. When `range`
 * is provided, only headings inside `[start, end)` are returned. Pass
 * `getActiveTabRange(editor)` to scope to the active tab.
 */
export function collectHeadings(
  editor: Editor,
  range?: { start: number; end: number } | null,
): HeadingInfo[] {
  const doc = editor.state?.doc
  if (!doc) return []

  const headings: HeadingInfo[] = []
  doc.descendants((node: Node, pos: number) => {
    if (node.type.name === TOC) return false
    if (node.type.name !== HEADING) return false

    if (range && (pos < range.start || pos >= range.end)) return false

    const level = node.attrs?.level as number | undefined
    const text = node.textContent?.trim()
    if (!text || !level || level < 1 || level > 6) return false

    const id = (node.attrs?.id as string | undefined) || ''
    headings.push({ id, level, text, pos })
    return false
  })
  return headings
}
