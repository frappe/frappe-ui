# v1 resources are exempt from the TypeScript at-bar item, permanently

**Status**: accepted

## Context

[#886](https://github.com/frappe/frappe-ui/issues/886) settled the data API export
posture for `1.0.0`: v1 resources ship **supported, un-deprecated, and with no
changes to their internal implementation code**. The census behind that call,
counted per the map's rule 5 against freshly fetched remote refs: **344 call sites
across 204 files**, in helpdesk, crm, builder, `frappe/frappe`'s `ui/` package, and
insights. v1 is not a legacy tier by any measure available at the tag — it is what
five of six consumers actually run, at roughly 2.6× v2's call-site count.

[At-bar](../at-bar.md) item 0 says a "keep" call means items 1–9 all have to be
true. Item 1 requires `<script setup lang="ts">`. `resources.js`, `listResource.js`
and `documentResource.js` are hand-written JavaScript with hand-written `.d.ts`
files, and rewriting them to TypeScript is off the table for this release — not
deferred, not split into a follow-up ticket, **permanently false by decision**.
That is a standing violation of item 1 that at-bar's own rules do not have a slot
for: the checklist's N/A column excuses an item when it does not apply (a
composable has no story because stories are not a component concept), not when it
applies and the answer is "no, and it never will without a separate, larger
decision to rewrite this code."

ADR-0011 was explicit that the bar does not bend for a family that cannot reach
it: split the remainder into new tickets, or un-export the member. Neither fits
here. Splitting implies the TypeScript rewrite is coming later; it deliberately
is not — rewriting 884 lines of production-load-bearing state-machine code carries
real regression risk for a change that buys nothing at 344 call sites, none of
which need a type system to keep working. Un-exporting fails rule 9 in the other
direction: this is the opposite of a dead export.

So the exception needs writing down, not inferring. Nine sweep tickets are still
open on the map; without a named exception, each one that meets an inconvenient
item is free to argue "v1 resources got a pass, so can I" by analogy. This ADR is
the boundary that argument runs into.

## Decision

**Item 1 of the at-bar checklist is permanently false for exactly these eleven
exports**, and that is accepted rather than fixed:

- `createResource`, `createListResource`, `createDocumentResource`
- `getCachedResource`, `getCachedListResource`, `getCachedDocumentResource`
- `resourcesPlugin`
- `saveLocal`, `getLocal`, `deleteLocal`
- `onDocUpdate`

`resources.js`, `listResource.js` and `documentResource.js` stay `.js`, with their
existing hand-written `.d.ts` files, through `1.x`. `plugin.js` stays `.js` too;
`local.ts`, `realtime.ts` and `socketAccess.ts` are already TypeScript and are not
part of this exception.

**Reasoning:**

- **Already frozen in practice.** 344 production call sites across five apps are
  running this exact implementation today. A "keep" call under rule 2 freezes the
  *API* until `2.0.0` regardless of item 1; the code freezing too changes nothing
  those call sites can observe.
- **Any change is riskier than the freeze.** A TypeScript rewrite of a
  reactive-state factory this size (977 lines across `resources.js`,
  `listResource.js`, `documentResource.js` and `plugin.js`), exercised this hard
  in production, has more
  ways to introduce a behavioral regression than it has ways to help — there is no
  type error today reaching 344 call sites that a `.d.ts` file doesn't already
  catch at the call site.
- **The audit this exception permits produces a document, not a change.** Item 6's
  P1–P15 review runs read-only against this code — see the ticket-934 audit posted
  on the issue — specifically so that reaching bar doesn't quietly become "and now
  fix what the audit finds."

**This grants nothing else.** It is not a general rule that a high call-site count
exempts an export from the at-bar checklist — under that reading, `ListView`
(also widely used, also not fully modernized) would clear the same bar for the
same reason, and that is not the intent. The exception is scoped to these eleven
names, for this one item, because of the specific finding above: the call sites
are the *reason* the code is frozen, not a size threshold that waives review.
Every other at-bar item — types.ts-equivalent coverage via the `.d.ts` files,
tests, docs, stories (N/A — not components), the P1–P15 audit, the
zero-`@deprecated` check, `defineExpose` (N/A), and the changelog/migration
requirement — still applies and is discharged normally.

**The boundary drawn on implementation code:**

- **Out, until `2.0.0`:** renames, signature changes, and additions. An added
  method or option is frozen the moment it ships, exactly like a renamed one —
  ADR-0012 made the same finding for the template-ref surface. There is no
  "it's just additive" carve-out here either.
- **In, during `1.x`:** tests and docs — neither touches implementation.
- **In, during `1.x`:** bug fixes. Frozen means the *API* is frozen, not the file.
  A fix that changes behavior without changing the exported shape is still
  allowed; a fix that would require a rename, a new option, or a different return
  shape is not — that is a `2.0.0` change wearing a bug-fix label.

## Consequences

- `resources.js`, `listResource.js`, `documentResource.js` and `plugin.js` do not
  gain `<script setup lang="ts">` or a generated `types.ts` for `1.0.0`, or ever,
  short of a future ADR that reopens this one.
- `listResource.js` gained test coverage
  ([`listResource.test.ts`](../../src/resources/listResource.test.ts)) under this
  ADR's "tests are in" line — the file has no implementation changes, only new
  test cases.
- A future sweep that wants a TypeScript rewrite of v1 resources needs a new ADR
  that supersedes this one, not a citation of "the v1 resources exception."
- Nothing here changes the deprecation status decided in #886: these exports stay
  un-deprecated and supported through `1.x`.
