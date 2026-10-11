# frappe-ui

## 1.0.1

### Patch Changes

- [#1279](https://github.com/frappe/frappe-ui/pull/1279)
  [`6a9b53b`](https://github.com/frappe/frappe-ui/commit/6a9b53bfe6906aaf4333ae24ec35b9a7640cfb97)
  Thanks [@netchampfaris](https://github.com/netchampfaris)! - Charts: a
  category axis label that is shortened in the middle now keeps its ending, and
  no longer gets a second ellipsis at the end (fix).

- [#1186](https://github.com/frappe/frappe-ui/pull/1186)
  [`fa11b7c`](https://github.com/frappe/frappe-ui/commit/fa11b7c01839366956350913ab82f9751e82223e)
  Thanks [@jacob-salvi](https://github.com/jacob-salvi)! - Checkbox: a checked
  or indeterminate checkbox now lightens on hover and press, and checkboxes no
  longer show a shadow on hover (fix).

- [#1266](https://github.com/frappe/frappe-ui/pull/1266)
  [`0f7e10c`](https://github.com/frappe/frappe-ui/commit/0f7e10c7eddc63e2be402f72d2879f0a855eff08)
  Thanks [@GursheenK](https://github.com/GursheenK)! - Editor: images and videos
  without a size get one only after the person's own edit, not when a document
  opens or a collaborator edits it, and one Ctrl+Z now undoes the person's edit
  (fix).

- [#1230](https://github.com/frappe/frappe-ui/pull/1230)
  [`b132448`](https://github.com/frappe/frappe-ui/commit/b1324480d2bf636afb9df90c277da0506f39e9d9)
  Thanks [@magic-peach](https://github.com/magic-peach)! - PageHeaderMobile: the
  `#prefix` and `#suffix` slots now follow the text direction, so in
  right-to-left pages the back button sits on the right (fix).

- [#1113](https://github.com/frappe/frappe-ui/pull/1113)
  [`02c1f4c`](https://github.com/frappe/frappe-ui/commit/02c1f4c64afd7316c50d47b4a99c7ee982592eee)
  Thanks [@Prakhar-Pandey28](https://github.com/Prakhar-Pandey28)! - Progress: a
  bar without a `label` now has the accessible name "Progress" instead of its
  percentage, so screen readers do not read the value twice (fix).

- [#1272](https://github.com/frappe/frappe-ui/pull/1272)
  [`413db16`](https://github.com/frappe/frappe-ui/commit/413db16d0c697e1a7a8e630b1dbfc87810363254)
  Thanks [@netchampfaris](https://github.com/netchampfaris)! - SidebarRailItem:
  a `subtle` item paints no fill behind an image, so a rounded logo shows no
  gray rim at its corners (fix).

- [#1104](https://github.com/frappe/frappe-ui/pull/1104)
  [`104a636`](https://github.com/frappe/frappe-ui/commit/104a6364ec1f3ac4ad0e73f1324ffda201bb8979)
  Thanks [@kaulith](https://github.com/kaulith)! - Editor: dragging a link or
  selected text out of a read-only editor now carries the browser's URL or text,
  as it does from plain HTML (fix).

- [#1105](https://github.com/frappe/frappe-ui/pull/1105)
  [`0d6bf54`](https://github.com/frappe/frappe-ui/commit/0d6bf54f26c0526e09eba850301286f7975d33ce)
  Thanks [@waterWang](https://github.com/waterWang)! - Realtime: updates keep
  arriving after a reconnect and on a new socket (fix).

- [#1161](https://github.com/frappe/frappe-ui/pull/1161)
  [`9696cc0`](https://github.com/frappe/frappe-ui/commit/9696cc0c221c58efcf654e35e229025681e0e001)
  Thanks [@RitvikSardana](https://github.com/RitvikSardana)! - Editor: the
  mention, emoji, tag and slash-command menus stay next to the caret when the
  page or the editor's scroll container scrolls or the window resizes, and never
  show a position meant for an older list (fix).
