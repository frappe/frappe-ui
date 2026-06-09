# ThemeSwitcher

A labeled control for choosing between **light**, **dark**, and **system**
appearance. Each option is a preview card depicting that mode, and selecting one
drives the global `<html data-theme>` through [`useTheme`](#usetheme), so a bare
`<ThemeSwitcher />` switches the whole app with no wiring.

<ComponentPreview name="ThemeSwitcher-Default" layout="stacked" />

## Branding

Pass a `name` and a `logo` (an image URL or a Component) to show your branding
inside the theme panel previews. The `label` and `description` props set the heading of the component.

<ComponentPreview name="ThemeSwitcher-Branded" layout="stacked" />

## Toggle button

In a header or sidebar you rarely want the full card preview. You want a single
labelled button that flips the state. Build one from the same
[`useTheme`](#usetheme) composable: because both controls share the one
`<html data-theme>`, they stay in sync, and the button drops straight into a
sidebar or menu.

<ComponentPreview name="ThemeSwitcher-Toggle" layout="stacked" />

## In a user menu

A user menu is the most common home for theme switching. Nest the three options
as a hover submenu inside a [`Dropdown`](/components/Dropdown), drive them through the same
[`useTheme`](#usetheme) singleton, and mark the active one with `selected` so the menu
always reflects the shared `<html data-theme>`.

<ComponentPreview name="ThemeSwitcher-Menu" layout="stacked" />

## useTheme

The component is backed by the `useTheme` composable, exported from the library.
Its state is a shared singleton, so every consumer (the switcher, a sidebar
toggle, a user-menu entry) stays in sync with the single `<html data-theme>`
source of truth.

There is nothing to set up. The first `useTheme()` call restores the saved theme
(falling back to `system`) and starts following the OS preference. Calling it
near your app root simply makes that happen as early as possible.

```ts
import { useTheme } from 'frappe-ui'

const { currentTheme, setTheme, toggleTheme } = useTheme()
```

The selection persists to `localStorage` under the `theme` key and is reapplied
on the next load.

| Member            | Type                        | Description                                                        |
| ----------------- | --------------------------- | ----------------------------------------------------------------- |
| `currentTheme`    | `Ref<Theme>`                | The selected theme: `'light' \| 'dark' \| 'system'`.              |
| `setTheme`        | `(theme: Theme) => void`    | Sets the theme, applies `data-theme`, and persists to storage.    |
| `toggleTheme`     | `() => void`                | Flips between light and dark.                                      |
| `initializeTheme` | `() => void`                | Restores the saved theme (or `system`). Run once automatically.   |
| `getSystemTheme`  | `() => 'light' \| 'dark'`   | Resolves the current OS preference.                               |

> **Avoid the flash.** The theme is applied from JavaScript once the app loads,
> so a page that ships without a `data-theme` briefly shows the default theme
> before switching. Set an initial `data-theme` on your `<html>`, or inline a
> small script that reads `localStorage.theme`, to render the right theme from
> the first paint.

<!-- @include: ./ThemeSwitcher.api.md -->
