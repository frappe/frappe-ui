# Removing `Autocomplete`

Pending work. `Autocomplete` is replaced by `Combobox` for single selection and
`MultiSelect` for multiple. It warns on mount today and, under
[ADR-0008](../spec/adr/0008-no-deprecated-members-in-1-0-0.md), is deleted
before `1.0.0` rather than carried through `1.x`.

This is the largest item in that sweep and the only one with a blocking
internal dependency.

## frappe-ui uses it itself

Two internal call sites must migrate before the component can go:

| File | Usage |
| --- | --- |
| `src/components/ListFilter/ListFilter.vue` | 3 usages, imports `AutocompleteOption` |
| `src/components/ListFilter/SearchComplete.vue` | 1 usage, imports `Option` from `Autocomplete/types` |

Both use `Autocomplete` as a remote-search picker — exactly the case `Combobox`
has to cover well. Migrating them is the real proof that `Combobox` is a
sufficient replacement, so do them first. Any gap they expose is an additive
fix to `Combobox`.

(`frappe/DataImport/MappingStep.vue` also uses it, but everything under
`frappe/` is superseded by `framework/ui` in the frappe repo. It needs deleting
with the rest of that folder, not migrating.)

`FormControl type="autocomplete"` goes at the same time. Removing it narrows
`FormControl`'s `type` union — a second breaking change — and lets
`Autocomplete/deprecationKey.ts` and the `provide()` in `FormControl.vue`
disappear with it.

## External call sites

Verified counts of genuine `import { Autocomplete } from 'frappe-ui'`:

| App | Live call sites |
| --- | --- |
| insights | ~83 across 48 files, globally registered |
| helpdesk | ~3 |
| crm | 1 |
| builder, frappe core, gameplan, meet, raven, erpnext | 0 |

Earlier grep-based counts of ~93 files were wrong: they counted vendored forks
and local look-alikes as live consumers.

insights is roughly 95% of the migration. Everything else is four call sites.
Any plan for removing `Autocomplete` is really a plan for migrating insights.

## insights is not fully analysed

Two targeted sweeps of insights have run. Option value types came back clean
(all strings plus one number). Search-box control turned up `:hideSearch="true"`
on two call sites, which is why `Combobox` gained `hideSearch`.

That is two questions answered, not ~83 call sites read. Two passes aimed at
API gaps found two gaps, which suggests more are there.

**Do not set a removal date until insights' call sites have been read.** Start
with `insights/frontend/src/components/ListFilter/ListFilter.vue` and
`.../SearchComplete.vue` — they share names with frappe-ui's own remote-search
consumers above, which is where the `filterable` gap surfaced.

## Before deletion

- migrate `ListFilter.vue` and `SearchComplete.vue`, and fix whatever gaps that
  exposes
- read insights' call sites and record what would block them
- remove `type="autocomplete"` from `FormControl`
- publish a migration guide with side-by-side examples for the common shapes:
  single, multiple, grouped options, remote search, `#target` → `#trigger`
- delete `src/components/Autocomplete/` and its root export
