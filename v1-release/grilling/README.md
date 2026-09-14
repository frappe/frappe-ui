# Phase 2 page contract

Create the eight remaining area pages beside `01-vocabulary.html`. Do not change
`_shared.css`, `_shared.js`, `01-vocabulary.html`, or `index.html` unless the
shared contract itself needs a fix.

## Page skeleton

Every area page must link the shared files with relative paths and define the
four globals before loading `_shared.js`:

```html
<link rel="stylesheet" href="_shared.css" />
<div data-grill-page></div>
<script>
  const AREA = 'data-layer'
  const TITLE = 'Data layer'
  const INTRO = 'One paragraph.'
  const QUESTIONS = []
</script>
<script src="_shared.js"></script>
```

`_shared.js` writes the question count to `frappe-ui-rc-grill:<area>:__count`
and a copy manifest to `frappe-ui-rc-grill:<area>:__questions` when the page
loads. It stores each response at `frappe-ui-rc-grill:<area>:<qid>` as
`{choice, answer}`. A question counts as answered when it has a selected option
or a non-empty free-text answer.

## `QUESTIONS` object shape

```js
{
  id: 'DAT-Q1',
  title: 'Name the concerned API',
  covers: ['H01', 'B1'],
  severity: 'High',
  tier: 'T3 · 58 sites',
  dependsOn: 'DAT-Q0', // optional; omit when independent
  what: '<p>Two to four plain-English sentences.</p>',
  visual: {
    label: 'Consumer usage',
    code: '- current line\n+ proposed line',
  },
  // Or: visual: { label: 'Props and slots', html: '<table>...</table>' }
  found: '<p>One to three sentences with <code>file:line</code> evidence.</p>',
  said: '<p>The earlier choice and comment verbatim, plus condensed research; or Nothing yet.</p>',
  tradeoff: '<p>Two to four sentences covering both costs and consequences.</p>',
  options: ['Concrete action', 'Another concrete action'],
  recommended: 0,
  why: 'One sentence explaining the recommendation.',
}
```

Use two to four radio options. Do not include “Recommended” in an option string;
`recommended` is its zero-based index and the renderer adds the label. Keep
every code visual to 16 lines or fewer. Use real names confirmed in `src/`. Use
“not measured” when `rc-migration-effort.md` has no row for the item.

“Keep and document” must be an option for a merely inconsistent API. It must not
be an option for a trap such as a wrong type, dead option, or duplicate emit.
Nothing may be pre-selected.

## Area slugs

| File                         | `AREA`               |
| ---------------------------- | -------------------- |
| `02-data-layer.html`         | `data-layer`         |
| `03-overlays-dialogs.html`   | `overlays-dialogs`   |
| `04-inputs-selection.html`   | `inputs-selection`   |
| `05-navigation.html`         | `navigation`         |
| `06-shells-page-header.html` | `shells-page-header` |
| `07-editor.html`             | `editor`             |
| `08-list.html`               | `list`               |
| `09-packaging-tokens.html`   | `packaging-tokens`   |

## Checklist

- Link `_shared.css` and `_shared.js` with same-folder relative paths.
- Set `AREA`, `TITLE`, `INTRO`, and `QUESTIONS` before `_shared.js` loads.
- Let `_shared.js` set `frappe-ui-rc-grill:<area>:__count`; verify it matches
  the rendered question count.
- Keep all assets local. Make no network requests.
- Leave every radio unselected and every answer empty on first load.
- Follow the design-tree order. Put dependent questions later and set
  `dependsOn`.
- Include every required content section in the object, in the documented order.
- Keep visuals focused and no longer than 16 lines.
- Test storage restore, per-page copy, copy fallback, clear confirmation, index
  progress, and mobile layout.
