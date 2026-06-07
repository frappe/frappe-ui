# ThemeSwitcher

A labeled control for choosing between **light**, **dark**, and **system**
appearance. Each option is a live preview card, and selecting one drives the
global `<html data-theme>` through [`useTheme`](#usetheme) so a bare
`<ThemeSwitcher />` switches the whole app with no wiring.

<ComponentPreview name="ThemeSwitcher-Default" layout="stacked" />

## Branding

Pass a `name` and a `logo` (an image URL or a Component) to show your branding
inside the theme panel previews. The `label` and `description` props set the heading of the component.

<ComponentPreview name="ThemeSwitcher-Branded" layout="stacked" />

## Toggle button

For a header, sidebar, or a menu component you rarely want the full card preview instead you want a
single labelled button which toggles the state. You can simply build one from the same [`useTheme`](#usetheme) composable. Since both controls share `<html data-theme>`, they stay consistent and  You can plug it straight into any of your UI components.
<ComponentPreview name="ThemeSwitcher-Toggle" layout="stacked" />

## useTheme

The component is backed by the `useTheme` composable, exported from the library.
Its state is a shared singleton, so every consumer (the switcher, a sidebar
toggle, etc.) stays in sync with the single `<html data-theme>` source of truth.
Call it once near your app root to restore the saved theme on load:

```ts
import { useTheme } from 'frappe-ui'

const { currentTheme, setTheme, toggleTheme } = useTheme()
```

| Member            | Type                        | Description                                                        |
| ----------------- | --------------------------- | ----------------------------------------------------------------- |
| `currentTheme`    | `Ref<Theme>`                | The selected theme: `'light' \| 'dark' \| 'system'`.              |
| `setTheme`        | `(theme: Theme) => void`    | Sets the theme, applies `data-theme`, and persists to storage.    |
| `toggleTheme`     | `() => void`                | Flips between light and dark.                                      |
| `initializeTheme` | `() => void`                | Restores the saved theme (or `system`). Run once automatically.   |
| `getSystemTheme`  | `() => 'light' \| 'dark'`   | Resolves the current OS preference.                               |

<!-- @include: ./ThemeSwitcher.api.md -->
