# Rating

Lets users rate items using stars in a simple, interactive way. Provides immediate visual feedback and supports partial or full selections.

<ComponentPreview name="Rating-Default" layout="stacked" />

## Sizes

<ComponentPreview name="Rating-Sizes" />

## Max stars

`max` controls the number of stars rendered. Defaults to `5`.

<ComponentPreview name="Rating-Max" />

## Half stars

Set `step="0.5"` to allow half-star ratings. The control switches its ARIA
role to `slider` so screen readers can announce non-integer values.

<ComponentPreview name="Rating-HalfStep" />

## Value tooltip

`showValueTooltip` renders a tooltip with the current (or previewed) value
on hover, formatted as `"{value} / {max}"`.

<ComponentPreview name="Rating-Tooltip" />

## Clearable

`allowClear` lets users clear the rating by clicking the currently-selected
value. The `0` digit on the keyboard also clears the value.

<ComponentPreview name="Rating-Clearable" />

## Custom icon

`icon` accepts a Vue component — typically an auto-imported lucide icon
(`import LucideHeart from '~icons/lucide/heart'`). String names aren't
supported, to keep the prop consistent with other frappe-ui icon props.

<ComponentPreview name="Rating-CustomIcon" />

## Custom colors

The four colors are exposed as CSS custom properties on the root and are
part of the public API. Set them on any ancestor (via a scoped class or
inline `style`) to recolor the control — useful when the default yellow
doesn't suit a custom icon (e.g. a heart or flame).

```
--rating-filled    /* selected stars (and hover-preview overlap) */
--rating-preview   /* hover preview ahead of the selected value  */
--rating-removing  /* selected stars being "un-hovered"           */
--rating-empty     /* unfilled stars                              */
```

The defaults are passed as `var()` fallbacks rather than set directly on
the root, so inherited values from any ancestor win — no need to target
`.rating-stars` specifically.

In **dark mode**, the component only adjusts `--rating-empty` (the default
yellow filled/preview/removing read on both surfaces). Custom palettes
usually need their own dark-mode overrides because the light shades used
for `preview` / `removing` invert on a dark surface:

```css
.rating-red {
  --rating-filled: theme(colors.red.500);
  --rating-preview: theme(colors.red.300);
  --rating-removing: theme(colors.red.200);
}
[data-theme='dark'] .rating-red {
  --rating-preview: theme(colors.red.700);
  --rating-removing: theme(colors.red.800);
}
```

> Note: `theme()` only works in CSS (scoped `<style>` blocks or CSS files).
> If you'd rather use an inline `style="..."` attribute on `<Rating>`, pass
> resolved color values (`#ef4444`) instead — `theme()` is a build-time
> PostCSS function and the browser can't evaluate it at runtime.

<ComponentPreview name="Rating-CustomColor" />

## Labeling

<ComponentPreview name="Rating-Labeling" />

## States

<ComponentPreview name="Rating-States" />

## Keyboard

| Mode | Keys | Action |
| --- | --- | --- |
| Radiogroup (`step="1"`) | `←` / `↑` / `→` / `↓` | Move focus and select adjacent star |
| | `Home` / `End` | Select first / last star |
| | `Space` / `Enter` | Select the focused star |
| | `1`–`9` | Set the rating to that value |
| Slider (`step="0.5"`) | `←` / `↓` | Decrement by `step` |
| | `→` / `↑` | Increment by `step` |
| | `PageUp` / `PageDown` | Increment / decrement by one full star |
| | `Home` / `End` | Set to `0` / `max` |
| | `0`–`9` | Set the rating to that integer |

## Customization

Each star exposes data-attribute hooks for styling:

- Root: `data-slot="control"`, `data-size`, `data-readonly`, `data-state="valid|invalid"`.
- Star: `data-slot="star"`, `data-index`, `data-state="filled|preview|removing|empty"`.
- Half-star fill: each star renders two half-spans with their own
  `data-state` for half-step granularity.

For color customization, see [Custom colors](#custom-colors) above.

## Deprecated `rating_from` prop

The `rating_from` prop is kept for backwards compatibility and fires a
dev-mode `[frappe-ui] Rating.rating_from is deprecated. Use max instead.`
warning. Use `max` instead.

<ComponentPreview name="Rating-LegacyRatingFrom" />

<!-- @include: ./Rating.api.md -->
