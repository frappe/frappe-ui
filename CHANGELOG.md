# frappe-ui

## 1.0.2

### Patch Changes

- Editor: the suggestion menus (@mention, /, #, :) can now be clicked inside a
  Dialog without closing it (fix).
  [#1288](https://github.com/frappe/frappe-ui/pull/1288)
- Editor: @mention results now list an exact name match first, then names that
  start with the typed text, then names with a word that starts with it (fix).
  [#1288](https://github.com/frappe/frappe-ui/pull/1288)
- MobileShell: in an installed iOS 26 app, the tab bar now reaches the bottom
  edge and clears the home indicator; `frappe-ui/style.css` now gives every
  installed app with a translucent status bar a page at least as tall as the
  screen, which is what restores the full-screen viewport (fix).
  [#1289](https://github.com/frappe/frappe-ui/pull/1289)
- Combobox, MultiSelect: search results now list exact matches first, then
  labels that start with the typed text, then labels with a word that starts
  with it (fix). [#1290](https://github.com/frappe/frappe-ui/pull/1290)
- Vite plugin: an app linked into a bench's `apps/` from another folder now
  builds and runs in dev; tools such as Pilot set `FRAPPE_BENCH_PATH` to the
  bench (fix). [#1283](https://github.com/frappe/frappe-ui/pull/1283)

## 1.0.1

### Patch Changes

- Charts: a category axis label that is shortened in the middle now keeps its
  ending, and no longer gets a second ellipsis at the end (fix).
  [#1279](https://github.com/frappe/frappe-ui/pull/1279)
- Checkbox: a checked or indeterminate checkbox now lightens on hover and press,
  and checkboxes no longer show a shadow on hover (fix).
  [#1186](https://github.com/frappe/frappe-ui/pull/1186)
- Editor: images and videos without a size get one only after the person's own
  edit, not when a document opens or a collaborator edits it, and one Ctrl+Z now
  undoes the person's edit (fix).
  [#1266](https://github.com/frappe/frappe-ui/pull/1266)
- PageHeaderMobile: the `#prefix` and `#suffix` slots now follow the text
  direction, so in right-to-left pages the back button sits on the right (fix).
  [#1230](https://github.com/frappe/frappe-ui/pull/1230)
- Progress: a bar without a `label` now has the accessible name "Progress"
  instead of its percentage, so screen readers do not read the value twice
  (fix). [#1113](https://github.com/frappe/frappe-ui/pull/1113)
- SidebarRailItem: a `subtle` item paints no fill behind an image, so a rounded
  logo shows no gray rim at its corners (fix).
  [#1272](https://github.com/frappe/frappe-ui/pull/1272)
- Editor: dragging a link or selected text out of a read-only editor now carries
  the browser's URL or text, as it does from plain HTML (fix).
  [#1104](https://github.com/frappe/frappe-ui/pull/1104)
- Realtime: updates keep arriving after a reconnect and on a new socket (fix).
  [#1105](https://github.com/frappe/frappe-ui/pull/1105)
- Editor: the mention, emoji, tag and slash-command menus stay next to the caret
  when the page or the editor's scroll container scrolls or the window resizes,
  and never show a position meant for an older list (fix).
  [#1161](https://github.com/frappe/frappe-ui/pull/1161)
