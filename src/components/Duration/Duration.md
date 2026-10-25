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
| Days         | `1d 2h`, `2 days`                      | `93600`, `172800`  |
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

### Units

`largestUnit` and `smallestUnit` set which units the `short` and `long` presets
show. The edit text uses the same units. `colon` and templates name their own
units, so these props do not change them.

| Props                    | `93784`       |
| ------------------------ | ------------- |
| _(default)_              | `26h 3m 4s`   |
| `largest-unit="day"`     | `1d 2h 3m 4s` |
| `smallest-unit="minute"` | `26h 3m`      |

With `smallest-unit="minute"`, the value shows rounded to the nearest minute, so
`3599` shows `1h`. A typed value is saved rounded. A saved value that is not
edited keeps its seconds.

A minute field also reads a bare number as minutes and `a:b` as hours and
minutes, so `15` saves `900` and `1:30` saves `5400`. `1:30:45` and text with
units, such as `45s`, read the same as in a seconds field.

### Label, description and error

`label` renders above the field and `description` below it. `error` renders
below the field and hides `description`. It takes a string, an array of strings
(one line each), or an `Error`, the same values as
[ErrorMessage](./errormessage). An empty string or an empty array means no
error. `required` adds a red asterisk to the label and sets `required` on the
`<input>`.

The `#label` slot replaces the label text and the required marker, and receives
`{ required }`. A `#description` slot is not hidden by `error`. It renders
above the error.

```vue
<Duration v-model="seconds">
  <template #label="{ required }">
    Time spent <Badge v-if="required" label="Required" />
  </template>
  <template #description>Type 1h 30m, or 01:30:00.</template>
</Duration>
```

## Accessibility

| Keys         | Action                                     |
| ------------ | ------------------------------------------ |
| `Enter`      | Save the typed value                       |
| `Tab` / blur | Save the typed value                       |
| `Escape`     | Drop the edit and show the saved value     |

<!-- @include: ./Duration.api.md -->
