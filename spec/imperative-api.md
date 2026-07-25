# What components hand back through a template ref

Status: **proposed**. Not yet accepted. Written against `1.0.0-beta.25`.

Every component has four public surfaces: props, slots, emits, and whatever it
hands back when you grab it with a template ref. The first three have been
reviewed component by component before the v1 freeze. The fourth never has.

This document covers that fourth one. In code it's the `defineExpose` call.

There are 28 of them across `src/`. Four have types. The rest were written one
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

Related: [`selection-api-finalization.md`](./selection-api-finalization.md)
already settled this for `Select`, `Combobox`, and `MultiSelect`. This document
applies the same thinking to the rest of the library.

---

## 1. What's wrong today

### 1.1 `open` means two different things

Sometimes `open` is an action — you call it to open something:
`Popover.vue:278`, `HoverCard.vue:35-42`, `PickerShell.vue:265-267`, and all
three date pickers (`DatePicker.vue:201`, `DateRangePicker.vue:194`,
`DateTimePicker.vue:179`).

Sometimes `open` is a true/false value telling you whether the thing is open.
`HoverCard.vue:28` declares `open` as exactly that — so inside one file, `open`
is a boolean *and* the name of the function that changes it.

The same split runs through slot props: `Dropdown.vue:2,7` and
`HoverCard.vue:46` pass `open` as a boolean, while `Popover.vue:283-296` passes
it as a function and adds a separate `isOpen` for the boolean.

If you write `ref.value.open`, you cannot tell whether to call it or read it.
The types don't help, because almost none of this is typed (§1.4).

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

**`el` is the single most-used thing this library hands back.** 27 call sites
across five apps:

| App | Sites |
| --- | --- |
| crm | 19 (one inside its own vendored `Autocomplete` fork) |
| builder | 4 |
| insights | 2 |
| gameplan | 1 |
| gameplan-settings-exploration | 1 |

What they do with it: **23 call `focus()`**, 2 call `select()`
(`crm/.../DurationInput.vue:55`, `crm/.../FormattedInput.vue`), 2 call `blur()`
(`crm/.../DurationInput.vue:74`, `crm/.../WhatsAppBox.vue`). One asks for focus
without scrolling (`builder/.../PagePersonaSurvey.vue:198`).

It's used internally for the same reason — `PickerShell.vue:197,259`,
`TimePicker.vue:286,644`, `Duration.vue:56,79,82,113`, `LinkPopup.vue:100`,
`InsertIframe.vue:162`, `IframeInsertDialog.vue:104`. Nine internal callers,
almost all of them focusing.

So `el` exists mostly because `TextInput` has no `focus()`. Grabbing the raw
element was the only way.

`viewportElement` is the opposite case — a genuine need. `DesktopShell.vue:64`
watches it and registers the real scrolling element with the app shell, and
`SettingsBody.vue:19-21` forwards it so a panel body can be virtualized while
keeping the styled scrollbar. No function replaces either of those.

### 1.3 Three ways to focus something, and most things can't be focused at all

| Component | How it focuses |
| --- | --- |
| `Duration.vue:113` | reaches through `TextInput`'s `el` |
| `TimePicker.vue:643-645` | same |
| `Combobox.vue:377-383` | looks the element up by ID — already banned by the selection spec |
| `MultiSelect.vue:222-227` | looks it up by ID, and isn't handed back at all |

None of them accept options, so you can't ask for focus without scrolling —
even though both the library (`IframeInsertDialog.vue:104`) and userland
(`builder/.../PagePersonaSurvey.vue:198`) need exactly that.

Things you'd expect to be able to focus, but can't: `TextInput`, `Textarea`,
`Password`, `Select`, `MultiSelect`, `FileUploader`, `Checkbox`, `Switch`,
`Slider`, `Rating`, all three date pickers, `Tree`, `TabButtons`. The first two
are the most-used inputs in the library.

### 1.4 Opening and closing is inconsistent

`Popover` and `HoverCard` hand back both `open` and `close`. The three date
pickers hand back `open` only. `Dialog.vue:309` hands back `close` only.
`Autocomplete.vue:410` hands back `togglePopover` — the only toggle in the
library, and the only name with a component type stuck on the end.

### 1.5 Only 4 of 28 are typed, in two ways that behave differently

Typed: `Combobox.vue:421`, `Duration.vue:113`, and `Dialog.vue:309`.

The first two write `defineExpose<SomeType>(...)`. Dialog writes
`defineExpose(obj satisfies SomeType)`. These are **not the same thing**. The
first publishes exactly the declared type. The second publishes whatever the
object happens to contain and just checks it against the type — so adding a
stray member to Dialog's object would silently grow the public surface with no
error. For an API we're about to freeze, that matters.

**Two types that promise something the code never delivers:**

- `DropdownExposed { close: () => void }` (`Dropdown/types.ts:80-83`) is
  exported all the way out to consumers — but **`Dropdown.vue` never calls
  `defineExpose`**. `close()` exists (`Dropdown.vue:86-88`) but only as a slot
  prop. So writing `ref<DropdownExposed>()` and calling `.close()` compiles
  cleanly and crashes at runtime.
- `SelectExposed {}` (`Select/types.ts:146`) is an exported empty type with no
  implementation behind it.

Naming forks too: everything ends in `Exposed` except `SuggestionListExpose`
(`molecules/editor/extensions/suggestion/suggestion-types.ts:37`).

### 1.6 Nothing marks the internal ones as internal

`CalendarPanel.vue:436`, `PickerShell.vue:264`, and six editor list components
exist purely so sibling components can talk to each other. Nothing says so. The
only hint is that those components aren't exported, which you can't see from the
file.

It already costs us: `DateRangePicker.vue:199-200` and `DateTimePicker.vue:182`
each write out `{ focusInitialCell: () => void }` by hand because there's no
shared type to import. One contract, three copies, free to drift apart.

---

## 2. The proposal

### 2.1 Five verbs, and that's it

| Verb | What it does | Use it when |
| --- | --- | --- |
| `focus(options?)` | Moves keyboard focus to the main control. | **Always**, for anything you can type in or tab to. |
| `clear()` | Empties the value. Doesn't open, close, or focus. | The component holds a value that can be empty. |
| `open()` | Opens the overlay. Safe to call twice. | The component owns an overlay. |
| `close()` | Closes the overlay. Safe to call twice. | Paired with `open()`. |
| `reload()` | Fetches the data again. | The component owns a fetch you can't otherwise re-trigger. |

**No `toggle()`.** It's one line of caller code over `open` and `close`.
`spec/popover.md:211-212` already decided this for `Popover`; it becomes the
rule.

**No `reset()`.** `Combobox.reset` becomes `clear` (already agreed).

**`open` is always a verb here.** The boolean lives on `v-model:open` and on
slot props as `isOpen`. Nothing handed back through a ref is ever a boolean
named `open`. This fixes §1.1 and costs nothing — no component does that today.

`focus(options?)` takes the standard `FocusOptions`, so
`focus({ preventScroll: true })` works. Both the library and userland already
need it.

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

So: **functions, plus the two element cases in §2.3, plus one documented
exception** — a computed with a noun name, declared in the component's type.
Today that's `Editor.isEmpty`. A computed is safe here precisely because
assigning to an unwrapped computed fails loudly instead of silently corrupting
state.

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
  is read-only for the caller; a raw ref is not.
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
| `FileUploader.inputRef` | removed; `open()` replaces it |
| `Autocomplete.rootRef`, `TextEditor.rootRef` | removed with the components |
| `ScrollArea.viewportElement` | unchanged, now typed |
| `SettingsBody.viewportElement` | unchanged, sharing ScrollArea's type |

The `el` → `inputElement` rename touches 27 known sites (§1.2) — but 23 of them
are calling `focus()`, and `focus()` is being added. Those migrate to the verb,
not to the new name. The rename's real blast radius is the four `select()` /
`blur()` sites, all in crm.

### 2.4 Third-party objects: one exception, and it's written down

**`Editor.editor` stays.** Tiptap's whole command API lives on that object and
there's no way to offer it short of re-exporting Tiptap. It's documented
(`spec/editor.md:155-168`) and it's the intended seam between the component and
the `useEditor` layer. `TextEditor.vue:282`'s copy disappears with that
deprecated component.

**Nothing else hands back a third-party object without an ADR.** That's the line
that stops "just expose the reka instance" from spreading.

### 2.5 Everything gets a type

**Every component that hands anything back declares an exported
`<Component>Exposed` type — including one-function ones.**

- **Where:** the component's `types.ts`, next to its Props / Emits / Slots.
- **How:** always `defineExpose<XExposed>({ ... })`. **Never `satisfies`** — it
  lets the surface grow silently (§1.5).
- **Export:** from the component's `index.ts` explicit export list, not
  `export *`.
- **Name:** always `Exposed`, never `Expose`.
- **Shared shapes share a type:** `Select` + `Combobox` + `MultiSelect` share
  one; `ScrollArea` + `SettingsBody` share one; the three date pickers share
  one; `TextInput` + `Textarea` + `Password` share one.
- **Fix the two lying types now.** `DropdownExposed` gets implemented or
  deleted. `SelectExposed` gets `{ clear, focus }`. Shipping a type with nothing
  behind it past `1.0.0` isn't an option.

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
| `Select` | nothing | `{ clear, focus }` | No |
| `MultiSelect` | nothing | `{ clear, focus }` | No |
| `Combobox` | `{ reset, focus }` | `{ clear, focus }` | Yes — already agreed |
| `TextInput` | `{ el }` | `{ focus, clear, inputElement }` | **Yes — rename, needs sign-off** |
| `Textarea` | `{ el }` | `{ focus, clear, inputElement }` | **Yes — rename, needs sign-off** |
| `Password` | nothing | `{ focus, clear, inputElement }` | No |
| `Duration` | `{ focus }` | `{ focus, clear }` | No |
| `FileUploader` | `{ inputRef }` | `{ open, clear }` | **Yes — needs sign-off** |
| `Dialog` | `{ close }` | **nothing** — see §2.8 | **Yes — needs sign-off** |
| `Popover` | `{ open, close }` | unchanged — the model to copy | No |
| `HoverCard` | `{ open, close }` | same, plus a type | No |
| `Dropdown` | nothing (but promises `close`) | `{ open, close }` | No — makes the promise true |
| `DatePicker` | `{ open }` | `{ open, close, clear, focus }` | No |
| `DateRangePicker` | `{ open }` | `{ open, close, clear, focus }` | No |
| `DateTimePicker` | `{ open }` | `{ open, close, clear, focus }` | No |
| `TimePicker` | `{ focus }` | `{ open, close, clear, focus }` | No |
| `ScrollArea` | `{ viewportElement }` | same, plus a type | No |
| `SettingsBody` | `{ viewportElement }` | same, sharing ScrollArea's type | No |
| `Editor` | `{ editor, isEmpty }` | same, plus a type | No |
| `Autocomplete`, `TextEditor` | various | deleted with the component | Policy |
| `CalendarPanel`, `PickerShell`, editor lists | various | internal, shared types | No |

### 2.8 `Dialog` hands back nothing

I searched every app in the bench for `.close()` called on a template ref.
There are exactly two, and both are on `Popover`
(`insights/frontend/src/components/UseTooltip.vue:22`,
`builder/frontend/src/components/Controls/ColorPicker.vue:74`). **Nobody calls
Dialog's `close()` through a ref.**

That makes sense: you open a Dialog with `v-model`, so you close it the same
way. The `close` that people *do* use is the slot prop
(`Dialog.vue:32,73,95,113`) and the one passed to action callbacks
(`Dialog.vue:406-419`) — both stay, and neither is affected. So `defineExpose`
comes out of `Dialog` entirely and `DialogExposed` is deleted.

---

## 3. Needs sign-off

Breaking changes to things that are **not** currently deprecated, riskiest
first:

1. **`el` → `inputElement` on `TextInput` and `Textarea`.** 27 known sites.
   Most move to `focus()` instead; ~4 need the new name. It's a rename with a
   mechanical fix, and it surfaces as a type error rather than a runtime crash,
   but it is the widest-reaching change in this document.
2. **`Dialog` hands back nothing.** Verified unused in the bench (§2.8), but
   `DialogExposed` is currently exported, so removing it is still breaking.
3. **`FileUploader.inputRef` removed.** Its broken shape (§1.2) makes real usage
   unlikely.
4. **`Combobox.reset` → `clear`.** Already agreed; listed for completeness.

Additive, no sign-off needed: every `focus` / `clear` / `open` / `close`
addition, `Password.inputElement`, every new type, and `Dropdown` finally
implementing what it already promises.

## Task list

**Types**
- [ ] Add a `<Component>Exposed` type wherever something is handed back
- [ ] Change `Dialog.vue:309` off `satisfies` — or delete it entirely per §2.8
- [ ] Implement `DropdownExposed` as `{ open, close }`, or delete the type
- [ ] Fill in `SelectExposed`
- [ ] Rename `SuggestionListExpose` → `SuggestionListExposed`; stop exporting it
- [ ] Add the shared input type and the shared scroll-viewport type

**Verbs**
- [ ] Add `focus(options?)` to every input listed in §1.3
- [ ] Add `clear()` per the table in §2.7
- [ ] Add `close()` to the three date pickers and `TimePicker`
- [ ] Implement `{ open, close }` on `Dropdown`
- [ ] Replace every look-up-by-ID focus with a template ref

**Elements**
- [ ] Rename `el` → `inputElement` on `TextInput` and `Textarea`; make it a
      computed, type it precisely
- [ ] Add `inputElement` to `Password`
- [ ] Type `ScrollArea` / `SettingsBody`'s `viewportElement`

**Removals (after sign-off)**
- [ ] Remove `FileUploader.inputRef`; add `open()`
- [ ] Remove `defineExpose` from `Dialog`; delete `DialogExposed`

**Internal**
- [ ] Mark `CalendarPanel`, `PickerShell`, and the six editor lists `@internal`
- [ ] Add a shared `CalendarPanelExposed`; delete the three hand-written copies
