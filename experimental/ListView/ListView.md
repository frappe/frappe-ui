# ListView

Displays data in a structured, scrollable list with support for columns, groups, and custom content. Makes large sets of information easy to view, select, and interact with.

> **Parked** — `ListView` left the root export in `1.0.0` and now ships from
> [`frappe-ui/experimental`](/docs/experimental), exempt from the deprecation
> policy. [`frappe-ui/list`](/docs/molecules/list) is the replacement for new
> code, but it has no equivalent for ListView's config-driven columns yet, so
> `ListView` stays here until it does.

```ts
import { ListView } from 'frappe-ui/experimental'

// The parts a custom list composes:
import {
  ListHeader,
  ListHeaderItem,
  ListRows,
  ListRow,
  ListRowItem,
  ListSelectBanner,
} from 'frappe-ui/experimental'
```

## Simple List

<ComponentPreview name="ListView-Examples" />

## Custom List
<ComponentPreview name="ListView-CustomList" />

## Grouped Rows 
<ComponentPreview name="ListView-GroupedRows" />

## Cell Slot
<ComponentPreview name="ListView-CellSlot" />

## Empty List
<ComponentPreview name="ListView-Empty" />

## Disabled Rows
<ComponentPreview name="ListView-Disabled" />
