# frappe-ui

Ship tier: prod

Read [`CONTEXT.md`](./CONTEXT.md) for the repo map and vocabulary, and
[`PHILOSOPHY.md`](./PHILOSOPHY.md) for API design rules.

## Changesets

A PR that changes shipped files needs a changeset. The `Verify changesets`
check enforces this. Before you open a PR, load
[`.claude/skills/changeset/SKILL.md`](./.claude/skills/changeset/SKILL.md). It
says when a changeset is required, how to choose `patch` or `minor`, and how
to write the text.
