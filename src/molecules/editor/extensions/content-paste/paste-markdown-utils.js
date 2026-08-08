import { detectMarkdown, markdownToHTML } from '#utils/markdown';
import { parseHtmlToSlice } from './paste-html-utils';
/**
 * If `text` looks like markdown, render it to HTML and parse into a slice
 * against `schema`. Returns `null` when the text is plain (not markdown).
 */
export function tryMarkdownSlice(text, schema) {
    if (!text || !detectMarkdown(text))
        return null;
    const html = markdownToHTML(text);
    return parseHtmlToSlice(html, schema);
}
