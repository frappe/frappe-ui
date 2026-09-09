# Checkpoint — inputs / typography track (#1117, #1118)

- **Branch**: `v1/rc-inputs`
- **Base**: `2d65281be8` (`v1.0.0-beta.62`) on `main`
- **Contract**: `v1-release/rc-implementation-handoff.md` §2 + decision brief D2/D3
  (both untracked here; owned by the integration agent)

## Confirmed contract (not relitigated)

- Input sizes `xs / sm / md / lg`; single-line heights **24 / 28 / 32 / 40px**.
- Add `xs` everywhere; remove input `xl`.
- Labels, descriptions and Textarea text fixed at **13px**.
- Labels and descriptions default to **`ink-gray-6`** (Textarea *value* colour unchanged).
- Textarea `size` drives spacing + min-height only.
- `FormLabel.size` removed.
- Progress / Slider / toggle scales untouched.

## Surface map (from the source audit)

Five separate declarations of the input scale, per #1117:

| Declaration | File |
| --- | --- |
| `InputSize` | `src/composables/inputTypes.ts` |
| `SelectionSize` | `src/components/shared/selection/utils.ts` |
| `ItemListSize` | `src/components/ItemListRow/types.ts` |
| `ComboboxSize` | `src/components/Combobox/types.ts` |
| `MultiSelectSize` | `src/components/MultiSelect/types.ts` |
| Select inline union | `src/components/Select/types.ts` |
| `FormControl.size` (capped `sm\|md`) | `src/components/FormControl/types.ts` |

Class maps needing an `xs` row / losing `xl`:
`TextInput.vue` (3 maps), `Textarea.vue` (2), `Rating.vue` (1),
`shared/selection/utils.ts` (3), `Select/utils.ts` (1), `ItemListRow.vue` (1),
`experimental/CodeEditor/CodeEditor.vue` (1).

Downstream via `InputSize`, no local map: `Password`, `TimePicker`, `Duration`,
`DatePicker` family, `shared/picker/PickerShell.vue`.
Downstream via `SelectionSize`: `experimental/MultiEmailInput`.

## Status

- [x] Audit + surface map
- [ ] Size scale implementation
- [ ] Typography + colour implementation
- [ ] Tests (computed geometry)
- [ ] Docs / migration / `docs:gen`
- [ ] Screenshots
- [ ] Consumer census

## Verification log

(none yet)

## Consumer usage

(census running)

## Open questions

(none yet)
