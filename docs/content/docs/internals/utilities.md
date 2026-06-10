# Utilities

Internal class helpers re-exported from `frappe-ui/internals`.

> **Unstable API** — these helpers can change or disappear in any release. See
> [Internals](/docs/internals/introduction).

## inputFontSizeClasses

Returns the Tailwind font-size class frappe-ui input components use for a given
size token, so custom controls render text at the same scale as built-in ones.

```ts
import { inputFontSizeClasses } from 'frappe-ui/internals'

inputFontSizeClasses('sm') // 'text-base'
inputFontSizeClasses('md') // 'text-base'
inputFontSizeClasses('lg') // 'text-lg'
inputFontSizeClasses('xl') // 'text-xl'
```
