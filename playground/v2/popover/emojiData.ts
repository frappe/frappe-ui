// Emoji sections for the Picker › Grid emoji picker, built from the editor's
// emoji list (src/molecules/editor/extensions/emoji/emojis.json). That list
// has no categories but keeps the standard order, so each section is a run of
// it; later additions trail the list and are left out, except the flags and
// the smileys the design shows.
import raw from '../../../src/molecules/editor/extensions/emoji/emojis.json'

export interface Emoji {
  char: string
  /** Search text: the name with underscores as spaces. */
  name: string
}

export interface EmojiSection {
  id: string
  label: string
  /** Tab icon; the Figma icon each stands in for is noted. */
  icon: string
  emojis: Emoji[]
}

const ALL: Emoji[] = (raw as { name: string; emoji: string }[]).map((e) => ({
  char: e.emoji,
  name: e.name.replace(/_/g, ' '),
}))

const byChar = new Map(ALL.map((e) => [e.char, e]))

// The first screen of the design, in its order.
const DESIGN_SMILEYS = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉',
  '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '🤪', '😏', '😒', '😞', '😔', '😟',
  '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😢', '😭',
  '😤', '😠', '😡', '🤬', '😱', '😨', '😰', '😥', '😓',
  '😩', '😵', '🤯', '😳', '🥵', '🥶', '😱', '😈', '👿',
  '👹', '👺', '💀', '👻', '👽', '😺', '😾', '🙀', '😿',
]

const FALLBACK_NAMES: Record<string, string> = {
  '🤩': 'star struck',
  '🤪': 'zany face',
  '🤬': 'cursing face',
  '🤯': 'exploding head',
  '☹️': 'frowning face',
}

function run(from: number, to: number) {
  return ALL.slice(from, to + 1)
}

function uniq(emojis: Emoji[]) {
  const seen = new Set<string>()
  return emojis.filter((e) => !seen.has(e.char) && seen.add(e.char))
}

const isFlag = (e: Emoji) => {
  const cp = e.char.codePointAt(0) ?? 0
  return cp >= 0x1f1e6 && cp <= 0x1f1ff
}

const smileys = uniq([
  ...DESIGN_SMILEYS.map(
    (c) => byChar.get(c) ?? { char: c, name: FALLBACK_NAMES[c] ?? '' },
  ),
  ...run(0, 286),
])

export const SECTIONS: EmojiSection[] = [
  // icon/line/emoji
  { id: 'smileys', label: 'Smileys & people', icon: 'lucide-smile', emojis: smileys },
  // icon/line/leaf
  { id: 'nature', label: 'Animals & nature', icon: 'lucide-leaf', emojis: run(287, 447) },
  // icon/line/holiday
  { id: 'travel', label: 'Travel & places', icon: 'lucide-umbrella', emojis: run(616, 733) },
  // icon/line/lightbulb
  { id: 'objects', label: 'Objects', icon: 'lucide-lightbulb', emojis: run(734, 913) },
  // icon/line/announcement
  { id: 'symbols', label: 'Symbols', icon: 'lucide-megaphone', emojis: run(914, 1184) },
  // icon/line/brush
  { id: 'activities', label: 'Activities', icon: 'lucide-paintbrush', emojis: run(533, 615) },
  // icon/line/priority
  { id: 'flags', label: 'Flags', icon: 'lucide-flag', emojis: ALL.filter(isFlag) },
  // icon/line/colour
  { id: 'food', label: 'Food & drink', icon: 'lucide-signpost', emojis: run(448, 532) },
]

/** Every emoji once, for search. */
export const SEARCHABLE: Emoji[] = uniq(SECTIONS.flatMap((s) => s.emojis))
