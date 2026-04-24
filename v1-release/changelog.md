# Frappe UI v1 Changelog

This file tracks user-facing v1 changes as they land.

Keep entries focused on:

- breaking changes
- deprecations
- behavior changes users will notice
- migration guidance

Do not log internal refactors, test additions, or planning/doc maintenance
unless they affect consumers.

## Unreleased

### 2026-04-24

#### Tailwind — `lucide-*` CSS utility classes

A new Tailwind plugin registers one utility class per lucide-static icon
(~1800 icons). Each class renders as an inline-block square masked with the
icon SVG and tinted with `currentColor`, so it participates in `size-*`,
`text-*`, and layout classes without any import:

```html
<span class="lucide-menu size-4 text-ink-gray-6" />
```

The plugin reads SVGs at build time and inlines them as data URIs. Tailwind's
JIT scanner ensures only classes actually referenced in source make it into the
output CSS. SVGs are emitted at `stroke-width="1.5"` (overriding Lucide's
default of 2) for a lighter, more balanced look.

Classes live in the components layer so that utility classes like `size-4`,
`w-*`, `h-*` always win the cascade without `!important`.

#### Button — `lucide-*` strings for `icon` / `iconLeft` / `iconRight`

The `icon`, `iconLeft`, and `iconRight` props now accept `lucide-*` strings in
addition to components and FeatherIcon names:

```vue
<Button icon="lucide-more-horizontal" variant="ghost" />
<Button icon-left="lucide-plus" label="Add item" />
```

When the value starts with `lucide-`, the prop renders a `<span>` styled via
the Tailwind plugin instead of routing through `FeatherIcon`. Other strings
continue to fall through to FeatherIcon (back-compat). Component values are
unchanged.

### Breaking

- None.

### Deprecated

- `Divider.action.handler` is deprecated in favor of `Divider.action.onClick`.
  - Backwards compatibility is preserved for now.
  - A warning is shown when `handler` is used.

### Changed

- Divider action mode now supports `action.onClick` as the preferred callback
  API.
- Uncontrolled `Slider` now initializes to `min` instead of rendering with no
  thumb.
- Divider action mode now preserves separator semantics for assistive
  technologies.

### Migration notes

- Replace `Divider.action.handler` with `Divider.action.onClick`.

## Deprecation log

| API                      | Status     | Replacement              | Notes                                                      |
| ------------------------ | ---------- | ------------------------ | ---------------------------------------------------------- |
| `Divider.action.handler` | Deprecated | `Divider.action.onClick` | Still supported with a warning for backwards compatibility |
