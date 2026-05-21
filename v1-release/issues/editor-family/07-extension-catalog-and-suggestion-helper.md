# Finalize editor extension export catalog and suggestion helper

Labels: `needs-triage`
Type: AFK

## Parent

`spec/editor.md`

## What to build

Expose the full flat extension catalog from `frappe-ui/editor` and provide the helper needed to build suggestion-style extensions. Consumers should be able to import only the extensions they use, apply frappe-ui defaults, override with `.configure(...)`, and build custom mention/tag/slash/emoji experiences from primitives.

## Acceptance criteria

- [ ] TipTap-origin extensions listed in `spec/editor.md` are exported as flat named exports with frappe-ui default config applied.
- [ ] Frappe-custom extensions listed in `spec/editor.md` are exported as flat named exports.
- [ ] Consumers can override extension defaults with `.configure(...)`.
- [ ] Consumers who want raw TipTap behavior can still import directly from `@tiptap/extension-*`; frappe-ui does not hide that path.
- [ ] `SuggestionExtension.configure(...)` is exported and implements the specified options shape.
- [ ] `Editor`, `JSONContent`, `UploadedFile`, and menu-related types are exported from `frappe-ui/editor`.
- [ ] Import surface remains flat; no dot-notation namespace or top-level `frappe-ui` editor primitive exports are added.
- [ ] Tests verify representative wrapped defaults, `.configure(...)` override behavior, and suggestion helper command flow.

## Blocked by

- `01-editor-subpath-minimal-primitives.md`

## Notes

Default configs and the suggestion helper shape are API-sensitive. If implementation suggests changing defaults or adding registry/shorthand props, stop for HITL.
