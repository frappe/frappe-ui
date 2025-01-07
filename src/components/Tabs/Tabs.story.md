## Props

### tabs

It is an array of objects which contains the following attributes:

1. `label` is the name of the tab, it is required.
2. `icon` is the icon to be shown in the tab, it accept component and it is
   optional.
3. You can add more attributes which can be used for custom rendering in the tab
   header or content.

### v-model

It is used to set the active tab or change the active tab. It is required.

### vertical

It is used to show the tabs vertically. It is optional.

### as

You can set it to `div` to wrap tabs in a `div`. It can be any valid HTML tag.
This is useful to control the layout of the tabs. It is optional.

1. `as="div"` or any valid HTML tag

```html
<div>
  <!-- container div -->
  <div>
    <div active>Tab 1</div>
    <div>Tab 2</div>
    <div>Tab 3</div>
  </div>
  <div>
    <div active>Content 1</div>
    <div>Content 2</div>
    <div>Content 3</div>
  </div>
</div>
```

2. `as` is not set

```html
<div>
  <div active>Tab 1</div>
  <div>Tab 2</div>
  <div>Tab 3</div>
</div>
<div>
  <div active>Content 1</div>
  <div>Content 2</div>
  <div>Content 3</div>
</div>
```

## Slots

1. **tab-item:** You can use this slot to render custom tab items. It is
   optional.
2. **tab-panel:** You can use this slot to render custom tab panels. It is
   required. Example:

```vue
<Tabs v-model="tabIndex" :tabs="tabs">
   <template #tab-item="{ tab, selected }">
      <div :class="{ 'text-gray-900 font-semibold': selected }">
         <span>{{ tab.label }}</span>
         <span>{{ tab.icon }}</span>
      </div>
   </template>
   <template #tab-panel="{ tab }">
      <div>{{ tab.content }}</div>
   </template>
</Tabs>
```

## Layout Customization

You can customize the layout of the tabs by using `<TabList />` and `<TabPanels />`
components.

```vue
<Tabs v-model="tabIndex" :tabs="tabs">
   <TabList v-slot="{ tab, selected }">
      <div :class="{ 'text-gray-900 font-semibold': selected }">
         <span>{{ tab.label }}</span>
         <span>{{ tab.icon }}</span>
      </div>
   </TabList>
   <TabPanel v-slot="{ tab }">
      <div>{{ tab.content }}</div>
   </TabPanel>
</Tabs>
```
