---
'frappe-ui': patch
---

RTL: editor code blocks and link URLs stay left to right; arrow keys and swipes in the image viewer and table cells, "Insert column left/right", the table context menu, editor popups and dialogs, Tabs, the bidirectional Slider fill and the ListView group chevron follow the page direction.

The exported editor commands `TableAddColumnBefore` ("Insert column left") and `TableAddColumnAfter` ("Insert column right") now insert by screen side: on an RTL page `TableAddColumnBefore` adds the column after the current one in document order, and `TableAddColumnAfter` adds it before. Apps that use these commands in their own menus will see them switch sides on RTL pages.
