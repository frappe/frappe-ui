# Selection and Menu API RFC

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the intended public API direction for:

- `ItemList`
- `ItemListRow`
- `Dropdown`
- `Select`
- `Combobox`
- `MultiSelect`

It is based on:

- the v1 component philosophy
- the real-world usage audit in [`research/07-real-world-component-usage-audit.md`](./research/07-real-world-component-usage-audit.md)
- the decision to prefer higher-level components with props and slots over publicly exposing compound primitive families

This RFC is meant to guide v1 implementation and cleanup. It does not authorize breaking removals in `1.0.0`.

## Decision summary

- add `ItemList` as the shared styled list surface for option and menu rows
- add `ItemListRow` as the shared row shell for item rendering
- keep `Dropdown`, `Select`, `Combobox`, and `MultiSelect` as separate higher-level components with clear boundaries
- treat `Dropdown` as an action menu, not as the generic value picker
- standardize on shell-owned item customization
- standardize slot vocabulary around `#trigger`, `#item-prefix`, `#item-label`, `#item-suffix`, `#empty`, and `#footer`
- support `v-model:open` across the family
- keep query internal for now, but standardize on `@update:query`
- keep older APIs working in v1.x, but move weaker customization patterns out of the happy path
- keep `onClick` and `condition` as canonical naming where they already match library convention

## Goals

- keep these components separate and narrowly scoped
- make app usage easier and more consistent
- avoid breaking existing apps during `1.x`
- aggressively deprecate awkward customization APIs when a better replacement exists
- standardize slot vocabulary, state vocabulary, and styling hooks
- keep the component shell responsible for spacing, hover, selected, disabled, and layout states
- reuse one styled list foundation across selection and menu components instead of duplicating row markup and classes

## Non-goals

- collapsing all pickers into a single do-everything component
- exposing a broad set of low-level primitive families as the primary public API
- removing legacy APIs immediately in v1
- solving every richer people-picker or chip-input use case inside the base `MultiSelect`

## Component responsibilities

These boundaries should stay clear.

- `ItemList` = the shared styled list surface for option and menu rows
- `ItemListRow` = the shared row shell for item rendering
- `Dropdown` = action menus
- `Select` = small static choice lists
- `Combobox` = searchable single-choice picker
- `MultiSelect` = searchable multi-choice picker

This means:

- `ItemList` is the reusable base layer, not the default recommendation for ordinary app code
- do not grow `Dropdown` into a value picker
- do not treat `Select` as the searchable story
- do not keep `Autocomplete` as the long-term canonical public API once `Combobox` and `MultiSelect` are good enough

## Shared design rules

### 1. State conventions

Across this family:

- primary value uses `v-model` / `modelValue`
- visibility uses `v-model:open`
- secondary state gets named models only when really needed

For v1:

- `Dropdown` should support `v-model:open`
- `Select` should support `v-model:open`
- `Combobox` should support `v-model:open`
- `MultiSelect` should support `v-model:open`
- query stays internal for now
- searchable components may emit `update:query`, but should not require `v-model:query`

### 2. Trigger customization vocabulary

Use one advanced trigger slot name across this family where a trigger exists:

- `#trigger`

`ItemList` itself does not need a trigger. It is the content/list layer.

Slot props should be component-specific but predictable. At minimum:

- `open`
- `disabled`

Where relevant, also expose:

- `selectedOption`
- `selectedOptions`
- `displayValue`
- `toggleOpen`
- `close`

Compatibility aliases can remain:

- `Dropdown` keeps its current default slot behavior for v1.x
- `Select`, `Combobox`, and `MultiSelect` can keep convenience slots like `#prefix` and `#suffix`

But the documented advanced vocabulary should move toward `#trigger`.

### 3. Shell-owned item customization

This is the most important API decision.

`ItemList` should be the place where this shell is defined once and reused.

The component should own the item shell, including:

- spacing
- row height
- hover styling
- active styling
- selected styling
- disabled styling
- icon/check/suffix layout regions

Consumers should customize content through shared sub-slots instead of rebuilding the whole row.

Preferred shared item slots:

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`

Escape hatch:

- `#item`

`#item` should remain supported, but it should be clearly documented as an escape hatch because it forces the consumer to own the full row shell.

### 4. Styling hooks

Owned shells should expose stable hooks:

- `data-slot="trigger"`
- `data-slot="content"`
- `data-slot="item"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`
- `data-slot="empty"`
- `data-slot="footer"`

And state hooks where relevant:

- `data-state="open|closed"`
- `data-state="active|inactive"`
- `data-state="checked|unchecked"`
- `data-disabled`
- `data-variant`
- `data-size`

These hooks should reduce the need for shell replacement just to change classes.

### 5. Shared item object direction

The option model does not need to become identical across all four components, but it should converge where practical.

Common fields we should allow where they make sense:

```ts
{
  label: string
  value?: string | number | boolean
  disabled?: boolean
  icon?: string | Component
  description?: string
  slot?: string
}
```

Notes:

- `slot` should be the preferred field for alternate item rendering strategies
- `slot` should map to `#item-<slot>`
- old names like `slotName` should be deprecated in favor of `slot`

### 6. Escape hatches stay, but move out of the happy path

These remain supported in v1.x, but should be documented as advanced or deprecated depending on the component:

- direct `ItemList` usage for advanced cases

- full `#item` takeover
- per-item `component`
- per-item `render`
- old per-item custom slot fields like `slotName`

The better API should be:

- shell-owned rows
- focused sub-slots
- predictable state and styling hooks

### 7. Deprecation policy for this family

For v1.x:

- do not break existing public APIs
- add the new preferred APIs first
- keep older APIs exported and functioning
- add dev warnings where detection is practical and low-noise
- move older APIs out of the main docs path

Good candidates for deprecation warnings:

- `Combobox` custom items using `slotName`
- `Combobox` query listeners using `input` instead of `update:query`
- `Dropdown` items using `component` for ordinary row customization
- `Select` / `MultiSelect` usage of `#option` once `#item-label` exists

Harder-to-warn cases like `Dropdown #item` can be deprecated in docs first.

---

## ItemList proposed spec

### Role

`ItemList` is the shared styled list surface for menu rows and option rows.

It should be used internally by:

- `Dropdown`
- `Select`
- `Combobox`
- `MultiSelect`

It should also be usable directly by app authors for advanced cases where the higher-level components do not fit, but where they should still get the default row styling, spacing, states, and slots for free.

`ItemListRow` is the shared row component used by `ItemList` and by the higher-level components when they need the standard row shell.

### Why it should exist

Right now the same row shell is being reimplemented in multiple places:

- dropdown item rows
- select option rows
- combobox result rows
- multi-select rows
- app-local wrappers and custom pickers

That creates drift in:

- spacing
- icon alignment
- checkmark placement
- hover and active states
- disabled states
- empty states
- footer layout

`ItemList` and `ItemListRow` should centralize that UI layer.

### Scope

`ItemList` is not responsible for:

- trigger rendering
- popover/dropdown positioning
- search input behavior
- fetching data
- form semantics
- routing semantics

It is responsible for:

- rendering grouped and ungrouped lists
- row shell styling
- empty state region
- footer region
- selected/active/disabled visual states
- shared row slots and styling hooks
- optionally basic keyboard list navigation if that can be shared cleanly

`ItemListRow` is responsible for the single-row shell:

- spacing
- alignment
- prefix / label / suffix regions
- hover / active / selected / disabled presentation
- row-level styling hooks

### Public API direction

`ItemList` should be a public advanced component, but not the primary thing we push new users toward.

`ItemListRow` should also be public for advanced composition cases, but it is even more of a power-user API than `ItemList`.

The recommended order should be:

1. use `Dropdown`, `Select`, `Combobox`, or `MultiSelect`
2. use `ItemList` when you need a custom trigger/search/container arrangement but still want the shared list UI layer
3. use `ItemListRow` only when you need to compose the standard row shell yourself

### Proposed props

At a minimum:

```ts
interface ItemListItem {
  label?: string
  value?: string | number | boolean
  icon?: string | Component
  description?: string
  disabled?: boolean
  selected?: boolean
  active?: boolean
  slot?: string
  [key: string]: any
}

interface ItemListGroup {
  group?: string
  hideLabel?: boolean
  items: ItemListItem[]
}

interface ItemListProps {
  items?: ItemListItem[]
  groups?: ItemListGroup[]
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'ghost'
  emptyText?: string
  showCheckmark?: boolean
}

interface ItemListRowProps {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'ghost'
  active?: boolean
  selected?: boolean
  disabled?: boolean
}
```

This does not need to be the exact final type shape, but the public API should stay focused on list rendering rather than becoming another full picker abstraction.

### Preferred slots

For `ItemList`:

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#item`
- `#empty`
- `#footer`
- `#group-label`

Named item slots should also work via:

- `item.slot` -> `#item-<slot>`

For `ItemListRow`:

- default slot for row content
- `#prefix`
- `#label`
- `#suffix`

### Styling hooks

At minimum:

- `data-slot="item-list"`
- `data-slot="group"`
- `data-slot="group-label"`
- `data-slot="item"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`
- `data-slot="empty"`
- `data-slot="footer"`
- `data-slot="item-list-row"`

And state hooks:

- `data-state="active|inactive"`
- `data-state="checked|unchecked"`
- `data-disabled`
- `data-size`
- `data-variant`

### Relationship to the higher-level components

- `Dropdown` should compose `ItemList` / `ItemListRow` for action rows
- `Select` should compose `ItemList` / `ItemListRow` for option rows
- `Combobox` should compose `ItemList` / `ItemListRow` for search results rows
- `MultiSelect` should compose `ItemList` / `ItemListRow` for multi-select option rows

This is the key architectural decision for this family.

### v1 stance

`ItemList` should be added in v1 as a generic foundation for this cluster.

`ItemListRow` should be added alongside it as the shared row shell component.

These are among the few lower-level public components that do make sense to expose directly, because:

- the styling is shared
- the structure is shared
- advanced app cases clearly exist
- app authors should not have to rebuild the shell to get the design system behavior

---

## Dropdown proposed spec

### Role

`Dropdown` is the action menu component.

It should continue to support:

- simple action lists
- grouped actions
- submenus
- switch/toggle rows
- route-based actions
- occasional advanced custom rows
- menu-style “choose one of a few actions” cases where the app marks the current choice

Important boundary:

- if the UI is semantically choosing a form value or picker value, use `Select`
- if the UI is a menu of actions or view/filter/sort modes and one is currently active, `Dropdown` is still acceptable

So `Dropdown` can support checkmarks and active menu items, but it should not become the generic replacement for `Select`.

### Keep supported in v1.x

Current API stays supported:

- `button`
- `options`
- `placement`
- `side`
- `offset`
- `portalTo`
- grouped items
- `submenu`
- `switch`
- `switchValue`
- `component`
- `#item`
- current default trigger slot behavior

### Add / prefer

#### Advanced state

- `v-model:open`

#### Preferred trigger API

- `#trigger` as the documented trigger slot
- keep the default slot as a compatibility alias in v1.x

#### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`

#### Option object additions

Add non-breaking fields to `DropdownOption` where useful:

```ts
{
  label: string
  icon?: string | Component | null
  description?: string
  selected?: boolean
  disabled?: boolean
  route?: RouteLocationRaw
  onClick?: (value?: boolean) => void
  submenu?: DropdownOptions
  switch?: boolean
  switchValue?: boolean
  component?: any
  slot?: string
}
```

`selected` should be a user-provided field, not internal `Dropdown` state.

Because `Dropdown` is an action menu, not a value component, it should not try to infer or own selected state. The app should decide which item is currently active, and the component should expose that normalized state back through slot props like `selected` so consumers do not have to repeat `item.selected` checks everywhere.

This is especially important because many current `Dropdown #item` usages only exist to render a trailing checkmark.

### Deprecate

Keep working, but deprecate for standard row customization:

- `#item` as the default recommendation
- `item.component` for ordinary row styling/customization

Keep as escape hatches:

- deeply custom rows
- destructive full-width special rows
- embedded app selectors or similar exceptional content

### Migration path

#### Old

```vue
<Dropdown :options="items">
  <template #item="{ item }">
    <button class="flex h-7 w-full items-center justify-between rounded px-2 hover:bg-surface-gray-3">
      <span>{{ item.label }}</span>
      <LucideCheck v-if="active === item.value" class="size-4" />
    </button>
  </template>
</Dropdown>
```

#### New

```vue
<Dropdown :options="items">
  <template #item-suffix="{ item }">
    <LucideCheck v-if="item.selected" class="size-4" />
  </template>
</Dropdown>
```

#### Old exceptional custom row

```ts
{
  label: 'Delete',
  component: h(Button, { ... })
}
```

#### v1.x stance

Still supported. Keep it for exceptional content, but do not recommend it for normal icon/label/check/suffix customization.

---

## Select proposed spec

### Role

`Select` is the simple single-choice picker for small static lists.

### Keep supported in v1.x

Current API stays supported:

- `v-model`
- `size`
- `variant`
- `placeholder`
- `disabled`
- `id`
- `options`
- `#prefix`
- `#suffix`
- `#option`
- `#footer`

### Add / prefer

#### Advanced state

- `v-model:open`

#### Preferred trigger API

- `#trigger` for advanced custom trigger use
- keep `#prefix` and `#suffix` as simple convenience slots

#### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`

#### Option shape expansion

Support a richer non-breaking option object:

```ts
{
  label: string
  value: string | number
  disabled?: boolean
  icon?: string | Component
  description?: string
  slot?: string
}
```

### Deprecate

- `#option` as the primary documented customization API once `#item-label` exists

`#option` can remain as an alias for `#item-label` through v1.x.

### Migration path

#### Old

```vue
<Select v-model="chartType" :options="options">
  <template #option="{ option }">
    <div class="flex items-center gap-2">
      <component :is="option.icon" class="size-4" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</Select>
```

#### New

```vue
<Select v-model="chartType" :options="options">
  <template #item-prefix="{ option }">
    <component :is="option.icon" class="size-4" />
  </template>

  <template #item-label="{ option }">
    {{ option.label }}
  </template>
</Select>
```

---

## Combobox proposed spec

### Role

`Combobox` is the canonical searchable single-choice picker.

It should become the recommended path for new searchable single-select work.

### Keep supported in v1.x

Current API stays supported:

- `v-model`
- `variant`
- `options`
- `placeholder`
- `disabled`
- `openOnFocus`
- `openOnClick`
- `placement`
- `allowCustomValue`
- `update:selectedOption`
- `focus`
- `blur`
- `input`
- `slotName`
- `render`
- `type: 'custom'`
- `#prefix`
- current dynamic slot behavior for custom items

### Add / prefer

#### Advanced state

- `v-model:open`

#### Query event

- `@update:query`

Keep `input` working as a compatibility alias in v1.x, but document `update:query` as the preferred event.

#### Preferred trigger API

- `#trigger`
- keep `#prefix` as a convenience slot

#### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`
- `#item` as the full takeover escape hatch

#### Preferred item schema

Simple selectable items can keep their current shape, but richer object items should converge on:

```ts
{
  label: string
  value: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
}
```

For custom action-style rows, keep the current capability and preserve the existing naming convention:

```ts
{
  type: 'custom'
  key: string
  label: string
  icon?: string | Component
  disabled?: boolean
  slot?: string
  onClick?: (context: { query: string }) => void
  keepOpen?: boolean
  condition?: (context: { query: string }) => boolean
  render?: () => VNode
}
```

Preferred change here should be limited to:

- `slot` over `slotName`

Keep these existing names as canonical because they already match broader library convention:

- `onClick`
- `condition`

Dynamic custom item slots should be namespaced as:

- `#item-<slot>`

### Deprecate

Keep working, but deprecate in favor of the new names only where the change is clearly worth it:

- `slotName`
- `input` for query updates
- `render` as the default customization story

`render` should remain an escape hatch only.

Do not deprecate:

- `onClick`
- `condition`

### Migration path

#### Old

```ts
{
  type: 'custom',
  key: 'create-new',
  label: 'Create new',
  slotName: 'create-new',
  onClick: ({ searchTerm }) => createItem(searchTerm),
  condition: ({ searchTerm }) => Boolean(searchTerm),
}
```

```vue
<Combobox v-model="value" :options="options">
  <template #create-new="{ option, searchTerm }">
    Create "{{ searchTerm }}"
  </template>
</Combobox>
```

#### New

```ts
{
  type: 'custom',
  key: 'create-new',
  label: 'Create new',
  slot: 'create-new',
  onClick: ({ query }) => createItem(query),
  condition: ({ query }) => Boolean(query),
}
```

```vue
<Combobox v-model="value" :options="options" @update:query="query = $event">
  <template #item-create-new="{ item, query }">
    Create "{{ query }}"
  </template>
</Combobox>
```

#### Query event migration

Old:

```vue
<Combobox @input="onQueryChange" />
```

New:

```vue
<Combobox @update:query="onQueryChange" />
```

---

## MultiSelect proposed spec

### Role

`MultiSelect` is the canonical searchable multi-choice picker.

It should stay narrower than a full people-picker or chips input, but it should inherit the same item-slot model as `Combobox` and `Select`.

### Keep supported in v1.x

Current API stays supported:

- `v-model`
- `placeholder`
- `options`
- `hideSearch`
- `loading`
- `compareFn`
- `#option`
- `#footer`

### Add / prefer

#### Advanced state

- `v-model:open`

#### Query event

- `@update:query`

Query should stay internal otherwise.

#### Preferred trigger API

- `#trigger`
- keep trigger convenience behavior built in by default

#### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`
- `#item` as the full takeover escape hatch

#### Option shape expansion

Support a richer non-breaking option object:

```ts
{
  label: string
  value: string
  disabled?: boolean
  icon?: string | Component
  description?: string
  slot?: string
}
```

Grouped options should also be supported so apps do not keep building richer local multi-select variants just for grouped pickers.

### Deprecate

- `#option` as the primary documented customization API once `#item-label` exists

Keep `#option` as an alias in v1.x.

### Migration path

#### Old

```vue
<MultiSelect v-model="values" :options="options">
  <template #option="{ item }">
    <div class="flex items-center gap-2">
      <Avatar :image="item.image" class="size-4" />
      <span>{{ item.label }}</span>
    </div>
  </template>
</MultiSelect>
```

#### New

```vue
<MultiSelect v-model="values" :options="options">
  <template #item-prefix="{ item }">
    <Avatar :image="item.image" class="size-4" />
  </template>

  <template #item-label="{ item }">
    {{ item.label }}
  </template>
</MultiSelect>
```

### Scope guard

Do not force every richer multi-picker need into the base component.

If apps need all of these together:

- chips in the trigger
- avatars everywhere
- grouped async remote results
- custom selected summary behavior
- create-new actions
- person-specific affordances

that may justify a separate future component such as `MultiCombobox` or `PeoplePicker`.

---

## Autocomplete compatibility note

`Autocomplete` is not part of the long-term preferred API shape, but it is still heavily used across real apps.

v1 direction:

- keep `Autocomplete` exported and functioning
- document it as a migration layer
- direct new single-select searchable work toward `Combobox`
- direct new multi-select searchable work toward `MultiSelect`

Migration intent:

- `Autocomplete` single-select -> `Combobox`
- `Autocomplete` multi-select -> `MultiSelect`
- `#target` -> `#trigger`
- `#item-prefix` / `#item-label` / `#item-suffix` vocabulary should stay recognizable across the migration path

This should be a long migration, not an abrupt rename.

---

## Implementation order

1. **ItemList / ItemListRow**
   - build the shared styled list surface
   - build the shared row shell
   - add grouped list support
   - add shared item slots and styling hooks
   - make it usable directly by app authors for advanced cases

2. **Dropdown**
   - compose `ItemList` / `ItemListRow`
   - add shell-owned item slots
   - add `selected` support
   - add `v-model:open`
   - keep `#item` and `component`, but move them to escape-hatch status

3. **Combobox**
   - compose `ItemList` / `ItemListRow`
   - add `update:query`
   - add `v-model:open`
   - add preferred alias: `slot`
   - preserve `onClick` and `condition`
   - preserve current custom item API while warning on old names where needed

4. **Select**
   - compose `ItemList` / `ItemListRow`
   - add `v-model:open`
   - add `#item-prefix`, `#item-label`, `#item-suffix`
   - keep `#option` as alias

5. **MultiSelect**
   - compose `ItemList` / `ItemListRow`
   - align with the same slot model as `Select` and `Combobox`
   - add `v-model:open`
   - add `update:query`
   - add grouped option support

## v1 release contract for this RFC

For v1, this RFC means:

- no breaking API removals
- clear preferred APIs for new work
- explicit deprecations for awkward legacy customization patterns
- migration paths for existing apps
- a more consistent mental model across `ItemList`, `Dropdown`, `Select`, `Combobox`, and `MultiSelect`
