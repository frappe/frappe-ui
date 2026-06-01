# Build the `<TextEditor>` component

Labels: `needs-triage`
Type: AFK
Status: ✅ Done — `TextEditor.vue` rebuilt on `useEditor` with required `extensions`, unnamed `v-model` (+ `format`), reactive `placeholder` (threaded via `editor.storage.placeholder`) + `editable`, `autofocus`/`uploadFunction`/`maxHeight`, the `fixedMenu`/`bubbleMenu`/`floatingMenu` props (+ `fixedMenuPosition`/`bubbleMenuOptions`), and the `#default`/`#actions`/`#fixedMenu`/`#bubbleMenu`/`#floatingMenu` slots. The `RichTextEditor`/`CommentEditor`/`InlineEditor` ready-mades are deleted. `TextEditor.test.ts` (13 tests) covers model sync, reactivity, each menu surface via prop and slot, `#default` takeover, `#actions`, and comment-/article-shapes composed only from kits + presets.

## Parent

`spec/editor.md` (§2 component, §5 menu props/slots, §9–§11 patterns)

## What to build

The single editor component, built on `useEditor`. Capability via the required `extensions` array; chrome via `fixedMenu`/`bubbleMenu`/`floatingMenu` props (default off); layout via slots. This replaces the abandoned `RichTextEditor`/`CommentEditor`/`InlineEditor` ready-mades under `src/molecules/editor/` — delete those.

## Acceptance criteria

- [ ] `TextEditor` is exported from `frappe-ui/editor`; the abandoned `RichTextEditor`/`CommentEditor`/`InlineEditor` components are removed.
- [ ] `extensions` is a required prop (pass a kit or list).
- [ ] Unnamed `v-model` carries HTML by default and `JSONContent` when `format="json"`; `change` emits on update as a side-event (P1/P2).
- [ ] `placeholder` and `editable` are reactive; `autofocus`, `uploadFunction`, `maxHeight` behave per spec.
- [ ] The `placeholder` prop threads into the kit's `Placeholder` extension via `editor.storage.placeholder` (it does **not** reconfigure consumer-supplied extensions); see `spec/editor.md` §2. A consumer `Placeholder.configure({ placeholder })` wins.
- [ ] `fixedMenu`/`bubbleMenu`/`floatingMenu` accept `MenuItem[] | false`, default `false`; `fixedMenuPosition` is `'top' | 'bottom'` (default `'top'`); `bubbleMenuOptions` passes `shouldShow`/`tippyOptions` through.
- [ ] Slots: `#default` (`{ editor, isEmpty }`) takes over layout while the component keeps owning the editor lifecycle; `#actions` (`{ editor, isEmpty }`) renders in the toolbar row; `#fixedMenu`/`#bubbleMenu`/`#floatingMenu` (`{ editor }`) override a surface's render and win over their prop.
- [ ] No props that bypass `extensions` (no `mentions`/`tags`, no per-extension config props).
- [ ] `isEmpty` slot prop stays synced on create/update/transaction.
- [ ] Tests/stories cover: required `extensions`, HTML + JSON model sync, reactivity, each menu surface via prop and via slot, `#default` layout takeover, `#actions`, and **a comment-shape and an article-shape composed only from kits + presets** (proving no ready-made component is needed).

## Blocked by

- `01`
- `03`
- `04`
- `05`

## Notes

The customization ladder (L0–L4) and the props-vs-`.configure()` line are the heart of the design — do not add convenience props that bypass `extensions`. If a real call site needs a layout the slots can't express, stop for HITL rather than adding `#top`/`#bottom`/`#editor`-style slots. This component is validated end-to-end by the gameplan port (issue `07`) — treat that parity + bundle check as its real acceptance test, not just the unit stories here.
