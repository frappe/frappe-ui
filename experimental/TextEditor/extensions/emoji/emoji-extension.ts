import { PluginKey } from '@tiptap/pm/state'
import {
  BaseSuggestionItem,
  createSuggestionExtension,
} from '../suggestion/createSuggestionExtension'
import EmojiList from './EmojiList.vue'
import _EMOJIS from './emojis.json'

const EMOJIS = _EMOJIS as EmojiItem[]

export interface EmojiItem extends BaseSuggestionItem {
  name: string
  emoji: string
}

export default createSuggestionExtension<EmojiItem>({
  name: 'emoji',
  char: ':',
  pluginKey: new PluginKey('emojiSuggestion'),
  items: ({ query }: { query: string }) => {
    return EMOJIS.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    )
      .sort((a, b) => {
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()
        const queryLower = query.toLowerCase()

        // Exact matches first
        if (aName === queryLower && bName !== queryLower) return -1
        if (bName === queryLower && aName !== queryLower) return 1

        // Then names starting with the query
        if (aName.startsWith(queryLower) && !bName.startsWith(queryLower))
          return -1
        if (bName.startsWith(queryLower) && !aName.startsWith(queryLower))
          return 1

        // Then sort by name length (shorter first)
        return aName.length - bName.length
      })
      .slice(0, 5)
  },
  command: ({ editor, range, props: item }) => {
    if (item && item.emoji) {
      editor.chain().focus().deleteRange(range).insertContent(item.emoji).run()
    } else {
      console.error(
        'Emoji command execution error: emoji property not found on selected item or item is invalid.',
        item,
      )
    }
  },
  component: EmojiList,
})
