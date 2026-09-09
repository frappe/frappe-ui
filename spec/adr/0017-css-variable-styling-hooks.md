# CSS variable styling hooks

**Status**: accepted

## Context

Every refactored component exposes `data-slot` / `data-state` attributes so an
app can target its elements from CSS. Those hooks restyle _an element_. They
cannot express geometry that several elements must agree on: the column template
a `ListHeader` and every `ListRow` share, or the inline inset that keeps header
labels aligned with row content. Custom properties are the CSS mechanism for a
value declared once and read in many places, so the list family
(`frappe-ui/list`) ships the library's first component-level CSS variables, some
public and some internal — and whatever conventions it ships freeze at `1.0.0`
and set the pattern every later family will copy.

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

3. **A prop's value rides an internal carrier**, reset to `initial` at every
   component root and read through a use-site fallback:
   `var(--_list-columns, <built-in>)`. Carriers are per-instance prop state, so
   the reset is what stops an outer list's `columns`, `selectable` or
   `rowHeight` leaking into a nested list that omitted the prop — `initial` is
   the guaranteed-invalid value, so a root that set nothing lands on the
   built-in default instead of the inherited value. Public hooks are exempt from
   the reset — crossing boundaries is their purpose.

   A knob that must vary by breakpoint stays a prop and gets a **carrier per
   breakpoint**. `columns` writes `--_list-columns-base`,
   `--_list-columns-md`, … inline; the Tailwind plugin reads the app's resolved
   `theme('screens')` and generates the reset, plus one media rule per screen
   that copies that screen's carrier into a `--_list-tier-<screen>` var. A
   `var()` fallback chain on the root then picks the highest tier that is live,
   down to `base`. Each rule carries the same media condition Tailwind's own
   variant for that screen carries, so a tier is live exactly where that
   screen's utilities are: a `{ min, max }` screen takes its tracks off where
   it takes `md:hidden` off, and a `{ max }` or `{ raw }` screen works at all.
   Outside its screen a tier is guaranteed-invalid, which is what lets a tier
   end — the ladder is not assumed to be min-width only. This is what lets a
   prop be responsive without JS, and it is generated rather than shipped in
   the family's static stylesheet because the breakpoint names and widths
   belong to the consuming app. Generated rules use bare attribute specificity, because the source order
   of a package stylesheet and the app's Tailwind base layer is not something
   either file can control (see rule 4).

4. **Structural rules a consumer may override are wrapped in `:where()`** (zero
   specificity) so any consumer class wins regardless of stylesheet order.
   Attribute-level specificity is allowed only where another rule must be beaten
   and order cannot be relied on — Tailwind preflight's `button { padding: 0 }`,
   and the plugin's generated breakpoint rules over the package stylesheet's
   `:where()` copy of the base tier — with a comment saying so.

5. **Hooks are pure paint; behavior stays in props.** `columns` also flips the
   divider default and `rowHeight` also feeds `virtual` windowing, so they are
   props; `--list-gap` moves pixels only, so it is a hook. A knob that would
   desync behavior when set from CSS (a per-breakpoint row height under
   virtualization) must not become a hook.

   A knob that several components in one family must agree on, and that each
   instance must own, is also a prop rather than a hook. Hooks inherit, and
   inheritance is wrong for shared geometry a nested instance has to be able to
   restate — `columns` is the case that decided this.

6. **Each hook gets preset sugar** in the Tailwind plugin: a spacing-scale
   utility when the value space has a meaningful scale (`list-gap-*`,
   `list-row-px-*`), arbitrary-only when it does not. Sugar and raw `[--var:…]`
   classes hit the same var.

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
`:where([data-slot='list']) { --list-gap: var(--list-gap-default, …) }`).
Silently shadows ancestor values, which defeats the point of a hook. Rejected
for use-site fallbacks. Carriers are the opposite case: a declaration on the
root is exactly what a carrier needs, because per-instance state must not
inherit.

**Props for everything, no vars.** Symmetric with the rest of the API. Rejected
for `--list-gap` and `--list-row-padding-x`, which apps want to theme across a
subtree from one declaration.

**A public `--list-columns` hook, settable from any ancestor** (this ADR's
original decision, with `list-cols-[…]` as its sugar). It gave responsive
columns before the prop could express them, and the `--_list-columns-default`
carrier indirection existed so a consumer class would beat the prop. But hooks
inherit, so an ancestor's value silently overrode a nested list's own `columns`
prop, with `[--list-columns:initial]` as the opt-out — a nested list could not
be relied on to keep its own template. Rejected once `columns` grew the
breakpoint object: the responsive story no longer needs a hook, and each list
owning its grid is worth more than themeable columns. The var and the utility
are gone; the resolved template is internal.

**Client-side breakpoint resolution** — a resize observer or `matchMedia` in
`List`, picking the tier in JS. It would read the app's breakpoints from a
config import rather than from CSS, put a viewport measurement on the critical
path, and render the wrong template in SSR markup until hydration. Rejected for
generated media rules.

## Consequences

- The list family's public hooks are `--list-gap` and `--list-row-padding-x`,
  plus the sugar `list-gap-*` and `list-row-px-*`. This is the entire v1 CSS-var
  contract.
- `--list-columns`, `--list-columns-default`, `--list-checkbox-width` and
  `--list-row-height` are internal: `--_list-columns` (plus one
  `--_list-columns-<breakpoint>` carrier per tier and one generated
  `--_list-tier-<screen>`), `--_list-checkbox-width` and
  `--_list-row-height`. Column templates come from the `columns` prop alone; row
  height is the `rowHeight` prop's job (rule 5).
- Ancestor theming works uniformly for both hooks, and reaches nested lists in
  the subtree — inheritance is the feature for gap and inset, so that is by
  design. The `--_list-*` carriers reset at each list root, so an outer list's
  props never leak into a nested list. Because columns now ride carriers, every
  `List` owns its own grid: a nested list keeps its own `columns`, or the
  default feed template when it has none.
- `--list-row-padding-x` reaches every row: interactive rows re-declare the
  carrier with their `0.75rem` fallback, static rows carry it at a flush `0`
  default, and the header reads the hook directly — one declared value lands on
  all of them.
- `List.cy.ts` pins the contract: ancestor hook values apply while the `columns`
  prop stays the only source of the template, the dual inset default across row
  kinds, carrier containment in nested lists, preflight not eating button-row
  padding, and the responsive ladder below/at/above each breakpoint with its
  three nesting combinations. `tailwind/listColumns.test.js` pins the generated
  rules against custom screens, and `List.ssr.test.ts` pins the server markup.
- Future families expose CSS knobs only through this shape.
