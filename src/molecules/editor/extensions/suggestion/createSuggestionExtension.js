import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { createSuggestionRenderer, } from '#molecules/editor/extensions/shared/suggestion-renderer';
import { isInCode, getSuggestionOptions, } from '#molecules/editor/extensions/shared/suggestion-helpers';
import { autoOpenCleanupPlugin, insertSuggestionTrigger, } from '#molecules/editor/extensions/shared/suggestion-open';
/**
 * Factory that wraps `@tiptap/suggestion` in a TipTap `Extension`. The
 * imperative Floating UI/VueRenderer lifecycle lives in `createSuggestionRenderer`
 * (shared); this file is now just the extension shell + plugin registration.
 */
export function createSuggestionExtension(options) {
    return Extension.create({
        name: options.name,
        addOptions() {
            const customOptions = options.addOptions
                ? options.addOptions.call(this)
                : {};
            return {
                ...customOptions,
                suggestion: {
                    char: options.char,
                    pluginKey: options.pluginKey,
                    items: options.items,
                    command: options.command,
                    // Stay inert inside code blocks / inline code, where a trigger char
                    // (`:`/`#`/`@`) is literal source the author is typing — not a cue.
                    allow: ({ state, range }) => !isInCode(state.doc, range.from),
                    allowSpaces: options.allowSpaces,
                    startOfLine: options.startOfLine,
                    decorationTag: options.decorationTag || 'span',
                    decorationClass: options.decorationClass || 'suggestion',
                    render: () => createSuggestionRenderer(options.component, options.floatingOptions),
                },
            };
        },
        // Every suggester registers the same generic command. Tiptap keeps the last
        // registration of a name, and these are identical — the command takes the
        // suggester to open as an argument rather than belonging to any one of
        // them, so whichever instance wins behaves the same.
        addCommands() {
            return {
                openSuggestionMenu: (extensionName) => ({ editor, tr, commands, dispatch }) => {
                    const target = getSuggestionOptions(editor, extensionName);
                    const char = target?.suggestion?.char;
                    if (!char)
                        return false;
                    // Same test as the `allow` above, against `tr.doc` rather than
                    // `editor.state.doc`: an earlier command in the chain may already
                    // have edited the doc, and resolving a fresh position against the
                    // stale one can run past its end. Checking before inserting rather
                    // than cleaning up after leaves the document untouched when no
                    // menu can open.
                    if (isInCode(tr.doc, tr.selection.from))
                        return false;
                    if (!dispatch)
                        return true;
                    // A toolbar button takes focus on click, so the menu would open
                    // with the next keystroke going to the button. `commands.focus()`
                    // shares this transaction — only `editor.chain()` would start a
                    // rival one and throw.
                    commands.focus();
                    insertSuggestionTrigger(tr, char);
                    return true;
                },
            };
        },
        addProseMirrorPlugins() {
            const char = this.options.suggestion.char ?? options.char;
            const pluginKey = this.options.suggestion.pluginKey ?? options.pluginKey;
            return [
                Suggestion({
                    editor: this.editor,
                    ...this.options.suggestion,
                }),
                // Order matters: this reads the suggester's own state, so it has to be
                // applied after it. Cleans up after `openSuggestionMenu`.
                autoOpenCleanupPlugin({ char, pluginKey }),
            ];
        },
    });
}
