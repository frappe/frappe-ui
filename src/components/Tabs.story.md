## Props

### Tabs

It is an array of objects which contains the following attributes:

1. `label` is the name of the tab, it is required.
2. `icon` is the icon to be shown in the tab, it accept component and it is
   optional.
3. You can add more attributes which can be used for custom rendering in the tab
   header or content.

### Options

Currently, it has only one option `indicatorLeft` which is used to set the left
position of the indicator in case of custom rendering. It is optional and
default value is `20`.

## v-model

It is used to set the active tab or change the active tab. It is required.
