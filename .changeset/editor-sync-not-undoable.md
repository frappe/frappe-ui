---
'frappe-ui': patch
---

Editor: content set from outside through `v-model` no longer adds an undo step, so undo cannot wipe a document that loaded after the editor mounted (fix).
