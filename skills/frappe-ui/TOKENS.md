# Design tokens

frappe-ui ships a Tailwind preset. Colour, type, radius and shadow all come from semantic tokens, so one class works in light and dark mode. Tailwind's raw palette (`bg-gray-100`, `text-gray-900`) is a fixed light-mode value that never flips with `data-theme`, so always reach for the semantic token.

## Color tokens

Five semantic categories. `ink`, `surface` and `outline` cover almost every case; the `-alpha` pair are translucent, gray-only variants for overlay work.

| Category        | Utilities                                          | Steps                                                            |
|-----------------|----------------------------------------------------|------------------------------------------------------------------|
| `ink`           | `text-ink-*`, `fill-ink-*`, `placeholder-ink-*`     | `base`, `blue-link`, `gray-1..9`, `<color>-1..9`                  |
| `surface`       | `bg-surface-*`                                      | `base`, `sidebar`, `elevation-1..3`, `gray-1..10`, `<color>-1..10`|
| `outline`       | `border-outline-*`, `ring-outline-*`, `divide-outline-*` | `base`, `elevation-1..2`, `gray-1..9`, `<color>-1..10`       |
| `surface-alpha` | `bg-surface-alpha-*`                                | `base`, `sidebar`, `elevation-1..3`, `gray-1..10`                 |
| `outline-alpha` | `border-outline-alpha-*`                            | `base`, `elevation-1..2`, `gray-1..9`                             |

`<color>` is one of `red green blue amber orange yellow teal cyan violet purple pink`. Higher step = stronger contrast. Steps are not interchangeable across categories: in light mode `ink-red-5` resolves to red/500 while `surface-red-5` resolves to red/400.

### `text-ink-*` — text and icons

- `text-ink-gray-1..9` — the gray ink ladder, climbing in contrast. `text-ink-gray-8` is the page default; set it once on the page wrapper. Which step for which element: [DESIGN.md](DESIGN.md) → Hierarchy.
- `text-ink-blue-link` — links and toast action labels. (A blue `subtle` / `outline` / `ghost` button label is `text-ink-blue-5`.)
- `text-ink-red-7` — error text (what `ErrorMessage` renders).
- `text-ink-base` — the inverse ink. Use it on a dark surface: `bg-surface-gray-9` (toast), `bg-surface-gray-10` (tooltip).

### `bg-surface-*` — backgrounds

- `bg-surface-base` — page background. `bg-surface-sidebar` — sidebar and rail.
- `bg-surface-gray-1` — quiet fill for something that is not a control: the `subtle` input fill, a board column, an inset block inside a card.
- `bg-surface-gray-2` / `-3` / `-4` — the control interaction ladder: rest, hover, pressed. Written as `bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4`. Every colour follows the same 2 / 3 / 4 pattern.
- `bg-surface-elevation-1` — dialog panel and dialog body, and a card that sits on a tinted column (board cards).
- `bg-surface-elevation-2` — popover, dropdown and menu surface.
- `bg-surface-elevation-3` — active nav item and active tab. Pair with `shadow-sm`. A plain card is `bg-surface-base` plus a border (COMPONENTS.md → Card surface).
- Tinted status block: `bg-surface-<color>-2` with `text-ink-<color>-7` and `border-outline-<color>-3`. Solid status block: `bg-surface-<color>-7` with `text-white`.

### `border-outline-*` — borders and rings

- `border-outline-gray-1` / `-gray-2` — default and stronger borders. A bare `border` already resolves to `--outline-gray-1`.
- `border-outline-red-3` / `-green-3` — error and success borders.
- Focus rings are automatic: a global `:focus-visible` outline covers every focusable element. Retheme with `focus-visible:focus-ring-<name>`, where `<name>` is `red | green | amber | blue | violet`. Suppress with `focus-visible:outline-none`. `data-[state=open]:focus-ring` applies the default ring outside focus.

## Typography

`InterVar` is the `<html>` font. Two parallel scales share pixel sizes and differ in line-height:

- `text-*` — line-height 1.15 through `text-4xl`; `text-5xl` and up loosen to 1.4–1.6. For single-line labels: headings, button text, badges, table cells, stat values, timestamps.
- `text-p-*` — line-height 1.4–1.6. For text that wraps: paragraphs, descriptions, helper text.

| Class                       | Size  | Use                                     |
|-----------------------------|-------|-----------------------------------------|
| `text-2xs` / `text-p-2xs`   | 11px  | Micro-labels, badges / tiny captions    |
| `text-xs` / `text-p-xs`     | 12px  | Captions, meta / multi-line meta        |
| `text-sm` / `text-p-sm`     | 13px  | Secondary labels / secondary paragraphs |
| `text-base` / `text-p-base` | 14px  | Body labels / body paragraphs (default) |
| `text-md` / `text-p-md`     | 15px  | Dense section labels / compact intro    |
| `text-lg` / `text-p-lg`     | 16px  | Section subheads / long-form intro      |
| `text-xl` / `text-p-xl`     | 17px  | Card / panel titles / lead paragraphs   |
| `text-2xl` / `text-p-2xl`   | 18px  | Page titles                             |
| `text-3xl` / `text-p-3xl`   | 20px  | Prominent page titles                   |
| `text-4xl` / `text-p-4xl`   | 24px  | Hero headings                           |
| `text-5xl` … `text-12xl`    | 26–56px | Display only. No `text-p-*` twin — the paragraph scale stops at `text-p-4xl`. |

Size and weight combine into one utility: `text-<size>-<weight>` and `text-p-<size>-<weight>`, where `<weight>` is `medium | semibold | bold` — `text-lg-semibold`, `text-base-medium`, `text-p-sm-medium`. Each carries the letter-spacing tuned for that size and weight, so prefer it over `text-lg font-semibold`.

Headers use sentence case. Write "Recent activity". Mark a quiet section label with `text-ink-gray-5 text-sm`; mark a loud one with size and weight.

## Radius

The scale is numbered `rounded-0` … `rounded-9`, plus `rounded-none` and `rounded-full`. Named aliases (`rounded-md`, `rounded-xl`, …) were removed in 1.0.

| Class          | px   | Use                                                             |
|----------------|------|-----------------------------------------------------------------|
| `rounded-1`    | 4    | Checkboxes, colour swatches, small chips                        |
| `rounded-3`    | 6    | `xs` buttons                                                    |
| `rounded-4`    | 8    | Default control radius: `sm`/`md` buttons, `sm`/`md` inputs, list items, tooltips |
| `rounded-5`    | 10   | `lg` controls: `lg` buttons, `lg`/`xl` inputs, toasts           |
| `rounded-6`    | 12   | Card-like surfaces, popovers, dropdowns, menus                  |
| `rounded-7`    | 16   | Dialog panels                                                   |
| `rounded-full` | pill | Avatars, status dots, pill badges                               |

## Shadow

| Class                    | Use                                            |
|--------------------------|------------------------------------------------|
| `shadow-sm`              | Input on focus, resting card, active nav item  |
| `shadow-base` / `shadow` | Active tab indicator                           |
| `shadow-md`              | Slider thumb. Rare.                            |
| `shadow-lg`              | Bottom sheets, drag labels                     |
| `shadow-xl`              | Dialogs, toasts, tooltips                      |
| `shadow-2xl`             | Popovers, dropdowns, menus                     |

Pair a shadow with a `bg-surface-elevation-*` background: in dark mode shadows fade and the lighter elevation surface carries the depth.

## Spacing

Gutters, stacks and content widths: [DESIGN.md](DESIGN.md) → Geometry.

## Dark mode

The scheme lives in `data-theme` on `<html>` (`"light"` or `"dark"`). Semantic tokens flip automatically. Reach for a `dark:` variant only for a value that has no semantic token. Toggle the scheme and look at every new screen before calling it done.

Drive it from `useColorScheme()`, a module-level singleton every caller shares:

```js
import { useColorScheme, resolvedColorScheme } from 'frappe-ui'
const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
// colorScheme        Readonly<Ref<'light' | 'dark' | 'system'>>
// setColorScheme     (scheme: 'light' | 'dark' | 'system') => void — writes data-theme, persists
// toggleColorScheme  () => void
resolvedColorScheme() // 'light' | 'dark', with 'system' already resolved
```

## Custom CSS hooks

To style a frappe-ui component past its prop surface, target its `data-slot` and state attributes. Slot names in wide use: `trigger`, `content`, `content-body`, `input`, `control`, `search`, `item`, `item-prefix`, `label`, `prefix`, `action`, `footer`, `empty`. State attributes: `data-state` (values are per component — `open`/`closed`, `active`/`inactive`), `data-disabled`, `data-highlighted`, `data-placeholder`, `data-size`.

Both work as Tailwind variants (`data-[state=open]:rotate-180`, `data-[disabled]:opacity-50`) and as plain CSS:

```css
[data-slot='trigger'][data-state='open'] { box-shadow: ... }
[data-slot='item'][data-disabled] { opacity: 0.5 }
```
