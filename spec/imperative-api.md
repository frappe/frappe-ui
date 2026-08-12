# What components hand back through a template ref

Status: **accepted** —
[ADR-0012](./adr/0012-template-ref-surface.md), issue
[#916](https://github.com/frappe/frappe-ui/issues/916). First written against
`1.0.0-beta.25`; counts re-verified at sign-off.

Every component has four public surfaces: props, slots, emits, and whatever it
hands back when you grab it with a template ref. The first three have been
reviewed component by component before the v1 freeze. The fourth never has.

This document covers that fourth one. In code it's the `defineExpose` call.

There are 31 of them across `src/`. Four have types. The rest were written one
component at a time with no shared rule, and it shows.

## Not covered here

- **`frappe/`** — superseded by the `framework/ui` components in the frappe
  repo. Those get deleted, not redesigned.
- **`ListView`** — superseded by `frappe-ui/list`.
- **`Calendar`** — being rebuilt as composition-based components under
  `frappe-ui/calendar`.

The last two are where this surface went most wrong (13 members on Calendar, 4
on ListView, almost all of it duplicating slot props). Their replacements should
be built to the rules below rather than inheriting the old shape.

Related: [`selection.md`](./selection.md) already settles this for `Select`,
`Combobox`, and `MultiSelect` — all three expose exactly `{ clear, focus }`.
This document applies the same thinking to the rest of the library.

---

## 1. What's wrong today

### 1.1 `open` means two different things

Sometimes `open` is an action — you call it to open something:
`Popover.vue:268`, `HoverCard.vue:35-42`, `PickerShell.vue:251-255`, and all
three date pickers (`DatePicker.vue:201`, `DateRangePicker.vue:194`,
`DateTimePicker.vue:179`).

Sometimes `open` is a true/false value telling you whether the thing is open.
`HoverCard.vue:28` declares `open` as exactly that — so inside one file, `open`
is a boolean *and* the name of the function that changes it.

The same split runs through slot props: `Dropdown.vue:2,7` and
`HoverCard.vue:46` pass `open` as a boolean, while `Popover.vue:283-296` passes
it as a function and adds a separate `isOpen` for the boolean.

If you write `ref.value.open`, you cannot tell whether to call it or read it.
The types don't help, because almost none of this is typed (§1.5).

### 1.2 Four names for "give me the underlying HTML element"

| Name | Where | What you actually get |
| --- | --- | --- |
| `el` | `TextInput.vue:148`, `Textarea.vue:164` | a ref holding the element |
| `inputRef` | `FileUploader.vue:180` | **a function** that returns the element |
| `rootRef` | `Autocomplete.vue:409`, `TextEditor.vue:283` | a ref holding the element |
| `viewportElement` | `ScrollArea.vue:44`, `SettingsBody.vue:21` | a computed holding the element |

`inputRef` is the worst of these. It is named like a ref but it is a function
(`FileUploader.vue:89-91`), so `uploader.value.inputRef.focus()` fails quietly
while `uploader.value.inputRef().focus()` works.

**`el` is the single most-used thing this library hands back.** 39 call sites
across four apps, counted at sign-off against freshly fetched `upstream/develop`
(`upstream/main` for helpdesk), git-tracked sources only:

| App | Sites |
| --- | --- |
| crm | 21 (two inside its own vendored `Autocomplete` fork) |
| helpdesk | 14 (four inside two vendored `Autocomplete` forks) |
| gameplan | 2 |
| builder | 2 |
| insights | 0 |
| raven | 0 |

What they do with it: **31 call `focus()`**, 2 call `select()`
(`crm/.../DurationInput.vue:55`, `crm/.../FormattedInput.vue:34`), 3 call
`blur()` (`crm/.../DurationInput.vue:74,78`, `crm/.../WhatsAppBox.vue:118`), and
3 read `el._value` to get at the input's current text
(`crm/.../frappe-ui/Autocomplete.vue:128`, and both of helpdesk's
`Autocomplete` copies) — reaching into Vue's ref internals through a surface we
published. **Five ask for focus without scrolling** (helpdesk 4, builder 1), so
`focus(options?)` is answering a need that already exists rather than
anticipating one.

It's used internally for the same reason — `PickerShell.vue:197,259`,
`TimePicker.vue:286,644`, `Duration.vue:56,79,82,113`, `LinkPopup.vue:100`,
`InsertIframe.vue:162`, `IframeInsertDialog.vue:104`. Nine internal callers,
almost all of them focusing.

So `el` exists mostly because `TextInput` has no `focus()`. Grabbing the raw
element was the only way.

Two entries in the original count were not ours and have been dropped:
helpdesk's `NestedPopover` `.el` is headlessui's, and builder's
`useCanvasMarqueeSelection` `.el` is builder's own data structure.
`gameplan-settings-exploration` is not a git repository, so it falls outside the
map's counting rule. insights going from 2 to 0 matches
[#868](https://github.com/frappe/frappe-ui/issues/868) — it has fully migrated.

`viewportElement` is the opposite case — a genuine need. `DesktopShell.vue:64`
watches it and registers the real scrolling element with the app shell, and
`SettingsBody.vue:19-21` forwards it so a panel body can be virtualized while
keeping the styled scrollbar. No function replaces either of those.

### 1.3 Focusing is inconsistent, and most things can't be focused at all

| Component | How it focuses |
| --- | --- |
| `Duration.vue:113` | reaches through `TextInput`'s `el` |
| `TimePicker.vue:636-645` | same |
| `Select`, `Combobox`, `MultiSelect` | template ref, taking `FocusOptions` — **already fixed** by [`selection.md`](./selection.md) |

The first two accept no options, so you can't ask for focus without scrolling —
even though both the library (`IframeInsertDialog.vue:104`) and userland
(`builder/.../PagePersonaSurvey.vue:198`) need exactly that. The selection trio
is the shape to copy: `MultiSelect.vue:242-250` resolves the element through a
template ref specifically so the internal id stays internal.

Things you'd expect to be able to focus, but can't: `TextInput`, `Textarea`,
`Password`, `FileUploader`, `Checkbox`, `Switch`, `Slider`, `Rating`, all three
date pickers, `Tree`, `TabButtons`. The first two are the most-used inputs in
the library.

### 1.4 Opening and closing is inconsistent

`Popover` and `HoverCard` hand back both `open` and `close`. The three date
pickers hand back `open` only. `Dialog.vue:324` hands back `close` only.
`Autocomplete.vue:410` hands back `togglePopover` — the only toggle in the
library, and the only name with a component type stuck on the end.

### 1.5 Only 4 of 31 are typed, in three ways that behave differently

Typed: `Combobox.vue:435` and `MultiSelect.vue:330` (both `SelectionExposed`),
`Duration.vue:113`, and `Dialog.vue:324`.

The first three write `defineExpose<SomeType>(...)`. Dialog writes
`defineExpose(obj satisfies SomeType)`. These are **not the same thing**. The
first publishes exactly the declared type. The second publishes whatever the
object happens to contain and just checks it against the type — so adding a
stray member to Dialog's object would silently grow the public surface with no
error. For an API we're about to freeze, that matters.

`Select.vue:277-278` is a third shape — `const exposed: SelectionExposed = {...}`
then `defineExpose(exposed)`. It behaves correctly, because the annotated const
is what gets published, but it is a third way to write one thing.

**One type that promises something the code never delivers:**

- `DropdownExposed { close: () => void }` (`Dropdown/types.ts:80-83`) reaches
  consumers through `Dropdown/index.ts`'s `export * from './types'` — but
  **`Dropdown.vue` never calls `defineExpose`**. `close()` exists
  (`Dropdown.vue:86-88`) but only as a slot prop. So writing
  `ref<DropdownExposed>()` and calling `.close()` compiles cleanly and crashes
  at runtime.

The second one is already fixed: `SelectExposed {}` was an exported empty type,
and [`selection.md`](./selection.md) has since replaced it with the shared
`SelectionExposed { clear, focus }`, implemented on all three of `Select`,
`Combobox` and `MultiSelect`.

Naming forks too: everything ends in `Exposed` except `SuggestionListExpose`
(`molecules/editor/extensions/suggestion/suggestion-types.ts:37`).

### 1.6 Nothing marks the internal ones as internal

`CalendarPanel.vue:436`, `PickerShell.vue:251`, and six editor list components
exist purely so sibling components can talk to each other. Nothing says so. The
only hint is that those components aren't exported, which you can't see from the
file.

It already costs us: `DateRangePicker.vue:199-200` and `DateTimePicker.vue:182`
each write out `{ focusInitialCell: () => void }` by hand because there's no
shared type to import. One contract, three copies, free to drift apart.

---

## 2. The contract

### 2.0 What earns a place here

Vue offers three ways out of a component already. Slot props reach code inside
the slot. `v-model` and emits reach state. **A template ref exists for what
neither can do: driving the component from the parent's `<script>`.**

So a member goes on this surface only when a parent's script needs it and no
other surface reaches. If a slot prop already covers it, that's the answer.

This is a real filter, not a formality. It is why `FileUploader` ends up handing
back nothing (§2.7) even though it clearly *does* something you'd want to
trigger — `openFileSelector` has been a slot prop all along, used in 28 files
across five apps, and every one of them puts the trigger inside the slot.

The rule cuts hardest against **additions**, which is the opposite of where it
looks like it should. An added method freezes until `2.0.0` exactly like a
renamed one, and the costs are lopsided: adding a verb later is a minor release,
removing one is not. So a method with no demonstrated need is the expensive
choice and an omitted one is cheap to fix.

### 2.1 Five verbs, and that's it

| Verb | What it does | Use it when |
| --- | --- | --- |
| `focus(options?)` | Moves keyboard focus to the main control. | **Always**, for anything you can type in or tab to. |
| `clear()` | Empties the value. Doesn't open, close, or focus. | Selection components only — see below. |
| `open()` | Opens the overlay. Safe to call twice. | The component owns an overlay **and its trigger**. |
| `close()` | Closes the overlay. Safe to call twice. | Paired with `open()`. |
| `reload()` | Fetches the data again. | The component owns a fetch you can't otherwise re-trigger. |

**`open` and `close` are for overlays that own their trigger.** `Popover`,
`HoverCard`, `Dropdown` and the pickers all render the trigger inside themselves
through a `trigger` slot, so code outside that slot has no handle on it and a ref
is the only way in. Apps do exactly this: builder's `ColorPicker` calls both from
a function in its `<script>`, and helpdesk opens a date picker from a menu
item's `onClick` in three places.

`Dialog` has no trigger slot. The parent decides when it appears and already
holds that state in `v-model`, so a ref reaches nothing the parent lacks — which
is why it hands back nothing (§2.8).

**`clear()` stays where it already is.** `Select`, `Combobox` and `MultiSelect`
have it via [`selection.md`](./selection.md), and it goes nowhere new. For a
text input, `v-model` already empties the value; across the whole bench there is
one site that clears a component through a ref, and it is a `Combobox`.

**No `toggle()`.** It's one line of caller code over `open` and `close`.
`spec/popover.md:211-212` already decided this for `Popover`; it becomes the
rule.

**No `reset()`.** `Combobox.reset` became `clear` in
[`selection.md`](./selection.md) and has already shipped. One live site migrates
(`builder/.../MoreStylesPanel.vue:179`).

**`open` is always a verb here.** The boolean lives on `v-model:open` and on
slot props as `open`. Nothing handed back through a ref is ever a boolean
named `open`. This fixes §1.1 and costs nothing — no component does that today.

`focus(options?)` takes the standard `FocusOptions`, so
`focus({ preventScroll: true })` works. Both the library and userland already
need it — five app sites pass exactly that option today, reaching through `el`
to do it (helpdesk 4, builder 1).

`focus()` is the one verb that goes on everything you can type in or tab to,
rather than only where it is already asked for. It clears §2.0's bar by a wide
margin: 31 sites reach through `el` purely to call it, seven more fall back to
`querySelector` or `getElementById` (builder 5, helpdesk 2), and §1.3's gap is
that the library's two most-used inputs cannot be focused at all.

Adding a verb later is a minor release. Adding a sixth verb to this list needs
an ADR.

### 2.2 Functions and elements only — no other state

A template ref is for telling a component to *do* something. State comes out
through props and `v-model`, emits, and slot props — Vue already has three good
ways, and every piece of state currently handed back duplicates one of them.

There's a hard reason too, not just a stylistic one. Vue quietly unwraps refs on
the way out, so a handed-back `ref` arrives at the caller as a plain value —
and a **writable** one. Anyone holding the template ref can overwrite the
component's internal state by assigning to it. Meanwhile TypeScript still
reports it as a `Ref<T>`. Types and behaviour disagree on every live value the
library hands back.

So: **functions, plus the two element cases in §2.3, plus two documented
exceptions** — a computed with a noun name, declared in the component's type.
Today those are `Editor.isEmpty` and the chart family's `chart`
([ADR-0016](./adr/0016-charts-expose-echarts-instance.md)). A computed is safe
here precisely because assigning to an unwrapped computed fails loudly instead of
silently corrupting state.

### 2.3 Policy: handing back a DOM element

Some components genuinely have to. A virtualization library needs a real
scrolling element; an input needs `select()` and `setSelectionRange()`.
Pretending otherwise just pushes people to `querySelector`, which is worse — it
depends on markup we never promised.

So it's allowed, narrowly and consistently.

**Hand back an element only when all three hold:**

1. **No verb covers it.** There is a whole class of caller needs — measuring,
   text selection ranges, handing the element to a browser API or a third-party
   library — that a method can't reasonably enumerate.
2. **The element is what the component fundamentally is.** The native input of
   an input; the scroller of a scroll container. Not a wrapper, badge, icon, or
   any part that exists for layout.
3. **Exactly one per component.** If you want two, the component is doing too
   much, or one of them wants a verb instead.

**Never hand back:**

- Anything a verb already does. `focus`, `clear`, `open`, `close` come first —
  the element is not the way to trigger behaviour.
- Root or wrapper elements. Those move whenever the markup changes, and handing
  one back freezes the internal DOM into the public contract. (`rootRef` on
  `Autocomplete` and `TextEditor` dies with those components.)
- Elements belonging to a child component, reached through it.
- Elements that are an implementation detail the caller shouldn't know exists —
  `FileUploader`'s hidden file input is the example. `open()` covers what people
  actually wanted.

**How to name it: `<role>Element`.** camelCase, always the `Element` suffix, and
the role comes from a fixed short list:

| Name | Means | Components |
| --- | --- | --- |
| `inputElement` | The native element the user types in or operates. | `TextInput`, `Textarea`, `Password` |
| `viewportElement` | The element that actually scrolls. | `ScrollArea`, `SettingsBody` |

The name describes the **role**, not the tag — `Textarea` hands back
`inputElement` too. Same role, same name, so callers don't have to remember
which is which. **Adding a third role to this list needs an ADR.** That's what
keeps this from turning back into four names for one idea.

**How to shape it:**

- Always a **computed**, never the raw `ref`. After Vue's unwrapping, a computed
  is read-only for the caller; a raw ref is not. A property **getter** that
  reads the ref is also allowed: `defineExpose<T>()` type-checks the object
  literal itself, and a `ComputedRef<X>` doesn't structurally match the plain
  `X | null` a field like `inputElement` declares, so `TextInput`, `Textarea`,
  and `Password` use a getter instead — same guarantees, read-only and
  reactivity-tracked.
- Always **`| null`** — the component may not be mounted yet. Type it as
  precisely as you can: `HTMLInputElement | null`, not `HTMLElement | null`.
- **Never a function that returns the element.** That's `FileUploader.inputRef`,
  and it's a trap (§1.2).
- Always declared in the component's `*Exposed` type (§2.5), with a comment
  saying what it's for.

`ScrollArea.vue:43-45` already follows all of this. It's the reference example.

**What this changes:**

| Today | After |
| --- | --- |
| `TextInput.el` | `TextInput.inputElement` (`HTMLInputElement \| null`) |
| `Textarea.el` | `Textarea.inputElement` (`HTMLTextAreaElement \| null`) |
| `Password` — nothing | `Password.inputElement` |
| `FileUploader.inputRef` | removed, with nothing in its place — the `openFileSelector` slot prop already covers it (§2.7) |
| `Autocomplete.rootRef`, `TextEditor.rootRef` | removed with the components |
| `ScrollArea.viewportElement` | unchanged, now typed |
| `SettingsBody.viewportElement` | unchanged, sharing ScrollArea's type |

The `el` → `inputElement` rename touches 39 known sites (§1.2) — but 31 of them
are calling `focus()`, and `focus()` is being added. Those migrate to the verb,
not to the new name. The rename's real blast radius is two much smaller groups:

- **5 sites take the new name** — the `select()` / `blur()` calls, all in crm.
- **3 sites have no direct replacement** — the `el._value` reads in crm's and
  helpdesk's vendored `Autocomplete` forks. Those were reading the input's
  current text out of Vue's ref internals; they rewrite against the model value.

Every one of them fails as a type error at build time, not as a runtime crash.

### 2.4 Third-party objects: one exception, and it's written down

**`Editor.editor` stays.** Tiptap's whole command API lives on that object and
there's no way to offer it short of re-exporting Tiptap. It's documented
(`spec/editor.md:155-168`) and it's the intended seam between the component and
the `useEditor` layer. `TextEditor.vue:282`'s copy disappears with that
deprecated component.

**The seven echarts-backed charts stay too**, handing back the echarts instance
as `chart`. `echartOptions` reaches every option key and no instance method, and
`echarts.getInstanceByDom` reaches the instance whatever the component exposes —
so the choice is a declared seam or an undeclared one.
[ADR-0016](./adr/0016-charts-expose-echarts-instance.md) records the argument and
the limits, and `charts.md` states the contract.

**Nothing else hands back a third-party object without an ADR.** That's the line
that stops "just expose the reka instance" from spreading.

### 2.5 Everything gets a type

**Every component that hands anything back declares an exported
`<Component>Exposed` type — including one-function ones.**

- **Where:** the component's `types.ts`, next to its Props / Emits / Slots.
- **How:** always `defineExpose<XExposed>({ ... })`. **Never `satisfies`** — it
  lets the surface grow silently (§1.5) — and not the annotated-const form
  either, which behaves correctly but is a third way to write one thing.
- **Export:** from the component's `index.ts` explicit export list, not
  `export *`.
- **Name:** always `Exposed`, never `Expose`.
- **Shared shapes share a type:** `Select` + `Combobox` + `MultiSelect` share
  one (`SelectionExposed`, already shipped); `ScrollArea` + `SettingsBody` share
  one; the three date pickers and `TimePicker` share one; `TextInput` +
  `Textarea` + `Password` share one.
- **Delete `DropdownExposed`.** It promises a `close()` that `Dropdown.vue`
  never defines, and it reaches consumers through `export * from './types'`.
  Implementing it was rejected: that would add an unproven pair of methods
  (§2.0) to make true a type nobody should have relied on. Shipping a type with
  nothing behind it past `1.0.0` isn't an option either. `SelectExposed` was the
  other one and is already fixed (§1.5).

### 2.6 Internal ones must say so

They can stay, but all three of these are required:

1. The type is **not exported** from `src/index.ts` or any entry point.
2. **`@internal` comment** on both the type and the `defineExpose` call.
3. Any name outside the §2.1 verbs and the §2.3 element roles is itself a
   signal that it should be internal.

Applied:

- `CalendarPanel.focusInitialCell` → internal, with a shared type imported by
  both date pickers so the hand-written copies stop existing (§1.6).
- `PickerShell.open` → internal, grown to `{ open, close }` so the public
  pickers can offer `close()`.
- `SuggestionListExposed` → stop re-exporting it at `suggestion/index.ts:6`.

### 2.7 What each component ends up with

| Component | Today | After | Breaking |
| --- | --- | --- | --- |
| `Select` | `{ clear, focus }` | unchanged | No — already shipped |
| `MultiSelect` | `{ clear, focus }` | unchanged | No — already shipped |
| `Combobox` | `{ clear, focus }` | unchanged | No — `reset` → `clear` already shipped |
| `TextInput` | `{ el }` | `{ focus, inputElement }` | **Yes — rename, signed off** |
| `Textarea` | `{ el }` | `{ focus, inputElement }` | **Yes — rename, signed off** |
| `Password` | nothing | `{ focus, inputElement }` | No |
| `Duration` | `{ focus }` | unchanged | No |
| `FileUploader` | `{ inputRef }` | **nothing** — see below | **Yes — signed off** |
| `Dialog` | `{ close }` | **nothing** — see §2.8 | **Yes — signed off** |
| `Popover` | `{ open, close }` | unchanged — the model to copy | No |
| `HoverCard` | `{ open, close }` | same, plus a type | No |
| `Dropdown` | nothing (but promises `close`) | nothing; `DropdownExposed` deleted | Yes — loud, removes a type nobody could use |
| `DatePicker` | `{ open }` | `{ open, close, focus }` | No |
| `DateRangePicker` | `{ open }` | `{ open, close, focus }` | No |
| `DateTimePicker` | `{ open }` | `{ open, close, focus }` | No |
| `TimePicker` | `{ focus }` | `{ open, close, focus }` | No |
| `ScrollArea` | `{ viewportElement }` | same, plus a type | No |
| `SettingsBody` | `{ viewportElement }` | same, sharing ScrollArea's type | No |
| `Editor` | `{ editor, isEmpty }` | same, plus a type | No |
| The seven echarts-backed charts | `{ chart }` | unchanged — [ADR-0016](./adr/0016-charts-expose-echarts-instance.md) | No |
| `Autocomplete`, `TextEditor` | various | deleted with the component | Policy |
| `CalendarPanel`, `PickerShell`, editor lists | various | internal, shared types | No |
| everything else you can type in or tab to | nothing | `{ focus }` | No |

The last row is §1.3's list: `Checkbox`, `Switch`, `Slider`, `Rating`, `Tree`,
`TabButtons`. Each one gets `focus()` inside its own family's sweep.

**`FileUploader` hands back nothing.** `inputRef` is removed with nothing in its
place. The spec originally proposed `{ open, clear }` here; both fail §2.0.
`open()` would be a second public name for an action already called
`openFileSelector` as a slot prop in 28 files across five apps, and that slot
prop reaches every real use — all 28 put the trigger button inside the slot.
Renaming the slot prop to match was rejected as a quiet break in 28 files bought
for nothing. `clear()` has no site in the bench and no workaround in the bench
either — nobody remounts a `FileUploader` with `:key` to reset it.

### 2.8 `Dialog` hands back nothing

`Dialog` has no trigger slot. The parent decides when it appears and already
holds that state in `v-model`, so §2.1's trigger-ownership rule says a ref
reaches nothing the parent lacks.

The usage evidence agrees. Searching every app in the bench for `.close()` on a
template ref finds exactly two, both on `Popover`
(`insights/frontend/src/components/UseTooltip.vue:22`,
`builder/frontend/src/components/Controls/ColorPicker.vue:74`). **Nobody calls
Dialog's `close()` through a ref.**

But the rule is what decides it, not the count. Zero usage is evidence nobody
hit the need, not that the need is absent — and counting alone would have argued
just as well for stripping `HoverCard`, which nobody drives by ref either.
Trigger ownership is a property of the component, so it predicts instead of
observing, and it keeps `Popover` and `HoverCard` for the same reason it drops
`Dialog`.

The `close` that people *do* use is the slot prop (`Dialog.vue:32,73,95,113`)
and the one passed to action callbacks (`Dialog.vue:406-419`) — both stay, and
neither is affected. So `defineExpose` comes out of `Dialog` entirely and
`DialogExposed` is deleted.

---

## 3. Signed off

Resolved on [#916](https://github.com/frappe/frappe-ui/issues/916); rationale in
[ADR-0012](./adr/0012-template-ref-surface.md). Breaking changes to things that
are **not** currently deprecated, riskiest first:

1. **`el` → `inputElement` on `TextInput` and `Textarea`** — **renamed.** 39
   known sites; 31 move to `focus()`, 5 take the new name, 3 rewrite against the
   model value. It surfaces as a type error rather than a runtime crash, but it
   is the widest-reaching change in this document. Keeping `el` alongside the
   new name was never available: ADR-0008 bans deprecated members in `1.0.0`.
2. **`Dialog` hands back nothing** — **removed**, on §2.1's trigger-ownership
   rule. `DialogExposed` is exported, so removing it is a loud break. Growing it
   to `{ open, close }` for symmetry with `Popover` was rejected: symmetry isn't
   the rule, trigger ownership is.
3. **`FileUploader.inputRef` removed**, with nothing in its place (§2.7). Zero
   sites in the bench, and the proposed `open()` failed §2.0 — `openFileSelector`
   already covers it as a slot prop.
4. **`Combobox.reset` → `clear`** — already shipped via
   [`selection.md`](./selection.md). One live migration site.

**The additive half is bounded, not exempt** (§2.0). An added method freezes
until `2.0.0` exactly like a renamed one, so:

- `focus(options?)` goes on everything you can type in or tab to.
- `open` / `close` go on trigger-owning overlays only — `Popover` and
  `HoverCard` keep theirs, the three date pickers and `TimePicker` gain both.
- `clear()` stays on `Select`, `Combobox` and `MultiSelect` and goes nowhere new.
- `DropdownExposed` is **deleted**, not implemented.

Everything else waits for a real request and arrives in a minor release. A sixth
verb, or a third element role, still needs an ADR.

**Where the work happens.** This document is the contract; the `defineExpose`
edits happen inside the sweep that owns each component, as
[at-bar](./at-bar.md) item 8.

## Task list

Each item is done by the sweep that owns the component, as
[at-bar](./at-bar.md) item 8 — not as one pass.

**Types**
- [ ] Add a `<Component>Exposed` type wherever something is handed back
- [ ] Delete `DialogExposed` and its `satisfies` call (`Dialog.vue:324`)
- [ ] Delete `DropdownExposed` (`Dropdown/types.ts:80-83`)
- [ ] Move `Select.vue:277-278` to `defineExpose<SelectionExposed>(...)`
- [ ] Rename `SuggestionListExpose` → `SuggestionListExposed`; stop exporting it
- [ ] Add the shared input type, the shared scroll-viewport type, and the shared
      picker type

**Verbs**
- [ ] Add `focus(options?)` to every input and focusable control in §1.3
- [ ] Add `open()` / `close()` to the three date pickers and `TimePicker`
- [ ] Replace every look-up-by-ID focus with a template ref

**Elements**
- [ ] Rename `el` → `inputElement` on `TextInput` and `Textarea`; make it a
      computed, type it precisely
- [ ] Add `inputElement` to `Password`
- [ ] Type `ScrollArea` / `SettingsBody`'s `viewportElement`

**Removals**
- [ ] Remove `FileUploader.inputRef`, with nothing in its place
- [ ] Remove `defineExpose` from `Dialog`

**Internal**
- [ ] Mark `CalendarPanel`, `PickerShell`, and the six editor lists `@internal`
- [ ] Add a shared `CalendarPanelExposed`; delete the three hand-written copies

**Migration guide** — silent breaks needing a before/after under
[ADR-0011](./adr/0011-at-bar-checklist.md)'s test:
- [ ] `el._value` → the model value (crm 1, helpdesk 2, all vendored
      `Autocomplete` forks)
- [ ] `Combobox.reset()` → `clear()` (builder 1)
- [ ] `el.select()` / `el.blur()` → `inputElement.select()` / `.blur()` (crm 5)

Loud breaks needing only a changelog line: `DialogExposed`, `DropdownExposed`,
`FileUploader.inputRef`.
