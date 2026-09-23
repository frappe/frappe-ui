# Rating

A row of stars for picking a score, such as 4 out of 5.

<ComponentPlayground name="Rating" />

## Examples

### Product review

A required rating with a `description` and an `error`. Submit the form without
a rating to see the error.

<ComponentPreview name="Rating-ReviewForm" />

### Score with half stars

`step="0.5"` lets people pick half a star. Click the left half of a star for
the half value.

<ComponentPreview name="Rating-HalfStep" />

### Spice level

`icon` replaces the star with any class icon, here `lucide-flame`. `max`
sets the number of icons.

<ComponentPreview name="Rating-CustomIcon" />

### Mood check-in

The `#icon` slot draws a different emoji at each position. The slot's `index`,
`value` and `previewValue` pick which one stands out.

<ComponentPreview name="Rating-CustomSlot" />

## Behavior

### Value

`v-model` is a number from `0` to `max`, where `0` means no rating. `max`
defaults to `5`. A value outside that range shows as the nearest end, and a
value between steps shows rounded to the nearest `step`.

### Clearing

Clicking the selected star, or pressing `0`, sets the rating to `0`. To keep
people from clearing it, bind the value yourself and ignore the `0` update:

```vue
<Rating
  :model-value="value"
  @update:model-value="(v) => { if (v !== 0) value = v }"
/>
```

### Hover preview

While the pointer is over the stars, they show the value a click would pick.
Stars that the click would add and stars that it would remove are drawn in
lighter shades.

### Icon

`icon` takes a class name (`icon="lucide-zap"`), which renders as a `<span>`
with that class, or a Vue component. A component gets `fill="currentColor"`,
so closed shapes render filled.

The default icon is a filled star. The `lucide-star` class icon draws only the
outline, so it cannot replace the default.

### Icon slot

The `#icon` slot replaces the icon at each position, for content such as emojis
or icons that change from one position to the next. It renders twice per star,
once for each half, so half stars still work.

The slot receives `{ index, side, state, leftState, rightState, value,
previewValue, max }`. `index` starts at `1`. `state` is `filled`, `preview`,
`removing` or `empty`, and describes the half being drawn. Use it to set the
icon's color. `previewValue` is the value under the pointer, or `null`, so
`previewValue ?? value` is the value to highlight.

### Size

`size` defaults to `sm`, like every other input. A value it does not know
renders as `sm`.

### Label, description and error

`label` renders above the stars and `description` below them. `error` renders
below the stars and hides `description`. It takes a string, an array of
strings (one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label.

The `#label` slot replaces the label text and the required marker, and receives
`{ required }`. A `#description` slot is not hidden by `error`. It renders
above the error.

### Attributes

`class` and `style` go on the outer element: the wrapper when a label,
description or error shows, and the row of stars otherwise. Every other
attribute and listener goes on the row of stars.

## Accessibility

With whole stars, the row is a `radiogroup` and each star is a `radio` named
"3 of 5". Only the selected star, or the first star when there is no rating,
is in the tab order.

With `step="0.5"`, the whole row is one `slider`. Screen readers announce its
value as "3.5 of 5 stars", or "No rating, out of 5 stars" at `0`. The slider
role does not allow `aria-required`, so a required rating in this mode is
announced only through the hidden "(required)" text in the label.

| Mode           | Keys                          | Action                                      |
| -------------- | ----------------------------- | ------------------------------------------- |
| Whole stars    | `←` `↑` / `→` `↓`             | Select the previous / next star and move focus to it |
|                | `Home` / `End`                | Select the first / last star                |
|                | `Space` / `Enter`             | Select the focused star                     |
|                | `1`–`9`                       | Set the rating to that number               |
|                | `0`                           | Clear the rating                            |
| Half stars     | `←` `↓` / `→` `↑`             | Decrease / increase by half a star          |
|                | `PageDown` / `PageUp`         | Decrease / increase by one star             |
|                | `Home` / `End`                | Set to `0` / `max`                          |
|                | `0`–`9`                       | Set the rating to that number               |

A number above `max` sets the rating to `max`.

## Migrating from v0

| Before                    | After                                          |
| ------------------------- | ---------------------------------------------- |
| `:rating_from`            | `:max`                                         |
| `:readonly`               | `:disabled`                                    |
| `size` defaulted to `md`  | `size` defaults to `sm`; pass `size="md"` to keep the old size |
| attributes on the wrapper | attributes on the row of stars; `class` and `style` on the wrapper |

The old prop names are ignored without a warning: `:rating_from="10"` renders 5
stars, and a `:readonly` rating can be changed. See the
[migration guide](../migration#inputs), and
[the size change](../migration#rating-size).

<!-- @include: ./Rating.api.md -->
