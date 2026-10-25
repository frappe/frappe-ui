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

## Public API changes

If a PR changes the public API, its description needs a `## Public API`
section. The public API covers components, props, slots, events, exports and
tokens. Show each change in a code block, written as an app would use it. A
reviewer should not need to read the diff to see what changed.

````md
## Public API

```vue
<MultiSelect v-model="assignees" :options @highlight="(option) => preview(option)" />
```

- `highlight`: new event. It emits the highlighted option, or `null` on close.
````

Leave the section out when the public API does not change.
