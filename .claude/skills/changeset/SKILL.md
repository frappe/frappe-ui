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
- `package.json`.

Tests, stories and playgrounds do not count.

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

Combobox: a picked option now commits before the popover closes (fix).
```

Name `frappe-ui` only. A `create-frappe-ui` change also takes a `frappe-ui`
changeset, because both packages share one version.

## Write the text

Write for an app developer who reads the changelog. Match the style of
`docs/content/docs/changelog.md`.

- Start with the component or area, then a colon.
- Say what changed for the app, not how the code changed.
- End the first sentence with the tag from the changelog's "How to read an
  entry" table: `(fix)` or `(additive)`.
- If the app must do something, add a second paragraph that says what.
- Use one changeset per change. A PR with two independent changes adds two
  files.

## Releases

Maintainers release. Agents do not merge the release PR.

1. Each merge to `main` updates the `chore(release): version packages` PR.
2. Before merging it, copy the new `CHANGELOG.md` section into
   `docs/content/docs/changelog.md`.
3. Merging it changes the version. `publish.yml` publishes to npm and tags the
   commit.
