# `Link` ships `creatable` as a boolean prop instead of splitting into `<Link>` + `<CreatableLink>`

**Status**: accepted

## Context

`Link` (the Frappe-integrated doctype-record picker, specced in
[`../10-frappe-controls-spec.md`](../10-frappe-controls-spec.md)) historically
exposed three boolean affordance props: `allowCreate`, `allowClear`,
`allowRedirect`. While locking the v1 API, two of those — `allowClear` and
`allowRedirect` — were removed: clear becomes a default behavior gated by
`required: false`, and redirect collapses into the standard Combobox `#suffix`
slot pattern.

The third — the "Create new" action row in the popover — is more contentious.
A strict reading of **P8** ("split components instead of overloading them",
specifically *"a visible UI region appears/disappears"*) argues for splitting
into `<Link>` (pure picker) and `<CreatableLink>` (picker + create row), both
sharing a `useDoctypeSearch()` composable.

## Decision

Keep `Link` as a **single component** with a boolean `creatable` prop. Do not
introduce `<CreatableLink>`. Do not introduce `useDoctypeSearch()` as a public
composable in v1.

## Rationale

- The create-row does not change `Link`'s value contract — `modelValue` stays
  `string | null` whether `creatable` is true or false. P8's *"keep one
  component when the prop is additive without changing emitted shape"*
  carve-out applies.
- CRM call sites are dense with doctype pickers. Having every such site read
  `<Link>` in markup (rather than `<Link>` for some and `<CreatableLink>` for
  others) is significant for grep-ability, code review, and the mental model
  *"this is the doctype picker"*. The split would force readers to first ask
  *"which Link is this?"* before they understand the call site.
- The new visible region (one popover row) is narrow and tightly coupled to
  the existing options list — it is not a new UI mode (no tag-input area, no
  multi-pane layout, no different keyboard semantics). It is closer to a
  conditional row than to a fundamentally different shape.
- Splitting would push more CRM call sites toward `<Combobox>` + composable
  composition, undermining the reason `Link` exists as a molecule in the
  first place.

## Considered alternatives

- **`<Link>` + `<CreatableLink>` siblings, sharing `useDoctypeSearch()`.**
  P8-strict. Rejected for the readability cost (every create-enabled CRM site
  would read `<CreatableLink>` in markup, and consumers wanting redirect-plus-
  create would have to reach for `<Combobox>` + composable directly).
- **`<Link>` with an `extraOptions` array prop.** Rejected because
  `extraOptions` is a side-channel for arbitrary popover content — *"the docs
  grow `if X, then …` branches everywhere"* — and is the kind of structured
  prop P3 forbids (config blob, not irreducibly structured data the component
  renders).
- **Drop `Link` entirely; expose `useDoctypeSearch()` and have consumers use
  `<Combobox>` directly.** Maximally P8-aligned, but ~30× more verbose at the
  call site for the basic-picker case, which is the dominant use in CRM.

## Consequences

- `creatable` is the *only* boolean affordance prop that survives on `Link`.
  If a future affordance is proposed (e.g. `bulkSelect`, `recent`), this ADR
  is the precedent — and the precedent is "high bar to add, must not change
  the value contract, must read naturally as an additive feature."
- Consumers who need create-row UX richer than `@create(query)` — custom row
  rendering, multi-step create flows in-popover, persistence callbacks — fall
  back to `<Combobox>` directly with a `type: 'custom'` option. There is no
  intermediate API on `Link` for this case.
- If usage data later shows that the split (with `<CreatableLink>`) would be
  cleaner — for example, if `creatable` accretes orthogonal sub-props — this
  ADR can be revisited and reversed in a major release via P13.
