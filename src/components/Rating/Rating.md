# Rating

Lets users rate items using stars in a simple, interactive way. Provides immediate visual feedback and supports partial or full selections.

## Playground

<ComponentPlayground name="Rating" />

<ComponentPreview name="Rating-Default" layout="stacked" />

## Sizes

<ComponentPreview name="Rating-Sizes" />

## Half stars

Set `step="0.5"` to allow half-star ratings. The control switches its ARIA
role to `slider` so screen readers can announce non-integer values.

<ComponentPreview name="Rating-HalfStep" />

## Clearing

Clicking the currently-selected star (or pressing `0`) clears the rating
to `0`. To opt out, bind manually and drop the `0` update:

```vue
<Rating
  :model-value="value"
  @update:model-value="(v) => { if (v !== 0) value = v }"
/>
```

## Custom icon

`icon` accepts either a Vue component — typically an auto-imported lucide
icon (`import LucideHeart from '~icons/lucide/heart'`) — or a string
class name (e.g. `"lucide-zap"`).

<ComponentPreview name="Rating-CustomIcon" />

## Custom icon slot

For per-index content (emojis, mixed icons) or full control over color
and styling, use the `#icon` slot. It's called once per star and stamped
into both half-spans so half-step clipping still works.

The slot receives `{ index, side, state, leftState, rightState, value, previewValue, max }`.
Drive your style off `state` (`filled | preview | removing | empty`).

<ComponentPreview name="Rating-CustomSlot" />

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
| Slider (`step="0.5"`) | `←` / `↓` / `→` / `↑` | Decrement / increment by `step` |
| | `PageUp` / `PageDown` | Increment / decrement by one full star |
| | `Home` / `End` | Set to `0` / `max` |
| | `0`–`9` | Set the rating to that integer |

## Customization

Each star exposes data-attribute hooks for styling:

- Root: `data-slot="control"`, `data-size`, `data-disabled`, `data-state="valid|invalid"`.
- Star: `data-slot="star"`, `data-index`, `data-state="filled|preview|removing|empty"`.
- Half-star fill: each star renders two half-spans with their own
  `data-state` for half-step granularity.

## Deprecated props

- `rating_from` is kept as an alias for `max`.
- `readonly` is kept as an alias for `disabled`.

Both fire a one-time dev-mode `warnDeprecated` warning.

<!-- @include: ./Rating.api.md -->
