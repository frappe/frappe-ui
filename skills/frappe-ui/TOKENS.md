# Design tokens

frappe-ui ships a Tailwind preset with **semantic** color tokens. Use these instead of the raw palette (`gray-500`, `blue-700`, …). Tokens auto-flip in dark mode (`[data-theme="dark"]`).

## Color tokens

Three semantic categories — each takes a color + numeric step. Higher = stronger contrast.

### `text-ink-*` (foreground / text & icons)

`white | gray-1..9 | red-1..4 | green-1..3 | amber-1..3 | blue-1..3 | cyan-1 | pink-1 | violet-1 | blue-link`

- `text-ink-gray-9` — primary text (headings, body).
- `text-ink-gray-7` — secondary text.
- `text-ink-gray-5` / `gray-4` — tertiary / placeholder.
- `text-ink-blue-link` — links.
- `text-ink-red-3` — destructive / error text.
- `text-ink-green-3` — success text.

### `bg-surface-*` (backgrounds)

`white | gray-1..7 | red-1..7 | green-1..3 | amber-1..3 | blue-1..3 | orange-1 | violet-1 | cyan-1 | pink-1 | menu-bar | cards | modal | selected`

- `bg-surface-white` — primary page background.
- `bg-surface-gray-1` / `gray-2` — subtle / hover surface (cards, hovered rows).
- `bg-surface-gray-3` — pressed state.
- `bg-surface-menu-bar` — sidebar/toolbar background.
- `bg-surface-modal` — dialog body background.
- `bg-surface-selected` — selected row.
- `bg-surface-red-2` / `green-2` / `amber-2` / `blue-2` — tinted banners.

### `border-outline-*` (borders & rings)

`white | gray-1..5 | red-1..3 | green-1..2 | amber-1..2 | blue-1 | orange-1 | gray-modals`

- `border-outline-gray-1` / `gray-2` — default borders.
- `border-outline-gray-3` — focus ring on inputs.
- `border-outline-red-2` / `green-2` — error / success borders.

### Rule of thumb

| Need              | Use                              |
|-------------------|----------------------------------|
| Page bg           | `bg-surface-white`               |
| Card bg           | `bg-surface-white` + border, or `bg-surface-gray-1` |
| Hovered row       | `bg-surface-gray-2`              |
| Primary text      | `text-ink-gray-9`                |
| Muted text        | `text-ink-gray-5`                |
| Border            | `border-outline-gray-1` (or `gray-2` for stronger) |
| Destructive text  | `text-ink-red-3`                 |
| Success text      | `text-ink-green-3`               |

Never reach for `text-gray-900`, `bg-white`, `border-gray-200` — they don't track the theme.

## Typography

`font-family` is `InterVar` by default. The preset ships **two parallel scales** with the same pixel sizes but different line-heights:

- `text-*` — tight (`line-height: 1.15`). For **single-line labels**: headings, button text, badges, table cells, stat values, "2h ago" timestamps.
- `text-p-*` — loose (`line-height: 1.5–1.6`). For **multi-line / descriptive text**: paragraphs, descriptions, helper text, anything that may wrap.

Pick the wrong one and copy looks cramped (multi-line text in `text-*`) or floppy (one-line labels in `text-p-*`).

| Class                       | Size  | Use                                     |
|-----------------------------|-------|-----------------------------------------|
| `text-2xs` / `text-p-2xs`   | 11px  | Micro-labels, badges / tiny captions    |
| `text-xs` / `text-p-xs`     | 12px  | Captions, meta / multi-line meta        |
| `text-sm` / `text-p-sm`     | 13px  | Secondary labels / secondary paragraphs |
| `text-base` / `text-p-base` | 14px  | Body labels / body paragraphs (default) |
| `text-lg` / `text-p-lg`     | 16px  | Section subheads / long-form intro      |
| `text-xl` / `text-p-xl`     | 18px  | Card / panel titles / lead paragraphs   |
| `text-2xl`                  | 20px  | Page titles                             |
| `text-3xl`+                 | 24px+ | Marketing / hero only                   |

**Heuristic:** if the element is `<p>`, a description below a label, a feed entry that wraps, or helper text — use `text-p-*`. If it's `<h*>`, a `<Button>`/`<Badge>` label, a one-line meta row like "Updated 2h ago", or a stat value — use `text-*`.

All have tuned letter-spacing — don't override unless you know why.

## Radius

| Class            | px    | Use                            |
|------------------|-------|--------------------------------|
| `rounded-none`   | 0     | Flush edges                    |
| `rounded-sm`     | 4     | Tags, small chips              |
| `rounded` (default) | 8  | Inputs, buttons, list items    |
| `rounded-md`     | 10    | Cards                          |
| `rounded-lg`     | 12    | Dialogs, larger surfaces       |
| `rounded-xl`     | 16    | Hero panels                    |
| `rounded-2xl`    | 20    | Marketing surfaces             |
| `rounded-full`   | pill  | Avatars, status dots, pill badges |

## Shadow

| Class         | Use                                  |
|---------------|--------------------------------------|
| `shadow-sm`   | Cards on white                       |
| `shadow`      | Default (inputs on focus)            |
| `shadow-md`   | Popovers, dropdowns                  |
| `shadow-lg`   | Dialogs                              |
| `shadow-xl`   | Floating panels                      |
| `shadow-2xl`  | Hero overlays                        |

## Spacing

Use Tailwind's spacing scale. Frappe density tends to be tight:
- Form field gap: `space-y-3` or `gap-3`.
- Section gap: `space-y-6` / `gap-6`.
- Page padding: `p-4` on mobile, `p-6`/`p-8` on desktop.
- Inline gap inside a row: `gap-2`.

## Dark mode

Toggle by setting `[data-theme="dark"]` on `<html>`. All semantic tokens flip automatically. Test dark mode for every new screen — don't hand-craft `dark:` variants if a semantic token already covers it.

## Custom CSS hooks

When you must style a frappe-ui component beyond its prop surface, target its `data-slot` / `data-state` attributes (not internal classes):

```css
[data-slot="trigger"][data-state="open"] { box-shadow: ... }
[data-slot="item"][data-disabled] { opacity: .5 }
```

Never use class-injection props (`triggerClass`, `contentClass`) — they don't exist on frappe-ui components by design.
