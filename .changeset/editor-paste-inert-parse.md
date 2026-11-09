---
'frappe-ui': patch
---

Editor: pasted HTML and pasted markdown are parsed in a separate document, so event handlers in the pasted markup do not run.
