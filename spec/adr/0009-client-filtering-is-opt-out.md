# Client-side filtering is opt-out (`filterable`)

**Status**: accepted

## Context

`Combobox` and `MultiSelect` substring-match the options they are given against
the typed query. That is right for a local list and wrong for a remote one: when
options arrive from a server search, the backend has already decided what
matches, and a second literal substring pass on the client silently drops
anything that does not contain the typed string — fuzzy matches, id lookups,
relevance ranking. The user types, the server returns results, and the picker
shows nothing.

There was no way to turn it off. `Autocomplete`, the component these two
replace, filtered unconditionally too, so the gap predates them.

Three apps forked rather than adopt. crm's fork carries a `filterable` prop for
exactly this reason and backs roughly fifteen record pickers; helpdesk and
builder keep their own copies. Deleting `Autocomplete` without closing this gap
would have removed a component nobody used while leaving the reason they left.

## Decision

`filterable?: boolean`, defaulting to `true`, on `Combobox` and `MultiSelect`.
`false` turns off query filtering and nothing else.

A custom row's `condition` callback is consumer-declared visibility rather than
client filtering, so it keeps running either way. Combobox's predicate splits on
that line: a custom row with a `condition` is governed only by the condition; a
custom row without one falls back to a label substring match and is filtered
like any other row.

## Considered alternatives

**A filter function** (`filterable?: boolean | ((option, query) => boolean)`).
No call site anywhere in the bench wants a custom matcher — every one wants the
switch off. The boolean covers all observed need at the smallest size, and
widening it to accept a function later is additive.

## Consequences

- A remote-search picker is now `:filterable="false"` plus a debounced refetch,
  with no fork required.
- The default is unchanged, so local lists behave exactly as before.
