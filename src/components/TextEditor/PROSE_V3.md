# TextEditor Typography: prose-v3

`prose-v3` is a Tailwind CSS Typography modifier registered in `frappe-ui/tailwind/plugin.js`. It is the default `editorClass` for the TextEditor component.

## Core Decision: Zero Paragraph Margins

Paragraphs have **zero margin**. Users control spacing between paragraphs by pressing Enter to insert empty paragraphs.

### Why?

Rich text editors face a fundamental tension with paragraph spacing:

- **With auto margins**: Some users find the margin too small and add empty paragraphs anyway. Others find it too large. Both groups end up fighting the defaults, creating inconsistent "ghost paragraphs" in stored content.
- **With zero margins**: Users have direct control. One Enter = continuous text. Two Enters = a visible gap. The behavior is predictable and consistent across all users.

An empty `<p>` at 14px font size × 1.6 line-height = **~22px**, which becomes the user's natural spacing unit.

## Spacing System: 8px Grid

All spacing values are multiples of 8px (with 4px and 2px sub-steps for tight spacing). This ensures visual consistency and alignment across all content types.

```
Base unit:        8px
Empty paragraph:  14px × 1.6 = 22.4px ≈ 24px (3 × 8)  ← user's spacing unit
```

| Element              | Margin | Grid  | Rationale                                   |
| -------------------- | ------ | ----- | ------------------------------------------- |
| **p**                | 0px    | —     | User controls with Enter (empty p ≈ 22px)   |
| **h1, h2** top       | 32px   | 4 × 8 | Section break, larger than empty paragraph  |
| **h3, h4, h5** top   | 24px   | 3 × 8 | Subsection break, ≈ empty paragraph         |
| **All headings** bot | 8px    | 1 × 8 | Tight proximity to content below            |
| **Block elements**   | 16px   | 2 × 8 | Blockquote, code, table, img, video, figure |
| **ul, ol**           | 4px    | ½ × 8 | Flows inline with paragraph text            |
| **li**, nested lists | 2px    | ¼ × 8 | Tight internal list spacing                 |
| **hr**               | 24px   | 3 × 8 | Visual separator, matches empty-p unit      |

## Design Principles

### Rule of Proximity

Headings have **large top margin** (32/24px) and **small bottom margin** (8px). This creates a clear section break above while keeping the heading visually tied to its content below — the heading "owns" the content that follows it.

### Block Elements Get Breathing Room

Elements like blockquotes, code blocks, tables, and images are visually distinct from paragraph text. They get 16px (2 × 8) margins — enough separation from surrounding text, but less than the heading section break or the user's empty paragraph.

### Lists Flow With Text

Lists (ul/ol) get minimal outer margins (4px) because they typically continue the thought of the preceding paragraph. Internal list item spacing (2px) keeps items tight and scannable.

## Data Migration for Existing Content

Existing content was authored with `prose-sm`, which has automatic 8px paragraph margins. Users who wanted extra spacing between paragraphs inserted empty `<p></p>` tags ("ghost paragraphs") on top of those auto-margins.

Under `prose-v3` with zero paragraph margins, ghost paragraphs now render as intentional ~22px gaps, which is exactly what users wanted. However, content that relied on the auto 8px margin for basic paragraph separation (i.e., no ghost paragraphs) will appear as a continuous block of text.

### Migration Strategy

A one-time data patch should be run on existing content in `GP Discussion`, `GP Comment`, `GP Task`, and `GP Page` to ensure it looks correct under `prose-v3`.

**The rule:** Where two non-empty paragraphs are adjacent with no blank line between them, insert an empty paragraph to preserve the visual separation users originally saw.

```python
# Pseudocode
import re
from bs4 import BeautifulSoup

def migrate_content(html):
    soup = BeautifulSoup(html, 'html.parser')
    paragraphs = soup.find_all('p')
    for i, p in enumerate(paragraphs):
        if i == 0:
            continue
        prev = paragraphs[i - 1]
        # If two consecutive non-empty paragraphs are siblings with no empty p between them
        if prev.get_text(strip=True) and p.get_text(strip=True):
            if prev.find_next_sibling() == p:
                empty_p = soup.new_tag('p')
                p.insert_before(empty_p)
    return str(soup)
```

This is safe and reversible: it only inserts empty paragraphs, never deletes content.

## Implementation

`prose-v3` is registered under `theme.extend.typography.v3` in `frappe-ui/tailwind/plugin.js`. The `@tailwindcss/typography` plugin processes it into the `.prose-v3` class alongside `.prose`.

Usage:
```html
<TextEditor />  <!-- prose-v3 by default -->
<TextEditor editor-class="prose-v3 max-w-none" />  <!-- explicit -->
```
