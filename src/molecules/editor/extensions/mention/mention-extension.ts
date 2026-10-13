import { type MaybeRefOrGetter, toValue, type Component } from 'vue'
import {
  Extension,
  Node,
  mergeAttributes,
  type CommandProps,
  type Editor,
  type Range,
  type RawCommands,
} from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { PluginKey } from '@tiptap/pm/state'
import {
  createSuggestionExtension,
  type BaseSuggestionItem,
} from '../suggestion/createSuggestionExtension'
import MentionList from './MentionList.vue'
import { warnRemoved } from '#utils/warnDeprecated'
import {
  insertSuggestionNode,
  filterByQuery,
  getSuggestionOptions,
} from '#molecules/editor/extensions/shared/suggestion-helpers'
import './style.css'

/**
 * One entry in the `@` list.
 *
 * `label` is what the list shows and what the mention renders as; `value` is
 * the stable identifier stored on the node (`data-id`). Extra fields are
 * allowed and reach the item slot untouched, so an item can carry an avatar
 * or an email for a custom list component.
 */
export interface MentionSuggestionItem extends BaseSuggestionItem {
  label: string
  value: string
  /** The person's picture, shown before the name; initials stand in without one. */
  image?: string
  /**
   * The row that offers to invite the name typed, shown when nobody matches
   * it. Set by the list itself, never by a caller's items.
   */
  invite?: boolean
}

/**
 * Called when the name typed matches nobody and the invite row is taken.
 * `range` is the `@name` run in the document, for the host to replace with
 * whatever an invitation leaves behind — a mention, a plain name, nothing.
 */
export type MentionInviteHandler = (
  name: string,
  context: { editor: Editor; range: Range },
) => void

interface MentionSuggestionOptions {
  mentions: MaybeRefOrGetter<MentionSuggestionItem[]>
  onInvite: MentionInviteHandler | null
}

function createMentionNode(nodeView?: Component) {
  const nodeViewExtension = nodeView
    ? { addNodeView: () => VueNodeViewRenderer(nodeView) }
    : {}

  return Node.create({
    name: 'mention',
    group: 'inline',
    inline: true,
    selectable: true,
    atom: true,
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-id'),
          renderHTML: (attributes) => {
            if (!attributes.id) {
              return {}
            }
            return { 'data-id': attributes.id }
          },
        },
        label: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-label'),
          renderHTML: (attributes) => {
            if (!attributes.label) {
              return {}
            }
            return { 'data-label': attributes.label }
          },
        },
      }
    },

    parseHTML() {
      return [
        {
          tag: 'span.mention[data-type="mention"]',
          getAttrs: (dom) => {
            const element = dom as HTMLElement
            return {
              id: element.getAttribute('data-id'),
              label: element.getAttribute('data-label'),
            }
          },
        },
      ]
    },

    renderHTML({ HTMLAttributes }) {
      return [
        'span',
        mergeAttributes(HTMLAttributes, {
          class: 'mention',
          'data-type': 'mention',
        }),
        `@${HTMLAttributes['data-label'] || HTMLAttributes.id || ''}`,
      ]
    },
    renderText({ node }) {
      return `@${node.attrs.label || node.attrs.id || ''}`
    },

    ...nodeViewExtension,
  })
}

/**
 * Characters that may sit immediately before `@`. TipTap defaults to `[' ']`,
 * so `(@jane` never opened the list. Curly quotes are included because
 * Typography (on in RichTextKit) rewrites `"`/`'` the moment they are typed.
 * NBSP is included because pasted-from-email content often uses it as a space.
 * Closing quotes (`” ’`) are included because Typography curls a quote after a
 * word into the closing form; CJK and guillemet closers (`」 』 » ›`) match.
 *
 * Slash (`/`), tag (`#`), and emoji (`:`) keep the default: those triggers
 * after a word usually mean a path, a heading, or a colon, not a menu.
 */
const ALLOWED_MENTION_PREFIXES = [
  ' ',
  '\u00a0',
  '(',
  '[',
  '{',
  '<',
  '（',
  '【',
  '《',
  '「',
  '『',
  '«',
  '‹',
  '"',
  "'",
  '“',
  '”',
  '‘',
  '’',
  '」',
  '』',
  '»',
  '›',
]

const MentionSuggestionExtension =
  createSuggestionExtension<MentionSuggestionItem>({
    name: 'mentionSuggestion',
    char: '@',
    pluginKey: new PluginKey('mentionSuggestion'),
    listComponent: MentionList,
    allowedPrefixes: ALLOWED_MENTION_PREFIXES,

    addOptions() {
      return {
        mentions: [],
        onInvite: null,
      }
    },

    items: ({ query, editor }) => {
      const options = getSuggestionOptions<MentionSuggestionOptions>(
        editor,
        'mentionSuggestion',
      )
      const mentions = toValue(options?.mentions ?? [])

      // The matched items are passed through as they came in, so the item
      // slot receives the caller's own object, extra fields and all.
      const matched = filterByQuery(mentions, query, 'label').slice(0, 10)
      if (matched.length) return matched
      // Nobody of that name: one row offers to invite them, when the host
      // has somewhere to send an invitation.
      const name = query.trim()
      if (!name || !options?.onInvite) return []
      return [{ label: name, value: '', invite: true }]
    },

    command: ({ editor, range, props }) => {
      if (props.invite) {
        const options = getSuggestionOptions<MentionSuggestionOptions>(
          editor,
          'mentionSuggestion',
        )
        options?.onInvite?.(props.label, { editor, range })
        return
      }
      insertSuggestionNode(editor, range, 'mention', {
        id: props.value,
        label: props.label,
      })
    },

    floatingOptions: {
      placement: 'bottom-start',
      offset: [0, 8],
    },
    allowSpaces: false,
    decorationTag: 'span',
    decorationClass: 'mention-suggestion-active',
  })

export const MentionExtension = Extension.create<{
  items: MaybeRefOrGetter<MentionSuggestionItem[]> | null
  nodeView?: Component
  /**
   * Where an invitation goes when the name typed matches nobody. Without
   * one, the list shows nothing for an unknown name, as it always did.
   */
  onInvite?: MentionInviteHandler | null
}>({
  name: 'mentionExtension',

  addOptions() {
    return {
      items: null,
      onInvite: null,
    }
  },

  addExtensions() {
    if ('component' in this.options) {
      warnRemoved('Mention.component', 'Mention.nodeView')
    }
    const node = createMentionNode(this.options.nodeView)
    // Inert until configured: only wire the `@` suggestion when an item source
    // is provided. Existing mentions in content still render through the node.
    if (this.options.items == null) return [node]
    return [
      node,
      MentionSuggestionExtension.configure({
        mentions: this.options.items,
        onInvite: this.options.onInvite ?? null,
      }),
    ]
  },

  addCommands() {
    return {
      getMentions:
        () =>
        ({ editor }: CommandProps) => {
          const mentions: MentionSuggestionItem[] = []

          editor.state.doc.descendants((node: ProseMirrorNode) => {
            if (node.type.name === 'mention') {
              mentions.push({
                value: node.attrs.id,
                label: node.attrs.label,
              })
            }
          })

          return mentions
        },
      // getMentions is a data-query command (returns the mention list), not a
      // chainable boolean command — cast to satisfy the RawCommands shape.
    } as unknown as Partial<RawCommands>
  },
})
