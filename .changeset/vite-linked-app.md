---
'frappe-ui': patch
---

Vite plugin: an app linked into a bench's `apps/` from another folder now builds
and runs in dev; tools such as Pilot set `FRAPPE_BENCH_PATH` to the bench (fix).
