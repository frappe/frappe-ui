# Duration

A text input for entering a length of time. The caller works in **seconds** (via
`v-model`); the user types a human-readable duration in any common notation and
the component parses it on commit.

## Playground

<ComponentPlayground name="Duration" />

<ComponentPreview name="Duration-Default" layout="stacked" />

## Example

Logging effort against a task: the user enters a duration in any notation and
the saved seconds roll up into a total.

<ComponentPreview name="Duration-RealWorld" />

## Input notation

The field accepts several notations, case-insensitive, with units in any order.
Parsing happens when the field is committed (blur or `Enter`):

| Notation     | Example                                | Seconds            |
| ------------ | -------------------------------------- | ------------------ |
| Short units  | `1h 30m 45s`, `1h30m45s`, `45s 1h 30m` | `5445`             |
| Long units   | `1 hour 30 minutes`, `2hrs 15min`      | `5400`, `8100`     |
| Colon        | `1:30:45`, `1:30`, `:45`               | `5445`, `90`, `45` |
| Bare integer | `90`                                   | `90`               |

Invalid input keeps the field open with the typed text and an inline error so it
can be corrected; the saved value is left untouched until a valid commit.
`Escape` abandons the edit, and clearing the field commits `null`.

## Display format

When the field is not focused, the saved value is rendered using `format`. This
is either a **named preset** or a **token template string**. The default is the
`short` preset, which renders `2h 2m 3s` and omits zero parts.

### Presets

Presets are smart — they omit zero components (and `long` pluralizes):

| `format`            | `5445`                         | `90`                  |
| ------------------- | ------------------------------ | --------------------- |
| `short` _(default)_ | `1h 30m 45s`                   | `1m 30s`              |
| `long`              | `1 hour 30 minutes 45 seconds` | `1 minute 30 seconds` |
| `colon`             | `1:30:45`                      | `1:30`                |

### Token templates

Any other `format` value is a template, rendered literally (no zero-omission).
`h`/`m`/`s` are unit tokens; double them (`hh`/`mm`/`ss`) to zero-pad to two
digits. Wrap label text in single quotes so the unit letters render as text.

| `format`         | `7323`     |
| ---------------- | ---------- |
| `h'h' m'm' s's'` | `2h 2m 3s` |
| `hh:mm:ss`       | `02:02:03` |
| `h':'mm`         | `2:02`     |

Each token renders only its own component — `m` is the minutes-within-the-hour
(`2`), not the total minutes (`122`). Include every unit you want to keep, or a
higher unit's value is dropped from the output.

> Editing always switches to the canonical `2h 2m 3s` notation so the typed
> value round-trips reliably through the parser, whatever the display format.

<ComponentPreview name="Duration-Formats" />

## Sizes

<ComponentPreview name="Duration-Sizes" />

## Labeling

Duration implements the shared input labeling contract (`label`, `description`,
`error`, `required`), forwarded to the underlying `TextInput`.

<ComponentPreview name="Duration-States" />

## Keyboard

| Keys         | Action                                        |
| ------------ | --------------------------------------------- |
| `Enter`      | Commit the typed value                        |
| `Escape`     | Cancel the edit and revert to the saved value |
| `Tab` / blur | Commit the typed value                        |

## Customization

Duration renders a `TextInput`, so the same data-attribute styling hooks apply —
`data-slot="control"`, `data-size`, `data-disabled`, and `data-state="invalid"`
on error. See TextInput for the full taxonomy.

<!-- @include: ./Duration.api.md -->
