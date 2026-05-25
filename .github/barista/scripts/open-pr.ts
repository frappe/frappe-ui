#!/usr/bin/env bun
// Commits staged-or-unstaged changes on the barista working branch, pushes,
// and opens a DRAFT PR linked to the originating issue. Run once at the end
// of a /barista fix session.
//
// Refuses to touch files under a hardcoded denylist (workflows, app config,
// lockfiles, env files) even if the agent prompt was jailbroken into staging
// them. Refuses to run on any branch outside `barista/issue-<N>`.
//
// Usage:
//   ./open-pr.ts --title "<pr title>" --body-file <path>
//   ./open-pr.ts --title "<pr title>" --body "<inline body>"

import { $ } from "bun";
import { lstatSync } from "node:fs";

const branch = process.env.BARISTA_BRANCH;
const base = process.env.BARISTA_BASE;
const issue = process.env.BARISTA_ISSUE;
if (!branch) { console.error("BARISTA_BRANCH not set"); process.exit(1); }
if (!base)   { console.error("BARISTA_BASE not set");   process.exit(1); }
if (!issue)  { console.error("BARISTA_ISSUE not set");  process.exit(1); }

if (!branch.startsWith("barista/issue-")) {
  console.error(`Error: refusing to push branch outside barista/issue-* namespace (${branch})`);
  process.exit(1);
}

const currentBranch = (await $`git rev-parse --abbrev-ref HEAD`.text()).trim();
if (currentBranch !== branch) {
  console.error(`Error: HEAD is on '${currentBranch}', expected '${branch}'`);
  process.exit(1);
}

let title = "";
let body = "";
let bodyFile = "";
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  switch (argv[i]) {
    case "--title": title = argv[++i] ?? ""; break;
    case "--body": body = argv[++i] ?? ""; break;
    case "--body-file": bodyFile = argv[++i] ?? ""; break;
    default:
      console.error(`Error: unknown arg ${argv[i]}`);
      process.exit(1);
  }
}

if (!title) { console.error("Error: --title is required"); process.exit(1); }
if (!body && !bodyFile) { console.error("Error: one of --body or --body-file is required"); process.exit(1); }
if (bodyFile && !(await Bun.file(bodyFile).exists())) {
  console.error(`Error: body file not found: ${bodyFile}`);
  process.exit(1);
}

// Path denylist — barista must not touch these even if the prompt says to.
const DENY: RegExp[] = [
  /^\.github\//,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^yarn\.lock$/,
  /^\.env$/,
  /^\.env\./,
  /^\.changeset\/config\.json$/,
  /^LICENSE/,
  /^CODEOWNERS$/,
];

// Do NOT .trim() — porcelain v1 lines start with the two-char XY status flag
// (often space + letter), and a left-trim would shift the first line and
// make `.slice(3)` eat the first character of its path.
const statusOut = (await $`git status --porcelain`.text()).replace(/\n+$/, "");
if (!statusOut) {
  console.error("Error: no changes to commit");
  process.exit(1);
}

const changed = statusOut
  .split("\n")
  .filter(Boolean)
  .map(line => line.slice(3));

for (const path of changed) {
  for (const pat of DENY) {
    if (pat.test(path)) {
      console.error(`Error: refusing to commit change to denylisted path: ${path} (matches ${pat})`);
      process.exit(1);
    }
  }
}

// Stage only the paths git reported as changed, and skip anything that isn't
// a regular file / symlink / directory. The sandbox sometimes mounts
// /dev/null character devices at the workspace root (.bash_profile, .zshrc,
// etc.) which show as untracked but cannot be added — `git add -A` would
// abort the whole stage.
const stageable = changed.filter(path => {
  try {
    const st = lstatSync(path);
    return st.isFile() || st.isSymbolicLink() || st.isDirectory();
  } catch {
    // ENOENT — likely a deleted path; keep it so git records the deletion.
    return true;
  }
});

if (stageable.length === 0) {
  console.error("Error: no stageable changes (only non-regular-file entries detected)");
  process.exit(1);
}

await $`git add -- ${stageable}`;
await $`git commit -m ${`barista: attempt fix for #${issue}`}`;
// Force-push is safe: namespace is barista-owned and the prepare-branch step
// resets the branch to base at the start of every run.
await $`git push --force-with-lease origin ${branch}`;

const existing = (await $`gh pr list --head ${branch} --state open --json url --jq .[0].url`.text()).trim();
if (existing && existing !== "null") {
  console.log(`PR already open for ${branch}: ${existing}`);
  console.log("(force-push above updated the branch contents)");
  process.exit(0);
}

const ghArgs: string[] = ["pr", "create", "--draft", "--base", base, "--head", branch, "--title", title];
if (bodyFile) ghArgs.push("--body-file", bodyFile);
else ghArgs.push("--body", body);
await $`gh ${ghArgs}`;
