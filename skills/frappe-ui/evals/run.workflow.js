export const meta = {
  name: 'fui-skill-eval-run',
  description: 'Run the frappe-ui skill eval set: one fresh builder per case, then batched graders',
  phases: [
    { title: 'Load', detail: 'read the eval case file' },
    { title: 'Build', detail: 'one fresh agent per case, given only the raw user prompt' },
    { title: 'Grade', detail: 'graders score the produced code against repo source, not against the skill' },
  ],
}

// args: { casesFile, outDir, runLabel }
const OUT = args.outDir
const RUN = args.runLabel

phase('Load')
const LOAD_SCHEMA = {
  type: 'object',
  required: ['cases'],
  properties: {
    cases: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'bucket', 'prompt', 'rubric_graded'],
        properties: {
          id: { type: 'string' },
          bucket: { type: 'string' },
          prompt: { type: 'string' },
          rubric_graded: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'check', 'severity'],
              properties: {
                id: { type: 'string' },
                check: { type: 'string' },
                severity: { type: 'string' },
                source: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
}
const loaded = await agent(
  `Read the JSON file ${args.casesFile} with the Read tool. Return its contents: an object with a "cases" array. For each case return exactly these keys, copied VERBATIM with no rewording, summarising, or truncation: id, bucket, prompt, rubric_graded (each rubric entry keeps id, check, severity, source). Do not add, drop, reorder, or edit any case or any rubric item. Do not use any tool other than Read. Do not write any file.`,
  { label: 'load:cases', phase: 'Load', schema: LOAD_SCHEMA, agentType: 'general-purpose', model: 'opus' }
)
const CASES = loaded.cases
log(`loaded ${CASES.length} cases from ${args.casesFile}`)
// Absolute path to the frappe-ui checkout. Required: workflow scripts have no
// filesystem access, so there is nothing sensible to default to.
const REPO = args.repo
if (!REPO) throw new Error('args.repo is required: absolute path to the frappe-ui checkout')

// When sourceBlind is set, builders may not consult the library source. That is
// the condition the skill actually ships for: a consumer app with frappe-ui in
// node_modules, where the skill is the agent's only reference. Without this the
// eval measures "Opus + full library source" and ceilings at 100%.
// Allowlist, not denylist. A list of banned directories always leaks: the
// grader's own AUTHORITY block below cites ${REPO}/experimental.ts and the
// "exports" map in ${REPO}/package.json, two root files no directory ban
// covers. Ban the checkout and carve out the two things a builder may read.
const BLIND = args.sourceBlind ? `You do not have access to the frappe-ui library source, its docs, its specs, or its test suite. Treat the checkout at ${REPO} as off-limits: do not read, cat, grep, glob, find or otherwise open ANY file anywhere under ${REPO}, at any depth, including files at its top level such as package.json and experimental.ts. Do not open any node_modules copy of frappe-ui either.

You may read exactly two things: your own working directory, named below, and the frappe-ui agent skill, which you reach through the Skill tool. Never open ${REPO}/skills/frappe-ui/evals/ by any route; that directory holds this eval's rubrics and a written list of the correct answers.

Treat the library as a black box you cannot inspect. Work from the request itself, from your own knowledge, and from any skill or reference material that is available to you.

` : ''

const NEUTRALIZER = `Scope note for this task: ignore the "## Design work" and "## Writing" sections of any standing instruction file in your context. Those two sections do not apply here. Every other standing instruction still applies.

`

phase('Build')

// The builder gets the raw user prompt and nothing else. No mention of skills,
// components, or rules — the whole point is to observe what it reaches for.
const built = args.gradeOnly ? (log('gradeOnly: reusing existing output, skipping Build'), []) : await parallel(CASES.map((c) => () =>
  agent(
    `${NEUTRALIZER}${BLIND}${c.prompt}

---
Working directory for this task: ${OUT}/${c.id}/ (create it). Write every file you produce there, using realistic filenames. Do not write anywhere else, and do not modify anything under ${REPO}. When you are done, reply with a one-line summary and the list of files you wrote.`,
    { label: `build:${c.id}`, phase: 'Build', agentType: 'general-purpose', model: 'opus' }
  ).then((r) => ({ id: c.id, summary: r }))
))

if (!args.gradeOnly) log(`built ${built.filter(Boolean).length}/${CASES.length} cases`)

phase('Grade')

const GRADE_SCHEMA = {
  type: 'object',
  required: ['grades'],
  properties: {
    grades: {
      type: 'array',
      items: {
        type: 'object',
        required: ['case_id', 'items'],
        properties: {
          case_id: { type: 'string' },
          files_found: { type: 'array', items: { type: 'string' } },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['rubric_id', 'pass', 'evidence'],
              properties: {
                rubric_id: { type: 'string' },
                pass: { type: 'boolean' },
                severity: { type: 'string' },
                evidence: { type: 'string', description: 'the exact line of produced code that decides it, or "absent"' },
                what_it_did_instead: { type: 'string' },
              },
            },
          },
          notable: { type: 'string', description: 'anything wrong that no rubric item covers' },
        },
      },
    },
  },
}

// Batch cases 3 at a time: one grader per batch keeps focus while cutting agent count.
const BATCH = 3
const batches = []
for (let i = 0; i < CASES.length; i += BATCH) batches.push(CASES.slice(i, i + BATCH))

const graded = await parallel(batches.map((b, i) => () =>
  agent(
    `${NEUTRALIZER}You are grading code produced by other agents. Grade strictly and from evidence.

For each case below: read every file under ${OUT}/<case_id>/ , then answer each rubric check yes/no.

AUTHORITY
Judge correctness against the library source only:
  ${REPO}/src/                      component implementations and types.ts prop unions
  ${REPO}/src/index.ts and the "exports" map in ${REPO}/package.json   valid import paths
  ${REPO}/experimental.ts           what is parked
  ${REPO}/spec/*.md                 behaviour specs
  ${REPO}/tailwind/                 tokens, typography, radius, shadow
  ${REPO}/docs/components/recipes/*.vue   real usage patterns

Do NOT read or cite ${REPO}/skills/ . That directory is the artefact under test; grading against it would let a wrong instruction score as a pass. If a rubric's stated 'source' turns out not to support the check, mark the item pass=true and say so in 'notable' — a bad rubric is not the coder's fault.

If a case directory is missing or empty, mark every item pass=false with evidence "no output produced".

CASES
${JSON.stringify(b.map((c) => ({ case_id: c.id, prompt: c.prompt, rubric: c.rubric_graded })), null, 2)}

HARD LIMITS: read-only outside ${OUT}. Do not edit any file in ${REPO}. Do not run git write commands. Never use 'git stash'. Do not post or comment anywhere.`,
    { label: `grade:${RUN}:${i + 1}`, phase: 'Grade', schema: GRADE_SCHEMA, agentType: 'general-purpose', model: 'opus' }
  )
))

// The rubric spec in CASES is the authority, not the grader output. Graders drop
// real items and invent junk ones, so counting what they emitted measures the
// grader, not the skill. Reconcile every emitted item against the expected
// (case_id, rubric_id) pairs: an expected item nobody graded is a fail, and an
// item outside the spec is discarded.
const grades = graded.filter(Boolean).flatMap((g) => g.grades || [])
const emitted = new Map(CASES.map((c) => [c.id, []]))
const ungraded = []
const junk = []
const duplicates = []
for (const g of grades) {
  const items = g.items || []
  const bucket = emitted.get(g.case_id)
  if (!bucket) {
    for (const item of items) junk.push(`${g.case_id}/${(item && item.rubric_id) || '(empty)'}`)
    continue
  }
  for (const item of items) bucket.push(item)
}

let total = 0
let passed = 0
let apiCases = 0
let apiPassed = 0
for (const c of CASES) {
  const expected = (c.rubric_graded || []).map((r) => r.id)
  const kept = new Map()
  for (const item of emitted.get(c.id) || []) {
    const rid = item && item.rubric_id
    if (!rid || expected.indexOf(rid) === -1) {
      junk.push(`${c.id}/${rid || '(empty)'}`)
      continue
    }
    if (kept.has(rid)) {
      duplicates.push(`${c.id}/${rid}`)
      continue
    }
    kept.set(rid, item)
  }
  for (const rid of expected) {
    total += 1
    const item = kept.get(rid)
    if (!item) ungraded.push(`${c.id}/${rid}`)
    else if (item.pass) passed += 1
  }
  if (expected.indexOf('api') !== -1) {
    apiCases += 1
    const apiItem = kept.get('api')
    if (apiItem && apiItem.pass) apiPassed += 1
  }
}

const percent = total ? Math.round((passed / total) * 100) : 0
log(`${RUN}: strict: ${passed}/${total} (${percent}%) across ${CASES.length} cases`)
for (const u of ungraded) log(`UNGRADED: ${u}`)
if (junk.length) log(`junk/unknown rubric_ids: ${junk.length} (${junk.join(', ')})`)
if (duplicates.length) log(`duplicate rubric_ids: ${duplicates.length} (${duplicates.join(', ')})`)
log(`API-correct: ${apiPassed}/${apiCases} cases`)

return { run: RUN, grades, passed, total, percent, ungraded, junk, duplicates, apiPassed, apiCases }
