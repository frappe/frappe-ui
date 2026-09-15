/**
 * Compile-time contract for the editor option types.
 *
 * Every `@ts-expect-error` below is an assertion: `yarn type-check` fails if
 * the line starts to compile. The runtime body only keeps the fixtures alive.
 */
import { describe, expectTypeOf, it } from 'vitest'
import type { EditorState } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import type { PopoverAlign, PopoverSide } from '#components/Popover/types'
import type {
  CommentKitOptions,
  TiptapEditor as MenuEditor,
  EditorMenuOptions,
  EditorMenuShouldShowContext,
  InlineKitOptions,
  MentionSuggestionItem,
  RichTextKitOptions,
  StarterKitOptions,
  TagSuggestionItem,
  UploadFunction,
  UploadedFile,
} from './index'

// --- ED-Q3: StarterKit keys -------------------------------------------------

const starterKit: StarterKitOptions = {
  paragraph: false,
  undoRedo: false,
  trailingNode: { node: 'paragraph' },
}

// @ts-expect-error `code` is not a StarterKit member; the frappe Code mark owns it.
const starterKitCode: StarterKitOptions = { code: false }
// @ts-expect-error `codeBlock` is not a StarterKit member.
const starterKitCodeBlock: StarterKitOptions = { codeBlock: false }
// @ts-expect-error `link` is not a StarterKit member; the frappe Link mark owns it.
const starterKitLink: StarterKitOptions = { link: false }

// --- ED-Q4: typed kit members ----------------------------------------------

const commentKit: CommentKitOptions['starterKit'] = { paragraph: false }
// @ts-expect-error `heading` inside `starterKit` is overwritten by the kit's own member.
const commentKitHeading: CommentKitOptions['starterKit'] = { heading: false }

const image: RichTextKitOptions['image'] = {
  uploadFunction: async () => ({ file_url: '/files/a.png' }),
}
// @ts-expect-error A misspelled option must not reach the extension unnoticed.
const imageTypo: RichTextKitOptions['image'] = { uplaodFunction: null }

const imageViewer: RichTextKitOptions['imageViewer'] = {}
const imageViewerOff: RichTextKitOptions['imageViewer'] = false
// @ts-expect-error ImageViewer takes no options.
const imageViewerTypo: RichTextKitOptions['imageViewer'] = { zoom: true }

const tocOn: RichTextKitOptions['toc'] = {}
// @ts-expect-error Toc takes no options.
const tocTypo: RichTextKitOptions['toc'] = { levels: [2, 3] }

const slashDefault: RichTextKitOptions['slashCommands'] = {}
const slashItems: RichTextKitOptions['slashCommands'] = {
  items: [{ title: 'Insert', icon: 'lucide-plus', command: () => {} }],
}
const slashOff: RichTextKitOptions['slashCommands'] = false
// @ts-expect-error Only `items` configures the slash menu.
const slashTypo: RichTextKitOptions['slashCommands'] = { itmes: [] }

const textAlign: RichTextKitOptions['textAlign'] = { types: ['heading'] }
// @ts-expect-error TextAlign has no `alignments` misspelling.
const textAlignTypo: RichTextKitOptions['textAlign'] = { alignements: [] }

// --- ED-Q4: InlineKit takes `false` only ------------------------------------

const inlineStarter: InlineKitOptions['starterKit'] = {
  code: false,
  undoRedo: false,
}
const inlineStarterOff: InlineKitOptions['starterKit'] = false
const inlineStarterObject: InlineKitOptions['starterKit'] = {
  // @ts-expect-error InlineKit registers stock extensions or none; objects are ignored.
  bold: { HTMLAttributes: { class: 'x' } },
}
// @ts-expect-error InlineKit has no heading.
const inlineStarterHeading: InlineKitOptions['starterKit'] = { heading: false }

// --- ED-Q6: mention and tag items -------------------------------------------

const mention: MentionSuggestionItem = { label: 'Jane', value: 'jane@x.com' }
const mentionExtra: MentionSuggestionItem = {
  label: 'Jane',
  value: 'jane@x.com',
  avatar: '/files/jane.png',
}
// @ts-expect-error A mention item needs a stable `value`.
const mentionNoValue: MentionSuggestionItem = { label: 'Jane' }

const tag: TagSuggestionItem = { label: 'design' }
const tagWithValue: TagSuggestionItem = { label: 'design', value: 'TAG-0001' }
// @ts-expect-error A tag item needs a `label`.
const tagNoLabel: TagSuggestionItem = { value: 'TAG-0001' }

// --- ED-Q2: upload contract -------------------------------------------------

const uploadWithOptions: UploadFunction = async (file, options) => {
  options?.onProgress?.({ loaded: 1, total: 2, percent: 50 })
  return { file_url: `/files/${file.name}` }
}
// A one-parameter handler stays assignable.
const uploadLegacy: UploadFunction = async () => ({ file_url: '/files/a.png' })
// @ts-expect-error Every upload result must carry a `file_url`.
const uploadNoUrl: UploadFunction = async () => ({ file_name: 'a.png' })

const uploaded: UploadedFile = { file_url: '/files/a.png', anything: 1 }

// --- ED-Q8: one menu options type -------------------------------------------

const menuOptions: EditorMenuOptions = {
  side: 'top',
  align: 'start',
  offset: 8,
  shouldShow: ({ editor, from, to }) => from !== to && editor.isEditable,
}
// The two axes are the library's own, shared with every other overlay.
expectTypeOf<EditorMenuOptions['side']>().toEqualTypeOf<
  PopoverSide | undefined
>()
expectTypeOf<EditorMenuOptions['align']>().toEqualTypeOf<
  PopoverAlign | undefined
>()
// @ts-expect-error `side` is a fixed set of values.
const menuBadSide: EditorMenuOptions = { side: 'above' }
// @ts-expect-error `align` is a fixed set of values.
const menuBadAlign: EditorMenuOptions = { align: 'middle' }
// @ts-expect-error `placement` is replaced by `side` and `align`.
const menuPlacement: EditorMenuOptions = { placement: 'top-start' }
// @ts-expect-error Only the listed positioning keys are read.
const menuUnknownKey: EditorMenuOptions = { updateDelay: 250 }

/**
 * Both TipTap menus pass `from` and `to` on every call:
 * `@tiptap/extension-floating-menu/dist/index.js:214-223` and
 * `@tiptap/extension-bubble-menu/dist/index.js:348-356`. `element` is the
 * bubble menu's alone, so it stays optional.
 */
const menuContext: EditorMenuShouldShowContext = {
  editor: null as unknown as MenuEditor,
  view: null as unknown as EditorView,
  state: null as unknown as EditorState,
  from: 1,
  to: 4,
}
// @ts-expect-error `from` and `to` are always supplied, so they are required.
const menuContextNoRange: EditorMenuShouldShowContext = {
  editor: null as unknown as MenuEditor,
  view: null as unknown as EditorView,
  state: null as unknown as EditorState,
}

void starterKitCode
void starterKitCodeBlock
void starterKitLink
void commentKitHeading
void imageTypo
void imageViewerTypo
void tocTypo
void slashTypo
void textAlignTypo
void inlineStarterObject
void inlineStarterHeading
void mentionNoValue
void tagNoLabel
void uploadNoUrl
void menuBadSide
void menuBadAlign
void menuPlacement
void menuUnknownKey
void menuContextNoRange

describe('editor option types', () => {
  it('accepts the documented shapes', () => {
    expectTypeOf(starterKit).toMatchTypeOf<StarterKitOptions>()
    expectTypeOf(commentKit).toMatchTypeOf<CommentKitOptions['starterKit']>()
    expectTypeOf(image).toMatchTypeOf<RichTextKitOptions['image']>()
    expectTypeOf(imageViewer).toEqualTypeOf<Record<string, never>>()
    expectTypeOf(tocOn).toEqualTypeOf<Record<string, never>>()
    expectTypeOf(slashDefault.items).toBeNullable()
    expectTypeOf(slashItems.items).toBeNullable()
    expectTypeOf(textAlign).toMatchTypeOf<RichTextKitOptions['textAlign']>()
    expectTypeOf(inlineStarter).toMatchTypeOf<InlineKitOptions['starterKit']>()
    // `false` removes a member; the declarations above are the assertion.
    void imageViewerOff
    void slashOff
    void inlineStarterOff
    expectTypeOf(mention).toMatchTypeOf<MentionSuggestionItem>()
    expectTypeOf(mentionExtra).toMatchTypeOf<MentionSuggestionItem>()
    expectTypeOf(tag).toMatchTypeOf<TagSuggestionItem>()
    expectTypeOf(tagWithValue).toMatchTypeOf<TagSuggestionItem>()
    expectTypeOf(uploadWithOptions).toMatchTypeOf<UploadFunction>()
    expectTypeOf(uploadLegacy).toMatchTypeOf<UploadFunction>()
    expectTypeOf(uploaded).toMatchTypeOf<UploadedFile>()
    expectTypeOf(menuOptions).toMatchTypeOf<EditorMenuOptions>()
    expectTypeOf(menuContext).toMatchTypeOf<EditorMenuShouldShowContext>()
  })
})
