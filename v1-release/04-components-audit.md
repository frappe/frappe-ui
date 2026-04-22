# Components Audit

This is the first-pass audit for the agreed v1 core component set.

## Audit criteria

For each core component, v1 expects:

- TypeScript
- `<script setup>`
- baseline docs
- baseline stories
- baseline component tests
- stable public API audit

This document focuses on the structural audit baseline first. API quality
findings should be layered on top in follow-up passes.

## Core component audit matrix

| Component    | Primary file                                   | script setup |  TS | types.ts | stories | tests | docs | Notes                                                           |
| ------------ | ---------------------------------------------- | -----------: | --: | -------: | ------: | ----: | ---: | --------------------------------------------------------------- |
| Alert        | `src/components/Alert/Alert.vue`               |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Avatar       | `src/components/Avatar/Avatar.vue`             |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Badge        | `src/components/Badge/Badge.vue`               |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | API audit still needed                                          |
| Breadcrumbs  | `src/components/Breadcrumbs/Breadcrumbs.vue`   |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Button       | `src/components/Button/Button.vue`             |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Still uses internal `FeatherIcon`                               |
| Checkbox     | `src/components/Checkbox/Checkbox.vue`         |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Combobox     | `src/components/Combobox/Combobox.vue`         |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Part of critical selection cluster                              |
| DatePicker   | `src/components/DatePicker/DatePicker.vue`     |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| MonthPicker  | `src/components/MonthPicker/MonthPicker.vue`   |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| TimePicker   | `src/components/TimePicker/TimePicker.vue`     |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Dialog       | `src/components/Dialog/Dialog.vue`             |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Overlay/floating blocker                                        |
| Divider      | `src/components/Divider/Divider.vue`           |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Baseline coverage added; action mode semantics reviewed         |
| Dropdown     | `src/components/Dropdown/Dropdown.vue`         |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Part of critical selection/floating cluster                     |
| ErrorMessage | `src/components/ErrorMessage/ErrorMessage.vue` |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| FileUploader | `src/components/FileUploader/FileUploader.vue` |           ❌ |  ❌ |       ❌ |      ✅ |    ❌ |   ✅ | Legacy public component; modernization blocker                  |
| FormControl  | `src/components/FormControl/FormControl.vue`   |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Baseline present; part of critical selection/input cluster      |
| ListView     | `src/components/ListView/ListView.vue`         |           ✅ |  ❌ |       ❌ |      ✅ |    ❌ |   ✅ | Script setup but not TS; missing types/test baseline            |
| MultiSelect  | `src/components/MultiSelect/MultiSelect.vue`   |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Critical blocker                                                |
| Password     | `src/components/Password/Password.vue`         |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Depends on FormControl quality                                  |
| Popover      | `src/components/Popover/Popover.vue`           |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Overlay/floating blocker                                        |
| Progress     | `src/components/Progress/Progress.vue`         |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Rating       | `src/components/Rating/Rating.vue`             |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Still uses internal `FeatherIcon`                               |
| Select       | `src/components/Select/Select.vue`             |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Selection/floating cluster                                      |
| Sidebar      | `src/components/Sidebar/Sidebar.vue`           |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Slider       | `src/components/Slider/Slider.vue`             |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Baseline present                                                |
| Switch       | `src/components/Switch/Switch.vue`             |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Critical blocker; still uses internal `FeatherIcon`             |
| TabButtons   | `src/components/TabButtons/TabButtons.vue`     |           ❌ |  ❌ |       ❌ |      ✅ |    ❌ |   ✅ | Legacy public component; modernization blocker                  |
| Tabs         | `src/components/Tabs/Tabs.vue`                 |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| TextEditor   | `src/components/TextEditor/TextEditor.vue`     |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Public component baseline exists; internals still need refactor |
| TextInput    | `src/components/TextInput/TextInput.vue`       |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Textarea     | `src/components/Textarea/Textarea.vue`         |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Baseline present                                                |
| Toast        | `src/components/Toast/Toast.vue`               |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Baseline coverage added in this pass                            |
| Tooltip      | `src/components/Tooltip/Tooltip.vue`           |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Good baseline                                                   |
| Tree         | `src/components/Tree/Tree.vue`                 |           ✅ |  ✅ |       ✅ |      ✅ |    ✅ |   ✅ | Still uses internal `FeatherIcon`                               |

## Highest-priority structural gaps

These are the most obvious blockers against the agreed v1 component standard.

### 1. Legacy public components that are not yet on TS + `<script setup>`

- FileUploader
- TabButtons

These need modernization before they can satisfy the v1 bar.

### 2. Public core components still missing TypeScript baseline

- ListView

This component is already on `<script setup>` but is still not on TypeScript and
does not expose a typed component baseline.

### 3. Public core components missing baseline stories / tests / docs

#### Missing docs

- None in the current core set

#### Missing stories

- None in the current core set

#### Missing tests

- FileUploader
- ListView
- TabButtons

### 4. Public core components missing `types.ts`

- FileUploader
- ListView
- TabButtons

### 5. Core components still using internal `FeatherIcon`

At minimum confirmed in:

- Button
- Rating
- Switch
- Tree

There are likely more usages across related components and internals. This needs
a broader removal pass as part of the v1 deprecation strategy.

## TextEditor-specific note

`TextEditor` itself has the outer baseline, but several internal editor
subcomponents still use legacy patterns. The editor should therefore be treated
as:

- structurally present enough to document/test now
- still requiring dedicated internal refactor work before v1

This matches the agreed plan: stabilize and simplify, but do not expand scope.
Detailed editor-specific v1 decisions now live in [`plan.md`](./plan.md).

## Selection/input family note

The following components should be audited together, not independently:

- Combobox
- Dropdown
- Select
- MultiSelect
- FormControl
- Switch
- TabButtons
- deprecated Autocomplete
- deprecated Input

This cluster has overlapping responsibilities and should be treated as a single
API stabilization workstream.

## Recommended execution order for the audit

## Wave 1 — structural blockers

Address the components that clearly fail the baseline standard:

- FileUploader
- TabButtons
- ListView

### Target outcomes

- TS + `<script setup>` where missing
- `types.ts` where missing
- baseline stories
- baseline tests
- baseline docs where missing

## Wave 2 — critical component clusters

Audit and stabilize together:

- Dialog / Popover / Dropdown / Select / Combobox
- FormControl / Switch / MultiSelect / TabButtons
- deprecations: Input / Autocomplete / FeatherIcon usage

## Wave 3 — TextEditor stabilization

See [`plan.md`](./plan.md).

- simplify structure
- identify duplicated code
- migrate remaining internals that still use legacy patterns
- stabilize public API boundaries
- implement the default-off policy for font family and font size

## Wave 4 — consistency pass across the rest of core

After the hard blockers are removed:

- align size/variant/placement patterns
- align slot/emits naming
- verify docs/stories/tests remain representative of the frozen API

## Follow-up audit tasks

Use [`plan.md`](./plan.md) for the agreed broad v1 direction, and
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) for
the selection/menu family-specific API pass.

This first pass does **not** yet answer:

- which components have API inconsistencies that should block v1
- which props/events/slots need renaming or deprecation
- which stories are too weak to count as meaningful coverage
- which tests are too shallow for their component complexity

Recommended next audit passes:

1. API consistency audit
2. deprecation audit
3. docs quality audit
4. test-depth audit

## Source notes

This audit is based on the current repository structure and presence/absence of
the agreed baseline artifacts, not on a full semantic review of each component
implementation.
