# Utilities

Some common utilities that are useful in building frontend apps.

## debounce

Creates a function that will run only once in the specified number of wait time
(milliseconds). In the following example, if you run `debouncedInput` function
every time the user presses a key, it will run only once in every `500ms`.

```js
import { debounce } from 'frappe-ui'

function onInput(e) {
  // do something with input event
}

let debouncedInput = debounce(onInput, 500)
```

## fileToBase64

This function will return the base64 string of a
[File object](https://developer.mozilla.org/en-US/docs/Web/API/File_API).

```js
import { fileToBase64 } from 'frappe-ui'

let base64 = fileToBase64(file) // file must be an instance of File
```

## pageMeta

This is a plugin that can be used to update the `document.title` reactively as
the page changes.

Register the plugin in your `main.js` file.

```js
import { pageMetaPlugin } from 'frappe-ui'
// ...
app.use(pageMetaPlugin)
```

Now, in your page component, declare the `pageMeta` function. It must return an
object with `title` and (`icon` or `emoji`) properties. The `pageMeta` function
behaves like a computed property, if there are reactive dependences that change,
`document.title` will also change accordingly.

**Page.vue**

```vue
<template>...</template>
<script>
export default {
    ...
    pageMeta() {
        return {
            title: 'Page Title',
            icon: '<link to .png, .ico file>',
            emoji: '🌈'
        }
    }
}
</script>
```
