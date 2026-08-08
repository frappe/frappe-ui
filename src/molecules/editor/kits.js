import { Extension, Node } from '@tiptap/core';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';
import { Gapcursor, UndoRedo } from '@tiptap/extensions';
import { Placeholder, Link, StarterKit, Code, CodeBlock, Image, ImageGroup, ImageViewer, Video, Attachment, MediaDrop, ContentPaste, Emoji, Mention, Tag, Table, TableRow, TableCell, TableHeader, TableNavigation, TableCellColor, TableSelectionOverlay, TaskList, TaskItem, Iframe, Toc, SlashCommands, TextStyle, Color, Highlight, Typography, TextAlign, StyleClipboard, EditorDropcursor, } from './extensions';
/**
 * Configure tiptap's StarterKit as a kit's base bundle. We always disable its
 * built-in `link` mark so the frappe `Link` member (with our defaults) owns it,
 * avoiding a duplicate-name collision. The same applies to `code`/`codeBlock`:
 * StarterKit's stock versions are disabled and replaced by the frappe `Code`
 * (backtick toggle) + `CodeBlock` (lowlight, indent keymaps, language picker)
 * extensions. `HeadingIds` rides alongside `heading` to assign stable ids for
 * the table-of-contents. `heading` is threaded explicitly so a kit can expose
 * it as a top-level member.
 */
function starterKitBase(starter, heading) {
    if (starter === false)
        return [];
    return [
        StarterKit.configure({
            ...starter,
            heading: heading,
        }),
        Code,
        CodeBlock,
    ];
}
/** Push `ext.configure(option)` unless the member was removed with `false`. */
function pushMember(list, ext, option) {
    if (option !== false)
        list.push(ext.configure(option ?? {}));
}
const commentKitDefaults = () => ({
    starterKit: {},
    heading: {},
    placeholder: {},
    link: {},
    image: {},
    imageGroup: {},
    imageViewer: {},
    video: {},
    attachment: {},
    table: false,
    contentPaste: {},
    emoji: {},
    mention: {},
    tag: {},
});
/** Shared comment-grade members, reused as the base of RichTextKit. */
function commentMembers(options) {
    const list = [
        ...starterKitBase(options.starterKit, options.heading),
    ];
    pushMember(list, Placeholder, options.placeholder);
    pushMember(list, Link, options.link);
    pushMember(list, Image, options.image);
    // ImageGroup nodes contain Image nodes, so it can't load without Image.
    if (options.image !== false)
        pushMember(list, ImageGroup, options.imageGroup);
    if (options.image !== false)
        pushMember(list, ImageViewer, options.imageViewer);
    pushMember(list, Video, options.video);
    pushMember(list, Attachment, options.attachment);
    // The single drop pipeline; only useful when there's a media or attachment
    // node to route to.
    if (options.image !== false ||
        options.video !== false ||
        options.attachment !== false)
        list.push(MediaDrop);
    // Table needs its row/cell/header companions; TableNavigation adds the
    // spreadsheet-style cell navigation. Shared so both kits get it (off by
    // default for CommentKit, on for RichTextKit).
    if (options.table !== false) {
        list.push(Table.configure(options.table), TableRow, TableCell, TableHeader, TableNavigation, TableCellColor, TableSelectionOverlay);
    }
    pushMember(list, ContentPaste, options.contentPaste);
    pushMember(list, Emoji, options.emoji);
    pushMember(list, Mention, options.mention);
    pushMember(list, Tag, options.tag);
    return list;
}
export const CommentKit = Extension.create({
    name: 'commentKit',
    addOptions() {
        return commentKitDefaults();
    },
    addExtensions() {
        return commentMembers(this.options);
    },
});
export const RichTextKit = Extension.create({
    name: 'richTextKit',
    addOptions() {
        return {
            ...commentKitDefaults(),
            table: {},
            taskList: {},
            iframe: {},
            toc: {},
            slashCommands: {},
            color: {},
            highlight: {},
            typography: {},
            textAlign: {},
            styleClipboard: {},
        };
    },
    addExtensions() {
        const options = this.options;
        // Table is handled by commentMembers (shared, on for RichTextKit via the
        // `table: {}` default below).
        const list = commentMembers(options);
        // Task list needs its item companion.
        if (options.taskList !== false) {
            list.push(TaskList.configure(options.taskList), TaskItem);
        }
        pushMember(list, Iframe, options.iframe);
        pushMember(list, Toc, options.toc);
        // SlashCommands ships a built-in command registry; `false` removes it.
        if (options.slashCommands !== false)
            list.push(SlashCommands.configure(options.slashCommands));
        // Color works on top of the TextStyle mark — register both together.
        if (options.color !== false) {
            list.push(TextStyle, Color.configure(options.color));
        }
        pushMember(list, Highlight, options.highlight);
        pushMember(list, Typography, options.typography);
        pushMember(list, TextAlign, options.textAlign);
        pushMember(list, StyleClipboard, options.styleClipboard);
        return list;
    },
});
/**
 * A document that holds exactly one block, which makes the editor single-line:
 * Enter can't split into a second block (the schema rejects it), so it's a no-op.
 */
const OneLineDocument = Node.create({
    name: 'doc',
    topNode: true,
    content: 'block',
});
export const InlineKit = Extension.create({
    name: 'inlineKit',
    addOptions() {
        return {
            starterKit: {},
            placeholder: {},
            link: {},
        };
    },
    addExtensions() {
        const options = this.options;
        const list = [];
        if (options.starterKit !== false) {
            list.push(OneLineDocument, Text, Paragraph);
            if (options.starterKit.bold !== false)
                list.push(Bold);
            if (options.starterKit.italic !== false)
                list.push(Italic);
            if (options.starterKit.strike !== false)
                list.push(Strike);
            if (options.starterKit.underline !== false)
                list.push(Underline);
            if (options.starterKit.code !== false)
                list.push(Code);
            if (options.starterKit.dropcursor !== false)
                list.push(EditorDropcursor);
            if (options.starterKit.gapcursor !== false)
                list.push(Gapcursor);
            if (options.starterKit.undoRedo !== false)
                list.push(UndoRedo);
        }
        pushMember(list, Placeholder, options.placeholder);
        pushMember(list, Link, options.link);
        return list;
    },
});
