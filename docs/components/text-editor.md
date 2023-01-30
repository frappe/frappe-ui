<script setup>
import { ref } from 'vue'
import { TextEditor, TextEditorFixedMenu, TextEditorBubbleMenu, TextEditorContent, Button, Input } from '../../src/index'
let content1 = ref(`<p><strong>Hello, we are Frappe 👋</strong></p><p>We are a remote technology company committed to building world-class <mark data-color="#fef9c3" style="background-color: #fef9c3; color: inherit">open-source</mark> software products and services. This is our story.</p><p><strong>Framework and Apps</strong></p><p>Our flagship products are our web framework <a target="_blank" rel="noopener noreferrer nofollow" href="https://frappeframework.com/">Frappe</a> which is a fully featured, low code framework, and the world's best free and open source ERP <a target="_blank" rel="noopener noreferrer nofollow" href="https://erpnext.com/">ERPNext</a>. ERPNext helps companies from tiny startups to large enterprises and public bodies manage their operations from financial accounting, inventory management to payroll. Along with ERPNext we have built <a target="_blank" rel="noopener noreferrer nofollow" href="https://frappe.io/frappeverse">several other products</a> on top of our framework and we continue to build more.</p><p>In case you are wondering, FRAPPE = FRamework + APPs :-)</p><p><strong>Products</strong></p><ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://frappecloud.com/"><strong>Frappe Cloud</strong></a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/frappe/gameplan"><strong>Gameplan</strong></a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://frappedesk.com/"><strong>Frappe Desk</strong></a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/frappe/insights"><strong>Frappe Insights</strong></a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/frappe/drive"><strong>Frappe Drive</strong></a></p></li></ul>`)
let content2 = ref('Highly customized editor')
let contentBubble = ref('Highlight some text here')
let editable = ref(true)
let fixedMenuMinimalButtons = [
    'Paragraph',
    ['Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'],
    'Separator',
    'Bold',
    'Italic',
    'Separator',
    'Bullet List',
    'Numbered List',
    'Separator',
    'Link',
    'Blockquote',
    'Code',
]
let fixedMenuButtons = [
    'Paragraph',
    ['Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'],
    'Separator',
    'Bold',
    'Italic',
    'Separator',
    'Bullet List',
    'Numbered List',
    'Separator',
    'Align Left',
    'Align Center',
    'Align Right',
    'FontColor',
    'Separator',
    'Image',
    'Video',
    'Link',
    'Blockquote',
    'Code',
    'Horizontal Rule',
    [
        'InsertTable',
        'AddColumnBefore',
        'AddColumnAfter',
        'DeleteColumn',
        'AddRowBefore',
        'AddRowAfter',
        'DeleteRow',
        'MergeCells',
        'SplitCell',
        'ToggleHeaderColumn',
        'ToggleHeaderRow',
        'ToggleHeaderCell',
        'DeleteTable',
    ],
    ]
let mentions = [
  { label: "Husain Wrenn", value: "hwrenn0@spotify.com" },
  { label: "Gwenore Fitter", value: "gfitter1@foxnews.com" },
  { label: "Ricard Claussen", value: "rclaussen2@imgur.com" },
  { label: "Rickard Higford", value: "rhigford3@multiply.com" },
  { label: "Lazarus MacKey", value: "lmackey4@prlog.org" },
  { label: "Karrah Ege", value: "kege5@prweb.com" },
  { label: "Seward Godin", value: "sgodin6@msu.edu" },
  { label: "Milzie Sanches", value: "msanches7@senate.gov" },
  { label: "Walt Arrington", value: "warrington8@tripod.com" },
  { label: "Seline Bonifas", value: "sbonifas9@hibu.com" },
];
</script>

# Text Editor

The Text Editor component is used for rich-text editing. It is based on
[Tiptap](https://tiptap.dev).

## Usage

The TextEditor component is very flexible in terms of layout and features. It
provides building blocks like menus and slots for building any type of editor
experience you might want.

Here is a basic version with fixed menu at the top.

<Story class="h-80" :iframe="false">
  <TextEditor
    editor-class="!prose-sm border max-w-none rounded-b-lg p-3 overflow-auto h-64 focus:outline-none"
    :fixedMenu="true"
    :content="content1"
    @change="val => content1 = val"
    :mentions="mentions"
  />
</Story>

```vue
<template>
  <TextEditor
    editor-class="prose-sm border max-w-none rounded-b-lg p-3 overflow-auto h-64 focus:outline-none"
    :fixedMenu="true"
    :content="content"
    @change="(val) => (content = val)"
    :mentions="mentions"
  />
</template>

<script setup>
import { TextEditor } from 'frappe-ui'
let mentions = [
  { label: 'Husain Wrenn', value: 'hwrenn0@spotify.com' },
  { label: 'Gwenore Fitter', value: 'gfitter1@foxnews.com' },
  { label: 'Ricard Claussen', value: 'rclaussen2@imgur.com' },
  { label: 'Rickard Higford', value: 'rhigford3@multiply.com' },
  { label: 'Lazarus MacKey', value: 'lmackey4@prlog.org' },
  { label: 'Karrah Ege', value: 'kege5@prweb.com' },
  { label: 'Seward Godin', value: 'sgodin6@msu.edu' },
  { label: 'Milzie Sanches', value: 'msanches7@senate.gov' },
  { label: 'Walt Arrington', value: 'warrington8@tripod.com' },
  { label: 'Seline Bonifas', value: 'sbonifas9@hibu.com' },
]
</script>
```

If you are on Vue version 3.2 or earlier, you need to add this line in your main.js file:
```js
app.config.unwrapInjectedRef = true
```
You can read more about it here: https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity


## Props

| Name                | Default | Value                       | Description                                                                                            |
| :------------------ | :------ | :-------------------------- | :----------------------------------------------------------------------------------------------------- |
| `content`           | `null`  | `String`                    | HTML string to set as the initial value in the editor                                                  |
| `placeholder`       | `null`  | `String`                    | Placeholder text to show when the content is empty                                                     |
| `editorClass`       | `null`  | `String \| Object \| Array` | Valid [CSS class values](https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes) |
| `editable`          | `true`  | `Boolean`                   | Enable/disable editing                                                                                 |
| `fixedMenu`         | `null`  | `true \| false \| Array`    | See [customizing menu](#customizing-menu)                                                              |
| `bubbleMenu`        | `null`  | `true \| false \| Array`    | See [customizing menu](#customizing-menu)                                                              |
| `floatingMenu`      | `null`  | `true \| false \| Array`    | See [customizing menu](#customizing-menu)                                                              |
| `extensions`        | `null`  | `Array`                     | [Tiptap extensions](https://tiptap.dev/extensions)                                                     |
| `starterkitOptions` | `null`  | `Object`                    | Options to pass to the [Starterkit Extension](https://tiptap.dev/api/extensions/starter-kit)           |
| `mentions`          | `null`  | `Array`                     | Array of `{label, value}` for mentions list                                                            |

## Customizing Menu

There are three types of menus available for the editor.

- Fixed Menu: Menu that is always visible at a fixed place
- Bubble Menu: Menu that shows up when you select some text
- Floating Menu: Menu that shows up on a new line

You can choose to use any of these or a combination of these in your editor.
Here are some examples of customized editors:

### Fixed menu with custom buttons

You can customize which buttons show up in the menu by passing an array of
button names. You can find the list of all buttons available
[here](https://github.com/frappe/frappe-ui/blob/main/src/components/TextEditor/commands.js).

<Story class="h-80" :iframe="false">
  <TextEditor
    editor-class="!prose-sm border max-w-none rounded-b-lg p-3 overflow-auto h-64 focus:outline-none"
    :fixedMenu="fixedMenuMinimalButtons"
    :content="content1"
    @change="val => content1 = val"
  />
</Story>

```vue
<template>
  <TextEditor
    editor-class="!prose-sm border max-w-none rounded-b-lg p-3 overflow-auto h-64 focus:outline-none"
    :fixedMenu="fixedMenuMinimalButtons"
    :content="content"
    @change="(val) => (content = val)"
  />
</template>
<script setup>
import { TextEditor } from 'frappe-ui'
let content = ref('[initial html content]')
let fixedMenuMinimalButtons = [
  'Paragraph',
  ['Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'],
  'Separator',
  'Bold',
  'Italic',
  'Separator',
  'Bullet List',
  'Numbered List',
  'Separator',
  'Link',
  'Blockquote',
  'Code',
]
</script>
```

### Minimal editor with bubble menu

Setting `bubbleMenu` to `true` will show a bubble menu on text selection. You
can also pass a list of button names, just like the previous example.

<Story class="h-28" :iframe="false">
  <TextEditor
    editor-class="!prose-sm border max-w-none rounded-lg p-3 overflow-auto h-20 focus:outline-none"
    :bubbleMenu="true"
    :content="contentBubble"
    @change="val => contentBubble = val"
  />
</Story>

```vue
<template>
  <TextEditor
    editor-class="!prose-sm border max-w-none rounded-lg p-3 overflow-auto h-20 focus:outline-none"
    :bubbleMenu="true"
    :content="content"
    @change="(val) => (content = val)"
  />
</template>
<script setup>
import { TextEditor } from 'frappe-ui'
let content = ref('[initial html content]')
</script>
```

### Floating menu and bubble menu

You can combine multiple menus. You can also pass an array of button names.

<Story class="h-80" :iframe="false">
  <TextEditor
    editor-class="!prose-sm border max-w-none rounded-lg p-3 overflow-auto h-72 focus:outline-none"
    :floatingMenu="true"
    :bubbleMenu="true"
    placeholder="Type something and press enter"
  />
</Story>

```vue
<template>
  <TextEditor
    editor-class="!prose-sm border max-w-none rounded-lg p-3 overflow-auto h-20 focus:outline-none"
    :floatingMenu="true"
    :bubbleMenu="true"
  />
</template>
<script setup>
import { TextEditor } from 'frappe-ui'
</script>
```

### Comment Editor

An example of how to use slots and various features of the TextEditor to make a
customized editor experience.

There are three slots available: `top`, `bottom` and `editor`. The `top` and
`bottom` are slots for placing menus at the top or bottom of the editor. If you
are using these slots, you must import and render the Menu components manually.
They are available to import as `TextEditorFixedMenu`, `TextEditorBubbleMenu`,
and `TextEditorFloatingMenu`.

The `editor` slot renders the `TextEditorContent` component, you can override it
and render the `TextEditorContent` component if you want some custom behaviour.

<Story class="h-[15rem] !block" :iframe="false">
  <Input class="mb-2" type="checkbox" v-model="editable" label="Editable" />
  <TextEditor
    class="border p-4 rounded-lg"
    :editor-class="['prose-sm max-w-none min-h-[6rem]']"
    :content="content2"
    @change="val => content2 = val"
    :starterkit-options="{ heading: { levels: [2, 3, 4, 5, 6] } }"
    placeholder="Write something..."
    :editable="editable"
  >
    <template v-slot:editor="{ editor }">
      <TextEditorContent
        :class="[editable && 'max-h-[6rem] overflow-y-auto']"
        :editor="editor"
      />
    </template>
    <template v-slot:bottom>
      <div
        v-if="editable"
        class="mt-2 flex flex-col justify-between sm:flex-row sm:items-center"
      >
        <TextEditorFixedMenu
          class="-ml-1 overflow-x-auto"
          :buttons="fixedMenuMinimalButtons"
        />
        <div class="mt-2 flex items-center justify-end space-x-2 sm:mt-0">
          <Button appearance="primary">
            Submit
          </Button>
        </div>
      </div>
    </template>
  </TextEditor>
</Story>

```vue
<template>
  <Input class="mb-2" type="checkbox" v-model="editable" label="Editable" />
  <TextEditor
    class="rounded-lg border p-4"
    :editor-class="['prose-sm max-w-none min-h-[6rem]']"
    :content="content2"
    @change="(val) => (content2 = val)"
    :starterkit-options="{ heading: { levels: [2, 3, 4, 5, 6] } }"
    placeholder="Write something..."
    :editable="editable"
  >
    <template v-slot:editor="{ editor }">
      <TextEditorContent
        :class="[editable && 'max-h-[6rem] overflow-y-auto']"
        :editor="editor"
      />
    </template>
    <template v-slot:bottom>
      <div
        v-if="editable"
        class="mt-2 flex flex-col justify-between sm:flex-row sm:items-center"
      >
        <TextEditorFixedMenu
          class="-ml-1 overflow-x-auto"
          :buttons="fixedMenuMinimalButtons"
        />
        <div class="mt-2 flex items-center justify-end space-x-2 sm:mt-0">
          <Button appearance="primary"> Submit </Button>
        </div>
      </div>
    </template>
  </TextEditor>
</template>

<script setup>
import {
  TextEditor,
  TextEditorFixedMenu,
  TextEditorContent,
  Button,
  Input,
} from 'frappe-ui'
let content = ref('Highly customized editor')
let editable = ref(true)
let fixedMenuMinimalButtons = [
  'Paragraph',
  ['Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'],
  'Separator',
  'Bold',
  'Italic',
  'Separator',
  'Bullet List',
  'Numbered List',
  'Separator',
  'Link',
  'Blockquote',
  'Code',
]
</script>
```
