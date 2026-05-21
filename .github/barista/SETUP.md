# Barista — Issue Triage & PR Review Bot Setup

Barista is a pair of GitHub Actions workflows that use Claude (via the official `anthropics/claude-code-action`) to triage incoming issues and review pull requests on `frappe/frappe-ui`. It investigates the codebase, applies labels (issues), and posts a comment with its findings. Asking the reporter for more info is a last resort.

It posts as **`barista[bot]`** (a custom GitHub App), and bills Claude API calls against a maintainer's Claude Max subscription.

## What gets created on each trigger

### Issue triage (`barista-triage.yml`)

| Trigger | Action |
| --- | --- |
| `issues.opened` | Read issue → investigate the code (grep, read files, check git history, search past issues) → apply labels → post a comment with findings or hypothesis |
| `issue_comment.created` (only if comment contains `/barista` AND author is a maintainer) | Re-investigate based on the maintainer's directive |
| `workflow_dispatch` (manual) | Re-triage a specific issue number for debugging |

### PR review (`barista-review.yml`)

| Trigger | Action |
| --- | --- |
| `pull_request` opened / synchronize / reopened / ready_for_review | Read PR + diff → investigate affected files → post one review comment with verdict (Looks good / Minor nits / Concerns) |
| `issue_comment.created` on a PR (only if comment contains `/barista review` AND author is a maintainer) | Re-review, optionally focused on what the maintainer asked about |
| `workflow_dispatch` (manual) | Re-review a specific PR number for debugging |

Fork PRs and drafts are skipped by design — the bot token is not exposed to untrusted PR head code, and drafts aren't ready for review.

### Fix → PR (`barista-fix.yml`) — write mode

| Trigger | Action |
| --- | --- |
| `issue_comment.created` on an issue (only if comment contains `/barista fix` AND author is `@netchampfaris`) | Investigate → edit files on `barista/issue-<N>` branch → open a **draft** PR linking the issue, or bail with a comment if the fix is too large |
| `workflow_dispatch` (manual, only `@netchampfaris`) | Same, for a specific issue number |

This is the only write-mode workflow. Locked to a single GitHub login (`netchampfaris`) — change the `if:` block in `barista-fix.yml` to widen the allowlist. Sandbox script `open-pr.sh` enforces a path denylist (workflows, `package.json`, lockfiles, env, license, CODEOWNERS) so even a jailbroken prompt cannot mutate those.

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

### 2. Add labels barista uses

Barista already uses your existing labels (`bug`, `enhancement`, `documentation`, `question`, `invalid`, `duplicate`, `ui`, `editor`, `javascript`, `dependencies`). It also expects three new labels — create them once:

```sh
gh label create needs-repro --description "Bug report missing a minimal reproduction" --color FBCA04 --repo frappe/frappe-ui
gh label create needs-info  --description "Needs more context to be actionable"        --color FBCA04 --repo frappe/frappe-ui
gh label create triaged     --description "Seen by barista"                            --color C2E0C6 --repo frappe/frappe-ui
```

### 3. Mint a Claude Max OAuth token

On a machine where you're logged into Claude with the Max subscription you want billed:

```sh
claude setup-token
```

Copy the printed token.

### 4. Add repository secrets and variables

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

### 5. Verify

1. Open a throwaway test issue on the repo titled e.g. "Test: barista triage" with a clear bug description.
2. Within ~60 seconds you should see `barista[bot]` apply labels (and possibly comment).
3. If nothing happens, check **Actions → Barista — Issue Triage** for run logs.
4. To re-run on an existing issue manually: **Actions → Barista — Issue Triage → Run workflow → enter issue number**.

## How maintainers interact with it

### On issues

- **Disagree with a label?** Just change it. Barista treats human labels as sacred and won't re-apply its choice.
- **Want it to look again?** Comment `/barista retriage` (or anything containing `/barista`) on the issue. Example commands: `/barista retriage`, `/barista label bug`, `/barista this is a question not a bug`.
- **Want to silence it on one issue?** Add the `triaged` label manually before opening — barista will still run on `issues.opened` but will respect existing labels.

### On pull requests

- **Want a fresh review?** Comment `/barista review` on the PR (optionally with a focus, e.g. `/barista review focus on accessibility`). Only maintainers can trigger this.
- **Want barista to skip this PR?** Open as draft; barista skips drafts. Or set `BARISTA_ENABLED=false` globally.

### Asking barista to attempt a fix

- Comment `/barista fix` on an issue. Restricted to `@netchampfaris`; barista checks out `barista/issue-<N>` off `main`, edits files, force-pushes, and opens a **draft** PR. Re-running replaces the previous attempt on the same branch.
- Append direction to scope the fix: `/barista fix add a dismissible alias on Toast`.
- Set `BARISTA_FIX_ENABLED=true` (repo variable) to enable. Default is off.

### Global

- **Silence everything?** Set `BARISTA_ENABLED` variable to `false`.
- **Silence write mode only?** Set `BARISTA_FIX_ENABLED` to `false` (or unset). Triage and review keep running.

## Files in this setup

```
.github/
  workflows/
    barista-triage.yml                  # issue triage workflow
    barista-review.yml                  # PR review workflow
    barista-fix.yml                     # fix → draft-PR workflow (write mode, locked to @netchampfaris)
  barista/
    SETUP.md                            # this file
    scripts/
      gh.sh                             # read-only gh wrapper (issues + PRs, sandbox)
      edit-issue-labels.sh              # write-only label editor (sandbox)
      add-comment.sh                    # write-only comment poster (issues + PRs, sandbox)
      open-pr.sh                        # write-only branch+commit+push+PR-create (sandbox, path denylist)
      append-stats.sh                   # appends run-stats footer to barista's comment
      fetch-image.sh                    # downloads issue/PR images for inspection
.claude/
  commands/
    barista-triage.md                   # triage prompt + allowed-tools manifest
    barista-review.md                   # review prompt + allowed-tools manifest
    barista-fix.md                      # fix-mode prompt + allowed-tools manifest
```

The sandbox scripts intentionally restrict what Claude can do. Even if the prompt is jailbroken, Claude can only call subcommands and flags these scripts allow.

## Cost & rate limits

- Each triage run = one Claude conversation (typically a few tool calls, ~10–30 seconds of model time).
- Billed to the Max subscription tied to `CLAUDE_CODE_OAUTH_TOKEN`. Max's 5-hour rolling rate limit is far above expected issue volume on this repo.
- If you switch off Max (or want to bill the org), regenerate against an Anthropic API key: replace `claude_code_oauth_token` with `anthropic_api_key` in the workflow and set `ANTHROPIC_API_KEY` instead.

## Future work

Auto-triggering fix mode (without a `/barista fix` comment) for narrow, high-confidence issue classes — e.g. broken-link or typo-only doc PRs. Today fix mode requires an explicit `/barista fix` from `@netchampfaris`; auto-triggering would need a stricter confidence gate and probably its own kill switch.
