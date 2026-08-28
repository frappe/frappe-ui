# ThemeSwitcher

A labeled control for choosing between **light**, **dark**, and **system**
appearance. Each option is a preview card depicting that mode, and selecting one
drives the global `<html data-theme>` through [`useColorScheme`](#usecolorscheme), so a bare
`<ThemeSwitcher />` switches the whole app with no wiring.

> **Parked** — `ThemeSwitcher` left the root export in `1.0.0` and now ships
> from [`frappe-ui/experimental`](/docs/experimental), exempt from the
> deprecation policy. It stays deprecated: build the control from
> [`useColorScheme`](#usecolorscheme) plus `Select` or `Dropdown` in new code.

```ts
import { ThemeSwitcher } from 'frappe-ui/experimental'
import type { ThemeSwitcherProps } from 'frappe-ui/experimental'

// The composable behind it stays on the root export:
import { useColorScheme } from 'frappe-ui'
```

<ComponentPreview name="ThemeSwitcher-Default" layout="stacked" />

## Branding

Pass a `name` and a `logo` (an image URL or a Component) to show your branding
inside the theme panel previews. The `label` and `description` props set the heading of the component.

<ComponentPreview name="ThemeSwitcher-Branded" layout="stacked" />

## Toggle button

In a header or sidebar you rarely want the full card preview. You want a single
labelled button that flips the state. Build one from the same
[`useColorScheme`](#usecolorscheme) composable: because both controls share the one
`<html data-theme>`, they stay in sync, and the button drops straight into a
sidebar or menu.

<ComponentPreview name="ThemeSwitcher-Toggle" layout="stacked" />

## In a user menu

A user menu is the most common home for theme switching. Nest the three options
as a hover submenu inside a [`Dropdown`](/docs/components/dropdown), drive them through the same
[`useColorScheme`](#usecolorscheme) singleton, and mark the active one with `selected` so the menu
always reflects the shared `<html data-theme>`.

<ComponentPreview name="ThemeSwitcher-Menu" layout="stacked" />

## useColorScheme

The component is backed by the `useColorScheme` composable, exported from the
library. Its state is a shared singleton, so every consumer (the switcher, a
sidebar toggle, a user-menu entry) stays in sync with the single
`<html data-theme>` source of truth.

There is nothing to set up. The first `useColorScheme()` call restores the saved
preference (falling back to `system`) and starts following the OS setting.
Calling it near your app root simply makes that happen as early as possible.

```ts
import { useColorScheme } from 'frappe-ui'

const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
```

The selection persists to `localStorage` under the `theme` key and is reapplied
on the next load.

| Member              | Type                            | Description                                                              |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `colorScheme`       | `Readonly<Ref<ColorScheme>>`    | The selection: `'light' \| 'dark' \| 'system'`. Read-only.               |
| `setColorScheme`    | `(scheme: ColorScheme) => void` | Selects a scheme, applies `data-theme`, and persists it.                 |
| `toggleColorScheme` | `() => void`                    | Flips between light and dark.                                            |

`colorScheme` is read-only because the ref is only half the state — the other
half is the `data-theme` attribute and the stored value. Assigning to it would
move the ref and leave the document and `localStorage` behind. Go through
`setColorScheme`.

> **`colorScheme`, not `theme`.** Everywhere else in the library `theme` means a
> color tone (`theme="blue"` on a Button). The `data-theme` attribute and the
> `theme` storage key keep the older name so app CSS and saved preferences
> keep working.

> **Avoid the flash.** The scheme is applied from JavaScript once the app loads,
> so a page that ships without a `data-theme` briefly shows the default before
> switching. Set an initial `data-theme` on your `<html>`, or inline a small
> script that reads `localStorage.theme`, to render the right one from the first
> paint.

<!-- @include: ./ThemeSwitcher.api.md -->
