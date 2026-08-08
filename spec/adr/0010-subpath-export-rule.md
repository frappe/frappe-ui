# What earns a subpath export vs. the root export

**Status**: accepted

## Context

`frappe-ui` ships a root export plus subpaths — `experimental`, `frappe`, `editor`,
`list`, `code-editor`, `drive`, `icons`, `tailwind`, `vite`, `vitepress`, and the
`*-style.css` entries — with no written rule for which surface a thing belongs on.
ADR-0004 gave one reason after the fact ("isolated heavy dependency and/or large
colliding export surface"), but it doesn't hold today: `frappe-ui/list` has no heavy
dependency, and root already carries heavy ones (`echarts` via the chart components,
`socket.io-client` via the v1 resources' realtime helpers — `initSocket` was the
example when this was written, and #927 has since removed it — all of TipTap via the
deprecated `TextEditor` re-export). Without a generative rule, every new family
invents its own answer and
the split reads as accident rather than design — a problem that gets worse, not
better, once `1.0.0` freezes whatever exists.

## Decision

**Root is the default.** A subpath is earned only by one of three things:

**(a) Cost isolation.** It statically pulls a third-party dependency, or ships a CSS
side effect, that root must not impose on every consumer. "Statically" is load-bearing:
a dependency reached only through `await import()` is already isolated at the call site
and needs no subpath.

**(b) Extensible registry.** Consumers can add a *new kind* of member the library never
defined — a custom TipTap extension, a custom menu item — with no change on the library
side. A component with props and slots is not this, however complex it is inside.
Assembling a fixed set of named parts into a layout (however many parts, however deep
the nesting) is also not this — it's how most of this library is composed, and it
doesn't discriminate: `SettingsDialog`, `PageHeader`, `Sidebar`, and the legacy
`ListView` all show the same pattern and none of them earns a subpath by it.

**(c) Name collision.** Its export names collide with root's, or would as root grows.

**Explicitly not a reason:** part count, file count, or organization/discoverability
alone. A subpath is a permanent packaging decision — once exported at `1.0.0` it is
frozen until `2.0.0` (ADR-0008's reasoning, applied to the whole surface) — so
"it would read better organized" doesn't clear the bar. Grouping by domain is the
docs' job, not the module graph's. Concretely: **root staying the default means
`SettingsDialog`, `PageHeader`/`PageHeaderMobile`, `Sidebar`, and the legacy
`ListView` family all stay at root and freeze there.** Because a subpath is no longer
available later as a way to reorganize them, getting their names and shapes right
before the tag matters more, not less — that responsibility passes to each family's
own sweep ticket.

Build-time and tooling entries (`tailwind`, `vite`, `vitepress`,
`tsconfig.base.json`) aren't runtime code and aren't judged by these three limbs at
all — they aren't importable into a component tree in the first place. They're a
separate category, decided on their own terms.

### Applied to the export surface as it stands

| Subpath | Limb(s) | Notes |
| --- | --- | --- |
| `frappe-ui/editor` | a + b + c | Static TipTap; open extension/menu registry (ADR-0004); `ListItem` and others already collide with root names. |
| `frappe-ui/list` | c | `List`, `ListHeader`, `ListRow`, `ListRows` collide with the legacy `ListView` family, which stays at root undeprecated until it reaches parity. This is sufficient for `1.0.0` on its own; it does not need a second reason. If `ListView` is ever removed, whether `list` still earns a subpath is a fresh decision for that moment, not one to pre-answer now. |
| `frappe-ui/icons` | a | `spritePlugin` statically imports the full `lucide-static` sprite; `IconPicker` reads the injected sprite DOM. Holds only while `spritePlugin` ships — a smaller cleanup (rewire `IconPicker` to the tailwind plugin's build-time icon list, delete `spritePlugin` and the duplicate `Icon.vue`) would remove the only static dependency in the subpath and fold it into root. |
| `frappe-ui/charts` (in flight, #890) | a | Statically imports `echarts/core`. Rule-compliant as designed. |
| `frappe-ui/experimental` | P14 | Its own rule; not judged by these limbs. Now also home to `CodeEditor` and `CodePreview` (see below). |
| `frappe-ui/code-editor` | none | Removed. `CodeEditor`'s only dependency (CodeMirror) is entirely behind `await import()` — nothing static. It is a form-field sibling of `Textarea`/`TextInput` (its own prop types are derived from the shared `InputVariant`/`InputSize` union), not a family with a composition model. `CodePreview` statically imports `marked`, which would otherwise re-enter root's dependency graph the moment ADR-0008 deletes the deprecated `TextEditor` re-export (`marked`'s only other path to root). Rather than fold `CodeEditor` into root and leave `CodePreview` behind on a single-purpose subpath, both move to `frappe-ui/experimental` together — P14 carries no stability promise, so the pair can grow into a fuller code-editing parts family later, against real usage, without needing a `2.0.0`. |
| `frappe-ui/frappe`, `frappe-ui/drive`, `frappe-ui/drive/*` | — | Disposition is #867's decision, not this rule's. |
| `frappe-ui/tailwind`, `frappe-ui/tailwind/tokens.js`, `frappe-ui/vite`, `frappe-ui/vitepress`, `frappe-ui/tsconfig.base.json`, `frappe-ui/hljs-theme.css` | — | Build-time/tooling category; #887's decision. |

### What this hands to other tickets

- **#870** (root-surface audit): `dayjs`/`dayjsLocal` (→ `dayjs/esm` + 3 plugins) is a
  static dependency that trips limb (a) and cannot stay at root as-is. `initSocket`
  (→ `socket.io-client`) was the other one; #927 resolved it by deleting the export
  outright rather than re-homing it, so limb (a) has nothing left to answer for there.
  `socket.io-client` still appears in `resources/realtime.ts`, which exports functions
  typed against its `Socket`, but only in type position — it is erased at build and is
  not a static dependency under this rule. `frappe-ui/utils` is not the fix — sorting the
  non-component root exports found only two genuinely generic, dependency-free
  functions (`debounce`, `fileToBase64`); everything else is either a component's own
  API misplaced at the top level, or belongs to the data-fetching subsystem. Each
  flagged export needs its own disposition (un-export, re-home with its real owner,
  or move with the data layer), not a shared bucket.
- **#885** (charts / `GridLayout`): the *old* chart components (`AxisChart`, `ECharts`,
  `DonutChart`, `FunnelChart`, `NumberChart`) and `GridLayout` statically import
  `echarts` and `grid-layout-plus` respectively — limb (a) says they cannot stay at
  root as-is. `frappe-ui/charts` (#890) already ships the v2 replacement correctly
  isolated; the old family and `GridLayout` need the same treatment (lazy-load,
  subpath, or un-export) once #890 lands.
- **#886** (data API export posture): `idb-keyval` is imported only by
  `src/data-fetching/`, nowhere else in the library — the data layer already trips
  limb (a) on its own, independent of any stylistic argument for a `frappe-ui/data`
  subpath.
- **#867** (`frappe-ui/frappe` removal): 84 call sites across crm (51), helpdesk (14),
  insights (7), and builder (12) on freshly fetched `upstream` refs — the largest
  subpath dependency of any app.
- **#872** (overlays sweep): `NestedPopover` is the only file in the library that
  imports `@popperjs/core`, and one of three still on `@headlessui/vue`. It has 13
  downstream call sites (crm 3, helpdesk 10) despite not actually supporting nested
  popovers — it's a plain popper-positioned popover with a legacy name. Removing it
  drops a dependency outright.
- **#878** (app shell sweep): confirms app-shell stays at root (no dependency, no CSS
  side effect, no collision under this rule) — the `PageHeader`/`DesktopHeader` and
  `PageHeaderMobile`/`MobileHeader` rename is that ticket's execution, not this one's.
- **#884** (editor sweep): confirms `frappe-ui/editor` is rule-compliant on all three
  limbs and flags the concrete collision (`ListItem`, among others) for the deprecated
  `TextEditor` removal to close out.
- **#887** (build-time subpaths): `code-editor`'s disposition is decided here (moves to
  `experimental`, not a build-time subpath). The icon cleanup this rule identified —
  remove `spritePlugin`, rewire `IconPicker` off the sprite DOM to the tailwind
  plugin's build-time name list, delete the duplicate `icons/Icon.vue` — is filed
  separately (see below) rather than folded into this ticket's build-tooling scope,
  since it's a component/API question that happens to touch a build plugin, not
  build-tooling itself.

## Considered alternatives

- **Namespace the whole library** (root holds only primitives; every cohesive domain —
  app-shell, inputs, overlays, data — gets a subpath). Rejected for `1.0.0`: partial
  namespacing is worse than either extreme (a consumer can no longer predict where
  anything lives), and full namespacing is a breaking rewrite of every import in five
  apps that would need its own map and would slip the tag. Adding a subpath later is
  additive and legal under P13; removing a root export is not. Deferring costs
  nothing; taking the option now spends it permanently on the least evidence this
  effort will ever have.
- **A size/part-count threshold** ("more parts than root's largest family earns a
  subpath"). Rejected: tested against every compound family at root — `ListView` (13
  parts), `SettingsDialog` (9), `PageHeader` (7), `Sidebar` (6) — and found no line
  that separates `SettingsDialog` from `frappe-ui/list` (8 parts) without either
  emptying root or admitting the threshold is arbitrary.
- **A documented-public-CSS-custom-properties clause**, added to explain why
  `frappe-ui/list` should stand independent of its collision with `ListView`.
  Rejected: "is it documented" is a property of whether someone wrote a comment, not
  of the code's architecture — two components with identical designs could get
  different verdicts based on incidental documentation. `list`'s collision with
  `ListView` is sufficient justification on its own for `1.0.0`; inventing a second,
  weaker limb to pre-answer what happens if `ListView` is removed someday charts fog
  this map doesn't need to chart yet.

## Consequences

- Every subpath's disposition is now derived from a written test, not repo
  archaeology — a new family's authors can apply P15 themselves instead of
  re-litigating the question.
- `frappe-ui/code-editor` is removed as a subpath; `CodeEditor`, `CodePreview`, and
  `loadLanguage` move to `frappe-ui/experimental`. No downstream app imports
  `frappe-ui/code-editor` today (checked against freshly fetched `upstream` refs for
  crm, helpdesk, insights, builder, gameplan, raven), so this is a zero-call-site
  move, not a break.
- `frappe-ui/list`, `frappe-ui/icons`, and the in-flight `frappe-ui/charts` all stand
  on this rule without needing a carve-out.
- Root keeps `SettingsDialog`, `PageHeader`, `Sidebar`, and the legacy `ListView`
  family. Their naming now carries the full weight of being permanent — each
  family's own sweep ticket (#878, #879, #882, and a `SettingsDialog` naming pass not
  yet ticketed) is where that gets settled before the tag, not here.
