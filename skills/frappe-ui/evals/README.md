# Skill eval harness

A regression gate for `skills/frappe-ui/`. Run it before and after any edit to
the skill. It answers two questions the skill's own text cannot:

1. **Does the skill fire?** Scored from agent transcripts, never from self-report.
2. **Does an agent that has only the skill write correct code?** Scored against
   library source, never against the skill.

## Files

| File | What it is |
|---|---|
| `cases.json` | the 12-case set: 4 trigger, 2 non-trigger, 3 component-choice, 3 guideline |
| `cases-full-24.json` | the full 24-case set the 12 were drawn from |
| `run.workflow.js` | the runner: one fresh builder per case, then batched graders |
| `score_invocation.py` | reads agent transcripts and reports what the agent actually did |
| `findings-2026-08.md` | 59 source-verified defects found in the pre-rewrite skill |
| `observed-failures-2026-08.md` | the 10 defect classes agents actually produced |

## Two conditions that make or break the measurement

**Run builders source-blind.** Pass `sourceBlind: true`. Without it, builders
read `src/` and grade themselves against the truth, and every case passes whatever
the skill says. The first run of this eval scored 41/41 that way and meant nothing.
A blind run scored 4/10.

**Neutralize standing instructions.** A user-level `CLAUDE.md` that says "load the
frappe-ui skill" makes every trigger case pass for the wrong reason. The runner
prepends a scope note that suspends those sections. Check it still matches the
wording of any standing instructions in play.

Graders are barred from reading `skills/` — grading the artefact against itself
lets a wrong instruction score as a pass.

## Running

    Workflow({
      scriptPath: 'skills/frappe-ui/evals/run.workflow.js',
      args: { repo: '<abs path to the frappe-ui checkout>',
              casesFile: '<abs>/cases.json', outDir: '/tmp/fui-run',
              runLabel: 'run', sourceBlind: true }
    })

Then score invocation from the workflow's transcript dir:

    python3 score_invocation.py <transcriptDir> cases.json out.json '/tmp/fui-run/{id}/'

`gradeOnly: true` re-grades existing output without rebuilding — use it when you
change a rubric.

## Result, 2026-08

| Metric | Before | After |
|---|---|---|
| Invocation correct | 12/12 | 12/12 |
| Rubric items | 45/52 | 49/51 |
| API-correct cases | 4/10 | 8/10 |

Invocation was already perfect and the frontmatter `description` was left
untouched. Every gain came from prop-level facts. The failures were never about
picking the wrong component — the agent picked right in all 12 cases both times
— they were about calling it wrong.
