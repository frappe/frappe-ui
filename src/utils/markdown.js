import { marked } from 'marked';
export function markdownToHTML(text) {
    // Use synchronous marked.parse
    return marked.parse(text, {
        gfm: true,
        breaks: true,
        async: false,
    });
}
export function detectMarkdown(text) {
    const lines = text.split('\n');
    const markdown = lines.filter((line) => 
    // check for inline markdown content like images, links, italic, bold, etc.
    /!\[.*\]\(.*\)/.test(line) ||
        /\[.*\]\(.*\)/.test(line) ||
        /(^|\s)\*.*\*(\s|$)/.test(line) ||
        /(^|\s)_.*_(\s|$)/.test(line) ||
        /(^|\s)\*\*.*\*\*(\s|$)/.test(line) ||
        /(^|\s)__.*__(\s|$)/.test(line) ||
        /(^|\s)~~.*~~(\s|$)/.test(line) ||
        // check for block markdown content like headings, code blocks, lists, etc.
        line.startsWith('![') ||
        line.startsWith('#') ||
        line.startsWith('> ') ||
        line.startsWith('*') ||
        line.startsWith('- ') ||
        line.startsWith('1. ') ||
        line.startsWith('```') ||
        line.startsWith('`') ||
        line.startsWith('[') ||
        line.startsWith('---'));
    return markdown.length > 0;
}
