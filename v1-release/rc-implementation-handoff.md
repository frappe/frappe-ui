# RC implementation handoff

These are local ticket drafts. No GitHub issue, PR, or library implementation changed during this review.

Source review: `main` at `db3b5305626a3f33789612111d0534c65961e13f`, version `1.0.0-beta.61`.
Refresh the source and relevant PR state before implementation. Preserve unrelated work.

Decision record: [RC decision brief](rc-decision-brief.md).
Hosted review: https://frappe-ui-v1-decisions.netchamp-faris.chatgpt.site

## 1. Rename the rail into the Sidebar family

Existing issue: [#1116](https://github.com/frappe/frappe-ui/issues/1116).

Rename `Rail` to `SidebarRail` and `RailItem` to `SidebarRailItem` before RC.
Keep each independently composable beside `Sidebar`. The rail can also render alone.
Do not make Sidebar own the rail layout or turn the rail into its collapsed mode.

Inspect `src/components/Rail`, its exports in `src/index.ts`, documentation, stories, and consuming apps.
Rename related public types and symbols consistently. Treat component aliases as migration choices, not permanent duplicate APIs.
Document the accepted names and the migration before the RC freeze.

Acceptance:

- The new names import from `frappe-ui` and infer the existing props and events.
- Root exports, related public types, stories, documentation, and consumer imports agree.
- Existing rail interaction tests pass with the new names.
- Standalone rail and rail-plus-sidebar layouts preserve existing behavior.
- #1116 records the retained PageHeader, Duration, TimePicker, Divider.action, and renderless Editor contracts.
- Correct the Button.icon, Spinner, and password-input false premises without new component work.

## 2. Implement the input scale and fixed form typography

Existing issues: [#1117](https://github.com/frappe/frappe-ui/issues/1117) and [#1118](https://github.com/frappe/frappe-ui/issues/1118).

Use one owner because both issues change overlapping maps, types, examples, and tests.

Confirmed contract:

- Input sizes are `xs / sm / md / lg` with single-line heights of 24/28/32/40px.
- Add `xs` consistently and remove input `xl`.
- Labels, descriptions, and Textarea text stay at 13px.
- Labels and descriptions use `ink-gray-6`.
- Textarea size controls spacing and minimum height. Single-line heights do not prescribe Textarea height.
- Remove `FormLabel.size` as the consequence of fixed label typography.
- Leave Progress, Slider, and toggle scales separate.

Inspect `src/composables/inputTypes.ts`, TextInput, Textarea, FormLabel, InputLabeling, FormControl, and the selection size maps.
Include PickerShell and experimental consumers that share these types.

Acceptance:

- Every affected type accepts only sizes implemented by its renderer.
- FormControl can express the complete accepted input scale.
- Computed single-line heights match 24/28/32/40px at the standard root scale.
- Label and Textarea text remain 13px at every size.
- Both label implementations and descriptions use the confirmed `ink-gray-6` default. Verify contrast and disabled states in light and dark themes.
- Tests cover prefixes, suffixes, multiline content, labels, required indicators, and disabled states where affected.
- Invalid runtime sizes get a documented fallback rather than losing geometry classes.
- Check CRM, Helpdesk, Gameplan, and available framework consumers for `xl` and `FormLabel.size` usage.
- Document the migration and report unavailable consumer checks as unverified.
- Generated API tables and migration documentation match the final types.

The user confirmed `ink-gray-6` for labels and descriptions. This does not change the Textarea value color.
Update existing color types where required by the accepted default without introducing another public color API.

## 3. Add declarative responsive columns to List

Related PR: [#1097](https://github.com/frappe/frappe-ui/pull/1097). Revise its ancestor-inheritance contract.

Keep the simple `columns: string[]` form. Add this accepted object form:

```vue
<List
  :columns="{
    base: ['minmax(0, 1fr)', '80px', '64px'],
    md: ['minmax(0, 1fr)', '140px', '100px'],
    lg: ['minmax(0, 2fr)', '180px', '120px'],
  }"
>
  ...
</List>
```

Require `base`. Each breakpoint replaces the complete template and applies upward until the next supplied breakpoint.
Use the consuming app's responsive breakpoint definitions, including customized values.
Breakpoints mean viewport width. Each nested List owns its configuration.
Changing track widths or count does not hide cells. Callers coordinate matching header and body visibility classes.
Keep CSS variables internal and retain separate gap and row-padding utilities.

Inspect `src/molecules/list/List.vue`, `types.ts`, `style.css`, `list.md`, and `tailwind/plugin.js`.
Generate media rules through the app's Tailwind configuration. Use CSS for responsiveness without client viewport state.
Do not add named column registries, resize state, saved layouts, or a new Table export.

Acceptance:

- Existing array consumers continue to work.
- The object form requires base and provides useful Vue template inference.
- Verify below, at, and above each configured breakpoint.
- Omitted breakpoints retain the previous applicable template; arrays are not merged by index.
- An app-customized md value agrees with that app's md visibility utilities.
- Every List root resets internal breakpoint values, including roots without explicit columns.
- Test outer-responsive/inner-static, outer-static/inner-responsive, and inner-default combinations.
- SSR markup renders the correct responsive result without waiting for hydration.
- Header and row tracks agree for deterministic column sizes.
- Documentation explains that independent row grids do not share intrinsic auto sizing.
- Virtualized row height continues to match the virtualizer's assumptions.
- Revise the relevant ADR, generated API tables, and #1097 tests.

## 4. Finish public type and model-event repairs

Related PRs: [#1091](https://github.com/frappe/frappe-ui/pull/1091) and [#1098](https://github.com/frappe/frappe-ui/pull/1098).

Integrate after the rename and responsive type changes, or rebase and verify them together.
Preserve runtime model events while correcting duplicate declarations.
Check exported interface members as well as template inference.

Acceptance:

- Consumers can import the documented public types.
- Typed Vue examples compile with v-model and explicit model-update listeners.
- Document removed public interface members even when the runtime event still exists.
- Verify actual duplicate declarations rather than changing every component named in an old issue.
- Include DividerAction documentation/export consistency in the public-type audit.

## 5. Reconcile release scope and run integration checks

Reconcile [#1029](https://github.com/frappe/frappe-ui/issues/1029), the Wayfinder map, related API tickets, and `v1-release/plan.md`.
Use existing tickets for the work above. Avoid duplicate issues.

Confirmed 1.1 deferrals: natural dates #1101, href navigation #1125, parity additions #1122, Tag/Notification #1123,
PhoneInput #930, resizable layouts #542, MultiSelect creation #809, and initializer #826.
Deferral does not approve their future API designs or mean the work is complete.

Saqib owns charts #1128. Coordinate its RC readiness without reopening his API decisions in this queue.
Keep the tooltip grouping and migration findings in the decision brief available for his review.

Review correctness fixes against current main before adopting old patches.
Prioritize cache isolation #1006, reconnect subscriptions #1105, early toasts #1062, and accessible names #1089/#1039/#1113.
Do not make every open issue an RC blocker.

Integration acceptance:

- Run the repository's current required CI checks, including type checks, tests, component tests, and API-table checks.
- Check documentation and migration examples against the final exports.
- Build and boot CRM, Helpdesk, and Gameplan against the candidate. Record exact revisions and results.
- Resolve failures or record a concrete blocker. Passing library CI does not replace consumer validation.
- Prepare release notes and RC artifacts only after required checks pass.
- Follow #1029's existing one-week app soak and maintainer sign-off policy.
- An API break requires another RC and restarts the soak. Ordinary bug fixes follow the existing release policy.

## Execution order

1. Reconcile the approved decisions into the existing tickets and release instructions.
2. Run rail, input/typography, and List implementation in isolated worktrees with separate file ownership.
3. Serialize shared export-barrel integration and generated documentation updates.
4. Integrate public types and coordinate Saqib's charts work.
5. Run release validation and report the remaining blockers with evidence.

For AFK execution, persist each task's branch, commit, test results, and blocker in its ticket or local checkpoint.
Escalate new public-contract changes, material consumer migration costs, and failures that cannot be resolved within the accepted scope.
This handoff prepares the implementation work; it does not claim that the library has been changed or that an RC is ready.
