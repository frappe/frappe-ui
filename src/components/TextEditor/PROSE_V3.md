# TextEditor Typography: prose-v3

`prose-v3` is a Tailwind CSS Typography modifier registered in `frappe-ui/tailwind/plugin.js`. It is the default `editorClass` for the TextEditor component.

## Core Philosophy

**Users control paragraph spacing.** Paragraphs have zero margin. Pressing Enter once continues the flow; pressing Enter twice creates an intentional gap. This removes the ambiguity of automatic margins and makes spacing explicit and consistent across all users.

All other spacing (headings, blocks, lists) is calibrated against the **8px grid**, using the empty paragraph height (~20px) as the natural reference point.

## Paragraph Spacing

Paragraphs have **zero margin**. An empty `<p>` becomes the spacing unit:

```
font-size: 14px × line-height: 1.6 = ~22px
clamped to: height: 20px (via style.css)
```

- One Enter → paragraphs flow together
- Two Enters → ~20px gap (intentional break)

### Empty paragraph height

`p:empty` and `p:has(> br:only-child)` are both set to `height: 20px; line-height: 20px` in `style.css`. This overrides the natural line-height-derived height and makes spacing predictable. The two selectors are needed because:

- `p:empty` → stored HTML `<p></p>`
- `p:has(> br:only-child)` → Tiptap's live editor cursor placeholder `<p><br></p>`

## Spacing System: 8px Grid

| Element               | Margin | Grid  | Rationale                                    |
| --------------------- | ------ | ----- | -------------------------------------------- |
| **p**                 | 0px    | —     | User controls with Enter (~20px per empty p) |
| **h1, h2** top        | 32px   | 4 × 8 | Section break, larger than empty paragraph   |
| **h3, h4, h5** top    | 24px   | 3 × 8 | Subsection break, ≈ empty paragraph          |
| **All headings** bot  | 8px    | 1 × 8 | Tight proximity to content below             |
| **Block elements**    | 16px   | 2 × 8 | Blockquote, pre, table, img, video, figure   |
| **ul, ol**            | 4px    | ½ × 8 | Flows inline with paragraph text             |
| **li**, nested lists  | 4px    | ½ × 8 | Small breathing room between items           |
| **hr**                | 24px   | 3 × 8 | Visual separator, ≈ empty paragraph          |

### HR

`hr` renders as a short centered line — 20% width, centered via `margin: auto`. Not edge-to-edge.

## Typography

| Property          | Value               | Notes                              |
| ----------------- | ------------------- | ---------------------------------- |
| `font-size`       | 14px                |                                    |
| `font-weight`     | 420                 | Slightly lighter than semibold     |
| `line-height`     | 1.6                 |                                    |
| `letter-spacing`  | 0.02em              |                                    |

### Color tokens (prose-v3 only)

These are scoped to `prose-v3` and do not affect `prose-sm` or other modifiers:

| Token                  | Value          | vs DEFAULT       |
| ---------------------- | -------------- | ---------------- |
| `--tw-prose-body`      | `ink-gray-7`   | was `ink-gray-8` |
| `--tw-prose-bold`      | `ink-gray-8`   | was `ink-gray-9` |
| `--tw-prose-quotes`    | `ink-gray-7`   | was `ink-gray-8` |
| `--tw-prose-quote-borders` | `ink-gray-3` | was `ink-gray-1` |
| `--tw-prose-kbd`       | `ink-gray-8`   | was `ink-gray-9` |
| `--tw-prose-code`      | `ink-gray-8`   | was `ink-gray-9` |

Body text uses `ink-gray-7` (#525252) instead of `ink-gray-8` (#383838) — softer on white backgrounds for long-form reading.

## Element Styles

### Links

No `text-decoration`. Instead: a thin bottom border (`1px solid ink-gray-3`) that darkens to `ink-gray-6` on hover. Subtler than underline but still clearly interactive.

### Inline code

Tailwind Typography adds backtick `::before`/`::after` pseudo-content — these are suppressed. Inline code gets a background pill:

- `background: surface-gray-2`
- `border-radius: 4px`
- `padding: 1px 5px`
- `font-size: 12px`

`pre code` resets all of these so code blocks are unaffected.

### Blockquote

- `border-inline-start: 2px solid ink-gray-3`
- `color: ink-gray-6` — recedes from body text
- `font-style: normal` — no italic
- Quote mark pseudo-content suppressed

**Note:** The `border-inline-start-width: 2px` is set in `style.css` (not the plugin) because Tailwind Typography's `0.25rem` default is wrapped in `:where()` (0 specificity) and the plugin's override has equal specificity — source order is unreliable. The `style.css` rule uses element specificity (`0,1,1`) to guarantee the override wins.

## Code Blocks (CodeBlockComponent.vue)

Code blocks use `lowlight` (highlight.js) for syntax highlighting. Themes switch based on `[data-theme]`.

| Property      | Light              | Dark              |
| ------------- | ------------------ | ----------------- |
| Background    | `#f6f8fa`          | `#0d1117`         |
| Text          | `#24292e`          | `#c9d1d9`         |
| Border        | `var(--outline-gray-2)` | `var(--outline-gray-2)` |
| Token colors  | GitHub light       | GitHub dark       |
| Font size     | 12px               | 12px              |
| Line height   | 1.7                | 1.7               |

The `--outline-gray-2` CSS variable automatically switches values in dark mode since it is defined in both `:root` and `[data-theme="dark"]`.

### Language selector / label

- **Edit mode**: standard `<select>` with `form-select` class, always visible
- **Readonly mode**: static `<span>` showing the language name (or "auto"), non-interactive
- Reactivity: `isEditable` is tracked in `data()` and updated via `editor.on('update', ...)` — same pattern used by `IframeNodeView` and `ImageGroupNodeView`

## Implementation Notes

### Why the plugin, not CSS?

All spacing and typography values go through the `@tailwindcss/typography` plugin (`tailwind/plugin.js` under `theme.extend.typography.v3`). This means:

- Values are processed by PostCSS
- Selectors are properly scoped with `:where()` for 0-specificity resets
- `prose-*` modifier variants work (e.g., `prose-p:mt-4`)

The only exceptions are rules that need to win a specificity battle against the plugin's own `:where()` selectors — those go in `style.css` (blockquote border width, empty paragraph height).

### DEFAULT typography config

The `DEFAULT` typography config in `plugin.js` is **unchanged** from the original. All prose-v3 color and style changes are scoped exclusively to the `v3` modifier. This means `prose-sm` and other modifiers are unaffected.

## Data Migration

Existing content was authored with `prose-sm`, which has automatic 8px top/bottom margins on `<p>` tags. Under `prose-v3`, adjacent paragraphs with no blank line between them will render without any gap.

### Scale of the problem (sample data)

| Doctype       | Docs needing patch | Gaps to insert |
| ------------- | ------------------ | -------------- |
| GP Discussion | 2,732 / 3,563      | 12,684         |
| GP Comment    | 5,590 / 12,281     | 14,306         |
| GP Page       | 52 / 97            | 247            |
| GP Task       | 12 / 133           | 30             |

### Migration rule

For every pair of adjacent non-empty `<p>` elements (direct siblings, no empty `<p>` between them), insert `<p data-prose-v3-migrated></p>`.

The `data-prose-v3-migrated` marker attribute makes the patch **reversible**: a rollback script can strip exactly these paragraphs without touching any user-authored empty paragraphs.

### Deployment sequence

```
1. Deploy code (prose-v3 default)   ← can still revert code-only, zero data risk
2. Run forward migration             ← insert marked empty paragraphs
3. Monitor                           ← if issues, run rollback + revert code
```

### Rollback

- **Before data migration**: revert code only. Zero data touched.
- **After data migration**: strip `[data-prose-v3-migrated]` paragraphs, revert code.
- **After users create new prose-v3 content**: new content uses intentional empty paragraphs for spacing. Under `prose-sm` these render as ~38px instead of ~20px — slightly more spaced but still readable. No patch needed.
