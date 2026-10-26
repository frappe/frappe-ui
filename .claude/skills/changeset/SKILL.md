---
name: changeset
description: Decide whether a frappe-ui change needs a changeset, choose patch or minor, and write the release-note text in `.changeset/*.md`. Use before opening any frappe-ui PR that changes shipped files.
---

# Changesets

A changeset is a Markdown file in `.changeset/`. It says how the next release
bumps the version, and it holds the changelog text for the change. The release
PR collects all pending changesets into `CHANGELOG.md`.

## Does the PR need one?

The `Verify changesets` check decides. It fails when the PR changes a shipped
file and adds no changeset. Shipped files are:

- the `files` list in `package.json`, such as `src/`, `vite/` and `tailwind/`,
- the `files` list in `packages/create-frappe-ui/package.json`,
- `package.json` and `packages/create-frappe-ui/package.json`.

Tests, stories, playgrounds and Markdown files do not count, even inside
`src/`. Component docs such as `src/components/Button/Button.md` count as docs.

| Change | What to add |
| --- | --- |
| Apps see a difference | a changeset with text |
| Refactor, types-only cleanup or dependency bump that apps do not see | `yarn changeset --empty` |
| Docs, CI, tests or specs only | nothing |

## Choose the bump

| Change | Bump |
| --- | --- |
| Bug fix, or a visual or behavior correction | `patch` |
| New public API: a component, prop, slot, event, export or token | `minor` |
| Deprecation of a public API | `minor` |
| Breaking change | Stop. Ask a maintainer. v1 takes no major release from a PR. |

`minor` needs the `release:minor` label on the PR. A maintainer adds it.
Without the label, the check fails. Say in the PR description why the change
is `minor`.

## Create the file

Run `yarn changeset` and choose the bump. Or write the file by hand with any
name:

```md
---
'frappe-ui': patch
---

Combobox: a picked option now commits before the popover closes.
```

Name `frappe-ui` only. A `create-frappe-ui` change also takes a `frappe-ui`
changeset, because both packages share one version.

## Write the text

Write for an app developer who reads the changelog. The text of each changeset
becomes one line in `CHANGELOG.md`. Use this format:

```md
<Component or area>: <what changed for the app>.
```

- Start with the component or area, such as `Combobox` or `Tailwind preset`.
- Say what changed for the app, not how the code changed.
- Do not end with a tag such as `(fix)` or `(additive)`. The release PR
  already puts each line under "Minor Changes" or "Patch Changes".
- A deprecation ends with `(deprecation)`, so it stands out from the new
  features under "Minor Changes", and says what to use instead.
- If the app must do something, say what in the same line. Keep the text to
  one line.
- Use one changeset per change. A PR with two independent changes adds two
  files.

Examples:

```md
Combobox: a picked option now commits before the popover closes.
Dialog: the new `size` prop sets the width of the dialog.
Badge: the `theme` prop is deprecated; use `variant` instead (deprecation).
```

## Releases

Maintainers release. Agents do not merge the release PR.

1. Each merge to `main` updates the `chore(release): version packages` PR. It
   writes each changeset as one line in `CHANGELOG.md`, followed by a link to
   its PR (`.changeset/changelog.cjs`).
2. Merging it changes the version. `publish.yml` publishes to npm, tags the
   commit, and creates a GitHub release from the version's `CHANGELOG.md`
   section.

The docs page `/docs/changelog/v1` includes `CHANGELOG.md`, so it needs no
copy. `/docs/changelog/v0-to-v1` lists the changes up to 1.0.0 and does not
change.
