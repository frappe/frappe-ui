import { commandMeta, headingMeta, } from './commands';
import { CellSelection } from '@tiptap/pm/tables';
import { openFontColorPicker } from './components/font-color/fontColorController';
import { openTableCellColorPicker } from './components/table-color/tableCellColorController';
import { openTableSizePicker } from './components/table-size-picker/tableSizePickerController';
/** True when a multi-cell table range is selected (drag across cells). */
function isCellRangeSelection(editor) {
    return editor.state?.selection instanceof CellSelection;
}
function canRun(editor, command) {
    const canEditor = editor.can?.();
    if (!canEditor?.chain)
        return true;
    let can = true;
    const canChain = canEditor.chain();
    const proxyEditor = {
        ...editor,
        chain: () => canChain,
    };
    try {
        command(proxyEditor);
        can = canChain.run?.() !== false;
    }
    catch {
        can = true;
    }
    return can;
}
function command(meta, action, component, canCheck = true) {
    return {
        label: meta.label,
        icon: meta.icon,
        action,
        isActive: meta.isActive,
        isDisabled: canCheck ? (editor) => !canRun(editor, action) : undefined,
        isAvailable: meta.isAvailable,
        component,
    };
}
export const Bold = command(commandMeta.bold, (editor) => {
    // A CellSelection must keep its cell range — `.focus()` collapses it to a
    // text cursor, so fan bold out across cells without focusing.
    if (isCellRangeSelection(editor)) {
        return editor.chain().toggleCellBold().run();
    }
    return editor.chain().focus().toggleBold().run();
});
export const Italic = command(commandMeta.italic, (editor) => editor.chain().focus().toggleItalic().run());
export const Strike = command(commandMeta.strike, (editor) => editor.chain().focus().toggleStrike().run());
// Inline `code` mark toggle. Exported as `InlineCode` (not `Code`) so it doesn't
// collide with the `Code` extension export; its visible/aria label is still "Code".
export const InlineCode = command(commandMeta.inlineCode, (editor) => editor.chain().focus().toggleCode().run());
export const BulletList = command(commandMeta.bulletList, (editor) => editor.chain().focus().toggleBulletList().run());
export const OrderedList = command(commandMeta.orderedList, (editor) => editor.chain().focus().toggleOrderedList().run());
export const Blockquote = command(commandMeta.blockquote, (editor) => editor.chain().focus().toggleBlockquote().run());
export const Paragraph = command(commandMeta.paragraph, (editor) => editor.chain().focus().setParagraph().run());
function heading(level) {
    return command(headingMeta(level), (editor) => editor.chain().focus().toggleHeading({ level }).run());
}
export const H1 = heading(1);
export const H2 = heading(2);
export const H3 = heading(3);
export const H4 = heading(4);
export const H5 = heading(5);
export const H6 = heading(6);
export const HeadingGroup = {
    type: 'group',
    label: 'Heading',
    items: [H2, H3, H4],
};
function align(meta, alignment) {
    return command(meta, (editor) => {
        // Keep a multi-cell range intact: `.focus()` would collapse the
        // CellSelection so alignment only hits the anchor cell.
        if (isCellRangeSelection(editor)) {
            return editor.chain().setCellTextAlign(alignment).run();
        }
        return editor.chain().focus().setTextAlign(alignment).run();
    });
}
export const AlignLeft = align(commandMeta.alignLeft, 'left');
export const AlignCenter = align(commandMeta.alignCenter, 'center');
export const AlignRight = align(commandMeta.alignRight, 'right');
// Named color/highlight (`namedColor`/`namedHighlight`) drive an imperative
// picker so the toolbar button remains owned by MenuItems.
export const FontColor = command(commandMeta.fontColor, (editor, context) => {
    if (!context?.trigger)
        return;
    openFontColorPicker({ editor, anchor: context.trigger });
}, undefined, false);
export const FontHighlight = command(commandMeta.fontHighlight, (editor) => editor.chain().focus().toggleHighlightByName('yellow').run());
export const InsertImage = command(commandMeta.image, (editor) => editor.chain().focus().selectAndUploadImage().run(), undefined, false);
export const InsertVideo = command(commandMeta.video, (editor) => editor.chain().focus().selectAndUploadVideo().run(), undefined, false);
// Like InsertVideo, exposed as a command but not added to any default toolbar;
// the primary entry points for attachments are drag/drop and paste.
export const InsertAttachment = command(commandMeta.attachment, (editor) => editor.chain().focus().selectAndUploadFile().run(), undefined, false);
export const InsertLink = command(commandMeta.link, (editor) => editor.commands.openLinkEditor(), undefined, false);
export const InsertIframe = command(commandMeta.embed, (editor) => editor.commands.openIframeDialog(), undefined, false);
// Opens a size-picker grid anchored to the toolbar button; without a trigger
// (programmatic call) it inserts the default 3×3 directly. Like the other
// picker-opening items, the action can't be probed via `can()`.
export const InsertTable = command(commandMeta.table, (editor, context) => {
    if (context?.trigger) {
        openTableSizePicker({ editor, anchor: context.trigger });
        return;
    }
    return editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
}, undefined, false);
export const HorizontalRule = command(commandMeta.horizontalRule, (editor) => editor.chain().focus().setHorizontalRule().run());
// History controls. `isActive` doesn't apply; availability is left open (history
// ships in StarterKit) and the button disables itself when there's nothing to do.
export const Undo = {
    label: 'Undo',
    icon: 'lucide-undo-2',
    action: (editor) => editor.chain().focus().undo().run(),
    isDisabled: (editor) => !editor.can().undo(),
};
export const Redo = {
    label: 'Redo',
    icon: 'lucide-redo-2',
    action: (editor) => editor.chain().focus().redo().run(),
    isDisabled: (editor) => !editor.can().redo(),
};
export const Separator = { type: 'separator' };
// ---------------------------------------------------------------------------
// Table controls
//
// Surfaced in a contextual toolbar (`EditorTableMenu`) that appears only while
// the selection is inside a table. Each item disables itself through the
// editor's `can()` chain (via `canRun`), and the whole set self-prunes when the
// Table extension isn't loaded — `isAvailable` checks the live schema, so the
// same `tableToolbar` is inert in a comment editor and live in a doc editor.
// ---------------------------------------------------------------------------
/** True when the Table extension's node is present in the active schema. */
function tableLoaded(editor) {
    return !!editor.schema.nodes.table;
}
function tableCommand(label, icon, action, isActive) {
    return {
        label,
        icon,
        action,
        isActive,
        isDisabled: (editor) => !canRun(editor, action),
        isAvailable: tableLoaded,
    };
}
export const TableAddColumnBefore = tableCommand('Insert column left', 'lucide-arrow-left-to-line', (editor) => editor.chain().focus().addColumnBefore().run());
export const TableAddColumnAfter = tableCommand('Insert column right', 'lucide-arrow-right-to-line', (editor) => editor.chain().focus().addColumnAfter().run());
export const TableDeleteColumn = tableCommand('Delete column', 'lucide-square-x', (editor) => editor.chain().focus().deleteColumn().run());
export const TableAddRowBefore = tableCommand('Insert row above', 'lucide-arrow-up-to-line', (editor) => editor.chain().focus().addRowBefore().run());
export const TableAddRowAfter = tableCommand('Insert row below', 'lucide-arrow-down-to-line', (editor) => editor.chain().focus().addRowAfter().run());
export const TableDeleteRow = tableCommand('Delete row', 'lucide-square-x', (editor) => editor.chain().focus().deleteRow().run());
// Active when the cursor sits in a header cell, so the toggle reflects the
// state of the row it would flip.
export const TableToggleHeaderRow = tableCommand('Toggle header row', 'lucide-panel-top', (editor) => editor.chain().focus().toggleHeaderRow().run(), (editor) => editor.isActive('tableHeader'));
// One button for both directions: merges a multi-cell selection, splits a
// merged cell. `can()` disables it when neither applies; the label names
// whichever direction currently applies.
export const TableMergeOrSplit = {
    ...tableCommand('Merge or split cells', 'lucide-table-cells-merge', (editor) => editor.chain().focus().mergeOrSplit().run()),
    getLabel: (editor) => editor.can().mergeCells()
        ? 'Merge cells'
        : editor.can().splitCell()
            ? 'Split cell'
            : 'Merge or split cells',
};
export const TableDelete = tableCommand('Delete table', 'lucide-trash-2', (editor) => editor.chain().focus().deleteTable().run());
// Opens an imperative picker (cell background + text color), so it owns no
// can()-probe (which would invoke the action). `isAvailable` self-prunes it when
// the Table extension is absent, matching the other table controls.
export const CellColor = {
    label: 'Cell color',
    icon: 'lucide-paint-bucket',
    action: (editor, context) => {
        if (!context?.trigger)
            return;
        openTableCellColorPicker({ editor, anchor: context.trigger });
    },
    isAvailable: tableLoaded,
};
/** Contextual table toolbar, consumed by `EditorTableMenu`. */
export const tableToolbar = [
    TableAddColumnBefore,
    TableAddColumnAfter,
    TableDeleteColumn,
    Separator,
    TableAddRowBefore,
    TableAddRowAfter,
    TableDeleteRow,
    Separator,
    TableToggleHeaderRow,
    TableMergeOrSplit,
    CellColor,
    Separator,
    TableDelete,
];
export const minimalToolbar = [Bold, Italic, InsertLink];
export const commentToolbar = [
    Bold,
    Italic,
    Strike,
    Separator,
    BulletList,
    OrderedList,
    InsertLink,
];
export const articleToolbar = [
    HeadingGroup,
    Separator,
    Bold,
    Italic,
    Strike,
    Separator,
    BulletList,
    OrderedList,
    Blockquote,
    InsertLink,
    InsertImage,
    InsertTable,
];
