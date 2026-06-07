# PhoneInput

A phone number input with a built-in country picker. The flag and dial code sit
inside the field; the bound value is a single string in `"<isd>-<number>"`
format, e.g. `"+91-9876543210"`.

<ComponentPreview name="PhoneInput-Default" layout="stacked" />

## Default country

When the value is empty, the pre-selected country comes from the
`default-country` prop — an ISO2 code (`"us"`), a dial code (`"+44"` or `"44"`),
or a country name (`"Japan"`). Without the prop, the country is guessed from the
system timezone; when nothing resolves, a globe placeholder invites picking one.

<ComponentPreview name="PhoneInput-DefaultCountry" />

## Detecting the country from the value

Values carrying a dial code — pasted, autofilled (the input sets
`autocomplete="tel"`), or set externally — select the matching country and keep
the national part in the input. The longest dial code wins, so `"+1242…"`
resolves to the Bahamas, not the US (`+1`).

<ComponentPreview name="PhoneInput-CountryDetect" layout="stacked" />

## Sizes

<ComponentPreview name="PhoneInput-Sizes" />

## Variants

<ComponentPreview name="PhoneInput-Variants" />

## Labeling

`label`, `description`, `error`, and `required` are wired into the number input
via the shared labeling contract — identical to `TextInput`. Setting `error`
suppresses the `description` and applies `aria-invalid="true"`.

<ComponentPreview name="PhoneInput-Labeling" />

## States

<ComponentPreview name="PhoneInput-States" />

## Suffix slot

<ComponentPreview name="PhoneInput-Suffix" />

## Value format

- Typing emits `"<isd>-<number>"` (`"+91-9876543210"`); the first hyphen is the
  delimiter, later hyphens belong to the number.
- An empty number emits `''` — never a dangling `"+91-"`.
- No validation — `type="tel"` and `inputmode="tel"` are keyboard hints, not
  constraints. Validate in the consumer.

<!-- @include: ./PhoneInput.api.md -->
