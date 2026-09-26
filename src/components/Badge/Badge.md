# Badge

A small pill-shaped label for a status, a count or a short piece of metadata.

<ComponentPlayground name="Badge" />

## Examples

### Event status

A red badge with an icon in `#prefix` flags an event that needs attention.

<ComponentPreview name="Badge-EventStatus" />

### Call metadata

Gray badges with an icon in `#prefix` show the date and length of a call, and
links to its recording and note.

<ComponentPreview name="Badge-CallMeta" />

### List status

The status column of a table maps each status to a `theme`. A colored dot in
`#prefix` repeats the color. An `outline` badge in the header shows the count.

<ComponentPreview name="Badge-ListStatus" />

### Row tags

Colored tags on a task row, a gray "+2" badge for the tags that do not fit,
and a due date.

<ComponentPreview name="Badge-RowTags" />

### Reactions

An emoji in `#prefix` and a count as the label.

<ComponentPreview name="Badge-Reactions" />

## Behavior

### Label and slots

`label` takes a string or a number. The default slot replaces it. `#prefix`
and `#suffix` place content before and after the label, such as an icon or a
dot. Their size follows `size`.

### Unsupported values

A `theme`, `variant` or `size` outside the supported values falls back to the
default (`gray`, `subtle`, `md`) and logs a warning in development.

<!-- @include: ./Badge.api.md -->
