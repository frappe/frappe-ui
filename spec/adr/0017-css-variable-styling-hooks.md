# CSS variable styling hooks

**Status**: accepted

## Context

Every refactored component exposes `data-slot` / `data-state` attributes so an
app can target its elements from CSS. Those hooks restyle _an element_. They
cannot express geometry that several elements must agree on: the column template
a `ListHeader` and every `ListRow` share, or the inline inset that keeps header
labels aligned with row content. Custom properties are the CSS mechanism for a
value declared once and read in many places, so the list family
(`frappe-ui/list`) ships the library's first public component-level CSS
variables — and whatever conventions it ships freeze at `1.0.0` and set the
pattern every later family will copy.

The library already had three unreconciled precedents: design tokens are
unprefixed globals (`--surface-gray-1`), `Spinner` uses a prefixed internal var
(`--fui-spinner-paint-size`), and the editor uses `--prose-*`. Nothing said
which vars are contract, where a consumer may set them, or how a var-fed default
interacts with a prop.

## Decision

A component family may expose **styling hooks**: custom properties named
`--<family>-<knob>` (`--list-gap`), documented in the family's "Styling hooks"
section. Everything else is internal and carries a `--_<family>` prefix
(`--_list-row-pad`) — internal vars can change in any release.

1. **Hooks are unprefixed.** frappe-ui already owns the app's design-token
   namespace unprefixed; a `--fui-` prefix on hooks alone would buy half a
   collision guarantee at the cost of uglier authoring (`[--fui-list-gap:…]`)
   and a divergence from the sugar utility names. Documented hook names are
   reserved by the library.

2. **Defaults live in `var()` fallbacks at the use site, never as declarations
   on an element.** A declaration on the component root would shadow inherited
   values, so this is what makes hooks settable on the component _or any
   ancestor_ — theming every list in a subtree is one declaration on a wrapper.
   It also permits per-context defaults: the same `--list-row-padding-x` falls
   back to `0.75rem` on interactive rows and `0` on static rows and the header,
   and a consumer value replaces all of them.

3. **A prop that feeds a hook writes an internal `-default` carrier** (`columns`
   → `--_list-columns-default`), read as the hook's fallback:
   `var(--list-columns, var(--_list-columns-default, <built-in>))`. Props set
   inline styles, which beat any class; the indirection is what keeps a consumer
   class — `max-sm:list-cols-[…]` — winning over the prop, which is the whole
   responsive story. Carriers are per-instance prop state, so the stylesheet
   resets them to `initial` at every component root: an outer list's `columns`,
   `selectable` or `rowHeight` must never leak into a nested list that omitted
   the prop. Public hooks are exempt from the reset — crossing boundaries is
   their purpose.

4. **Structural rules a consumer may override are wrapped in `:where()`** (zero
   specificity) so any consumer class wins regardless of stylesheet order.
   Attribute-level specificity is allowed only where an element reset must be
   beaten (Tailwind preflight's `button { padding: 0 }`), with a comment saying
   so.

5. **Hooks are pure paint; behavior stays in props.** `columns` also flips the
   divider default and `rowHeight` also feeds `virtual` windowing, so they are
   props; `--list-gap` moves pixels only, so it is a hook. A knob that would
   desync behavior when set from CSS (a per-breakpoint row height under
   virtualization) must not become a hook.

6. **Each hook gets preset sugar** in the Tailwind plugin: a spacing-scale
   utility when the value space has a meaningful scale (`list-gap-*`,
   `list-row-px-*`), arbitrary-only when it does not (`list-cols-[…]`). Sugar
   and raw `[--var:…]` classes hit the same var.

7. **No `@property` registration.** Registration is global and takes a single
   `initial-value`, which cannot express per-context fallbacks like the row
   inset's `0.75rem`/`0` split; the guaranteed-invalid → fallback behavior of
   unregistered properties is the mechanism rule 2 depends on.

## Considered alternatives

**Prefixed hooks (`--fui-list-gap`)**, Radix-style. Collision-proof against
app-defined vars, but inconsistent with the unprefixed token namespace the
preset already claims, and the names stop matching the sugar utilities.
Rejected; hook names are documented and reserved instead.

**Defaults declared on the component root** (the original implementation:
`:where([data-slot='list']) { --list-columns: var(--list-columns-default, …) }`).
Kept the prop indirection but silently shadowed ancestor values, so `--list-gap`
was themeable from a wrapper while `--list-columns` was not — an asymmetry that
would have frozen. Rejected for use-site fallbacks.

**Props for everything, no vars.** Symmetric with the rest of the API, but a
prop cannot vary by breakpoint or container without JS, and shared-geometry
knobs are exactly the ones apps set responsively (collapse a table to a feed on
mobile). Rejected.

## Consequences

- The list family's public hooks are `--list-columns`, `--list-gap` and
  `--list-row-padding-x`, plus the sugar `list-cols-[…]`, `list-gap-*`,
  `list-row-px-*`. This is the entire v1 CSS-var contract.
- `--list-columns-default`, `--list-checkbox-width` and `--list-row-height` are
  renamed `--_list-columns-default`, `--_list-checkbox-width` and
  `--_list-row-height`: the first two were always carriers, and row height is
  the `rowHeight` prop's job (rule 5), so none of the three is API.
- Ancestor theming works uniformly for all three hooks, and reaches nested lists
  in the subtree — inheritance is the feature, so that is by design. It also
  means an outer hook value overrides a nested `List`'s own `columns` prop
  (hooks beat props, wherever the hook comes from); the opt-out is
  `[--list-columns:initial]` on the inner list. The `--_list-*` carriers, by
  contrast, reset at each list root, so an outer list's props never leak into a
  nested list.
- `--list-row-padding-x` reaches every row: interactive rows re-declare the
  carrier with their `0.75rem` fallback, static rows carry it at a flush `0`
  default, and the header reads the hook directly — one declared value lands on
  all of them.
- `List.cy.ts` pins the contract: hook beats prop, ancestor values apply, the
  dual inset default across row kinds, carrier containment in nested lists, the
  ancestor-hook-overrides-inner-prop rule with its `initial` opt-out, and
  preflight not eating button-row padding.
- Future families expose CSS knobs only through this shape.
