# Code editor family: engine plus renderless component, no field

**Status**: accepted

## Context

`frappe-ui/experimental` ships `CodeEditor`, a labeled form field built on CodeMirror 6.
It reached 548 lines. About half of that is `variant`, `size`, and theme handling, and its
own comments record the fight with StyleModule order and equal specificity. Capability is a
`language` prop backed by `loadLanguage`, so the component decides what the editor can do.

A bench-wide audit of the real consumers shows the field shape does not reach any of them.

- **Frappe Desk does not use CodeMirror at all.** `frappe/public/js/frappe/form/controls/code.js`
  runs Ace. It gives each user a vim, emacs, or vscode keymap from `User.code_editor_type`. It
  feeds `df.autocompletions` from `get_autocompletion_items`. It inserts at the cursor for
  markdown image drops and console boilerplate. It has an Expand/Collapse control between 300
  and 600 px, and a copy button in read mode.
- **Builder runs CodeMirror 6 and hand-assembles about 20 extensions** in
  `frontend/src/utils/createCodeMirrorState.ts`. It adds three completion sources
  (`jsGlobalCompletion.ts`, `pythonCustomCompletion.ts`, and a server dictionary from
  `builder.api.get_codemirror_completions`), a Vue search panel through `search({ createPanel })`,
  and a theme `Compartment` driven by `useDark`.
- **`@framework/ui` already consumes the field** at
  `apps/frappe/ui/src/components/Fields/CodeEditorField.vue`. It sets `--cm-max-height`, adds an
  `@overflow` expand pill, split and stacked preview layouts, and JSON pretty-print on commit.
- **Nothing in the fleet** has multi-file tabs, breakpoints, server-pushed error annotations, or
  a real diff editor.

So the deepest consumer already writes the extension array by hand, and the shallowest consumer
already wraps the field to get its own chrome. The library sits in the middle and serves neither.
ADR-0004 answered the same question for TipTap: ship the engine, the renderless component, the
parts, and the kits, and let each app own its assembled editor.

The other half of the problem is packaging. ADR-0010 removed `frappe-ui/code-editor` because
CodeMirror sat entirely behind `await import()` and the component was a form-field sibling of
`Textarea`. Both facts change here.

## Decision

The code editor ships at one subpath, `frappe-ui/code-editor`, as an engine plus a renderless
component plus parts plus a kit. The prebuilt labeled field moves to `@framework/ui`.

1. **frappe-ui ships the family only.** No labeled field, no ready-made assembled editor. The
   field that exists today moves to `@framework/ui`, where its chrome, its preview layouts, and
   its JSON pretty-print already live.

2. **Capability is a required `extensions` array** of raw CodeMirror `Extension` values. There is
   no `language` prop and no feature booleans. This is P15 limb (b): an open registry, where the
   consumer adds a kind of member the library never defined.

3. **CodeMirror is statically imported by the engine.** The consumer's own `extensions` array
   already pulls CodeMirror into its chunk, so a dynamic import inside the library saves nothing.
   It costs a null `window` on every part until it resolves. Apps that want to defer the bytes use
   `defineAsyncComponent` or a lazy route, which is the deferral they control anyway.

4. **The subpath is earned on three limbs** of ADR-0010. Limb (a): the engine statically imports
   CodeMirror. Limb (b): `extensions` is an open registry. Limb (c): the family's names collide.
   `Extension` already means a TipTap type on `frappe-ui/editor`, and `CodeEditor` is a name root
   would have to avoid forever once it holds a code editor of any kind.

5. **Parts.** `useCodeEditor` owns the `EditorView` lifecycle and returns
   `ShallowRef<EditorView | null>`. `<CodeEditor>` is renderless: it owns the lifecycle, binds
   content, and provides the view. `<CodeEditorContent>` renders the box and takes an optional
   `editor` prop that falls back to the injection, the same shape ADR-0004's building blocks use.
   There are no menu parts, because CodeMirror owns all of its own DOM.

6. **Styling is three independently removable layers.** CodeMirror's own base styles are the
   first. A frappe chrome stylesheet is the second, scoped under a class that the `codeChrome`
   extension adds, so an app that omits the extension gets none of that CSS. The `codeHighlight`
   extension is the third and carries syntax colours. Dropping one layer never disturbs the other
   two. There is no `variant` prop and no `size` prop. Those become CSS var sets applied by the
   consumer's wrapper. Knob names follow ADR-0017: `--code-bg`, `--code-border`, `--code-radius`,
   `--code-focus-ring`, `--code-font-size`, `--code-padding`, `--code-min-height`,
   `--code-max-height`. Dark mode needs no reconfiguration, because the knobs and the highlight
   style resolve `var(--ink-*)` and `var(--surface-*)`.

7. **`extensions` is reactive.** It takes `MaybeRefOrGetter<Extension[]>`, and the engine
   re-applies the array with a top-level `StateEffect.reconfigure`. `Compartment` stays out of
   the public API. This diverges from `frappe-ui/editor`, where `extensions` is construction-time.
   The divergence reflects the engines: TipTap cannot swap extensions at runtime, CodeMirror can.
   The runtime cases are real. Desk picks the language from `df.options`, and Builder's
   `activeScript.script_type` changes under the user.

8. **Content is the unnamed `v-model`** (P2). It has two channels: `update:modelValue` fires live,
   and `change` fires on blur as the commit point.

9. **`CodeKit` is one configurable bundle with eight members.** Five are the ones real consumers
   toggle: `lineNumbers` (default false), `foldGutter`, `autocompletion`, `search`, `placeholder`.
   Three are ours: `chrome`, `highlight`, `keymap`. Everything else `basicSetup` carries stays a
   fixed base inside the kit, not a member and not a name frappe-ui owns. The kit exists because
   `basicSetup` is a flat array from which no member can be removed, which is why Builder
   hand-assembled 20 extensions. A member is a name that freezes at the tag, so a member nobody
   toggles is cost with no benefit. Adding a member later is additive, removing one is not. The
   kit is a value you pass or ignore, not a component default.

10. **`loadLanguage(key)` survives.** The ten `@codemirror/lang-*` packages move from hard
    dependencies to optional peer dependencies. Today every app that installs frappe-ui downloads
    all ten.

11. **The composable returns the `EditorView` unwrapped.** This is the house pattern: `useEditor`
    returns the TipTap instance, and ADR-0016 and ADR-0018 hand back the echarts instance.

12. **The extension array absorbs the non-goals.** vim and emacs keymaps, server completions,
    custom search panels, save and execute keymaps, indentation markers, diff view, multi-file
    tabs, and JSON linting are all extensions the consumer passes. None is a library feature.

13. **`CodePreview` leaves frappe-ui** and becomes framework-ui's. `marked` stays a frappe-ui
    dependency either way, because `frappe-ui/editor`'s ContentPaste extension imports
    `markdownToHTML` from `src/utils/markdown.ts`.

14. **The `experimental` pair is deleted when the family lands**, with no deprecation window
    (P14). There is no codemod. The only importer anywhere is framework-ui's
    `Fields/CodeEditorField.vue`, rewritten by hand. That file imports `frappe-ui/code-editor`
    today, a subpath that does not exist, so it is pinned to an old beta or already broken.

The API is specified in [`../code-editor.md`](../code-editor.md).

## Considered alternatives

- **Keep the field and promote it from `experimental` to root or a subpath.** Rejected: a
  `language` key plus feature props cannot reach Builder's three completion sources, its Vue
  search panel, or Desk's vim keymap. Every new capability becomes a new prop. That is the
  config-monolith shape ADR-0004 already rejected once.
- **Ship only a theme and a keymap, and tell consumers to use CodeMirror's `basicSetup`.**
  Rejected: `basicSetup` is a flat array, so `lineNumbers` cannot be removed from it. Builder's
  20-line hand-assembly stays exactly where it is, so the deepest consumer gets nothing. Ordering
  knowledge also becomes a sentence in the docs instead of code: a frappe keymap must outrank
  `basicSetup`, and only a bundle can guarantee that.
- **Fold the family into `frappe-ui/editor`.** Rejected: `Editor`, `EditorContent`, `Extension`,
  `Code`, and `CodeBlock` already mean TipTap things on that subpath. A code-only consumer would
  also pull TipTap.
- **Keep CodeMirror behind `await import()`, as today.** Rejected: the consumer's `extensions`
  array imports CodeMirror statically, so the laziness is already defeated at the call site. It
  buys nothing and makes the view null until it resolves.
- **Build the family in `frappe-ui/experimental` first and promote it later.** Rejected: a static
  CodeMirror in that barrel drags CodeMirror into the dev module graph of everything else the
  barrel exports. Parking the component there is also the move that produced this redesign.

## Consequences

- **`extensions` behaves differently across the two editor families.** It is reactive here and
  construction-time in `frappe-ui/editor`. Both specs state their own rule, and CONTEXT.md records
  the split, because a reader who knows one family will guess wrong about the other.
- **There is no `variant` prop and no `size` prop.** An app that wants a subtle box and a small
  font sets `--code-bg`, `--code-border`, and `--code-font-size` on a wrapper. About half of the
  old component was variant, size, and theme handling, and none of it moves to the new one.
- **Apps own their code field the way they own their editor component.** framework-ui's
  `CodeEditorField` is the first one. It keeps its label, its expand pill, its preview layouts,
  and its JSON pretty-print, and it stops fighting library defaults to get them.
- **The ten language packages become optional peers.** An app that calls `loadLanguage('python')`
  must install `@codemirror/lang-python`. Every app stops downloading the other nine.
- **Names freeze at the tag.** The family lands before `1.0.0`, so `CodeEditor`,
  `CodeEditorContent`, `useCodeEditor`, `CodeKit`, `loadLanguage`, the subpath itself, and the
  eight `--code-*` knobs are frozen under P13 and P15 until `2.0.0`.
