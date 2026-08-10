# What "at bar for `1.0.0`" means

**Status**: accepted

## Context

The [Road to `frappe-ui` 1.0.0](https://github.com/frappe/frappe-ui/issues/864) map cuts
the export surface into fourteen sweep tickets. Each one ends by claiming its family is
"at bar". Nothing defined that phrase, so fourteen tickets shared a definition of done that
did not exist.

`v1-release/plan.md` came closest: core components must be "implemented in TypeScript,
implemented with `<script setup>`, documented, covered by baseline stories, covered by
baseline component tests, audited for API consistency and stability". That list predates the
map. It does not cover the keep-or-un-export call, the docs-accuracy check, the
`@deprecated` sweep, or the `defineExpose` surface, and every item on it is stated loosely
enough that two people would answer it differently.

The cost of that ambiguity is asymmetric. An export reviewed to a bar that turns out to be
too low is frozen until `2.0.0` (ADR-0008's reasoning). An export held to a bar that turns
out to be too high costs one session.

## Decision

The checklist lives in [`at-bar.md`](../at-bar.md). This ADR records the choices behind it
and the alternatives rejected.

### The unit is the public export

Not the directory, not the family. This follows the map's Rule 2 directly: the thing that
freezes at `1.0.0` is the thing a consumer can import, so that is the thing that must be
reviewed or removed.

It was tempting to expect this to shrink the sweep by dropping internal-only directories.
It does not. Tracing the export graph from every entry point, only `Menu/` and `types/` are
unreachable; `Provider`, `ScrollArea`, and `CommandPalette` are all exported,
and `InputLabeling/` and `shared/` export types. **An exported type freezes like any other
member**, which is a consequence worth stating plainly rather than a saving.

The unit was chosen for correctness, not economy. Choosing the family instead would have
let each sweeper draw their own line around internal code — the exact incomparability the
checklist exists to remove.

### One tier, with written N/A rules

The originating ticket asked whether each item is "required to tag" or "nice to have".
Rejected: a nice-to-have item is a "ships but unreviewed" parking spot under a friendlier
name, and it is the first thing dropped under deadline. Rule 2 forbids that spot.

Instead every item is required, and each carries a written rule for when it does not apply.
A composable has no story because stories do not apply to composables, not because a story
was optional and someone was busy. The record distinguishes the two.

### Tests are five named behaviors, not a file and not a percentage

A `.cy.ts` existing is the current de-facto bar and it means almost nothing: those files
range from 5 test cases to 29. Two alternatives were considered.

**A coverage floor** was rejected despite the tooling already existing
(`test:cypress:coverage`, `.github/scripts/merge-coverage.ts`). A component can reach a high
line-coverage number with no keyboard test at all, so it does not deliver what P12 needs,
and it becomes the arbitrary thing that blocks the tag on a slow week.

**Five named behaviors** — renders, `v-model` round-trip, disabled and loading, P12 keyboard
and focus, every documented slot renders — were chosen because each is a yes or no, and
because the list makes P12 enforceable for the first time.

### The audit is recorded as a P1–P15 verdict list; carve-outs go in `PHILOSOPHY.md`

Recording only the violations was rejected: with no record of a pass, there is no evidence a
principle was ever checked, and the sweeps stay incomparable.

Giving every family a `spec/<family>.md` holding its full audit was rejected as too large an
addition — ten such files exist covering roughly six families, and writing eight more inside
the sweep would slow every ticket.

The split adopted matches `spec/README.md`'s own rule that specs hold the current contract
and ADRs hold rationale: the per-family result is evidence and lives on the ticket; a
carve-out is durable guidance and lives in `PHILOSOPHY.md` beside the principle it bends,
the way Button's `#icon` exception already does at P6 and P11.

### "Meaningfully" is replaced by the silent-break test

ADR-0008 requires a migration before/after "where the shape changed meaningfully". A
migration entry is now required whenever the break is **silent** — old code still compiles
and runs but behaves differently — and only a changelog line when the break is **loud**, so
the toolchain reports it.

Ticket [#868](https://github.com/frappe/frappe-ui/issues/868) supplied the evidence: on
`Autocomplete`, `items` → `options` for grouped options renders nothing with no error, and
`#target` → `#trigger` flips `open` from a function to a boolean. Those are the entries a
migration guide exists for. "This import no longer exists" is not.

### The bar does not bend

When a family cannot reach bar in one session, the sweeper splits it into new tickets on the
map, or un-exports the member that cannot get there. Allowing the bar to bend with a
recorded reason was rejected for the same reason two tiers were: it recreates the parking
spot.

## Consequences

- **`spec/imperative-api.md` must be signed off before checklist item 8 means anything.**
  It is `proposed`, so there is currently nothing to check against. That is a blocking
  ticket against the nine sweeps whose families contain a `defineExpose`.
- **The generated API tables need a CI check.** `yarn docs:gen` runs in no workflow, so
  `.api.md` files can drift from the source unnoticed. Without it, item 4 asks sweepers to
  hand-verify generated output, which is the wrong division of labour.
- **194 blank member descriptions get filled inside the sweeps**, along family lines,
  rather than as one pass.
- **Item 0 is real work on every sweep.** Keep-or-un-export was not on `plan.md`'s list, and
  it is the item most likely to change the shape of a family.
- **The bar applies after the tag too.** A component added during `1.x` meets the same list
  before it is exported.
