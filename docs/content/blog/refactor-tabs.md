---
title: Refactor Tabs
description: Moving Tabs component to Reka-ui into one single component rather than multiple, Clean component structure
sidebar: false
tags: 
  - component
  - refactor
  - breaking change
---


# Refactor Tabs


Previously the Tab component was using Headless UI, the new one just uses Reka-ui. No multiple components:  `TabList` or `TabPanel`. One simple component!

[PR Link](https://github.com/frappe/frappe-ui/pull/457)

Check the [tabs doc](/docs/components/tabs) for detailed info

## Migration

### Before 

```html
<Tabs>
   <TabList />
   <TabPanel v-slot="{ tab }" class="h-full">
       {{ tab.content }}
   </TabPanel>
</Tabs>
```

### After

Use the `tab-panel` slot
```html
<Tabs>
  <template #tab-panel="{ tab }">
     {{ tab.content }}
  </template>
</Tabs>
```


