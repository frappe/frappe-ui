# Real-world component usage audit

## Scope

- Audited real app usage under `~/Projects/frappe-bench/apps/`, prioritizing frontend app code over stories/tests/docs.
- Focused on:
  - `Dropdown`
  - `Select`
  - `Combobox`
  - `MultiSelect`
  - `Autocomplete`
  - adjacent option-list / picker patterns where apps clearly built around the same needs
- Main app clusters inspected:
  - `helpdesk/desk/src`
  - `insights/frontend/src`
  - `insights/frontend/src2`
  - `gameplan/frontend/src`
  - `crm/frontend/src`
  - `drive/frontend/src`
  - `builder/frontend/src`
  - `meet/frontend/src`
  - `slides/frontend/src`
  - `hrms/frontend/src`
  - `frappe_calendar/frontend/src`
- Also inspected a few real app-local wrappers/custom controls where they are used in production app code, because they reveal what the shared library is missing or what patterns already work well.

## Apps and files inspected

Representative files inspected:

- **Helpdesk**
  - `helpdesk/desk/src/components/Settings/Agents.vue`
  - `helpdesk/desk/src/components/Settings/SavedReplies/SavedRepliesList.vue`
  - `helpdesk/desk/src/components/ViewBreadcrumbs.vue`
  - `helpdesk/desk/src/components/frappe-ui/Link.vue`
  - `helpdesk/desk/src/components/frappe-ui/Autocomplete.vue`
  - `helpdesk/desk/src/components/ticket-agent/AssignToBody.vue`
  - `helpdesk/desk/src/components/SearchComplete.vue`
  - `helpdesk/desk/src/components/Settings/SavedReplies/SavedReplyView.vue`
  - `helpdesk/desk/src/pages/knowledge-base/Article.vue`

- **Insights**
  - `insights/frontend/src/query/ChartTypeSelector.vue`
  - `insights/frontend/src/query/QueryDataSourceSelector.vue`
  - `insights/frontend/src/query/visual/FilterEditor.vue`
  - `insights/frontend/src/widgets/Table/TableOptions.vue`
  - `insights/frontend/src/widgets/AxisChart/AxisChartOptions.vue`
  - `insights/frontend/src/components/ShareDialog.vue`
  - `insights/frontend/src2/query/components/JoinSelectorDialog.vue`
  - `insights/frontend/src2/data_store/ImportTableDialog.vue`

- **Gameplan**
  - `gameplan/frontend/src/components/UserDropdown.vue`
  - `gameplan/frontend/src/components/NewSpaceDialog.vue`
  - `gameplan/frontend/src/components/NewTaskDialog/NewTaskDialog.vue`
  - `gameplan/frontend/src/components/MultiSelect.vue`
  - `gameplan/frontend/src/pages/Search.vue`
  - `gameplan/frontend/src/components/Settings/InvitePeople.vue`
  - `gameplan/frontend/src/pages/People.vue`

- **CRM**
  - `crm/frontend/src/components/Controls/Link.vue`
  - `crm/frontend/src/components/NewLead.vue`
  - `crm/frontend/src/components/Modals/TaskModal.vue`
  - `crm/frontend/src/components/Modals/ContactModal.vue`

- **Drive**
  - `drive/frontend/src/components/UsersBar.vue`
  - `drive/frontend/src/components/ShareDialog/ShareDialog.vue`
  - `drive/frontend/src/pages/Document.vue`
  - `drive/frontend/src/components/DocEditor/components/FontFamily.vue`

- **Builder / Meet / Slides / HRMS / Calendar**
  - `builder/frontend/src/components/PageActionsDropdown.vue`
  - `builder/frontend/src/components/PageClientScriptManager.vue`
  - `meet/frontend/src/components/settings/DeviceSettingsTab.vue`
  - `meet/frontend/src/components/FloatingControls.vue`
  - `slides/frontend/src/components/TextProperties.vue`
  - `slides/frontend/src/components/SlideProperties.vue`
  - `hrms/frontend/src/components/Link.vue`
  - `frappe_calendar/frontend/src/components/EventEdit.vue`

## Findings by component

### Dropdown

**What it is used for**
- By far the dominant menu/action primitive.
- Used mostly for action menus, not value selection.
- Common option shape is already very consistent: `label`, `icon`, `onClick`, plus occasional `group`, `hideLabel`, `submenu`, `switch`, `component`, `condition`.

**Default vs custom rendering**
- **Mostly default rendering** for standard action menus:
  - `insights/frontend/src/query/QueryMenu.vue`
  - `meet/frontend/src/components/FloatingControls.vue`
  - `builder/frontend/src/components/PageActionsDropdown.vue`
  - `gameplan/frontend/src/components/NewTaskDialog/NewTaskDialog.vue`
- **Custom rendering appears when the item needs more than label + icon**:
  - checkmarks
  - avatars / secondary text
  - nested row actions
  - destructive full-width button rows

**Customization patterns found**
- Trigger customization is common:
  - `#default` / slot `{ open }` used to rotate chevrons or style the trigger
  - examples:
    - `helpdesk/desk/src/components/Settings/Agents.vue`
    - `gameplan/frontend/src/components/UserDropdown.vue`
    - `builder/frontend/src/components/DashboardSidebar.vue`
- Full item replacement via `#item`:
  - `helpdesk/desk/src/components/Settings/Agents.vue`
  - `helpdesk/desk/src/components/Settings/SavedReplies/SavedRepliesList.vue`
  - `helpdesk/desk/src/components/ViewBreadcrumbs.vue`
  - `drive/frontend/src/components/UsersBar.vue`
- Escape hatch via `item.component`:
  - `helpdesk/desk/src/pages/knowledge-base/Article.vue` uses `component: h(Button, ...)` for delete
  - `gameplan/frontend/src/components/UserDropdown.vue` uses submenu `component: markRaw(AppSelector)`
- Advanced option schema really is used:
  - `submenu`: `gameplan/frontend/src/components/UserDropdown.vue`, `builder/frontend/src/components/DashboardSidebar.vue`, `drive/frontend/src/pages/Document.vue`
  - `switch`: `drive/frontend/src/pages/Document.vue`

**Main takeaway**
- `Dropdown` is useful and widely adopted.
- Its biggest weakness is item customization: once consumers need anything beyond the stock row, they often have to take over the whole row shell.

---

### Select

**What it is used for**
- Low-to-moderate usage.
- Mostly narrow, static enums:
  - status/type/scope/sort choices
  - examples:
    - `helpdesk/desk/src/pages/call-logs/CallLogModal.vue`
    - `slides/frontend/src/components/TextProperties.vue`
    - `slides/frontend/src/components/SlideProperties.vue`
    - `gameplan/frontend/src/pages/People.vue`

**Default vs custom rendering**
- **Almost entirely default rendering.**
- Only one clear real-world custom option rendering case stood out:
  - `helpdesk/desk/src/components/Settings/SavedReplies/SavedReplyView.vue`

**Customization patterns found**
- Trigger `#prefix` is common:
  - icons before selected value in `gameplan/frontend/src/pages/People.vue`
  - `helpdesk/desk/src/components/Settings/SavedReplies/SavedReplyView.vue`
- Option customization is rare, but where used it is relatively clean:
  - `helpdesk/desk/src/components/Settings/SavedReplies/SavedReplyView.vue`
  - consumer only renders icon + label inside `#option`
  - the component still owns the row shell/hover/selection styling

**Main takeaway**
- Real usage supports keeping `Select` small and boring.
- It is not where teams are asking for deep rendering flexibility.
- Its current customization style is better than `Dropdown` because the shell remains component-owned.

---

### Combobox

**What it is used for**
- Direct use is **much lighter** than `Autocomplete`.
- Real direct usage is mostly:
  - simple searchable single-selects
  - lower-level/primitive usage
  - component internals
- Examples:
  - `gameplan/frontend/src/components/NewTaskDialog/NewTaskDialog.vue`
  - `helpdesk/desk/src/components/Settings/FieldDependency/FieldDependencyFieldsSelection.vue`
  - `drive/frontend/src/components/DocEditor/components/FontFamily.vue`

**Default vs custom rendering**
- Direct app usage is mostly default/plain.
- The notable real-world advanced case:
  - `gameplan/frontend/src/components/NewSpaceDialog.vue`
    - uses `type: 'custom'`
    - `slotName: 'create-new'`
    - custom “Add New Category” row

**Customization patterns found**
- Per-option custom schema (`type: 'custom'`, `slotName`) exists, but I found only one strong real app usage.
- I did **not** find meaningful real app usage of Combobox `render` as a public customization pattern.
- Richer flows still drop to raw headless comboboxes instead of the higher-level component:
  - `drive/frontend/src/components/ShareDialog/ShareDialog.vue`
  - `gameplan/frontend/src/components/InputWithPills.vue`
  - `helpdesk/desk/src/components/Settings/Assignment Rules/AssigneeSearch.vue`

**Main takeaway**
- `Combobox` looks more like a lower-level primitive today.
- The per-option `slotName` / `render` model is real, but not strongly validated by usage.

---

### MultiSelect

**What it is used for**
- Surprisingly light direct usage in the shared component surface.
- Main-library-style usage found mostly in simple cases:
  - `helpdesk/desk/src/components/Settings/SavedReplies/SavedReplyView.vue`
  - `insights/frontend/src2/query/components/JoinSelectorDialog.vue`

**Default vs custom rendering**
- In the audited real usages, **almost all MultiSelect usage is default**.
- I did not find meaningful real-world customization of MultiSelect item rendering in app code.

**Adjacent patterns that matter**
- When apps need richer multi-select behavior, they often do **not** use the shared `MultiSelect`:
  - `gameplan/frontend/src/components/MultiSelect.vue`
    - grouped options
    - avatars/icons/counts
    - owned shell
    - used in:
      - `gameplan/frontend/src/pages/Search.vue`
      - `gameplan/frontend/src/components/Settings/InvitePeople.vue`
  - `helpdesk/desk/src/pages/desk/contact/ContactDialog.vue`
    - uses local `@/components/MultiSelect.vue` for tag-like email/phone entry (`v-model:items`)

**Main takeaway**
- Current shared `MultiSelect` seems underpowered for richer real-world needs.
- Apps needing grouped/visual/rich multi-pick behavior are building local alternatives.

---

### Autocomplete

**What it is used for**
- This is the most heavily used search-based selection API in real apps.
- Especially dominant in:
  - `insights/frontend/src`
  - `insights/frontend/src2`
  - Helpdesk/CRM/HRMS wrappers for remote link/search fields

**Default vs custom rendering**
- **Mostly default item rendering**, with light customization.
- Common customizations are:
  - custom trigger/target
  - `item-prefix`
  - `item-suffix`
  - app-local wrappers adding `item-label`

**Customization patterns found**
- Good shell-owned customization pattern already exists here:
  - `insights/frontend/src/query/ChartTypeSelector.vue`
    - custom target
    - `#item-prefix`
    - `#item-suffix`
  - `meet/frontend/src/components/settings/DeviceSettingsTab.vue`
    - `FormControl type="autocomplete"` with `#item-prefix` checkmark
  - `helpdesk/desk/src/components/frappe-ui/Link.vue`
  - `crm/frontend/src/components/Controls/Link.vue`
    - wrappers standardize `#item-prefix` + `#item-label` without giving up row shell
- `@update:query` is a real dependency:
  - `helpdesk/desk/src/components/SearchComplete.vue`
  - `insights/frontend/src/query/visual/FilterEditor.vue`
  - `hrms/frontend/src/components/Link.vue`
- One app already tries controlled query:
  - `insights/frontend/src2/data_store/ImportTableDialog.vue` uses `v-model:query`

**Main takeaway**
- `Autocomplete` already points to the best customization model in this audit:
  - component owns the row shell
  - consumer customizes sub-parts
- It also has the strongest real demand for async/query-aware behavior.

## Customization patterns found

1. **Default option/item rendering dominates**
   - especially for `Select`
   - also for most `Dropdown` menus and many `Autocomplete` pickers

2. **Trigger customization is common**
   - `Dropdown` uses slot `{ open }`
   - `Autocomplete` often uses `#target`
   - open state is commonly used to rotate chevrons or style active triggers

3. **Shell-owned sub-slot customization works well**
   - best examples:
     - `Autocomplete` `#item-prefix` / `#item-suffix`
     - Helpdesk/CRM wrappers with `#item-prefix` / `#item-label`
     - `Select` `#option` content while row shell remains internal

4. **Whole-row replacement is mainly a `Dropdown` problem**
   - `#item` is used when consumers need:
     - checkmarks
     - avatars
     - descriptions
     - nested row actions
   - this leads to duplicated spacing/hover/row-state classes

5. **Per-option custom schema exists but is weakly validated**
   - `slotName`: real use found in `gameplan/frontend/src/components/NewSpaceDialog.vue`
   - `render`: no meaningful real app usage found in audited consumer code
   - `item.component`: used as an escape hatch, not as the dominant pattern

6. **Async search wrappers are duplicated across apps**
   - Helpdesk, CRM, and HRMS all have local link/search wrappers built around `Autocomplete` + `@update:query`

7. **Richer multi-select/people-picker use cases often bypass shared components**
   - Gameplan local `MultiSelect`
   - Drive raw headless `Combobox` people picker

## Pain points and inconsistencies

1. **Dropdown is the biggest outlier**
   - For customized rows, consumers often have to rebuild:
     - row layout
     - hover styling
     - spacing
     - icon alignment
     - selected/check affordances
   - clear examples:
     - `helpdesk/desk/src/components/Settings/Agents.vue`
     - `helpdesk/desk/src/components/ViewBreadcrumbs.vue`
     - `drive/frontend/src/components/UsersBar.vue`

2. **Autocomplete and Combobox overlap is real**
   - Older/established app code heavily uses `Autocomplete`
   - newer or lower-level work increasingly uses `Combobox`
   - both occupy similar search-select territory, but with different APIs and customization models

3. **Trigger slot vocabulary is inconsistent**
   - `Dropdown`: default slot / `v-slot`
   - `Autocomplete`: `#target`
   - `Select`: mostly `#prefix` / `#suffix`, no comparable trigger pattern
   - same family of components, different trigger customization language

4. **Query behavior is important, but controlled query is not yet clearly standard**
   - `@update:query` is clearly useful and actively used
   - `v-model:query` appears only in isolated usage
   - that argues for “query stays internal for now” more than for immediate full controlled-query API

5. **App teams are re-solving the same picker problems**
   - Helpdesk / CRM / HRMS all have their own link/search wrappers
   - Gameplan has its own richer MultiSelect
   - Drive drops to raw headless Combobox for people sharing

## Suggested unified direction

1. **Keep the components separate**
   - Real usage supports distinct roles for:
     - `Dropdown` = action menus
     - `Select` = small static choice lists
     - `Combobox` = searchable choice primitive
     - `MultiSelect` = multi-choice picker
   - Do **not** collapse these into one giant do-everything component.

2. **Standardize on a shell-owned item customization model**
   - Make the component own:
     - row shell
     - spacing
     - hover/active/selected/disabled states
     - selection affordance region
   - Expose consistent sub-slots instead:
     - `item-prefix`
     - `item-content` or `item-label`
     - `item-suffix`
     - `empty`
     - `footer`
   - This is the clearest “good pattern” already validated by `Autocomplete` and the Helpdesk/CRM link wrappers.

3. **Treat full item takeover as an escape hatch, not the primary API**
   - `#item`, `item.component`, per-option `render`, per-option `slotName` should remain advanced escape hatches
   - They should not be the default story for item customization

4. **Unify searchable selection around one canonical mental model**
   - If `Combobox` is the chosen canonical public name, keep `Autocomplete` as a compatibility wrapper / migration layer for a while
   - Real apps already depend heavily on `Autocomplete`; abrupt renaming would fight existing usage

5. **Make `Dropdown` follow the same item-slot philosophy as searchable pickers**
   - This is the highest-value cleanup
   - It would remove the current need to duplicate row-shell classes just to add a checkmark/avatar/suffix action

6. **Support advanced open state consistently**
   - Exposing `v-model:open` on `Select` / `Combobox` is compatible with real usage
   - consumers frequently care about open state for trigger styling already

7. **Keep query internal, but keep/standardize query events**
   - `update:query` is clearly useful today
   - `v-model:query` can wait until demand is stronger

8. **Add strong styling hooks**
   - `data-slot`
   - `data-state`
   - `data-size`
   - `data-variant`
   - especially on trigger and item shells
   - this would let consumers style without replacing structure

## Concrete examples

- `helpdesk/desk/src/components/Settings/Agents.vue`  
  `Dropdown` uses `#item` just to add a trailing checkmark. The row shell (`flex`, spacing, hover bg, alignment) is duplicated in app code.

- `helpdesk/desk/src/components/Settings/SavedReplies/SavedRepliesList.vue`  
  Same `Dropdown #item` pattern as above; another signal that the library should own the row shell.

- `helpdesk/desk/src/components/ViewBreadcrumbs.vue`  
  `Dropdown #item` duplicates icon layout and embeds a nested secondary dropdown for per-view actions.

- `drive/frontend/src/components/UsersBar.vue`  
  `Dropdown #item` fully customizes a user row with avatar, secondary text, and color indicator; again the consumer owns the shell.

- `helpdesk/desk/src/pages/knowledge-base/Article.vue`  
  Uses `component: h(Button, ...)` inside dropdown options for a destructive full-width delete row. Good escape hatch, but clearly exceptional.

- `gameplan/frontend/src/components/UserDropdown.vue`  
  Uses grouped dropdown items, submenus, and a submenu `component` (`AppSelector`). Shows that advanced menu schemas are real, but still special-case.

- `helpdesk/desk/src/components/Settings/SavedReplies/SavedReplyView.vue`  
  `Select` uses `#option` to add an icon next to the label, while the component still owns the option shell. This is a better customization model.

- `insights/frontend/src/query/ChartTypeSelector.vue`  
  `Autocomplete` uses custom trigger + `#item-prefix` + `#item-suffix` for icon/checkmark rendering without rebuilding the row shell.

- `meet/frontend/src/components/settings/DeviceSettingsTab.vue`  
  `FormControl type="autocomplete"` uses `#item-prefix` for selected checkmarks. Small customization, no shell duplication.

- `helpdesk/desk/src/components/frappe-ui/Link.vue`  
  Wrapper around `Autocomplete` that standardizes:
  - remote loading
  - `@update:query`
  - `#item-prefix`
  - `#item-label`
  - footer actions  
  CRM and HRMS have near-equivalent patterns:
  - `crm/frontend/src/components/Controls/Link.vue`
  - `hrms/frontend/src/components/Link.vue`

- `gameplan/frontend/src/components/NewSpaceDialog.vue`  
  Direct `Combobox` custom row via `type: 'custom'` + `slotName: 'create-new'`. Real, but rare.

- `drive/frontend/src/components/ShareDialog/ShareDialog.vue`  
  Uses raw `@headlessui/vue` `Combobox` directly for a richer people picker with chips/avatars. Strong evidence that high-level shared components do not yet cover this use case well.

- `gameplan/frontend/src/components/MultiSelect.vue`  
  Local richer MultiSelect owns the shell and supports grouped options, avatars, icons, counts, and compact selected summaries. Used in:
  - `gameplan/frontend/src/pages/Search.vue`
  - `gameplan/frontend/src/components/Settings/InvitePeople.vue`

- `insights/frontend/src2/data_store/ImportTableDialog.vue`  
  Uses `v-model:query` on `Autocomplete`. This is the one notable sign of controlled-query demand, but it is not yet widespread.

## Recommendation for next API design pass

1. **Fix `Dropdown` item customization first.**  
   Standardize a shell-owned item API with shared sub-slots. This is the clearest current pain point.

2. **Pick the canonical searchable-select story.**  
   Make `Combobox` the canonical API if that is the direction, but keep `Autocomplete` as a compatibility layer because real apps still use it heavily.

3. **Standardize slot vocabulary across the family.**  
   Aim for shared concepts across `Dropdown`, `Select`, `Combobox`, `MultiSelect`:
   - trigger/target
   - item-prefix
   - item-label/content
   - item-suffix
   - empty
   - footer

4. **Keep full custom rendering as an escape hatch only.**  
   Do not center the API around `slotName`, `render`, or `item.component`.

5. **Keep query internal for now.**  
   Preserve `update:query`; defer official `v-model:query` until more real demand appears.

6. **Decide whether richer multi-pickers deserve a separate component.**  
   Real apps want grouped/avatar/icon-rich multi-select behavior, but they are building separate components for it. That likely deserves either:
   - a richer `MultiSelect`, or
   - a separate dedicated picker, not a bloated base `MultiSelect`.

7. **Add `data-*` styling hooks on owned shells.**  
   This will reduce the need for consumers to replace markup just to change classes.