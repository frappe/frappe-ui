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

## Clearing

Clicking the currently-selected star (or pressing `0`) clears the rating
to `0`. This is the default behavior — there is no `clearable` prop.

To opt out, use `:model-value` + `@update:model-value` and drop the `0`
update yourself:

```vue
<Rating
  :model-value="value"
  @update:model-value="(v) => { if (v !== 0) value = v }"
/>
```

<ComponentPreview name="Rating-Clearable" />

## Custom icon

`icon` accepts either a Vue component — typically an auto-imported lucide
icon (`import LucideHeart from '~icons/lucide/heart'`) — or a string
class name (e.g. `"lucide-zap"`) that is rendered on a `<span>` for use
with the shared Lucide Tailwind utility.

<ComponentPreview name="Rating-CustomIcon" />

## Custom icon slot

For full control over each star — different content per index (emojis,
icons), custom colors, or any other per-star styling — use the `#icon`
slot. It's called once per star and stamped into both half-spans so
half-step clipping still works.

The slot receives:

| Prop | Type | Notes |
| --- | --- | --- |
| `index` | `number` | 1-based star position |
| `state` | `'filled' \| 'preview' \| 'removing' \| 'empty'` | The star's state — drive your color/style off this |
| `leftState` / `rightState` | same union | Per-half states for `step="0.5"` |
| `value` | `number` | Current saved rating |
| `previewValue` | `number \| null` | Value being hovered, or `null`. Use `previewValue ?? value` for single-select patterns where hover should preview the selection |
| `max` | `number` | Total stars |

### Per-index content

Render a different element per star — e.g. a mood scale of emojis. Style
each one off the `state` prop with whatever utility classes you like.

<ComponentPreview name="Rating-CustomSlot" />

### Custom colors with Tailwind

Map `state` → Tailwind classes to recolor the control. Use the `dark:`
variant for dark-mode overrides on `preview` / `removing` (which need to
flip lighter→darker against a dark surface).

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

For color or per-star customization, see [Custom icon slot](#custom-icon-slot) above.

## Deprecated `rating_from` prop

The `rating_from` prop is kept for backwards compatibility and fires a
dev-mode `[frappe-ui] Rating.rating_from is deprecated. Use max instead.`
warning. Use `max` instead.

<ComponentPreview name="Rating-LegacyRatingFrom" />

<!-- @include: ./Rating.api.md -->
