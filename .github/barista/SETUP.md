# Barista — PR Review & Fix Bot Setup

Barista is a pair of GitHub Actions workflows that use Claude (via the official `anthropics/claude-code-action`) to review pull requests and attempt small fixes on `frappe/frappe-ui`. It investigates the codebase and posts a comment with its findings.

It posts as **`barista[bot]`** (a custom GitHub App), and bills Claude API calls against a maintainer's Claude Max subscription.

## Shared review guidance

Greptile and Barista read [`.greptile/rules.md`](../../.greptile/rules.md).
Edit that file to change review policy. Keep API vocabulary and contracts in
`CONTEXT.md`, `PHILOSOPHY.md`, and `spec/`; the review policy links to them.
[`.greptile/files.json`](../../.greptile/files.json) lists context files by scope.

[`.greptile/config.json`](../../.greptile/config.json) configures Greptile to
review opened, reopened, and ready PRs, without automatic reviews on every push.
It skips drafts and release-bot PRs, keeps summaries compact, and leaves PR
descriptions unchanged. Related repositories require access through Greptile's
existing credentials. The settings use the documented
[Greptile directory format](https://www.greptile.com/docs/code-review/greptile-config-reference).

The Barista command retains its own tools, invocation details, and comment
format. Fix mode remains a Barista operation. The shared changelog rule is
review guidance, not a deterministic required check.
CodeRabbit's repository configuration has been removed. Disabling an installed
CodeRabbit app requires a separate change to its repository or organization settings.
The standalone `.semgrep.yml` remains available, but Greptile does not run it
through these settings.

## What gets created on each trigger

### PR review (`barista-review.yml`)

| Trigger | Action |
| --- | --- |
| `pull_request` opened / reopened / ready_for_review | Read PR + diff → investigate affected files → post one review comment with verdict (Looks good / Minor nits / Concerns) |
| `issue_comment.created` on a PR (only if comment contains `/barista review` AND author is a maintainer) | Re-review, optionally focused on what the maintainer asked about |
| `workflow_dispatch` (manual) | Re-review a specific PR number for debugging |

Fork PRs and drafts are skipped by design — the bot token is not exposed to untrusted PR head code, and drafts aren't ready for review.

### Fix → PR (`barista-fix.yml`) — write mode

| Trigger | Action |
| --- | --- |
| `issue_comment.created` on an issue (only if comment contains `/barista fix` AND author is `@netchampfaris`) | Investigate → edit files on `barista/issue-<N>` branch → open a **draft** PR linking the issue, or bail with a comment if the fix is too large |
| `workflow_dispatch` (manual, only `@netchampfaris`) | Same, for a specific issue number |

This is the only write-mode workflow. Locked to a single GitHub login (`netchampfaris`) — change the `if:` block in `barista-fix.yml` to widen the allowlist. Sandbox script `open-pr.ts` enforces a path denylist (workflows, `package.json`, lockfiles, env, license, CODEOWNERS) so even a jailbroken prompt cannot mutate those.

## One-time setup

### 1. Create the `barista` GitHub App

1. Go to **<https://github.com/organizations/frappe/settings/apps/new>** (must be a frappe org admin).
2. Fill in:
   - **Name:** `barista`
   - **Homepage URL:** `https://github.com/frappe/frappe-ui`
   - **Webhook:** **uncheck** "Active" (we don't need webhooks; the workflow handles events).
3. **Permissions (Repository):**
   - Issues: **Read & write**
   - Pull requests: **Read & write** (reserved for phase 2; safe to grant now)
   - Contents: **Read-only**
   - Metadata: **Read-only** (auto-selected)
4. **Where can this app be installed?** Only on this account.
5. Click **Create**.
6. On the app page:
   - Note the **App ID** (top of the page).
   - **Generate a private key** (bottom) — downloads a `.pem` file. Keep it safe; you'll paste its contents into a secret.
   - Upload an avatar if you like (this is what shows next to the bot's name on issues).
7. Click **Install App** in the left sidebar → install on **frappe/frappe-ui** (or all frappe-ui-related repos).

### 2. Mint a Claude Max OAuth token

On a machine where you're logged into Claude with the Max subscription you want billed:

```sh
claude setup-token
```

Copy the printed token.

### 3. Add repository secrets and variables

In **<https://github.com/frappe/frappe-ui/settings/secrets/actions>**, add:

| Type | Name | Value |
| --- | --- | --- |
| Secret | `BARISTA_APP_ID` | The numeric App ID from step 1.6 |
| Secret | `BARISTA_PRIVATE_KEY` | **Full contents** of the `.pem` file, including the `-----BEGIN…-----` and `-----END…-----` lines |
| Secret | `CLAUDE_CODE_OAUTH_TOKEN` | The token from `claude setup-token` |

In **Settings → Secrets and variables → Actions → Variables**, add:

| Type | Name | Value |
| --- | --- | --- |
| Variable | `BARISTA_ENABLED` | `true` |

The `BARISTA_ENABLED` variable is the kill switch. Set it to anything other than `true` (or delete it) to instantly disable barista without redeploying.

### 4. Verify

1. Open a throwaway test PR on the repo with a small code change.
2. Within a few minutes you should see a review comment from `barista[bot]`.
3. If nothing happens, check **Actions → Barista — PR Review** for run logs.
4. To re-run on an existing PR manually: **Actions → Barista — PR Review → Run workflow → enter PR number**.

## How maintainers interact with it

### On pull requests

- **Want a fresh review?** Comment `/barista review` on the PR (optionally with a focus, e.g. `/barista review focus on accessibility`). Only maintainers can trigger this.
- **Want barista to skip this PR?** Open as draft; barista skips drafts. Or set `BARISTA_ENABLED=false` globally.

### Asking barista to attempt a fix

- Comment `/barista fix` on an issue. Restricted to `@netchampfaris`; barista checks out `barista/issue-<N>` off `main`, edits files, force-pushes, and opens a **draft** PR. Re-running replaces the previous attempt on the same branch.
- Append direction to scope the fix: `/barista fix add a dismissible alias on Toast`.
- Set `BARISTA_FIX_ENABLED=true` (repo variable) to enable. Default is off.

### Global

- **Silence everything?** Set `BARISTA_ENABLED` variable to `false`.
- **Silence write mode only?** Set `BARISTA_FIX_ENABLED` to `false` (or unset). Review keeps running.

## Files in this setup

```
.github/
  workflows/
    barista-review.yml                  # PR review workflow
    barista-fix.yml                     # fix → draft-PR workflow (write mode, locked to @netchampfaris)
  actions/
    barista-setup/action.yml            # composite: mint app token, checkout, install Bun, resolve issue/PR number, react to /barista comments
    barista-run/action.yml              # composite: invoke claude-code-action with barista env
    barista-append-stats/action.yml     # composite: append run-stats footer
  barista/
    SETUP.md                            # this file
    scripts/                            # Bun TypeScript scripts (require setup-bun in CI)
      gh.ts                             # read-only gh wrapper (issues + PRs, sandbox)
      add-comment.ts                    # write-only comment poster (issues + PRs, sandbox)
      open-pr.ts                        # write-only branch+commit+push+PR-create (sandbox, path denylist)
      append-stats.ts                   # appends run-stats footer to barista's comment
      fetch-image.ts                    # downloads issue/PR images for inspection
.claude/
  commands/
    barista-review.md                   # review prompt + allowed-tools manifest
    barista-fix.md                      # fix-mode prompt + allowed-tools manifest
```

The sandbox scripts intentionally restrict what Claude can do. Even if the prompt is jailbroken, Claude can only call subcommands and flags these scripts allow. They're TypeScript executed by [Bun](https://bun.sh) (shebang `#!/usr/bin/env bun`); each workflow installs Bun via `oven-sh/setup-bun@v2` before the agent runs.

The composite actions in `.github/actions/barista-*` dedupe what the two workflows have in common — `barista-setup` handles the prelude (app token, checkout, Bun, number resolution, comment ack), `barista-run` invokes `claude-code-action`, and `barista-append-stats` appends the run-stats footer.

## Cost & rate limits

- Each barista run = one Claude conversation (typically a few tool calls, ~10–30 seconds of model time).
- Billed to the Max subscription tied to `CLAUDE_CODE_OAUTH_TOKEN`. Max's 5-hour rolling rate limit is far above expected issue volume on this repo.
- If you switch off Max (or want to bill the org), regenerate against an Anthropic API key: replace `claude_code_oauth_token` with `anthropic_api_key` in the workflow and set `ANTHROPIC_API_KEY` instead.

## Future work

Auto-triggering fix mode (without a `/barista fix` comment) for narrow, high-confidence issue classes — e.g. broken-link or typo-only doc PRs. Today fix mode requires an explicit `/barista fix` from `@netchampfaris`; auto-triggering would need a stricter confidence gate and probably its own kill switch.
