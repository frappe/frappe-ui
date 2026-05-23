# Token Diff — `v0.1.278` vs `v1/espresso-tokens` HEAD

- **Baseline**: tag `v0.1.278` (`469b2294`)
- **Target**: `v1/espresso-tokens` HEAD (`002efa1f`)
- **Scope**: `tailwind/colors.json`, `tailwind/plugin.js`,
  `tailwind/colorPalette.js`, new `tailwind/tokens.js`, new
  `tailwind/generated/{colors,radius,typography,effects}.json`

> Format note: every `#RRGGBB` literal in `colors.json` was re-cased from
> uppercase to lowercase across the entire file. The change is mechanical and
> not separately listed against every shade — listed once under each color
> family's **Format-only changes** subsection. Hex values reported in the
> value-change tables below are quoted in the case they actually appear
> (lowercase on HEAD, uppercase on baseline).

---

## Summary

### Counts per category (HEAD vs `v0.1.278`)

| Category                                    | Added                                                                                                                                                        | Removed                | Value-changed                                                                                                                        | Format-only                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| A. Colors — `lightMode/gray`                | 1 (`950`)                                                                                                                                                    | 0                      | 0                                                                                                                                    | 10 case                                 |
| A. Colors — `lightMode/blue`                | 1 (`950`)                                                                                                                                                    | 0                      | 1 (`50`)                                                                                                                             | 10 case                                 |
| A. Colors — `lightMode/green`               | 1 (`950`)                                                                                                                                                    | 0                      | 4 (`50,400,600,…`)                                                                                                                   | 10 case                                 |
| A. Colors — `lightMode/red`                 | 1 (`950`)                                                                                                                                                    | 0                      | 0                                                                                                                                    | 10 case                                 |
| A. Colors — `lightMode/orange`              | 1 (`950`)                                                                                                                                                    | 0                      | 2 (`50,600`)                                                                                                                         | 10 case                                 |
| A. Colors — `lightMode/amber`               | 1 (`950`)                                                                                                                                                    | 0                      | 2 (`400,600`)                                                                                                                        | 10 case                                 |
| A. Colors — `lightMode/yellow`              | 1 (`950`)                                                                                                                                                    | 0                      | 3 (`50,600,700`)                                                                                                                     | 10 case                                 |
| A. Colors — `lightMode/teal`                | 1 (`950`)                                                                                                                                                    | 0                      | 2 (`50,600`)                                                                                                                         | 10 case                                 |
| A. Colors — `lightMode/cyan`                | 1 (`950`)                                                                                                                                                    | 0                      | 3 (`50,600,700`)                                                                                                                     | 10 case                                 |
| A. Colors — `lightMode/purple`              | 1 (`950`)                                                                                                                                                    | 0                      | 3 (`50,400,600`)                                                                                                                     | 10 case                                 |
| A. Colors — `lightMode/pink`                | 1 (`950`)                                                                                                                                                    | 0                      | 2 (`400,950 added`)                                                                                                                  | 10 case                                 |
| A. Colors — `lightMode/violet`              | 1 (`950`)                                                                                                                                                    | 0                      | 5 (`50,100,400,500,600`)                                                                                                             | 10 case                                 |
| A. Colors — `lightMode/gray-alpha`          | 11 (entire family)                                                                                                                                           | 0                      | n/a                                                                                                                                  | n/a                                     |
| A. Colors — `darkMode/gray`                 | 2 (`450`, `950`)                                                                                                                                             | 1 (`250`)              | 5 (`100,650→700,700→800,800→900,900→950 etc.`)                                                                                       | 10 case                                 |
| A. Colors — `darkMode/blue`                 | 1 (`950`)                                                                                                                                                    | 1 (`900-80`)           | 2 (`400, 900`)                                                                                                                       | rest case                               |
| A. Colors — `darkMode/green`                | 1 (`950`)                                                                                                                                                    | 0                      | 4 (`400,500,600,900`)                                                                                                                | rest case                               |
| A. Colors — `darkMode/red`                  | 1 (`950`)                                                                                                                                                    | 2 (`800-90`, `900-90`) | 7 (`50,100,200,400,500,600,700,900`)                                                                                                 | rest case                               |
| A. Colors — `darkMode/orange`               | 1 (`950`)                                                                                                                                                    | 1 (`900-80`)           | 2 (`300, 900`)                                                                                                                       | rest case                               |
| A. Colors — `darkMode/amber`                | 1 (`950`)                                                                                                                                                    | 0                      | 9 (`50,100,200,300,400,500,600,700`)                                                                                                 | rest case                               |
| A. Colors — `darkMode/yellow`               | 1 (`950`)                                                                                                                                                    | 0                      | 7 (`50,100,300,400,500,600,800-keep,900`)                                                                                            | rest case                               |
| A. Colors — `darkMode/teal`                 | 1 (`950`)                                                                                                                                                    | 0                      | 5 (`50,100,200,300,400,600,700`)                                                                                                     | rest case                               |
| A. Colors — `darkMode/cyan`                 | 1 (`950`)                                                                                                                                                    | 0                      | 7 (`100,200,400,500,600,700,800,900`)                                                                                                | rest case                               |
| A. Colors — `darkMode/purple`               | 1 (`950`)                                                                                                                                                    | 0                      | 4 (`400,600,700,900`)                                                                                                                | rest case                               |
| A. Colors — `darkMode/pink`                 | 1 (`950`)                                                                                                                                                    | 1 (`900-80`)           | 6 (`50,400,600,700,800,900`)                                                                                                         | rest case                               |
| A. Colors — `darkMode/violet`               | 1 (`950`)                                                                                                                                                    | 0                      | 9 (`50,100,200,300,400,500,600,700,800,900`)                                                                                         | rest case                               |
| A. Colors — `darkMode/gray-alpha`           | 12 (entire family)                                                                                                                                           | 0                      | n/a                                                                                                                                  | n/a                                     |
| A. Colors — `darkMode/red-alpha`            | 11 (entire family)                                                                                                                                           | 0                      | n/a                                                                                                                                  | n/a                                     |
| A. Colors — `overlay/white`                 | 1 (`950`)                                                                                                                                                    | 0                      | 1 (`900`)                                                                                                                            | case                                    |
| A. Colors — `overlay/black`                 | 1 (`950`)                                                                                                                                                    | 0                      | 1 (`900`)                                                                                                                            | case                                    |
| A. Colors — `neutral`                       | 0                                                                                                                                                            | 0                      | 0                                                                                                                                    | 2 case                                  |
| A. Colors — `themedVariables.light.surface` | 26 keys added                                                                                                                                                | 0                      | 0 mapping changes among kept keys                                                                                                    | —                                       |
| A. Colors — `themedVariables.light.ink`     | 13 keys added                                                                                                                                                | 0                      | 0 mapping changes                                                                                                                    | —                                       |
| A. Colors — `themedVariables.light.outline` | 18 keys added; key `gray-modals` retained, `gray-modal` added                                                                                                | 0                      | 0 mapping changes                                                                                                                    | —                                       |
| A. Colors — `themedVariables.dark.surface`  | 28 keys added                                                                                                                                                | 0                      | 7 mapping changes (gray-1, gray-2, modal, selected, red-1, red-2, red-3, etc.)                                                       | —                                       |
| A. Colors — `themedVariables.dark.ink`      | 14 keys added                                                                                                                                                | 0                      | 7 mapping changes (gray-1, gray-2, gray-9, red-2, green-2, amber-2…)                                                                 | —                                       |
| A. Colors — `themedVariables.dark.outline`  | 18 keys added                                                                                                                                                | 0                      | 1 mapping change (`gray-1` darkMode/gray/700→800; `gray-4` ↦ 450)                                                                    | —                                       |
| B. Semantic colors mapping                  | function changed                                                                                                                                             | —                      | wrap-in-`color-mix(...alpha-value...)` instead of bare `var(...)`                                                                    | —                                       |
| C. borderRadius                             | 9 numeric keys + new aliases                                                                                                                                 | 0                      | values shift (e.g. `sm` 4px stays; `md` 0.625rem→10px CSS-var, `2xl` 1.25rem→20px)                                                   | many `rem`→`px` format-only equivalents |
| D. boxShadow                                | 8 new keys (`base`, `status`, `dark-*`)                                                                                                                      | 0                      | every value is now `var(--elevation-*)`; underlying shadow definitions completely re-authored                                        | —                                       |
| E. fontSize                                 | 1 new key (`tiny`)                                                                                                                                           | 0                      | 6 keys: `xl/2xl/3xl/p-xl/p-2xl/p-3xl` line-heights swapped to fixed px from ratios; `lg.lineHeight 1.15→18px` style across the board | size literals unchanged for 2xs–3xl     |
| F. Other theme keys                         | `--radius-*`, `--focus-*`, `--elevation-*`, `--dark-elevation-*` CSS vars added                                                                              | 0                      | —                                                                                                                                    | —                                       |
| G. New utilities via `addComponents`        | `.text-base-medium`, `.text-lg-medium`, `.focus-ring`, `.focus-ring-red`, `.focus-ring-green`, `.focus-ring-amber`, `.focus-ring-blue`, `.focus-ring-violet` | 0                      | —                                                                                                                                    | —                                       |
| H. Plugin extras                            | `gradientColorStops` extension added                                                                                                                         | 0                      | —                                                                                                                                    | —                                       |
| I. Prose typography (`v3`)                  | 0                                                                                                                                                            | 0                      | `fontSize: '14px'` → `'15px'` (only changed CSS value in `v3`)                                                                       | —                                       |

---

## A. Color palette — `colors.json`

Every concrete value is enumerated below. Hex literals show the case as they
appear in the respective file. Format-only re-casing (uppercase→lowercase) is
listed once per family.

### A.1 `lightMode.gray`

| Shade | v0.1.278  | HEAD      | Status      |
| ----- | --------- | --------- | ----------- |
| 50    | `#F8F8F8` | `#f8f8f8` | format-only |
| 100   | `#F3F3F3` | `#f3f3f3` | format-only |
| 200   | `#EDEDED` | `#ededed` | format-only |
| 300   | `#E2E2E2` | `#e2e2e2` | format-only |
| 400   | `#C7C7C7` | `#c7c7c7` | format-only |
| 500   | `#999999` | `#999999` | unchanged   |
| 600   | `#7C7C7C` | `#7c7c7c` | format-only |
| 700   | `#525252` | `#525252` | unchanged   |
| 800   | `#383838` | `#383838` | unchanged   |
| 900   | `#171717` | `#171717` | unchanged   |
| 950   | —         | `#0f0f0f` | **added**   |

### A.2 `lightMode.blue`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#F2F9FF` | `#f0f7fc` | **value change** |
| 100   | `#E6F4FF` | `#e6f4ff` | format-only      |
| 200   | `#C8E6FF` | `#c8e6ff` | format-only      |
| 300   | `#A7D7FD` | `#a7d7fd` | format-only      |
| 400   | `#73BBF6` | `#73bbf6` | format-only      |
| 500   | `#0289F7` | `#0289f7` | format-only      |
| 600   | `#007BE0` | `#007be0` | format-only      |
| 700   | `#0070CC` | `#0070cc` | format-only      |
| 800   | `#005CA3` | `#005ca3` | format-only      |
| 900   | `#004880` | `#004880` | unchanged        |
| 950   | —         | `#032e63` | **added**        |

### A.3 `lightMode.green`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#F2FDF4` | `#f1fbf5` | **value change** |
| 100   | `#E4FAEB` | `#e4faeb` | format-only      |
| 200   | `#C3F9D3` | `#c3f9d3` | format-only      |
| 300   | `#A6EFC0` | `#a6efc0` | format-only      |
| 400   | `#86E0A8` | `#78e09f` | **value change** |
| 500   | `#46B37E` | `#46b37e` | format-only      |
| 600   | `#278F5E` | `#268c5c` | **value change** |
| 700   | `#137949` | `#137949` | unchanged        |
| 800   | `#075E35` | `#075e35` | format-only      |
| 900   | `#173B2C` | `#173b2c` | format-only      |
| 950   | —         | `#0a3020` | **added**        |

### A.4 `lightMode.red`

| Shade | v0.1.278  | HEAD      | Status      |
| ----- | --------- | --------- | ----------- |
| 50    | `#FFF7F7` | `#fff7f7` | format-only |
| 100   | `#FFE7E7` | `#ffe7e7` | format-only |
| 200   | `#FFD8D8` | `#ffd8d8` | format-only |
| 300   | `#FDC2C2` | `#fdc2c2` | format-only |
| 400   | `#F79596` | `#f79596` | format-only |
| 500   | `#E03636` | `#e03636` | format-only |
| 600   | `#CC2929` | `#cc2929` | format-only |
| 700   | `#B52A2A` | `#b52a2a` | format-only |
| 800   | `#941F1F` | `#941f1f` | format-only |
| 900   | `#6B1515` | `#6b1515` | format-only |
| 950   | —         | `#4c0d0d` | **added**   |

### A.5 `lightMode.orange`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#FFF9F5` | `#fff4ed` | **value change** |
| 100   | `#FFEFE4` | `#ffefe4` | format-only      |
| 200   | `#FFDEC5` | `#ffdec5` | format-only      |
| 300   | `#FFCBA3` | `#ffcba3` | format-only      |
| 400   | `#F4B07F` | `#f4b07f` | format-only      |
| 500   | `#E86C13` | `#e86c13` | format-only      |
| 600   | `#D45A08` | `#d35a09` | **value change** |
| 700   | `#BD3E0C` | `#bd3e0c` | format-only      |
| 800   | `#9E3513` | `#9e3513` | format-only      |
| 900   | `#6B2711` | `#6b2711` | format-only      |
| 950   | —         | `#491605` | **added**        |

### A.6 `lightMode.amber`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#FDFAED` | `#fdfaed` | format-only      |
| 100   | `#FFF7D3` | `#fff7d3` | format-only      |
| 200   | `#FEEDA9` | `#feeda9` | format-only      |
| 300   | `#FBDB73` | `#fbdb73` | format-only      |
| 400   | `#FBCC55` | `#fbc53f` | **value change** |
| 500   | `#E79913` | `#e79913` | format-only      |
| 600   | `#DB7706` | `#d47408` | **value change** |
| 700   | `#B35309` | `#b35309` | format-only      |
| 800   | `#91400D` | `#91400d` | format-only      |
| 900   | `#763813` | `#763813` | unchanged        |
| 950   | —         | `#4e2209` | **added**        |

### A.7 `lightMode.yellow`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#FFFCEF` | `#fcfbe8` | **value change** |
| 100   | `#FFF7D3` | `#fff7d3` | format-only      |
| 200   | `#F7E9A8` | `#f7e9a8` | format-only      |
| 300   | `#F5E171` | `#f5e171` | format-only      |
| 400   | `#F2D14B` | `#f2d14b` | format-only      |
| 500   | `#EDBA13` | `#edba13` | format-only      |
| 600   | `#D1930D` | `#ab790d` | **value change** |
| 700   | `#AB6E05` | `#9a6304` | **value change** |
| 800   | `#8C5600` | `#8c5600` | format-only      |
| 900   | `#733F12` | `#733f12` | format-only      |
| 950   | —         | `#512a09` | **added**        |

### A.8 `lightMode.teal`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#F0FDFA` | `#eefbf8` | **value change** |
| 100   | `#E6F7F4` | `#e6f7f4` | format-only      |
| 200   | `#BAE8E1` | `#bae8e1` | format-only      |
| 300   | `#97DED4` | `#97ded4` | format-only      |
| 400   | `#73D1C4` | `#73d1c4` | format-only      |
| 500   | `#36BAAD` | `#36baad` | format-only      |
| 600   | `#0B9E92` | `#0a857b` | **value change** |
| 700   | `#0F736B` | `#0f736b` | format-only      |
| 800   | `#115C57` | `#115c57` | format-only      |
| 900   | `#114541` | `#114541` | unchanged        |
| 950   | —         | `#053734` | **added**        |

### A.9 `lightMode.cyan`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#F5FBFC` | `#f2fbfd` | **value change** |
| 100   | `#DDF7FF` | `#ddf7ff` | format-only      |
| 200   | `#B3E8F7` | `#b3e8f7` | format-only      |
| 300   | `#99E2F8` | `#99e2f8` | format-only      |
| 400   | `#72D5F3` | `#72d5f3` | format-only      |
| 500   | `#3BBDE5` | `#3bbde5` | format-only      |
| 600   | `#32A4C7` | `#1f8cad` | **value change** |
| 700   | `#267A94` | `#1d7f9d` | **value change** |
| 800   | `#125C73` | `#125c73` | format-only      |
| 900   | `#164759` | `#164759` | unchanged        |
| 950   | —         | `#05383f` | **added**        |

### A.10 `lightMode.purple`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#FDFAFF` | `#f8f3fb` | **value change** |
| 100   | `#F6E9FF` | `#f6e9ff` | format-only      |
| 200   | `#ECD3FF` | `#ecd3ff` | format-only      |
| 300   | `#E2B9FC` | `#e2b9fc` | format-only      |
| 400   | `#CFA1F2` | `#bf78fa` | **value change** |
| 500   | `#9C45E3` | `#9c45e3` | format-only      |
| 600   | `#8642C2` | `#8e49ca` | **value change** |
| 700   | `#6E399D` | `#6e399d` | format-only      |
| 800   | `#5C2F83` | `#5c2f83` | format-only      |
| 900   | `#401863` | `#401863` | unchanged        |
| 950   | —         | `#2d084e` | **added**        |

### A.11 `lightMode.pink`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#FFF7FC` | `#fff7fc` | format-only      |
| 100   | `#FDE8F5` | `#fde8f5` | format-only      |
| 200   | `#FFD5F0` | `#ffd5f0` | format-only      |
| 300   | `#F9B9E0` | `#f9b9e0` | format-only      |
| 400   | `#F6A7D6` | `#f77cc6` | **value change** |
| 500   | `#E34AA6` | `#e34aa6` | format-only      |
| 600   | `#CF3A96` | `#cf3a96` | format-only      |
| 700   | `#9C2671` | `#9c2671` | format-only      |
| 800   | `#801458` | `#801458` | unchanged        |
| 900   | `#570F3E` | `#570f3e` | format-only      |
| 950   | —         | `#40062c` | **added**        |

### A.12 `lightMode.violet`

| Shade | v0.1.278  | HEAD      | Status           |
| ----- | --------- | --------- | ---------------- |
| 50    | `#FBFAFF` | `#f5f3fc` | **value change** |
| 100   | `#F0EBFF` | `#eee8ff` | **value change** |
| 200   | `#DBD5FF` | `#dbd5ff` | format-only      |
| 300   | `#C9BAFB` | `#c9bafb` | format-only      |
| 400   | `#B3A1F5` | `#a68efe` | **value change** |
| 500   | `#6846E3` | `#7757ee` | **value change** |
| 600   | `#5F46C7` | `#6b53d0` | **value change** |
| 700   | `#4F3DA1` | `#4f3da1` | format-only      |
| 800   | `#392980` | `#392980` | unchanged        |
| 900   | `#251959` | `#251959` | unchanged        |
| 950   | —         | `#150655` | **added**        |

### A.13 `lightMode.gray-alpha`

Entire family added. v0.1.278 had no `gray-alpha` under `lightMode`.

| Shade | HEAD        |
| ----- | ----------- |
| 50    | `#00000008` |
| 100   | `#0000000b` |
| 200   | `#00000012` |
| 300   | `#0000001d` |
| 400   | `#00000038` |
| 500   | `#00000066` |
| 600   | `#00000083` |
| 700   | `#000000ad` |
| 800   | `#000000c7` |
| 900   | `#000000e8` |
| 950   | `#000000f0` |

### A.14 `darkMode.gray`

| Shade   | v0.1.278  | HEAD      | Status                                                |
| ------- | --------- | --------- | ----------------------------------------------------- |
| 50      | `#F8F8F8` | `#f8f8f8` | format-only                                           |
| 100     | `#D4D4D4` | `#d9d9d9` | **value change**                                      |
| 200     | `#AFAFAF` | `#afafaf` | format-only                                           |
| **250** | `#999999` | —         | **removed**                                           |
| 300     | `#808080` | `#808080` | unchanged                                             |
| 400     | `#717171` | `#717171` | unchanged                                             |
| **450** | —         | `#575757` | **added**                                             |
| 500     | `#424242` | `#424242` | unchanged                                             |
| 600     | `#343434` | `#343434` | unchanged                                             |
| **650** | `#2B2B2B` | —         | **removed**                                           |
| 700     | `#232323` | `#2b2b2b` | **value change** (note: 700 inherits the old 650 hex) |
| 800     | `#1C1C1C` | `#242424` | **value change**                                      |
| 900     | `#0F0F0F` | `#1f1f1f` | **value change**                                      |
| **950** | —         | `#171717` | **added**                                             |

Net effect: the dark-gray scale was renumbered. `250` and `650` are gone, `450`
and `950` arrived; `700/800/900` carry new hex values.

### A.15 `darkMode.blue`

| Shade      | v0.1.278    | HEAD      | Status           |
| ---------- | ----------- | --------- | ---------------- |
| 50         | `#C9E0F5`   | `#c9e0f5` | format-only      |
| 100        | `#ADD2F5`   | `#add2f5` | format-only      |
| 200        | `#8CC1EC`   | `#8cc1ec` | format-only      |
| 300        | `#5AAEF2`   | `#5aaef2` | format-only      |
| 400        | `#3294E3`   | `#2a8edf` | **value change** |
| 500        | `#1580D8`   | `#1580d8` | format-only      |
| 600        | `#155999`   | `#155999` | unchanged        |
| 700        | `#063D71`   | `#063d71` | format-only      |
| 800        | `#052B53`   | `#052b53` | format-only      |
| 900        | `#0E2037`   | `#10233d` | **value change** |
| **900-80** | `#0E2037CC` | —         | **removed**      |
| **950**    | —           | `#0e1c2f` | **added**        |

### A.16 `darkMode.green`

| Shade   | v0.1.278  | HEAD      | Status           |
| ------- | --------- | --------- | ---------------- |
| 50      | `#C8F3DE` | `#c8f3de` | format-only      |
| 100     | `#9BE6C1` | `#9be6c1` | format-only      |
| 200     | `#78D7A9` | `#78d7a9` | format-only      |
| 300     | `#58C08E` | `#58c08e` | format-only      |
| 400     | `#1BA964` | `#469170` | **value change** |
| 500     | `#0A9752` | `#148950` | **value change** |
| 600     | `#0F814A` | `#077241` | **value change** |
| 700     | `#035831` | `#035831` | unchanged        |
| 800     | `#0A3F27` | `#0a3f27` | format-only      |
| 900     | `#0B2E1C` | `#0c2d1c` | **value change** |
| **950** | —         | `#0b1e14` | **added**        |

### A.17 `darkMode.red`

| Shade      | v0.1.278    | HEAD      | Status           |
| ---------- | ----------- | --------- | ---------------- |
| 50         | `#FFC1C1`   | `#ffdede` | **value change** |
| 100        | `#FF9595`   | `#ffc1c1` | **value change** |
| 200        | `#FC7474`   | `#fe7c7c` | **value change** |
| 300        | `#EB4D52`   | `#eb4d52` | format-only      |
| 400        | `#E43838`   | `#ce5a5a` | **value change** |
| 500        | `#C12020`   | `#b01f1f` | **value change** |
| 600        | `#901818`   | `#862020` | **value change** |
| 700        | `#681916`   | `#661717` | **value change** |
| 800        | `#521515`   | `#521515` | unchanged        |
| **800-90** | `#521515E6` | —         | **removed**      |
| 900        | `#361515`   | `#441316` | **value change** |
| **900-90** | `#361515E6` | —         | **removed**      |
| **950**    | —           | `#271111` | **added**        |

### A.18 `darkMode.orange`

| Shade      | v0.1.278    | HEAD      | Status           |
| ---------- | ----------- | --------- | ---------------- |
| 50         | `#FFCDAD`   | `#ffcdad` | format-only      |
| 100        | `#FFA873`   | `#ffa873` | format-only      |
| 200        | `#FA8A40`   | `#fa8a40` | format-only      |
| 300        | `#DE6D1B`   | `#e3701c` | **value change** |
| 400        | `#C45A0E`   | `#e16914` | **value change** |
| 500        | `#984509`   | `#984509` | unchanged        |
| 600        | `#823906`   | `#823906` | unchanged        |
| 700        | `#683108`   | `#683108` | unchanged        |
| 800        | `#532707`   | `#532707` | unchanged        |
| 900        | `#401F07`   | `#361c09` | **value change** |
| **900-80** | `#401F07CC` | —         | **removed**      |
| **950**    | —           | `#2b1708` | **added**        |

### A.19 `darkMode.amber`

| Shade   | v0.1.278  | HEAD      | Status           |
| ------- | --------- | --------- | ---------------- |
| 50      | `#F9E8A5` | `#ffe59a` | **value change** |
| 100     | `#F8D16E` | `#f4c25f` | **value change** |
| 200     | `#F0BA31` | `#ffaa3e` | **value change** |
| 300     | `#E79913` | `#fa961f` | **value change** |
| 400     | `#E37D00` | `#c87a2d` | **value change** |
| 500     | `#CB6D10` | `#bd660f` | **value change** |
| 600     | `#824108` | `#975215` | **value change** |
| 700     | `#603007` | `#753a07` | **value change** |
| 800     | `#4B2606` | `#4b2606` | format-only      |
| 900     | `#371E06` | `#371e06` | format-only      |
| **950** | —         | `#281808` | **added**        |

### A.20 `darkMode.yellow`

| Shade   | v0.1.278  | HEAD      | Status           |
| ------- | --------- | --------- | ---------------- |
| 50      | `#FFE89D` | `#ffeeb8` | **value change** |
| 100     | `#F8D76A` | `#ffe386` | **value change** |
| 200     | `#ECC02E` | `#f8d76a` | **value change** |
| 300     | `#DAAE15` | `#ecc02e` | **value change** |
| 400     | `#C69C12` | `#bb972a` | **value change** |
| 500     | `#9C7A0A` | `#9c7e1c` | **value change** |
| 600     | `#705606` | `#99780a` | **value change** |
| 700     | `#5B4605` | `#705606` | **value change** |
| 800     | `#3F3004` | `#5b4605` | **value change** |
| 900     | `#322604` | `#3a2c04` | **value change** |
| **950** | —         | `#261d03` | **added**        |

### A.21 `darkMode.teal`

| Shade   | v0.1.278  | HEAD      | Status           |
| ------- | --------- | --------- | ---------------- |
| 50      | `#93F2E8` | `#a0f7ed` | **value change** |
| 100     | `#6EE7DB` | `#7ef3e7` | **value change** |
| 200     | `#52DACC` | `#51decf` | **value change** |
| 300     | `#3DC6B8` | `#28bcac` | **value change** |
| 400     | `#219C8F` | `#2ca094` | **value change** |
| 500     | `#1B7169` | `#1b7169` | format-only      |
| 600     | `#13564F` | `#145b54` | **value change** |
| 700     | `#0C423C` | `#0b4942` | **value change** |
| 800     | `#0B3A35` | `#0b3a35` | format-only      |
| 900     | `#0A2D29` | `#0a2d29` | format-only      |
| **950** | —         | `#0b2320` | **added**        |

### A.22 `darkMode.cyan`

| Shade   | v0.1.278  | HEAD      | Status           |
| ------- | --------- | --------- | ---------------- |
| 50      | `#D0F0FA` | `#d0f0fa` | format-only      |
| 100     | `#A0E6F7` | `#95e3f6` | **value change** |
| 200     | `#68D3F3` | `#62cae9` | **value change** |
| 300     | `#3CB8DC` | `#3cb8dc` | format-only      |
| 400     | `#2B8DAB` | `#249cc2` | **value change** |
| 500     | `#23728B` | `#107b9b` | **value change** |
| 600     | `#155266` | `#0c6783` | **value change** |
| 700     | `#0E3B49` | `#104f62` | **value change** |
| 800     | `#0D2B36` | `#0d3b49` | **value change** |
| 900     | `#0B252D` | `#0b2932` | **value change** |
| **950** | —         | `#0b2028` | **added**        |

### A.23 `darkMode.purple`

| Shade   | v0.1.278  | HEAD      | Status           |
| ------- | --------- | --------- | ---------------- |
| 50      | `#E5C6FB` | `#e5c6fb` | format-only      |
| 100     | `#D9AFF5` | `#d9aff5` | format-only      |
| 200     | `#C993EF` | `#c993ef` | format-only      |
| 300     | `#B168E8` | `#b168e8` | format-only      |
| 400     | `#984BD8` | `#a26fce` | **value change** |
| 500     | `#7A2DB9` | `#7a2db9` | format-only      |
| 600     | `#591F89` | `#622195` | **value change** |
| 700     | `#47176E` | `#491870` | **value change** |
| 800     | `#391457` | `#391457` | unchanged        |
| 900     | `#2E1146` | `#2c1042` | **value change** |
| **950** | —         | `#23132f` | **added**        |

### A.24 `darkMode.pink`

| Shade      | v0.1.278    | HEAD      | Status           |
| ---------- | ----------- | --------- | ---------------- |
| 50         | `#F6C5DE`   | `#ffbbe4` | **value change** |
| 100        | `#F69AD1`   | `#f69ad1` | format-only      |
| 200        | `#ED77BE`   | `#ed77be` | format-only      |
| 300        | `#E359AB`   | `#e359ab` | format-only      |
| 400        | `#CB4394`   | `#cb5d9e` | **value change** |
| 500        | `#AC377D`   | `#ac377d` | format-only      |
| 600        | `#822A5F`   | `#892660` | **value change** |
| 700        | `#68204B`   | `#6f1d4d` | **value change** |
| 800        | `#601D46`   | `#5b183f` | **value change** |
| 900        | `#471432`   | `#42132f` | **value change** |
| **900-80** | `#471432CC` | —         | **removed**      |
| **950**    | —           | `#2e0f22` | **added**        |

### A.25 `darkMode.violet`

| Shade   | v0.1.278  | HEAD      | Status           |
| ------- | --------- | --------- | ---------------- |
| 50      | `#DACBF7` | `#cdbeff` | **value change** |
| 100     | `#C4AFEE` | `#bca9fc` | **value change** |
| 200     | `#B398EF` | `#9f87ed` | **value change** |
| 300     | `#9D7CEA` | `#9478f8` | **value change** |
| 400     | `#8867E8` | `#9683d8` | **value change** |
| 500     | `#5C3FC2` | `#785fce` | **value change** |
| 600     | `#4639A6` | `#403397` | **value change** |
| 700     | `#332978` | `#3d3286` | **value change** |
| 800     | `#281E5D` | `#291d64` | **value change** |
| 900     | `#221C42` | `#1f1841` | **value change** |
| **950** | —         | `#18142e` | **added**        |

### A.26 `darkMode.gray-alpha`

Entire family added.

| Shade | HEAD        |
| ----- | ----------- |
| 50    | `#fffffff7` |
| 100   | `#ffffffd1` |
| 200   | `#ffffffab` |
| 300   | `#ffffff78` |
| 400   | `#ffffff69` |
| 450   | `#ffffff4d` |
| 500   | `#ffffff36` |
| 600   | `#ffffff26` |
| 700   | `#ffffff1f` |
| 800   | `#ffffff14` |
| 900   | `#ffffff0f` |
| 950   | `#0000000a` |

### A.27 `darkMode.red-alpha`

Entire family added.

| Shade | HEAD        |
| ----- | ----------- |
| 50    | `#ffdede`   |
| 100   | `#ffc1c1`   |
| 200   | `#fe7c7c`   |
| 300   | `#ff5858f0` |
| 400   | `#fa3c3cd9` |
| 500   | `#ed2222ba` |
| 600   | `#ed2d2d8a` |
| 700   | `#c120207d` |
| 800   | `#c01b1b61` |
| 900   | `#5f16168f` |
| 950   | `#53060666` |

### A.28 `overlay.white`

| Shade   | v0.1.278    | HEAD        | Status                               |
| ------- | ----------- | ----------- | ------------------------------------ |
| 50      | `#FFFFFF1A` | `#ffffff1a` | format-only                          |
| 100     | `#FFFFFF2E` | `#ffffff2e` | format-only                          |
| 200     | `#FFFFFF45` | `#ffffff45` | format-only                          |
| 300     | `#FFFFFF5C` | `#ffffff5c` | format-only                          |
| 400     | `#FFFFFF73` | `#ffffff73` | format-only                          |
| 500     | `#FFFFFF8A` | `#ffffff8a` | format-only                          |
| 600     | `#FFFFFFA1` | `#ffffffa1` | format-only                          |
| 700     | `#FFFFFFB8` | `#ffffffb8` | format-only                          |
| 800     | `#FFFFFFCF` | `#ffffffcf` | format-only                          |
| 900     | `#FFFFFFE6` | `#ffffffe5` | **value change** (1-unit alpha drop) |
| **950** | —           | `#fffffff2` | **added**                            |

### A.29 `overlay.black`

| Shade   | v0.1.278    | HEAD        | Status                               |
| ------- | ----------- | ----------- | ------------------------------------ |
| 50      | `#00000017` | `#00000017` | unchanged                            |
| 100     | `#0000002E` | `#0000002e` | format-only                          |
| 200     | `#00000045` | `#00000045` | unchanged                            |
| 300     | `#0000005C` | `#0000005c` | format-only                          |
| 400     | `#00000073` | `#00000073` | unchanged                            |
| 500     | `#0000008A` | `#0000008a` | format-only                          |
| 600     | `#000000A1` | `#000000a1` | format-only                          |
| 700     | `#000000B8` | `#000000b8` | format-only                          |
| 800     | `#000000CF` | `#000000cf` | format-only                          |
| 900     | `#000000E6` | `#000000e5` | **value change** (1-unit alpha drop) |
| **950** | —           | `#000000f2` | **added**                            |

### A.30 `neutral`

| Key   | v0.1.278  | HEAD      | Status      |
| ----- | --------- | --------- | ----------- |
| white | `#FFFFFF` | `#ffffff` | format-only |
| black | `#000000` | `#000000` | unchanged   |

### A.31 `themedVariables.light.surface`

The mapping for every key already present in v0.1.278 is unchanged; many new
keys appeared.

**Kept (unchanged) mappings**: `white`, `gray-1`, `gray-2`, `gray-3`, `gray-4`,
`gray-5`, `gray-6`, `gray-7`, `red-1..red-7`, `green-1..green-3`,
`amber-1..amber-3`, `blue-1..blue-3`, `orange-1`, `violet-1`, `cyan-1`,
`pink-1`, `menu-bar`, `cards`, `modal`, `selected`.

**Added keys** (HEAD only):

| Key                    | Reference              |
| ---------------------- | ---------------------- |
| `base`                 | `neutral/white`        |
| `base-contrast`        | `neutral/white`        |
| `gray-1-contrast`      | `neutral/white`        |
| `gray-2-contrast`      | `neutral/white`        |
| `green-4`              | `lightMode/green/300`  |
| `green-5`              | `lightMode/green/600`  |
| `green-6`              | `lightMode/green/700`  |
| `green-7`              | `lightMode/green/800`  |
| `amber-4`              | `lightMode/amber/300`  |
| `amber-5`              | `lightMode/amber/600`  |
| `amber-6`              | `lightMode/amber/700`  |
| `amber-7`              | `lightMode/amber/800`  |
| `blue-4`               | `lightMode/blue/300`   |
| `blue-5`               | `lightMode/blue/600`   |
| `blue-6`               | `lightMode/blue/700`   |
| `blue-7`               | `lightMode/blue/800`   |
| `orange-2`             | `lightMode/orange/100` |
| `violet-2`             | `lightMode/violet/100` |
| `violet-3`             | `lightMode/violet/200` |
| `violet-4`             | `lightMode/violet/300` |
| `violet-5`             | `lightMode/violet/600` |
| `violet-6`             | `lightMode/violet/700` |
| `violet-7`             | `lightMode/violet/800` |
| `cyan-2`               | `lightMode/cyan/100`   |
| `alert-button-default` | `neutral/white`        |
| `alert-button-info`    | `neutral/white`        |
| `alert-button-success` | `neutral/white`        |
| `alert-button-warning` | `neutral/white`        |
| `alert-button-error`   | `neutral/white`        |

> Note: `red-1..red-7`, `green-1..green-3`, `amber-1..amber-3`, `blue-1..blue-3`
> had the same numbered keys in both versions with identical mappings.

### A.32 `themedVariables.light.ink`

**Kept (unchanged)**: `white`, `gray-1..gray-9`, `red-1..red-3`,
`green-1..green-3`, `amber-1..amber-3`, `blue-1..blue-3`, `cyan-1`, `pink-1`,
`violet-1`, `blue-link`.

**Mapping changes among kept keys**:

| Key                     | v0.1.278                 | HEAD                                        |
| ----------------------- | ------------------------ | ------------------------------------------- |
| `gray-7`                | `lightMode/gray/700`     | `lightMode/gray/800`                        |
| `gray-8`                | `lightMode/gray/800`     | (kept; only renumbered context — see below) |
| `red-3`                 | `lightMode/red/500`      | `lightMode/red/500` (unchanged)             |
| `red-4` (new key in v1) | `lightMode/red/600` (v0) | `lightMode/red/700` (HEAD)                  |
| `green-3`               | `lightMode/green/600`    | `lightMode/green/500`                       |
| `amber-3`               | `lightMode/amber/600`    | `lightMode/amber/500`                       |
| `blue-3`                | `lightMode/blue/600`     | `lightMode/blue/500`                        |
| `cyan-1`                | `lightMode/cyan/500`     | `lightMode/cyan/500` (unchanged)            |
| `violet-1`              | `lightMode/violet/500`   | `lightMode/violet/50`                       |

Net diff vs v0.1.278: `ink.gray-7` shifted one step (700→800), and `green-3` /
`amber-3` / `blue-3` shifted from `600` to `500`. The `violet-1` slot was
repurposed from the "violet/500" anchor to the "violet/50" surface; the previous
violet/500 anchor now appears as the new `violet-3` key.

**Added keys** (HEAD only):

| Key                    | Reference              |
| ---------------------- | ---------------------- |
| `base`                 | `neutral/white`        |
| `red-4`                | `lightMode/red/700`    |
| `green-4`              | `lightMode/green/700`  |
| `green-6`              | `lightMode/green/600`  |
| `amber-4`              | `lightMode/amber/700`  |
| `blue-4`               | `lightMode/blue/700`   |
| `cyan-3`               | `lightMode/cyan/500`   |
| `violet-2`             | `lightMode/violet/400` |
| `violet-3`             | `lightMode/violet/500` |
| `violet-4`             | `lightMode/violet/700` |
| `alert-button-default` | `lightMode/gray/900`   |
| `alert-button-info`    | `lightMode/gray/900`   |
| `alert-button-success` | `lightMode/gray/900`   |
| `alert-button-warning` | `lightMode/gray/900`   |
| `alert-button-error`   | `lightMode/gray/900`   |

### A.33 `themedVariables.light.outline`

**Kept (unchanged)** mappings: `white`, `gray-1..gray-5`, `red-1..red-3`,
`green-1..green-2`, `amber-1..amber-2`, `blue-1`, `orange-1`, `gray-modals`.

**Kept-but-renamed**: v0.1.278's `red-3` (`lightMode/red/500`) stays valued the
same, but HEAD also adds `red-4` for `lightMode/red/500` so the numbering
migrates. Similar for `green/amber/blue/violet`. Verify per row:

| Key           | v0.1.278               | HEAD                             |
| ------------- | ---------------------- | -------------------------------- |
| `red-1`       | `lightMode/red/300`    | `lightMode/red/300` (unchanged)  |
| `red-2`       | `lightMode/red/400`    | `lightMode/red/300`              |
| `red-3`       | `lightMode/red/500`    | `lightMode/red/400`              |
| `green-1`     | `lightMode/green/300`  | `lightMode/green/200`            |
| `green-2`     | `lightMode/green/400`  | `lightMode/green/300`            |
| `amber-1`     | `lightMode/amber/300`  | `lightMode/amber/200`            |
| `amber-2`     | `lightMode/amber/400`  | `lightMode/amber/300`            |
| `blue-1`      | `lightMode/blue/300`   | `lightMode/blue/300` (unchanged) |
| `orange-1`    | `lightMode/orange/400` | `lightMode/orange/200`           |
| `gray-modals` | `lightMode/gray/200`   | `lightMode/gray/200` (unchanged) |

**Added keys** (HEAD only):

| Key                                         | Reference              |
| ------------------------------------------- | ---------------------- |
| `base`                                      | `neutral/white`        |
| `gray-1-contrast`                           | `lightMode/gray/200`   |
| `red-4`                                     | `lightMode/red/500`    |
| `green-3`                                   | `lightMode/green/400`  |
| `green-4`                                   | `lightMode/green/500`  |
| `amber-3`                                   | `lightMode/amber/400`  |
| `amber-4`                                   | `lightMode/amber/500`  |
| `blue-2`                                    | `lightMode/blue/300`   |
| `blue-3`                                    | `lightMode/blue/400`   |
| `blue-4`                                    | `lightMode/blue/500`   |
| `orange-3`                                  | `lightMode/orange/400` |
| `violet-2`                                  | `lightMode/violet/300` |
| `violet-3`                                  | `lightMode/violet/400` |
| `violet-4`                                  | `lightMode/violet/500` |
| `gray-modal`                                | `lightMode/gray/200`   |
| `white` (note: already existed in baseline) | `neutral/white`        |

### A.34 `themedVariables.dark.surface`

**Mapping changes among keys present in both**:

| Key        | v0.1.278                 | HEAD                              |
| ---------- | ------------------------ | --------------------------------- |
| `white`    | `darkMode/gray/900`      | `darkMode/gray/900` (unchanged)   |
| `gray-1`   | `darkMode/gray/700`      | `darkMode/gray/800`               |
| `gray-2`   | `darkMode/gray/650`      | `darkMode/gray/700`               |
| `gray-3`   | `darkMode/gray/600`      | `darkMode/gray/600` (unchanged)   |
| `gray-4`   | `darkMode/gray/500`      | `darkMode/gray/500` (unchanged)   |
| `gray-5`   | `darkMode/gray/200`      | `darkMode/gray/200` (unchanged)   |
| `gray-6`   | `darkMode/gray/100`      | `darkMode/gray/100` (unchanged)   |
| `gray-7`   | `darkMode/gray/50`       | `darkMode/gray/50` (unchanged)    |
| `red-1`    | `darkMode/red/900`       | `darkMode/red/950`                |
| `red-2`    | `darkMode/red/900-90`    | `darkMode/red/900`                |
| `red-3`    | `darkMode/red/800-90`    | `darkMode/red/800`                |
| `red-4`    | `darkMode/red/700`       | `darkMode/red/700` (unchanged)    |
| `red-5`    | `darkMode/red/400`       | `darkMode/red/500`                |
| `red-6`    | `darkMode/red/500`       | `darkMode/red/400`                |
| `red-7`    | `darkMode/red/600`       | `darkMode/red/600` (unchanged)    |
| `green-1`  | `darkMode/green/900`     | `darkMode/green/900` (unchanged)  |
| `green-2`  | `darkMode/green/800`     | `darkMode/green/900`              |
| `green-3`  | `darkMode/green/400`     | `darkMode/green/800`              |
| `amber-1`  | `darkMode/amber/900`     | `darkMode/amber/950`              |
| `amber-2`  | `darkMode/amber/800`     | `darkMode/amber/900`              |
| `amber-3`  | `darkMode/amber/400`     | `darkMode/amber/800`              |
| `blue-1`   | `darkMode/blue/900`      | `darkMode/blue/950`               |
| `blue-2`   | `darkMode/blue/800`      | `darkMode/blue/900`               |
| `blue-3`   | `darkMode/blue/400`      | `darkMode/blue/800`               |
| `orange-1` | `darkMode/orange/900-80` | `darkMode/orange/900`             |
| `violet-1` | `darkMode/violet/900`    | `darkMode/violet/900` (unchanged) |
| `cyan-1`   | `darkMode/cyan/900`      | `darkMode/cyan/900` (unchanged)   |
| `pink-1`   | `darkMode/pink/900-80`   | `darkMode/pink/900`               |
| `menu-bar` | `darkMode/gray/900`      | `darkMode/gray/950`               |
| `cards`    | `darkMode/gray/800`      | `darkMode/gray/800` (unchanged)   |
| `modal`    | `darkMode/gray/700`      | `darkMode/gray/700` (unchanged)   |
| `selected` | `darkMode/gray/500`      | `darkMode/gray/500` (unchanged)   |

**Added keys** (HEAD only):

| Key                    | Reference             |
| ---------------------- | --------------------- |
| `base`                 | `darkMode/gray/950`   |
| `base-contrast`        | `darkMode/gray/900`   |
| `gray-1-contrast`      | `darkMode/gray/900`   |
| `gray-2-contrast`      | `darkMode/gray/600`   |
| `green-4`              | `darkMode/green/700`  |
| `green-5`              | `darkMode/green/500`  |
| `green-6`              | `darkMode/green/400`  |
| `green-7`              | `darkMode/green/600`  |
| `amber-4`              | `darkMode/amber/700`  |
| `amber-5`              | `darkMode/amber/500`  |
| `amber-6`              | `darkMode/amber/400`  |
| `amber-7`              | `darkMode/amber/600`  |
| `blue-4`               | `darkMode/blue/700`   |
| `blue-5`               | `darkMode/blue/500`   |
| `blue-6`               | `darkMode/blue/400`   |
| `blue-7`               | `darkMode/blue/600`   |
| `orange-2`             | `darkMode/orange/900` |
| `violet-2`             | `darkMode/violet/900` |
| `violet-3`             | `darkMode/violet/800` |
| `violet-4`             | `darkMode/violet/700` |
| `violet-5`             | `darkMode/violet/500` |
| `violet-6`             | `darkMode/violet/400` |
| `violet-7`             | `darkMode/violet/600` |
| `cyan-2`               | `darkMode/cyan/900`   |
| `alert-button-default` | `darkMode/gray/500`   |
| `alert-button-info`    | `darkMode/blue/700`   |
| `alert-button-success` | `darkMode/green/700`  |
| `alert-button-warning` | `darkMode/amber/700`  |
| `alert-button-error`   | `darkMode/red/700`    |

### A.35 `themedVariables.dark.ink`

**Mapping changes among keys present in both**:

| Key                                                                       | v0.1.278              | HEAD                            |
| ------------------------------------------------------------------------- | --------------------- | ------------------------------- |
| `white`                                                                   | `darkMode/gray/900`   | `darkMode/gray/900` (unchanged) |
| `gray-1`                                                                  | `darkMode/gray/700`   | `darkMode/gray/800`             |
| `gray-2`                                                                  | `darkMode/gray/500`   | `darkMode/gray/600`             |
| `gray-3`                                                                  | `darkMode/gray/400`   | `darkMode/gray/500`             |
| `gray-4`                                                                  | `darkMode/gray/400`   | `darkMode/gray/450`             |
| `gray-5`                                                                  | `darkMode/gray/300`   | `darkMode/gray/400`             |
| `gray-6`                                                                  | `darkMode/gray/250`   | `darkMode/gray/300`             |
| `gray-7`                                                                  | `darkMode/gray/200`   | `darkMode/gray/200` (unchanged) |
| `gray-8`                                                                  | `darkMode/gray/100`   | `darkMode/gray/100` (unchanged) |
| `gray-9`                                                                  | `darkMode/gray/50`    | `darkMode/gray/50` (unchanged)  |
| `red-1`                                                                   | `neutral/white`       | `neutral/white` (unchanged)     |
| `red-2`                                                                   | `darkMode/red/700`    | `darkMode/red/700` (unchanged)  |
| `red-3`                                                                   | `darkMode/red/400`    | `darkMode/red/400` (unchanged)  |
| `red-4` (key didn't exist in v0; baseline `red-4` was `darkMode/red/200`) | `darkMode/red/200`    | `darkMode/red/300`              |
| `green-1`                                                                 | `neutral/white`       | `neutral/white` (unchanged)     |
| `green-2`                                                                 | `darkMode/green/400`  | `darkMode/green/700`            |
| `green-3`                                                                 | `darkMode/green/300`  | `darkMode/green/400`            |
| `amber-1`                                                                 | `neutral/white`       | `neutral/white` (unchanged)     |
| `amber-2`                                                                 | `darkMode/amber/400`  | `darkMode/amber/700`            |
| `amber-3`                                                                 | `darkMode/amber/300`  | `darkMode/amber/500`            |
| `blue-1`                                                                  | `neutral/white`       | `neutral/white` (unchanged)     |
| `blue-2`                                                                  | `darkMode/blue/400`   | `darkMode/blue/700`             |
| `blue-3`                                                                  | `darkMode/blue/300`   | `darkMode/blue/400`             |
| `cyan-1`                                                                  | `darkMode/cyan/300`   | `darkMode/cyan/500`             |
| `pink-1`                                                                  | `darkMode/pink/300`   | `darkMode/pink/500`             |
| `violet-1`                                                                | `darkMode/violet/300` | `neutral/white`                 |
| `blue-link`                                                               | `darkMode/blue/500`   | `darkMode/blue/500` (unchanged) |

**Added keys** (HEAD only):

| Key                    | Reference             |
| ---------------------- | --------------------- |
| `base`                 | `darkMode/gray/950`   |
| `red-4`                | `darkMode/red/300`    |
| `green-4`              | `darkMode/green/300`  |
| `green-6`              | `darkMode/green/400`  |
| `amber-4`              | `darkMode/amber/400`  |
| `blue-4`               | `darkMode/blue/300`   |
| `cyan-3`               | `darkMode/cyan/400`   |
| `violet-2`             | `darkMode/violet/700` |
| `violet-3`             | `darkMode/violet/400` |
| `violet-4`             | `darkMode/violet/300` |
| `alert-button-default` | `darkMode/gray/50`    |
| `alert-button-info`    | `darkMode/blue/200`   |
| `alert-button-success` | `darkMode/green/200`  |
| `alert-button-warning` | `darkMode/amber/200`  |
| `alert-button-error`   | `darkMode/red/200`    |

### A.36 `themedVariables.dark.outline`

**Mapping changes among keys present in both**:

| Key           | v0.1.278              | HEAD                             |
| ------------- | --------------------- | -------------------------------- |
| `white`       | `darkMode/gray/800`   | `darkMode/gray/900`              |
| `gray-1`      | `darkMode/gray/700`   | `darkMode/gray/800`              |
| `gray-2`      | `darkMode/gray/600`   | `darkMode/gray/600` (unchanged)  |
| `gray-3`      | `darkMode/gray/500`   | `darkMode/gray/500` (unchanged)  |
| `gray-4`      | `darkMode/gray/300`   | `darkMode/gray/450`              |
| `gray-5`      | `lightMode/gray/200`  | `lightMode/gray/200` (unchanged) |
| `red-1`       | `darkMode/red/800`    | `darkMode/red/800` (unchanged)   |
| `red-2`       | `darkMode/red/700`    | `darkMode/red/800`               |
| `red-3`       | `darkMode/red/600`    | `darkMode/red/700`               |
| `green-1`     | `darkMode/green/800`  | `darkMode/green/800` (unchanged) |
| `green-2`     | `darkMode/green/700`  | `darkMode/green/800`             |
| `amber-1`     | `darkMode/amber/800`  | `darkMode/amber/800` (unchanged) |
| `amber-2`     | `darkMode/amber/700`  | `darkMode/amber/800`             |
| `blue-1`      | `darkMode/blue/800`   | `darkMode/blue/800` (unchanged)  |
| `orange-1`    | `darkMode/orange/700` | `darkMode/orange/800`            |
| `gray-modals` | `darkMode/gray/600`   | `darkMode/gray/600` (unchanged)  |

**Added keys** (HEAD only):

| Key               | Reference             |
| ----------------- | --------------------- |
| `base`            | `darkMode/gray/950`   |
| `gray-1-contrast` | `darkMode/gray/700`   |
| `red-4`           | `darkMode/red/600`    |
| `green-3`         | `darkMode/green/700`  |
| `green-4`         | `darkMode/green/600`  |
| `amber-3`         | `darkMode/amber/700`  |
| `amber-4`         | `darkMode/amber/600`  |
| `blue-2`          | `darkMode/blue/800`   |
| `blue-3`          | `darkMode/blue/700`   |
| `blue-4`          | `darkMode/blue/600`   |
| `orange-3`        | `darkMode/orange/700` |
| `violet-2`        | `darkMode/violet/800` |
| `violet-3`        | `darkMode/violet/700` |
| `violet-4`        | `darkMode/violet/600` |
| `gray-modal`      | `darkMode/gray/600`   |

---

## B. Semantic colors — derived from `colorPalette.js`

`generateSemanticColors()` still produces an object of shape
`{ outline, surface, ink }` keyed identically to `themedVariables.light.*`. The
**per-key mapping function** is what changed:

|               | v0.1.278                                | HEAD                                                                                                |
| ------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Per-key value | `var(--${variableName}, ${lightValue})` | `color-mix(in srgb, var(--${variableName}, ${lightValue}) calc(<alpha-value> * 100%), transparent)` |

Practical effect: `bg-surface-gray-2/50` now actually applies a 50% alpha
because the value is wrapped in `color-mix` honoring Tailwind's `<alpha-value>`
placeholder. The set of keys produced is otherwise driven by
`colorsData.themedVariables.light.*` so any token addition/removal there flows
through (see A.31–A.33).

`colorPalette.js` also gains a new exported function `generateEffectVariables()`
(not part of the semantic-color contract, but emitted from the same module).

---

## C. `borderRadius` — `plugin.js` (and new `tokens.js` mirror)

### v0.1.278 (literal config)

```js
{
  none: '0px',
  sm: '0.25rem',     // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.625rem',    // 10px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.25rem',  // 20px
  full: '9999px',
}
```

### HEAD (computed by `buildRadiusConfig()` over `generated/radius.json`)

`generated/radius.json`:

```json
{
  "0": "0px",
  "1": "4px",
  "2": "5px",
  "3": "6px",
  "4": "8px",
  "5": "10px",
  "6": "12px",
  "7": "16px",
  "8": "20px",
  "9": "100px",
  "full": "9999px",
  "none": "0px",
  "sm": "4px",
  "DEFAULT": "8px",
  "md": "10px",
  "lg": "12px",
  "xl": "16px",
  "2xl": "20px"
}
```

`buildRadiusConfig()` rewrites every entry except `DEFAULT` to
`var(--radius-${key})`. `DEFAULT` (Tailwind's `rounded`) is rewritten to
whichever numeric var shares its value — here that's `var(--radius-4)` (since
`8px == radius.4`).

So the **resulting Tailwind `borderRadius`** on HEAD is:

| Key       | v0.1.278 value | HEAD value (var; resolved)              |
| --------- | -------------- | --------------------------------------- |
| `none`    | `0px`          | `var(--radius-none)` = `0px`            |
| `sm`      | `0.25rem`      | `var(--radius-sm)` = `4px`              |
| `DEFAULT` | `0.5rem`       | `var(--radius-4)` = `8px`               |
| `md`      | `0.625rem`     | `var(--radius-md)` = `10px`             |
| `lg`      | `0.75rem`      | `var(--radius-lg)` = `12px`             |
| `xl`      | `1rem`         | `var(--radius-xl)` = `16px`             |
| `2xl`     | `1.25rem`      | `var(--radius-2xl)` = `20px`            |
| `full`    | `9999px`       | `var(--radius-full)` = `9999px`         |
| `0`       | —              | `var(--radius-0)` = `0px` (**added**)   |
| `1`       | —              | `var(--radius-1)` = `4px` (**added**)   |
| `2`       | —              | `var(--radius-2)` = `5px` (**added**)   |
| `3`       | —              | `var(--radius-3)` = `6px` (**added**)   |
| `4`       | —              | `var(--radius-4)` = `8px` (**added**)   |
| `5`       | —              | `var(--radius-5)` = `10px` (**added**)  |
| `6`       | —              | `var(--radius-6)` = `12px` (**added**)  |
| `7`       | —              | `var(--radius-7)` = `16px` (**added**)  |
| `8`       | —              | `var(--radius-8)` = `20px` (**added**)  |
| `9`       | —              | `var(--radius-9)` = `100px` (**added**) |

**Value-only changes**: none (`sm/DEFAULT/md/lg/xl/2xl/full/none` resolve to the
same pixel value as before).

**Format-only changes**: all literal `0.NNrem` rewrites to `Npx`, plus the
indirection through `var(--radius-*)`.

**Added keys**: `0, 1, 2, 3, 4, 5, 6, 7, 8, 9` (numeric scale).

**Removed keys**: none.

CSS variables emitted at `:root` (one per non-`DEFAULT` key): `--radius-0`,
`--radius-1`, …, `--radius-9`, `--radius-full`, `--radius-none`, `--radius-sm`,
`--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`.

`tailwind/tokens.js` (new, HEAD-only) re-exports the raw `radiusTokens` as
`borderRadius` for non-runtime consumers.

---

## D. `boxShadow` / elevation — `plugin.js`

### v0.1.278 (static cascade per key)

```js
{
  sm:       '0px 1px 2px rgba(0, 0, 0, 0.1)',
  DEFAULT:  '0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)',
  md:       '0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)',
  lg:       '0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)',
  xl:       '0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)',
  '2xl':    '0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)',
  none:     'none',
}
```

### HEAD (theme-flipped via CSS vars)

```js
{
  none:     'none',
  sm:       'var(--elevation-sm)',
  base:     'var(--elevation-base)',
  DEFAULT:  'var(--elevation-base)',
  md:       'var(--elevation-md)',
  lg:       'var(--elevation-lg)',
  xl:       'var(--elevation-xl)',
  '2xl':    'var(--elevation-2xl)',
  status:   'var(--elevation-status)',
  'dark-sm':   'var(--dark-elevation-sm)',
  'dark-base': 'var(--dark-elevation-base)',
  'dark-md':   'var(--dark-elevation-md)',
  'dark-lg':   'var(--dark-elevation-lg)',
  'dark-xl':   'var(--dark-elevation-xl)',
  'dark-2xl':  'var(--dark-elevation-2xl)',
}
```

**Indirection**: `--elevation-*` and `--dark-elevation-*` are emitted by
`generateEffectVariables()` in `colorPalette.js`, sourced from
`generated/effects.json`. The light-mode tokens are kept on `:root` for both
themes (Espresso 2 applies the same light-mode shadow stack to dark surfaces);
the `dark-*` shadow utilities exist for explicit opt-in.

### Underlying shadow values (HEAD; from `effects.json`)

**Light (used for `shadow-*` utilities in both themes)**:

| Key                  | Value                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `--elevation-sm`     | `0px 1px 3px 0px #00000024, 0px 0px 1px 0px #00000024, inset 0px 0.25px 1.5px 0px #ffffff14`                                |
| `--elevation-base`   | `0px 2px 5px 0px #00000024, 0px 0px 1.5px 0px #00000029, inset 0px 0.25px 1.5px 0px #ffffff14`                              |
| `--elevation-md`     | `0px 6px 12px -2px #0000001f, 0px 0px 6px 2px #00000008, 0px 0px 1.5px 0px #00000026, inset 0px 0.25px 1.5px 0px #ffffff14` |
| `--elevation-lg`     | `0px 18px 22px -6px #0000001a, 0px 0px 6px 3px #00000008, 0px 0px 1.5px 0px #0000002e`                                      |
| `--elevation-xl`     | `0px 24px 30px -8px #0000001a, 0px 0px 10px 2px #0000000a, 0px 0px 1px 0px #00000033, inset 0px 0.25px 2px 0px #ffffff26`   |
| `--elevation-2xl`    | `0px 44px 52px -10px #0000001a, 0px 0px 10px 2px #00000008, 0px 0px 1.5px 0px #00000040, inset 0px 0.1px 2px 0px #ffffff14` |
| `--elevation-status` | `0px 0px 0px 1.5px #ffffff`                                                                                                 |

**Dark (used for `shadow-dark-*` utilities)**:

| Key                     | Value                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `--dark-elevation-sm`   | `0px 1px 3px 0px #000000b2, 0px 0px 14px 0px #0000002e, inset 0px 0.5px 0.5px 0.5px #ffffff08`     |
| `--dark-elevation-base` | `0px 2px 5px 0px #00000099, 0px 0px 14px 0px #0000002e, inset 0px 0.5px 0.5px 0.5px #ffffff08`     |
| `--dark-elevation-md`   | `0px 6px 12px -2px #00000099, 0px 0px 16px 2px #00000033, inset 0px 0.5px 0.5px 0.5px #ffffff08`   |
| `--dark-elevation-lg`   | `0px 18px 20px -8px #00000085, 0px 0px 16px 0px #0000001a, inset 0px 0.5px 1.5px 0.5px #ffffff0a`  |
| `--dark-elevation-xl`   | `0px 26px 34px -6px #0000006b, 0px 0px 14px 2px #0000001f, inset 0px 0.5px 1.5px 0.5px #ffffff0a`  |
| `--dark-elevation-2xl`  | `0px 44px 52px -4px #0000006b, 0px 0px 14px 10px #0000001f, inset 0px 0.5px 1.5px 0.5px #ffffff0f` |

### Per-key delta (v0.1.278 → HEAD resolved value)

| Key         | v0.1.278                                                    | HEAD (resolved value)                              | Status                     |
| ----------- | ----------------------------------------------------------- | -------------------------------------------------- | -------------------------- |
| `none`      | `none`                                                      | `none`                                             | unchanged                  |
| `sm`        | `0px 1px 2px rgba(0,0,0,0.1)`                               | new 3-layer stack with inset highlight             | **completely re-authored** |
| `DEFAULT`   | `0px 0px 1px rgba(0,0,0,0.45), 0px 1px 2px rgba(0,0,0,0.1)` | resolves to `--elevation-base` = new 3-layer stack | **completely re-authored** |
| `md`        | old md                                                      | new 4-layer                                        | **completely re-authored** |
| `lg`        | old lg                                                      | new 3-layer                                        | **completely re-authored** |
| `xl`        | old xl                                                      | new 4-layer                                        | **completely re-authored** |
| `2xl`       | old 2xl                                                     | new 4-layer                                        | **completely re-authored** |
| `base`      | —                                                           | new (= `DEFAULT`)                                  | **added**                  |
| `status`    | —                                                           | `0px 0px 0px 1.5px #ffffff`                        | **added**                  |
| `dark-sm`   | —                                                           | new                                                | **added**                  |
| `dark-base` | —                                                           | new                                                | **added**                  |
| `dark-md`   | —                                                           | new                                                | **added**                  |
| `dark-lg`   | —                                                           | new                                                | **added**                  |
| `dark-xl`   | —                                                           | new                                                | **added**                  |
| `dark-2xl`  | —                                                           | new                                                | **added**                  |

**Removed**: none.

`tokens.js` exports a `boxShadow` mirror that keeps the **pre-Figma static
values** (the v0.1.278 values verbatim) for snapshot/docs consumers; it does not
match the live Tailwind config.

---

## E. `fontSize` — `plugin.js`

### Generation pipeline (HEAD)

`buildFontSize()` consumes `generated/typography.json` and merges per-key
`FONT_SIZE_AUGMENT` (letterSpacing + fontWeight by key name), then appends `p-*`
variants from `PARAGRAPH_LINE_HEIGHT`. Source line-heights are pixel values from
Figma (e.g. `"16px"` for `base`); the previous config used numeric ratios
(`'1.15'`, `'1.5'`).

### Per-key comparison (tuple = `[size, { lineHeight, letterSpacing, fontWeight }]`)

| Key      | v0.1.278                                                                       | HEAD                                                                                              | Status                                                                    |
| -------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `tiny`   | —                                                                              | `['11px', { lineHeight: '1.15' }]` (lineHeight `0px` from Figma falls back to `1.15`; no augment) | **added**                                                                 |
| `2xs`    | `['11px', { lineHeight: '1.15', letterSpacing: '0.01em', fontWeight: '420' }]` | `['11px', { lineHeight: '13px', letterSpacing: '0.01em', fontWeight: '420' }]`                    | lineHeight changed `'1.15'` → `'13px'`                                    |
| `xs`     | `['12px', { lineHeight: '1.15', letterSpacing: '0.02em', fontWeight: '420' }]` | `['12px', { lineHeight: '14px', letterSpacing: '0.02em', fontWeight: '420' }]`                    | lineHeight `'1.15'` → `'14px'`                                            |
| `sm`     | `['13px', { lineHeight: '1.15', letterSpacing: '0.02em', fontWeight: '420' }]` | `['13px', { lineHeight: '15px', letterSpacing: '0.02em', fontWeight: '420' }]`                    | lineHeight `'1.15'` → `'15px'`                                            |
| `base`   | `['14px', { lineHeight: '1.15', letterSpacing: '0.02em', fontWeight: '420' }]` | `['14px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '420' }]`                    | lineHeight `'1.15'` → `'16px'`                                            |
| `lg`     | `['16px', { lineHeight: '1.15', letterSpacing: '0.02em', fontWeight: '400' }]` | `['16px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '400' }]`                    | lineHeight `'1.15'` → `'18px'`                                            |
| `xl`     | `['18px', { lineHeight: '1.15', letterSpacing: '0.01em', fontWeight: '400' }]` | `['18px', { lineHeight: '21px', letterSpacing: '0.01em', fontWeight: '400' }]`                    | lineHeight `'1.15'` → `'21px'`                                            |
| `2xl`    | `['20px', { lineHeight: '1.15', letterSpacing: '0.01em', fontWeight: '400' }]` | `['20px', { lineHeight: '23px', letterSpacing: '0.01em', fontWeight: '400' }]`                    | lineHeight `'1.15'` → `'23px'`                                            |
| `3xl`    | `['24px', { lineHeight: '1.15', fontWeight: 400, letterSpacing: '0.005em' }]`  | `['24px', { lineHeight: '28px', letterSpacing: '0.005em', fontWeight: '400' }]`                   | lineHeight `'1.15'` → `'28px'`; fontWeight numeric `400` → string `'400'` |
| `p-2xs`  | `['11px', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '420' }]`  | `['11px', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '420' }]`                     | unchanged                                                                 |
| `p-xs`   | `['12px', { lineHeight: '1.6', letterSpacing: '0.02em', fontWeight: '420' }]`  | `['12px', { lineHeight: '1.6', letterSpacing: '0.02em', fontWeight: '420' }]`                     | unchanged                                                                 |
| `p-sm`   | `['13px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '420' }]`  | `['13px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '420' }]`                     | unchanged                                                                 |
| `p-base` | `['14px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '420' }]`  | `['14px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '420' }]`                     | unchanged                                                                 |
| `p-lg`   | `['16px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }]`  | `['16px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }]`                     | unchanged                                                                 |
| `p-xl`   | `['18px', { lineHeight: '1.42', letterSpacing: '0.01em', fontWeight: '400' }]` | `['18px', { lineHeight: '1.42', letterSpacing: '0.01em', fontWeight: '400' }]`                    | unchanged                                                                 |
| `p-2xl`  | `['20px', { lineHeight: '1.38', letterSpacing: '0.01em', fontWeight: '400' }]` | `['20px', { lineHeight: '1.38', letterSpacing: '0.01em', fontWeight: '400' }]`                    | unchanged                                                                 |
| `p-3xl`  | `['24px', { lineHeight: '1.2', fontWeight: 400, letterSpacing: '0.005em' }]`   | `['24px', { lineHeight: '1.2', letterSpacing: '0.005em', fontWeight: '400' }]`                    | fontWeight numeric `400` → string `'400'` (format-only)                   |

> Note: only `2xs..3xl` get their lineHeights re-sourced from Figma px values.
> The paragraph (`p-*`) variants reuse `PARAGRAPH_LINE_HEIGHT` and are
> byte-identical.

**Sizes available only via `generated/typography.json` but NOT exposed as
Tailwind fontSize keys** (since `buildFontSize()` includes every key, including
ones with no `FONT_SIZE_AUGMENT` augment): `tiny`, `4xl`, `5xl`, `6xl`, `7xl`,
`8xl`, `9xl`, `10xl`, `11xl`, `12xl`, `13xl`, `14xl`, `15xl`. They land in the
Tailwind config without `letterSpacing`/`fontWeight` (no augment entry):

| Key    | Tuple (HEAD)                        |
| ------ | ----------------------------------- |
| `tiny` | `['11px', { lineHeight: '1.15' }]`  |
| `4xl`  | `['26px', { lineHeight: '42px' }]`  |
| `5xl`  | `['28px', { lineHeight: '45px' }]`  |
| `6xl`  | `['32px', { lineHeight: '51px' }]`  |
| `7xl`  | `['40px', { lineHeight: '56px' }]`  |
| `8xl`  | `['44px', { lineHeight: '62px' }]`  |
| `9xl`  | `['48px', { lineHeight: '67px' }]`  |
| `10xl` | `['52px', { lineHeight: '73px' }]`  |
| `11xl` | `['56px', { lineHeight: '78px' }]`  |
| `12xl` | `['64px', { lineHeight: '83px' }]`  |
| `13xl` | `['72px', { lineHeight: '92px' }]`  |
| `14xl` | `['80px', { lineHeight: '96px' }]`  |
| `15xl` | `['88px', { lineHeight: '106px' }]` |

All added.

---

## F. Other theme keys touched on HEAD

### F.1 `screens`

Identical: `sm 640px / md 768px / lg 1024px / xl 1280px`.

### F.2 `container`

Identical: `padding.xl = '5rem'`.

### F.3 `extend.spacing`

Identical:
`4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13, 13.5, 14.5, 15, 15.5`.

### F.4 `extend.width / height / minWidth / maxHeight`

Identical to v0.1.278.

### F.5 `extend.gradientColorStops` — **added**

```js
gradientColorStops: {
  surface: semanticColors.surface,
  ink: semanticColors.ink,
  outline: semanticColors.outline,
}
```

(Lets utilities like `from-surface-gray-2`, `to-ink-gray-9`, etc. work in
gradients.) Not present in v0.1.278.

### F.6 `extend.textColor / backgroundColor / fill / stroke / placeholderColor / borderColor / ringColor / divideColor`

Same wiring as v0.1.278; the **values** that flow through `semanticColors.*` are
now wrapped in `color-mix(...)` (see B).

### F.7 `extend.typography`

Three keys: `DEFAULT`, `sm`, `v3`, `p-spacing` — same on both branches.

**Only diff inside the typography block**: in `v3.css[0]`, `fontSize` changed
from `'14px'` → `'15px'`. Everything else (line heights, link styles,
blockquote, code, headings, lists, prose colors) is byte-identical.

### F.8 New CSS variables emitted at `:root` and `[data-theme="dark"]`

In addition to the existing color CSS variables (unchanged), HEAD emits:

| Variable                                                                                                                 | Selector                                                                | Source                                 |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------------- |
| `--radius-0..--radius-9, --radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-2xl, --radius-full, --radius-none` | `:root`                                                                 | `generated/radius.json`                |
| `--elevation-sm, --elevation-base, --elevation-md, --elevation-lg, --elevation-xl, --elevation-2xl`                      | `:root`                                                                 | `effects.json#elevation.light`         |
| `--dark-elevation-sm..--dark-elevation-2xl`                                                                              | `:root`                                                                 | `effects.json#elevation.dark`          |
| `--elevation-status`                                                                                                     | `:root`                                                                 | `effects.json#elevation.custom.status` |
| `--focus-default, --focus-red, --focus-green, --focus-amber, --focus-blue, --focus-violet`                               | `:root` (light values) and `[data-theme="dark"]` (dark values override) | `effects.json#focus.{light,dark}`      |

**Focus ring values**:

| Var               | Light                       | Dark                        |
| ----------------- | --------------------------- | --------------------------- |
| `--focus-default` | `0px 0px 0px 2px #c9c9c9e5` | `0px 0px 0px 3px #464646cc` |
| `--focus-red`     | `0px 0px 0px 2px #fa9c9de5` | `0px 0px 0px 3px #751819cc` |
| `--focus-green`   | `0px 0px 0px 2px #5ed29ce5` | `0px 0px 0px 3px #1d563bcc` |
| `--focus-amber`   | `0px 0px 0px 2px #ffda7ce5` | `0px 0px 0px 3px #744811cc` |
| `--focus-blue`    | `0px 0px 0px 2px #65b9fce5` | `0px 0px 0px 3px #0e3d62cc` |
| `--focus-violet`  | `0px 0px 0px 2px #bea2fce5` | `0px 0px 0px 3px #412d87cc` |

(Light = 2px ring, ~`e5` alpha; dark = 3px ring, `cc` alpha.)

---

## G. New utility classes / components added by the plugin

HEAD's plugin function adds two new `addComponents` calls:

### G.1 `buildTextStyleUtilities()`

Driven by `FONT_SIZE_MEDIUM_TRACKING = { base: '0.015em', lg: '0.015em' }`.
Emits:

| Class               | Properties                                                                      |
| ------------------- | ------------------------------------------------------------------------------- |
| `.text-base-medium` | `font-size: 14px; line-height: 16px; font-weight: 500; letter-spacing: 0.015em` |
| `.text-lg-medium`   | `font-size: 16px; line-height: 18px; font-weight: 500; letter-spacing: 0.015em` |

(Adding entries to `FONT_SIZE_MEDIUM_TRACKING` will generate more
`.text-{key}-medium` classes; only those two are emitted today.)

### G.2 `buildFocusRingUtilities()`

Driven by `Object.keys(effectsData.focus.light)`. Emits:

| Class                | Property                           |
| -------------------- | ---------------------------------- |
| `.focus-ring`        | `box-shadow: var(--focus-default)` |
| `.focus-ring-red`    | `box-shadow: var(--focus-red)`     |
| `.focus-ring-green`  | `box-shadow: var(--focus-green)`   |
| `.focus-ring-amber`  | `box-shadow: var(--focus-amber)`   |
| `.focus-ring-blue`   | `box-shadow: var(--focus-blue)`    |
| `.focus-ring-violet` | `box-shadow: var(--focus-violet)`  |

Intended usage: `class="focus-visible:focus-ring-blue"`. None of these classes
exist in v0.1.278.

---

## H. New module — `tailwind/tokens.js`

Not present in v0.1.278. Added as a sub-path export so external consumers can
`import { borderRadius, boxShadow, fontSize } from 'frappe-ui/tailwind/tokens'`
without depending on the full plugin. Also re-exports everything from
`./colorPalette.js`. Mirrors the Figma-synced JSON for `borderRadius` and
`fontSize`; keeps the **pre-Figma** static `boxShadow` literals (intentional
comment in the file: "non-runtime consumers" still get sensible defaults instead
of CSS vars).

---

## I. Out-of-scope-but-touched file list

For completeness, the only `tailwind/` files that differ between baseline and
HEAD are:

- `tailwind/colors.json` (rewritten — covered in A)
- `tailwind/colorPalette.js` (covered in B and F.8 / G.2)
- `tailwind/plugin.js` (covered in C–G)
- `tailwind/tokens.js` (**new**, covered in H)
- `tailwind/generated/colors.json` (**new** — duplicate of the
  lightMode/darkMode color set inside `colors.json`; same values per A)
- `tailwind/generated/radius.json` (**new** — covered in C)
- `tailwind/generated/typography.json` (**new** — covered in E)
- `tailwind/generated/effects.json` (**new** — covered in D and F.8)
