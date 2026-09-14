# Executing the RC work list

Use this brief to finish the remaining RC work in `rc-work-list.md`.

## Sources of truth

| File | Use |
| --- | --- |
| `rc-work-list.md` | Scope, QIDs, migrations, dependencies, and consumer counts. |
| `rc-api-decisions.md` | Exact contracts. It wins when older work-list wording differs. |
| `rc-open-questions.md` | Research and consumer evidence behind the decisions. |
| `rc-migration-effort.md` | Expected migration counts. Report any new impact before changing scope. |

The original 18 sections remain intact as scope records. Items 1, 3, and 6
landed in PRs #1151, #1150, and #1149. Combine the remaining sections into
exactly three sequential PRs:

1. **Batch 1 — overlays, navigation, and list:** items 2, 4, 5, 7, 9, 12, 16.
   Landed; `main` is at `v1.0.0-beta.69`.
2. **Batch 2 — data, dialogs, inputs, shells, and headers:** items 8, 10, 11,
   13, 14. Implemented on `v1/rc-batch-2` from
   `2b990bdb7de35616a4e600e2222a733c51aba5d3`. 45 QIDs, one codemod
   (`data-v1`), six commits. Awaiting review and merge.
3. **Batch 3 — editor, packaging, and tokens:** items 15, 17, 18. Not started;
   base it on `main` after batch 2 merges.

Finish and merge each batch before starting the next. Do not split a batch to
satisfy an old file-count preference. Include generated docs required by its
scope.

Every batch adds its codemod to both `bin` and `files` in `package.json`. A bin
whose file is not published installs as a broken symlink. `destinations-v1` was
in `bin` only until batch 2 fixed it.

## Authority

- Pushing branches and opening PRs on `frappe/frappe-ui` is authorized after
  the coordinated independent review.
- Do not merge. The maintainer merges after review.
- Do not change consumer apps or comment on other people's PRs or issues.
  Consumer migrations need separate authorization after the library PR lands.
- Read-only consumer checks are allowed.
- Use one implementation agent and one independent Claude CLI Opus high review
  per batch. Do not trigger GitHub Barista with a comment or action.

## Batch workflow

1. Fetch `origin/main`. Create a new worktree and a `v1/<batch>` branch from
   the fetched commit. Run `yarn install`.
2. Read every section and QID in the batch. Carry forward merged contracts;
   preserve `Icon.name` and `Icon.icon`, with `icon` winning when defined.
3. Implement codemods first. Test safe parsing, lexical scope, refusal paths,
   idempotence, symlink execution, and packaged dependencies. Run each codemod
   on its own tree.
4. Implement runtime, types, tests, specs, generated API docs, migration docs,
   and the recorded consumer inventory. Keep unrelated behavior unchanged.
5. Run focused checks while editing. At the end run one full `yarn test`, the
   touched Cypress specs with `ELECTRON_RUN_AS_NODE` unset, `yarn type-check`,
   `yarn docs:gen`, `yarn docs:check`, and clean own-tree codemod reruns.
6. Prepare one readable PR and request one independent review. A batch is ready
   only when CI is green and Barista is at least 4/5.
7. Babysit CI and GitHub review findings until ready, then wait for user review;
   do not merge or start the next batch.
