# RC medium triage

- Total: A 40, B 17, C 34. The file covers all 91 non-chart MEDIUM findings.
- M-data A3 B4 C4, M-base A4 B1 C1, M-dialog A9 B0 C1.
- M-overlays A2 B1 C3, M-inputs A2 B1 C6, M-navigation A0 B2 C5.
- M-tabs-tree A4 B1 C2, M-shells A3 B1 C3, M-composables A1 B0 C2.
- M-editor A7 B3 C2, M-list A2 B1 C3, M-packaging A3 B2 C2.

## M-data

### A. Mechanical

- **The v2 composable aliases.** Rule: P1's accepted v1 carve-out keeps `execute`, `fetch`, `reload`, `loading`, and `isFetching`. Fix: make no API change and record the exception in the API docs.
- **The unread object form of `FrappeUIPluginOptions.resources`.** Rule: P3 requires a primitive when the object carries no structured data. Fix: narrow `resources` to `boolean`.
- **The resource implementation wildcard exports.** Rule: P15 forbids `export *` from implementation modules. Fix: replace both wildcards with explicit named exports.

### B. Real decision

- **B1. Should `useDoc` keep subscription-style `onSuccess`, add option callbacks, or support both shapes?** Options: keep the return method, move both callbacks into options, or support both. Recommendation: support both because it adds the missing error hook without breaking subscription use.
- **B2. What cache and refetch rule should the v2 composables use?** Options: always refetch reads, default reads to cache, or keep per-composable defaults. Recommendation: default reads to cache with explicit refetch, and remove cache options from the one-shot `useNewDoc` POST.
- **B3. Should every v2 composable and document method use one options object?** Options: convert the positional forms, keep them, or add object overloads. Recommendation: convert `useDoctype` and `useNewDoc`, and move `runDocMethod.validate` outside its params.
- **B4. What happens to root `dayjs` and `dayjsLocal`?** Options: remove them, move them to a typed subpath, or keep them through an ADR exception. Recommendation: remove them because ADR-0010 rejects their root dependency, making `Dayjs` and `dayjsSystem` exports unnecessary.

### C. Can wait for 1.1

- **The unexported data and plugin types.** Additive type exports and declaration completion.
- **`FileUploadHandler.upload` ignores options, returns `any`, and uses a different progress payload.** Bug and typing fixes. Keep the v1 and v2 error contracts separate.
- **The v2 composables ignore `FrappeUIConfig` headers and base URL.** Configuration bug fix.
- **Loose composable errors, `debounce`, and `vOnOutsideClick` types.** Type corrections with no new runtime API.

## M-base

### A. Mechanical

- **`DividerAction` has a separate action shape.** Rule: CONTEXT defines actions as `ButtonProps` plus `onClick(context)`. Fix: derive `DividerAction` from the shared action shape.
- **Progress uses `intervals` as a boolean mode switch.** Rule: P3 rejects boolean mode switches. Fix: replace `intervals` plus `intervalCount` with `intervals?: number`.
- **Badge accepts any object as a label.** Rule: P3 requires primitive content props. Fix: type `label` as `string | number` and export the type if needed.
- **Icon's `name` prop also accepts a component.** Rule: P11 names the customization prop `icon` and gives it `string | Component`. Fix: rename `name` to `icon` with that type.

### B. Real decision

- **B5. Should `BreadcrumbItem` allow arbitrary fields?** Options: close the type, add `data?: Record<string, unknown>`, or keep the open index signature. Recommendation: add `data` because it preserves metadata without disabling typo checks.

### C. Can wait for 1.1

- **Four side type names and uneven axis type exports.** Add a shared exported alias while keeping component aliases.

## M-dialog

### A. Mechanical

- **Dialog uses `message` for description text.** Rule: the shared content vocabulary uses `description`. Fix: rename `message` to `description` before the v1 freeze.
- **Dialog exposes undocumented raw reka statics.** Rule: the Dialog spec lists the exact public API and excludes these statics. Fix: remove `Dialog.Title`, `Dialog.Description`, and `Dialog.Close`.
- **`paddingTop` accepts an invalid number branch.** Rule: the Dialog spec explicitly keeps this escape hatch for one live use. Fix: keep `paddingTop`, but narrow it to a valid CSS string.
- **Alert uses the unique `data-color` tone hook.** Rule: P4 names the tone axis `theme`. Fix: rename the hook to `data-theme`.
- **Alert has a tri-state icon prop.** Rule: P11 fixes icon customization at `string | Component`. Fix: remove the boolean branch.
- **Divider calls alignment `position`.** Rule: the shared layout vocabulary calls this axis `align`. Fix: rename the prop to `align`.
- **Breadcrumbs uses unscoped per-item slots.** Rule: P6 prefixes repeated-unit slots with `item-`. Fix: rename them to `#item-prefix` and `#item-suffix`.
- **PromptField has a narrow select option type.** Rule: the Dialog spec explicitly defines `{ label: string, value: string }[]`. Fix: keep that type and do not couple PromptField to the broader selection union.
- **HoverCard has a 0.3 open delay while the accepted default is 0.5 seconds.** Rule: the maintainer set public delays to milliseconds, and the spec sets the open default to 0.5 seconds. Fix: use a `500` millisecond default and update the unit docs.

### B. Real decision

- None.

### C. Can wait for 1.1

- **Dialog and BottomSheet lack specified hooks, and BottomSheet queries a class name.** Additive `data-slot` hooks and an internal selector bug fix.

## M-overlays

### A. Mechanical

- **`Popover.toggle` accepts a boolean or an Event.** Rule: P1 names the state change, not the interaction. Fix: replace it with `setOpen(boolean)`.
- **Fallthrough attributes land in three places.** Rule: P10 permits normal root fallthrough, not pass-through blobs. Fix: forward attributes once to each overlay's public root element.

### B. Real decision

- **B6. What common trigger slot shape should overlays expose?** Options: `{ open, disabled }`, `{ open, close, disabled }`, or `{ open, close, disabled, attrs }`. Recommendation: use `{ open, close, disabled }` because it covers state and control without exposing attribute plumbing.

### C. Can wait for 1.1

- **ContextMenu lacks `portalTo`.** Additive prop.
- **`HoverCardEmits` is missing while Popover has extra behavior emits.** Additive type export. The family specs intentionally keep the runtime emit shapes different.
- **Only Popover stamps `data-slot="trigger"`.** Additive styling hooks.

## M-inputs

### A. Mechanical

- **The three selection components use different empty values.** Rule: `spec/selection.md` explicitly sets `undefined`, `null`, and `[]`. Fix: make no API change and document FormControl's type-based forwarding.
- **DateTimePicker uses `allowCustomTime` beside `typeable`.** Rule: the input family uses `typeable` for typed entry. Fix: rename the prop to `typeable`.

### B. Real decision

- **B7. What should picker trigger slots expose instead of `toggle`?** Options: state only, state plus `setOpen`, or state plus `open` and `close`. Recommendation: expose state plus `setOpen(boolean)` because it matches selection's controlled-state model.

### C. Can wait for 1.1

- **Pickers and the other controls lack useful template-ref methods.** Additive `focus()` and related methods.
- **Input attributes land on wrappers, controls, or both.** Attribute-forwarding bug fix.
- **Duration drops the labeling slots.** Additive `#label` and `#description` slots.
- **FormControl blocks native date and time and leaks `variant` to toggles.** Type-routing and forwarding bugs.
- **`FrappeUIError` and `InputLabelingProps` ship only from experimental.** Additive stable type exports. Keep the v1 and v2 error shapes separate.
- **Input data-slot names differ, and FormLabel lacks its label hook.** Additive styling hooks.

## M-navigation

### A. Mechanical

- None.

### B. Real decision

- **B8. Should `SidebarHeader.menuItems` use full `MenuOptions` or a named sidebar subset?** Options: use `MenuOptions`, export a narrower type, or accept both. Recommendation: use `MenuOptions` and its `onClick` signature because the header renders the same menu data.
- **B9. Which shared variant replaces SidebarRailItem's `tile` value?** Options: map it to `solid`, map it to `subtle`, or keep one rail style. Recommendation: use `subtle` because it best matches the filled tile without adding a new shared-axis value.

### C. Can wait for 1.1

- **Sidebar prop types omit the `collapsed` model.** Additive declaration fix.
- **SidebarRailItem lacks route activity and anchor fallback.** Navigation behavior bug. Use the accepted `route` and `href` names.
- **SidebarItem prints non-lucide icon strings.** Rendering bug fix.
- **The exported sidebar injection keys lack documentation.** Documentation. Experimental parking also remains compatible later.
- **SidebarItem passes Tooltip an unsupported `placement` prop.** Prop-forwarding bug. Change it to `side="right"`.

## M-tabs-tree

### A. Mechanical

- **Tree slot props use `node`, `level`, and `focused`.** Rule: P7 sets per-item names to `item`, `index`, and `active`. Fix: rename the slot props to those names.
- **Tree emits `drag-start` and `drag-end`.** Rule: P1 requires behavior names. Fix: rename them to `move-start` and `move`, with cancellation reported separately from a committed move.
- **TabButton items exceed the Tabs spec.** Rule: the maintainer accepts `route`, external `href`, and data-object `onClick`. The Tabs spec requires string labels. Fix: keep those accepted fields, remove `tooltip`, and narrow `label` to `string`.
- **TabButtons and Tabs use different `data-state` values.** Rule: `spec/tabs.md` sets `active|inactive` for both shared trigger implementations. Fix: change TabButtons to `active|inactive`.

### B. Real decision

- **B10. How should Tree nodes carry app data?** Options: keep the open index signature, add a `data` field, or make `TreeNode` generic. Recommendation: make it generic because tree slots should retain the caller's node type.

### C. Can wait for 1.1

- **`SettingsDialogEmits` is stale and unexported.** Declaration fix. Add `keyboardShortcut`, default it to `"Mod+Shift+,"`, and accept `false` to disable it.
- **Two specs still list `sm|md|lg|xl`.** Documentation fix to `xs|sm|md|lg`.

## M-shells

### A. Mechanical

- **ScrollArea accepts `orientation="both"`.** Rule: P3 permits a named string axis with more than two states. Fix: keep `both` and document that it renders both scrollbars.
- **`useSheetDrag` is a stable root export despite being BottomSheet-specific.** Rule: P14 parks unsettled building blocks in `frappe-ui/experimental`. Fix: move `useSheetDrag` there.
- **ScrollBar cannot work with the public component set.** Rule: P14 allows incomplete building blocks to remain experimental. Fix: move the standalone ScrollBar export to `frappe-ui/experimental` and keep it internal to ScrollArea.

### B. Real decision

- **B11. What common name should shells use for the side region?** Options: `sidebar`, `rail`, or `nav`. Recommendation: use `sidebar` because it describes the region without prescribing width or content.

### C. Can wait for 1.1

- **PageHeader exports none of its prop types.** Additive type exports.
- **PageHeaderBase scrolls on any click and uses an unnamespaced opt-out.** Behavior bug and internal hook rename.
- **`useShellScrolled` defaults to 200 while examples use 12.** Default bug. Align code and docs in 1.1.

## M-composables

### A. Mechanical

- **`resolvedColorScheme` is a function with a noun name.** Rule: P1 requires a behavior name for exported functions. Fix: rename it to `getResolvedColorScheme`.

### B. Real decision

- None.

### C. Can wait for 1.1

- **Toggling from `system` can leave the visible scheme unchanged.** Behavior bug fix.
- **The portal-target trio has no docs page.** Documentation.

## M-editor

### A. Mechanical

- **Bubble and Floating menus leak TipTap's floating option bag.** Rule: `spec/editor.md` defines an owned options object with `shouldShow` and `tippyOptions`. Fix: export and use that narrow type.
- **EditorFixedMenu alone uses `buttonSize`.** Rule: the shared size axis is `size`. Fix: rename the prop to `size`.
- **Serialized prose variables sit on `.ProseMirror`, and the font fallback differs from docs.** Rule: ADR-0017 puts defaults in use-site fallbacks, while stored content fixes the variable names. Fix: keep the names, move defaults to use sites, and set the documented 14px fallback.
- **InlineKit accepts starter-kit objects but ignores them.** Rule: ADR-0004 requires every kit member to accept configuration or `false`. Fix: pass object configuration through to StarterKit.
- **`slashCommands` is untyped and lacks `items`.** Rule: CONTEXT says data-driven kit members stay inert until configured with `items`. Fix: give it a typed `items` option.
- **The editor barrel wildcard-exports implementation modules.** Rule: P15 forbids this. Fix: list the extension and menu exports explicitly.
- **Toolbar preset names do not pair with kit names.** Rule: ADR-0004 and `spec/editor.md` explicitly name the independent kit and preset exports. Fix: keep `articleToolbar` and `minimalToolbar` unchanged.

### B. Real decision

- **B12. What names should replace the two meanings of `component` in editor suggestions?** Options: `nodeView` plus `listComponent`, `renderer` plus `popup`, or keep `component`. Recommendation: use `nodeView` and `listComponent` because each names what the component renders.
- **B13. Should mention and tag suggestion items be generic or library-shaped records?** Options: generic items with accessors, shared fields plus `data`, or current fixed fields. Recommendation: use generic items so `value`, `email`, `full_name`, and internal `isNew` do not freeze.
- **B14. Which under-designed editor extensions stay in RichTextKit?** Options: keep and test them, make them opt-in, or park them in experimental. Recommendation: make StyleClipboard, Toc, and ImageViewer opt-in until each has a tested configuration contract.

### C. Can wait for 1.1

- **EditorDropZone requires an editor and lacks a hook.** Add context fallback and `data-slot` without removing the prop.
- **Several public editor signature types are unexported.** Export `UseEditorOptions`, `SuggestionFloatingOptions`, `BaseSuggestionItem`, the image option types, and `EditorCommandMeta`.

## M-list

### A. Mechanical

- **List row state hooks use three vocabularies.** Rule: `spec/item-list-row.md` sets `data-state="active|inactive"`. Fix: normalize row state to that attribute and use separate boolean attributes only for orthogonal state.
- **ListGroup has a `label` prop but a `#header` override.** Rule: P6 uses `#label` to override label content. Fix: rename the slot to `#label`.

### B. Real decision

- **B15. How should a ListRow declare activation semantics?** Options: let `onClick` switch the tag, add an explicit prop, or always render one element. Recommendation: add `as`, let `onClick` handle activation only, and do not swallow it in selectable mode.

### C. Can wait for 1.1

- **The ListRows default slot omits selected and active state.** Additive slot props under P7.
- **The sort glyph can render on the wrong side.** Layout bug fix.
- **Experimental exports collide with stable List names.** P14 allows renaming the experimental exports in any minor.

## M-packaging

### A. Mechanical

- **`rounded-9` is 999px.** Rule: ADR-0006 fixes `rounded-9` at 100px and reserves 9999px for `rounded-full`. Fix: set it to 100px.
- **Legacy `--focus-<name>` variables still ship.** Rule: ADR-0005 explicitly keeps them for backward compatibility. Fix: make no code change and document their legacy status.
- **The preset replaces Tailwind defaults despite documentation that it extends them.** Rule: the foundation contract says the preset extends Tailwind. Fix: move colors, font sizes, screens, radii, and shadows under `theme.extend`.

### B. Real decision

- **B16. What should replace `minWidth.50` and `width.wizard`?** Options: align and remove them, rename both values, or document both exceptions. Recommendation: align `50` to 12.5rem and remove `wizard` because scale keys must remain predictable and app-neutral.
- **B17. Which dark-mode token mechanism should remain public?** Options: semantic tokens only, semantic tokens plus fixed raw shades, or both current mechanisms. Recommendation: keep semantic tokens plus fixed raw shades, and put `alpha` in one consistent name position.

### C. Can wait for 1.1

- **The consumer toolchain contract is unwritten, `lucideIcons: false` breaks root, and `.ts` suffixes leak.** Documentation and build compatibility bugs.
- **The font token says `Inter Variable` while CSS uses `InterVar`.** Font wiring bug. Keep the Figma-backed token value.
