# Nothing marked `@deprecated` ships in `1.0.0`

**Status**: accepted

## Context

The selection family's earlier plan promised the opposite: keep every existing
public API exported and working through `1.x`, add the preferred API alongside
it, warn in dev, and move the old one out of the docs. The reasoning was that
bench apps already consumed these components and a break would strand them.

That reasoning assumed a stability promise that does not exist yet. The library
was on `1.0.0-beta.25` when this came up. No beta carries a compatibility
guarantee, so nothing deprecated was protected — but the moment `1.0.0` is
tagged, every deprecated member is locked in until the next major. Carrying
them across the tag would freeze a surface that was already judged wrong, for
years, to spare a migration that has to happen anyway.

## Decision

Every member and every component marked `@deprecated` is deleted before the
`1.0.0` tag. Neither individual props, slots, emits, and option fields, nor
whole components, survive it.

The sweep runs one component family at a time, each as its own change set. The
`1.0.0` tag waits for all of them.

The library-wide list of deprecated exports this applies to lives in
[`v1-release/deprecated-removals.md`](../../v1-release/deprecated-removals.md).
Member-level deprecations stay in each component's spec.

### Scope: the frozen surface only

This reaches every stable entry point. It does **not** reach
`frappe-ui/experimental`.

The reasoning above is entirely about the freeze: a deprecated member is
locked in until the next major *because the `1.0.0` tag makes it so*.
`frappe-ui/experimental` carries no stability promise (P14), so the tag freezes
nothing there and the argument does not apply. A deprecated export may park
there and stay deprecated.

Parking is therefore a third outcome alongside "delete" and "take to bar", and
it satisfies this ADR. `ThemeSwitcher` took it (#1094); the seven `@deprecated`
v0 `TextEditor` re-exports in `experimental/TextEditor/index.ts` already sit on
the same footing.

What parking does not buy is permanence. An export parked in `experimental` is
still on its way out, and removing it needs no major version.

## Consequences

- The last free window to remove things closes at `1.0.0`. Anything not
  removed by then is a major-version problem.
- Every removal needs a migration entry in the changelog and, where the shape
  changed meaningfully, a before/after example in the migration guide.
- Apps upgrading from a beta to `1.0.0` do real work. This is accepted: the
  alternative is that every app pays a smaller, permanent tax instead.
- Aliases stop being a tool. A rename is now a rename.
