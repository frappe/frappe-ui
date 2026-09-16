# What components hand back through a template ref

Status: **accepted** —
[ADR-0012](./adr/0012-template-ref-surface.md), issue
[#916](https://github.com/frappe/frappe-ui/issues/916). First written against
`1.0.0-beta.25`; counts re-verified at sign-off.

Every component has four public surfaces: props, slots, emits, and whatever it
hands back when you grab it with a template ref. The first three have been
reviewed component by component before the v1 freeze. The fourth never has.

This document covers that fourth one. In code it's the `defineExpose` call.

**How to read this.** §1 is the audit that produced the rules: its counts and
call-site tables are **historical**, measured against `1.0.0-beta.25` and the
app bench at sign-off, and they are evidence for the decisions rather than a
description of the library today. §2 and §3 are the current contract. §4 lists
the two members that do not meet it yet. The task list at the end records what
has shipped, each item checked against the source.

*Historical:* the audit found 31 `defineExpose` calls across `src/`, four of
them typed. The rest were written one component at a time with no shared rule,
and it showed. Today `src/` has 39 calls: 32 declare their type at the call
site, `Select` declares it on the object it publishes (§4), and six declare
none — `Editor` (§4), `Popover` (which does export `PopoverExposed`),
`PageHeaderTarget`, and the three editor suggestion lists.

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

## 1. What was wrong (historical audit)

Everything in this section describes the library as it stood at
`1.0.0-beta.25`, with call-site counts taken from the app bench at sign-off. It
is kept as the evidence behind §2, not as a current report. Where a finding has
since been fixed, the fix is noted inline and in the task list.

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

Things you'd expect to be able to focus, but couldn't: `TextInput`, `Textarea`,
`Password`, `FileUploader`, `Checkbox`, `Switch`, `Slider`, `Rating`, all three
date pickers, `Tree`, `TabButtons`. The first two are the most-used inputs in
the library.

**Where that list stands now.** Every component on it has shipped
`focus(options?)` except two: `FileUploader`, which hands back nothing at all by
decision (§2.7), and `Tree`, which exposes `expand` / `collapse` / `toggle` /
`expandAll` / `collapseAll` and no `focus` (`Tree/types.ts:141-152`). `Tree` is
the one open item in the task list's focus sweep.

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
error. For an API we're about to freeze, that matters. **Fixed:** `Dialog` no
longer calls `defineExpose` at all (§2.8), and no `defineExpose` in `src/` uses
`satisfies` today.

`Select.vue` is a third shape — `const exposed: SelectionExposed = {...}` then
`defineExpose(exposed)`. It behaves correctly, because the annotated constant is
what gets published, but it is a third way to write one thing. It still ships
that way (`Select.vue:306-307`); §4 explains why that is a style difference and
not a defect.

**One type that promises something the code never delivers:**

- `DropdownExposed { close: () => void }` (`Dropdown/types.ts:80-83`) reaches
  consumers through `Dropdown/index.ts`'s `export * from './types'` — but
  **`Dropdown.vue` never calls `defineExpose`**. `close()` exists
  (`Dropdown.vue:86-88`) but only as a slot prop. So writing
  `ref<DropdownExposed>()` and calling `.close()` compiles cleanly and crashes
  at runtime. **Fixed:** `DropdownExposed` no longer exists anywhere in `src/`.

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
silently corrupting state. The charts meet that shape; `Editor.isEmpty` does not
— it ships as a writable `ref`, which is the open item in §4.

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

"Before" is the beta.25 audit. "Shipped" is what `src/` does today, each row
checked against the source.

| Component | Before | Contract | Breaking | Shipped |
| --- | --- | --- | --- | --- |
| `Select` | `{ clear, focus }` | unchanged | No — already shipped | Yes — `Select.vue:306-307`, see §4 on the form |
| `MultiSelect` | `{ clear, focus }` | unchanged | No — already shipped | Yes — `MultiSelect.vue:348` |
| `Combobox` | `{ clear, focus }` | unchanged | No — `reset` → `clear` already shipped | Yes — `Combobox.vue:456` |
| `TextInput` | `{ el }` | `{ focus, inputElement }` | **Yes — rename, signed off** | Yes — `TextInput.vue:186` |
| `Textarea` | `{ el }` | `{ focus, inputElement }` | **Yes — rename, signed off** | Yes — `Textarea.vue:197` |
| `Password` | nothing | `{ focus, inputElement }` | No | Yes — `Password.vue:88` |
| `Duration` | `{ focus }` | unchanged | No | Yes — `Duration.vue:129` |
| `FileUploader` | `{ inputRef }` | **nothing** — see below | **Yes — signed off** | Yes — no `defineExpose` left |
| `Dialog` | `{ close }` | **nothing** — see §2.8 | **Yes — signed off** | Yes — no `defineExpose` left |
| `Popover` | `{ open, close }` | `{ open, close }`, plus the `contentEl` getter it now ships | No | Partly — `contentEl` is open against §2.3, see §4 |
| `HoverCard` | `{ open, close }` | same, plus a type | No | Yes — `HoverCard.vue:84`, `HoverCardExposed` |
| `Dropdown` | nothing (but promises `close`) | nothing; `DropdownExposed` deleted | Yes — loud, removes a type nobody could use | Yes — no such type in `src/` |
| `DatePicker` | `{ open }` | `{ open, close, focus }` | No | Yes — `DatePicker.vue:154`, `PickerExposed` |
| `DateRangePicker` | `{ open }` | `{ open, close, focus }` | No | Yes — `DateRangePicker.vue:162` |
| `DateTimePicker` | `{ open }` | `{ open, close, focus }` | No | Yes — `DateTimePicker.vue:167` |
| `TimePicker` | `{ focus }` | `{ open, close, focus }` | No | Yes — `TimePicker.vue:562` |
| `ScrollArea` | `{ viewportElement }` | same, plus a type | No | Yes — `ScrollArea.vue:45` |
| `SettingsBody` | `{ viewportElement }` | same, sharing ScrollArea's type | No | Partly — typed at `SettingsBody.vue:26`, but `SettingsBodyExposed` is a second identical declaration, not the shared one |
| `Editor` | `{ editor, isEmpty }` | same, plus a type | No | No — untyped, and `isEmpty` is writable, see §4 |
| The seven echarts-backed charts | `{ chart }` | unchanged — [ADR-0016](./adr/0016-charts-expose-echarts-instance.md) | No | Yes — all seven `defineExpose<ChartExposedRefs>({ chart: computed(...) })` |
| `Autocomplete`, `TextEditor` | various | deleted with the component | Policy | Partly — `Autocomplete` is deleted; `TextEditor` was parked in `frappe-ui/experimental` instead (#974) and still hands back `{ editor, rootRef }` |
| `CalendarPanel`, `PickerShell`, editor lists | various | internal, shared types | No | Partly — typed and out of every entry point, but none carries the `@internal` marker §2.6 requires |
| everything else you can type in or tab to | nothing | `{ focus }` | No | All but `Tree` — see below |

The last row is §1.3's list. `Checkbox` (`Checkbox.vue:108`), `Switch`
(`Switch.vue:103`), `Slider` (`Slider.vue:39`) and `Rating` (`Rating.vue:408`)
each ship `defineExpose<InputExposed>`, and `TabButtons` ships
`defineExpose<TabButtonsExposed>` (`TabButtons.vue:320`). `Tree` is the one left:
it hands back the five expansion verbs and no `focus`.

**`TabButtons` — shipped.** `TabButtonsExposed extends InputExposed`
(`TabButtons/types.ts:59`) is re-exported from `TabButtons/index.ts:6` and, through
`src/index.ts`, from the package root, so the surface is exactly
`{ focus(options?: FocusOptions): void }`. `focus()` moves focus to the selected
enabled option, or to the first enabled one when nothing is selected — the group
is a single tabstop, so that is where a `Tab` press lands. It targets the
rendered `[data-slot="tab-button"]`, not the track or the `Pill` inside it.
Disabled options are never focused: a disabled `route` or `href` option renders
as a disabled `<button>` rather than a link, and the lookup skips
`[data-disabled]` either way. An empty group, or one whose every option is
disabled, is a no-op. `FocusOptions` is forwarded untouched, `preventScroll`
included.

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

## 4. Open against this contract

Two shipped members do not meet the rules above. Both are recorded here and
neither is settled by this document: the runtime stays as it is until a decision
lands.

**`Editor` — pending.** §2.2 allows `isEmpty` as one of two documented state
exceptions, but only as a readonly computed declared in a named `*Exposed` type.
`Editor.vue:98` ships `defineExpose({ editor, isEmpty })`: an inferred shape,
with `isEmpty` a writable `ref` (`Editor.vue:52`), and `frappe-ui/editor` exports
no `EditorExposed` type. Which contract gives way — this policy or the shipped
members — is undecided. [`editor.md`](./editor.md) records the same conflict
against the same members; the two are meant to agree. Until it is decided, those
members are the shipped contract and stay as they are. Nothing here renames,
removes, or re-types them, and no exception is written to make the gap go away.

**`Popover.contentEl` — pending.** §2.3 allows one element per component, named
`<role>Element` from a fixed list (`inputElement`, `viewportElement`), and rules
out wrapper and content elements. `Popover.vue:141-147` publishes `contentEl`, a
property getter for the portaled content element, declared in the exported
`PopoverExposed` (`Popover/types.ts:85`). It is read-only for the caller, and it
is documented and tested, but it is neither on the role list nor a role that list
admits as written. Either §2.3 grows a content-element role by ADR or the member
goes through a removal. [`popover.md`](./popover.md) records it as unresolved on
the same terms. Until the decision lands, neither this document nor `Popover.vue`
changes, and §2.7's `Popover` row carries the member as shipped.

**`Select`'s expose shape is not a defect.** `Select.vue:306-307` writes
`const exposed: SelectionExposed = { clear, focus }` and then
`defineExpose(exposed)`. §2.5 prefers `defineExpose<SelectionExposed>(...)`, and
that preference holds for new code, but the annotated constant is what gets
published, so the surface is exactly `SelectionExposed`. The `satisfies` hole in
§1.5 does not apply here. This is a difference in syntax, not a behavior bug, and
it needs no refactor.

## Task list

Each item is done by the sweep that owns the component, as
[at-bar](./at-bar.md) item 8 — not as one pass. Checked items were verified in
`src/` on this branch; the rest name what is left.

**Types**
- [ ] Add a `<Component>Exposed` type wherever something is handed back — 32 of
      the 39 `defineExpose` calls in `src/` declare one at the call site. Left:
      `Editor` (§4), `Popover` (which does export `PopoverExposed`),
      `PageHeaderTarget` (`{ el }`, internal by intent on an exported
      component), and the three editor suggestion lists
- [x] Delete `DialogExposed` and its `satisfies` call — `Dialog.vue` has no
      `defineExpose`, and `DialogExposed` is gone from `src/`
- [x] Delete `DropdownExposed` — no occurrence anywhere in `src/`
- [ ] Move `Select.vue:306-307` to `defineExpose<SelectionExposed>(...)` — open
      as a style preference only; the shipped form is type-safe (§4)
- [ ] Rename `SuggestionListExpose` → `SuggestionListExposed`; stop exporting it
      — still `Expose`, still re-exported at
      `extensions/suggestion/index.ts:6`
- [x] Add the shared input type and the shared picker type — `TextInputExposed`
      (`TextInput/types.ts:44-49`) covers `TextInput`, `Textarea` and
      `Password`; `PickerExposed` (`shared/picker/types.ts:96-102`) covers the
      three date pickers and `TimePicker`
- [ ] Add the shared scroll-viewport type — `ScrollAreaExposed`
      (`ScrollArea/types.ts:15`) and `SettingsBodyExposed`
      (`SettingsDialog/types.ts:28`) are two identical declarations, not one

**Verbs**
- [ ] Add `focus(options?)` to every input and focusable control in §1.3 — every
      one of them ships it except `Tree`, which hands back the five expansion
      verbs and no `focus` (`FileUploader` hands back nothing by decision)
- [x] Add `open()` / `close()` to the three date pickers and `TimePicker` — all
      four `defineExpose<PickerExposed>` (`DatePicker.vue:154`,
      `DateRangePicker.vue:162`, `DateTimePicker.vue:167`, `TimePicker.vue:562`)
- [x] Replace every look-up-by-ID focus with a template ref — no
      `getElementById` call remains in `src/`; the one match is a comment in
      `MultiSelect.vue:262`

**Elements**
- [x] Rename `el` → `inputElement` on `TextInput` and `Textarea`; make it a
      computed, type it precisely — `TextInput.vue:186`, `Textarea.vue:197`,
      both through the getter form §2.3 allows, typed `HTMLInputElement | null`
      and `HTMLTextAreaElement | null`
- [x] Add `inputElement` to `Password` — `Password.vue:88`
- [x] Type `ScrollArea` / `SettingsBody`'s `viewportElement` — `ScrollArea.vue:45`,
      `SettingsBody.vue:26`; sharing one type is still open, above

**Removals**
- [x] Remove `FileUploader.inputRef`, with nothing in its place — no
      `defineExpose` in `FileUploader.vue`
- [x] Remove `defineExpose` from `Dialog` — none in `Dialog.vue`

**Internal**
- [ ] Mark `CalendarPanel`, `PickerShell`, and the editor lists `@internal` —
      their types are declared and reach no entry point, but no `@internal`
      marker exists on the type or the call (`CalendarPanel.vue:388`,
      `PickerShell.vue:217`, and the three suggestion lists — six at the time of
      the audit, three today)
- [x] Add a shared `CalendarPanelExposed`; delete the three hand-written copies
      — `DatePicker/calendarTypes.ts:141-143`, imported by `DateCalendar.vue:79`
      and `DateRangeCalendar.vue:144-145`; no hand-written copy is left

**Migration guide** — silent breaks needing a before/after under
[ADR-0011](./adr/0011-at-bar-checklist.md)'s test:
- [ ] `el._value` → the model value (crm 1, helpdesk 2, all vendored
      `Autocomplete` forks) — no entry in `migration.md`
- [x] `Combobox.reset()` → `clear()` (builder 1) — `migration.md`, Combobox table
- [x] `el.select()` / `el.blur()` → `inputElement.select()` / `.blur()` (crm 5) —
      covered by the `.el` → `.inputElement` row and the "`TextInput`,
      `Textarea`, `Password` — ref surface" section in `migration.md`

Loud breaks needing only a changelog line: `DialogExposed`, `DropdownExposed`,
`FileUploader.inputRef`. All three have one in
[`changelog.md`](../docs/content/docs/changelog.md).
