# Checkpoint — List track (responsive columns)

Branch: `v1/rc-list`
Base: `main` @ `2d65281be8` + PR #1097 merged at `1380a431d3`.

Ticket: `v1-release/rc-implementation-handoff.md` §3 (untracked, owned by the
integration agent).

## Status

In progress. Design settled, implementation starting.

## Design

`columns` accepts `string[]` (unchanged) or `{ base, <screen>… }` where every
value is a complete track array.

Resolution is pure CSS, no JS viewport state:

1. `List.vue` writes one inline custom property per supplied breakpoint:
   `--_list-columns-base`, `--_list-columns-md`, … The array form is exactly
   `{ base: array }`.
2. The Tailwind plugin reads the *app's* resolved `theme('screens')` and emits,
   in `addBase`, a reset of every `--_list-columns-<screen>` on
   `[data-slot='list']` plus one `@media (min-width: …)` rule per screen in
   ascending order. Each rule assigns the resolved
   `--_list-columns: var(--_list-columns-<screen>, var(--_list-columns-<lower>, … var(--_list-columns-base)))`.
   Omitted breakpoints therefore fall through to the nearest lower supplied one.
3. Rows and the header read `grid-template-columns: var(--_list-columns, auto
   minmax(0,1fr) auto)`.

The reset on `[data-slot='list']` is what makes every List root own its
configuration, including roots with no `columns` prop: an unset carrier is
`initial` (guaranteed-invalid), so `--_list-columns` computes to the
guaranteed-invalid value on that root and the use-site fallback applies instead
of the ancestor's value.

Specificity note: the plugin's rules use `[data-slot='list']` (0,1,0) while
`style.css` keeps a `:where()` (0,0,0) base tier as a no-plugin fallback. The
two files' source order is not controllable in a consuming app, so the plugin
must win on specificity rather than on order.

## Open decisions taken

See "Revisions to #1097" below.

## Left to do

Everything.
