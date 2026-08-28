# The `1.0.0` at-bar checklist

Status: **accepted**. Rationale in [ADR-0011](./adr/0011-at-bar-checklist.md).

Every sweep ticket on the [Road to `frappe-ui` 1.0.0](https://github.com/frappe/frappe-ui/issues/864)
map ends by claiming a family is "at bar". This is what that claim means. One list,
applied the same way by everyone, so two people auditing two different families
produce comparable results.

## What the bar applies to

**A public export** — anything a consumer can `import` from `frappe-ui` or one of its
subpaths. Not a directory, not a file.

This follows the map's Rule 2: exported at `1.0.0` means frozen until `2.0.0`, so every
export is either reviewed to bar or removed before the tag. Code a consumer cannot reach
is internal, carries no freeze, and needs nothing from this list.

In practice that is almost everything. Of the 73 directories under `src/components`, only
`Menu/` and `types/` contribute nothing to any entry point. Two more —
`InputLabeling/` and `shared/` — export types but no components, so items 1, 3, 4, 5
and 8 are N/A for them and items 0, 2, 6, 7 and 9 still apply. **An exported type is
public surface and freezes like any other member.**

Non-component exports (composables, utilities, plugins) are in scope with a shorter
list; the N/A column says which items drop.

## The checklist

Items run **in order**. Item 0 gates the rest.

### Item 0 — keep or un-export

Record an explicit call for every export in the family. There is no third answer and no
"decide later" — that is the parking spot Rule 2 exists to forbid.

If the call is **remove**, stop. Items 1–9 do not apply. Discharge it the way the map's
Rule 3 requires: delete the export, write the migration-guide entry, and file an issue on
each affected app's repo. The tag does not wait on those apps.

If the call is **keep**, everything below has to be true.

### Items 1–9

| # | Item | Not applicable when |
| --- | --- | --- |
| 1 | Implemented in TypeScript with `<script setup lang="ts">` | the export is not a component |
| 2 | A `types.ts` exporting the prop, emit and slot types | the export is not a component |
| 3 | Component tests covering the [five behaviors](#item-3-the-five-behaviors) | per-behavior, see below |
| 4 | A `<Name>.md` page; every prop, slot and emit has a non-empty description; the prose and examples are true | non-component exports document on the utilities, composables or subpath page instead — no colocated page, no playground |
| 5 | At least one file under `stories/` | the export is not a component |
| 6 | Audited against `PHILOSOPHY.md`, [recorded as below](#item-6-recording-the-audit) | never |
| 7 | Zero `@deprecated` members ([ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md)) | never |
| 8 | Every exposed member conforms to [`imperative-api.md`](./imperative-api.md) and is typed | the export exposes nothing |
| 9 | A changelog line, and a migration before/after when the [break is silent](#item-9-silent-vs-loud-breaks) | nothing was removed or renamed |

Item 8 counts `defineExpose` **and** setup-context `expose()`. Both reach the same
surface, and a census that greps only for `defineExpose` misses the other: `Button`
moved to `expose()` in `8b4aa3c43`, seven weeks before ADR-0012 was written, so its
`rootRef` survived the sweep that should have caught it (#1094 item 3).

An item is either **done** or **written down as N/A**. It is never skipped. If you find
yourself wanting to skip one, you have hit the [out-of-session rule](#when-a-family-cannot-reach-bar-in-one-session).

## Item 3: the five behaviors

A `.cy.ts` file existing is not the bar — today those files range from 5 cases
(`Tabs`) to 29 (`Select`), which is exactly the incomparability this document exists to
remove. The bar is five named behaviors, each a yes or no:

1. **Renders** with default props.
2. **`v-model` round-trip** — a value set by the parent shows up, and a change inside
   emits back. *N/A when the export holds no value.*
3. **Disabled and loading** states behave. *N/A when the export has neither.*
4. **Keyboard and focus** behavior required by P12 — tab order, the focus ring, whatever
   keyboard interaction the component's role implies.
5. **Every slot the docs page names** actually renders content passed to it.

Deliberately not a coverage percentage. A component can reach 80% line coverage with no
keyboard test at all, which is precisely the check P12 needs.

## Item 4: docs

The props, slots and emits tables are generated from the source by
`docs/scripts/propsgen.ts` into `<Name>.api.md`. Nobody writes them by hand, so "does the
table list every prop" is not a reviewer's job.

Two things are:

- **Descriptions.** The generator emits an empty description cell when the source carries
  no JSDoc. As of writing, **194 of 953 documented members ship with a blank description**.
  Filling a family's share of those is part of its sweep, not a separate pass.
- **Prose and examples.** The text around the table, and the playground and story code, has
  to describe what the component actually does now.

Table freshness is CI's job, not the sweeper's — `yarn docs:gen` currently runs in no
workflow, so the committed `.api.md` files can drift from the source silently. That job is
tracked separately; do not spend sweep time hand-checking generated tables.

## Item 6: recording the audit

Post a verdict list on the sweep ticket covering **P1–P15**, one line each, with one of
four verdicts:

- **pass** — the export already conforms.
- **fixed** — it did not; link the commit.
- **N/A** — the principle does not reach this export; say why in a few words.
- **carve-out** — a deliberate, permanent violation.

A carve-out is additionally written **into `PHILOSOPHY.md`, under the principle it bends**.
That is the existing convention, not a new one: Button's singular `#icon` slot is recorded
at P6 and again at P11, and P13 carries the accepted v1 carve-out list. After the tag, the
answer to "why is this API like this?" has to be findable next to the rule it breaks —
not in a closed issue.

## Item 9: silent vs loud breaks

ADR-0008 requires a changelog entry for every removal, and a migration guide before/after
"where the shape changed meaningfully". "Meaningfully" is the kind of judgment call this
document replaces.

**Every removal or rename gets a changelog line** in
[`changelog.md`](../docs/content/docs/changelog.md).

**A before/after in [`migration.md`](../docs/content/docs/migration.md) is required when
the break is silent** — old code still compiles and runs, but behaves differently:

- a renamed field inside an options object (`items` → `options` on grouped options quietly
  renders nothing)
- a prop or slot prop whose type changed (`#target` → `#trigger` also flips `open` from a
  function to a boolean)
- a default that changed

**A loud break needs only the changelog line.** If the consumer's build, type-check or
import fails, the toolchain already tells them, and a before/after adds noise to a guide
that is 559 lines already.

When in doubt about which one you have: if you can break it without the compiler noticing,
it is silent.

## When a family cannot reach bar in one session

**The bar does not bend.** A bent bar means an export ships unreviewed and frozen until
`2.0.0`, which is the thing Rule 2 forbids. There are two honest exits:

1. **Split.** Cut the remainder into new child tickets on the map and wire the blocking
   edges, so what is left is visible on the frontier rather than lost in a closed ticket.
2. **Remove.** If a member cannot reach bar at all and splitting will not help, un-export
   it — the Rule 2 escape valve, discharged the Rule 3 way.

Both are recorded. Neither is a failure; a sweep that honestly splits is worth more than
one that quietly lowers the bar.

## After `1.0.0`

The bar outlives the tag. A new component added during `1.x` meets the same list before it
is exported — the freeze window closes at `1.0.0`, so anything shipped after it is
committed for even longer.
