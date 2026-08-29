# Observed failures — blind eval, current skill

*2026-08 audit of the pre-merge five-file layout. COMPONENTS.md, DESIGN.md and TOKENS.md have since merged into CORE.md, so the line anchors below no longer resolve.*

Baseline: API-correctness clean in 4 of 10 cases. Every defect below was written
by an agent that had the skill loaded and could NOT read library source. That is
the condition the skill ships for.

Two categories. Fix both, but category A first: the skill caused those.

## A. The skill actively taught the wrong thing

| # | Defect written | Skill line responsible | Cases |
|---|---|---|---|
| A1 | `<LoadingText :lines="4" />` | DESIGN.md:244 literally shows `<LoadingText :lines="3" />`. `LoadingTextProps` has only `text?: string`. | 5 |
| A2 | `const { values } = await dialog.prompt({...})` | COMPONENTS.md:51 shows exactly this. `prompt()` returns `DialogHandle` synchronously; `onConfirm` is REQUIRED and receives `{ values }`. | 1 |
| A3 | `<PageHeader><template #suffix>` — button silently never renders | SKILL.md rule 7: "Slot vocabulary is fixed. `#prefix`, `#suffix`, ..." reads as universal. `PageHeader` declares only a default slot. | 1 |
| A4 | `useDoc({ cacheKey: [...] })` — option does not exist | COMPONENTS.md documents `cacheKey` under `useCall`, then says useList/useDoc are "higher-level wrappers around `useCall`", implying shared options. | 1 |
| A5 | Dropdown `{ group, items }` — renders nothing | COMPONENTS.md:35 shows this shape. `MenuGroupOption` is `{ group, options }` with `items?: never`. | 1 |

## B. The skill was silent, so the agent guessed wrong

| # | Defect written | What is missing | Cases |
|---|---|---|---|
| B1 | `:columns="[{ key, label, width }]"` — table renders `[object Object]`, layout dead | `ListProps.columns` is `string[]` of **CSS grid track sizes**; `List.vue` does `columns.join(' ')`. The skill says "table mode (`:columns` + `ListHeader`)" and never says what `columns` IS. **Highest-value single omission.** | 2 |
| B2 | `<ListRow :row="ticket">` | `ListRowProps` is `{ to, value, onClick }`. `value` is the row key, required for `selectable` / `v-model:active`. The skill never documents ListRow's props. | 3 |
| B3 | `<Dropdown placement="right">` — ignored | `DropdownProps` has `side` and `align`. Never documented. | 1 |
| B4 | `<CommandPaletteItem :label :icon>` with no `:value` — rows blank, select carries nothing | `CommandPaletteItemProps` requires `value`; label comes from the default slot (the `label` prop only feeds the filter); icons go in `#prefix`. The skill names the seven parts but documents none of their props. | 1 |
| B5 | `ListHeaderCell :column :label` — headers render empty | `ListHeaderCell` takes its label in the default slot. | 2 |

## What this means for the rewrite

- Length is not the problem. Cutting to ~500 lines would make this worse.
- The skill is thorough about WHICH component to pick (every case picked right)
  and thin about HOW to call it. Every failure is a prop/slot/shape error.
- Budget shift: spend fewer lines on prohibitions (56 of them, 19 naming a dead
  API, 11 where the ban is that name's only appearance) and more on the prop
  facts above.
- Do NOT touch the frontmatter `description`. Invocation scored 12/12 — 4/4
  triggers fired, 2/2 non-triggers stayed silent. That part works.
