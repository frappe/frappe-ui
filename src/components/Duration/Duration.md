# Duration

A text input for a length of time. The value is a number of seconds, and people
can type it as `1h 30m`, `1:30:00` or `5400`.

<ComponentPlayground name="Duration" />

## Examples

### Logging time

Each entry is typed in whatever notation is quickest, and the saved seconds add
up into a total. `formatDuration` renders a value outside the input.

<ComponentPreview name="Duration-RealWorld" />

### Service targets

`format="long"` writes the saved value out in words, which reads better in a
settings form.

<ComponentPreview name="Duration-SlaPolicy" />

## Behavior

### What people can type

The input accepts several notations. Case does not matter, and units can come
in any order.

| Notation     | Example                                | Seconds            |
| ------------ | -------------------------------------- | ------------------ |
| Short units  | `1h 30m 45s`, `1h30m45s`, `45s 1h 30m` | `5445`             |
| Long units   | `1 hour 30 minutes`, `2hrs 15min`      | `5400`, `8100`     |
| Colon        | `1:30:45`, `1:30`, `:45`               | `5445`, `90`, `45` |
| Bare integer | `90`                                   | `90`               |

The typed text is read when the input loses focus or on `Enter`. Text that
cannot be read keeps the input open with an error, and the saved value stays as
it was. `Escape` drops the edit. An empty input saves `null`.

### Display format

When the input is not focused, it shows the saved value in the `format` you
pass. `format` is a preset name or a template.

The presets leave out parts that are zero, and `long` adds plurals:

| `format`            | `5445`                         | `90`                  |
| ------------------- | ------------------------------ | --------------------- |
| `short` _(default)_ | `1h 30m 45s`                   | `1m 30s`              |
| `long`              | `1 hour 30 minutes 45 seconds` | `1 minute 30 seconds` |
| `colon`             | `1:30:45`                      | `1:30`                |

Any other value is a template, and every part in it is shown, zero or not.
`h`, `m` and `s` stand for hours, minutes and seconds. Double a letter (`hh`)
to pad it to two digits. Put text in single quotes so its letters are not read
as units.

| `format`         | `7323`     |
| ---------------- | ---------- |
| `h'h' m'm' s's'` | `2h 2m 3s` |
| `hh:mm:ss`       | `02:02:03` |
| `h':'mm`         | `2:02`     |

`m` is the minutes left over after the hours (`2`), not the total minutes
(`122`). A template without `h` drops the hours from the output.

While the input has focus, it always shows the short notation (`2h 2m 3s`), so
the text can be edited and read back the same way whatever the format.

### Label slots

Duration passes `label`, `description`, `error` and `required` to the
`TextInput` inside it, along with the `#label` and `#description` slots.

```vue
<Duration v-model="seconds">
  <template #label="{ required }">
    Time spent <Badge v-if="required" label="Required" />
  </template>
  <template #description>Type `1h 30m`, or `01:30:00`.</template>
</Duration>
```

### Template ref

`focus()` focuses the input.

## Accessibility

| Keys         | Action                                     |
| ------------ | ------------------------------------------ |
| `Enter`      | Save the typed value                       |
| `Tab` / blur | Save the typed value                       |
| `Escape`     | Drop the edit and show the saved value     |

## Styling

Duration renders a `TextInput`, so it has the same styling hooks:
`data-slot="control"`, `data-size`, `data-disabled`, and `data-state="invalid"`
when there is an error. See [TextInput](./textinput) for the full list.

<!-- @include: ./Duration.api.md -->
