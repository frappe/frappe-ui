<script>
import { onOutsideClickDirective, visibilityDirective, Button } from '../src'
export default {
  components: {
    Button
  },
  directives: {
    onOutsideClick: onOutsideClickDirective,
    visibility: visibilityDirective
  },
  data() {
    return {
        active: false,
        visible: false,
        intersectionRatio: 0
    }
  },
  methods: {
    setInactive() {
      this.active = false
    },
    onVisibilityChange(visible, entry) {
        this.visible = visible;
        this.intersectionRatio = entry.intersectionRatio;
    }
  },
}
</script>

# Directives

Some common Vue directives that are useful in building frontend apps.

## onOutsideClick

This directive can be used to listen for click events outside of the target
element. In the following example, the div with border has the directive, so
clicks outside the div will trigger the `setInactive` function.

<Story>
  <div class="rounded-lg border p-8" v-on-outside-click="setInactive">
    <Button @click="active = true">{{ active ? 'Click outside' : 'Click me' }}</Button>
  </div>
</Story>

```vue
<template>
  <div class="rounded-lg border p-8" v-on-outside-click="setInactive">
    <Button>{{ active ? 'Click outside' : 'Click me' }}}</Button>
  </div>
</template>
<script>
import { onOutsideClickDirective } from 'frappe-ui'
export default {
  directives: {
    onOutsideClick: onOutsideClickDirective,
  },
  data() {
    return { active: false }
  },
  methods: {
    setInactive() {
      this.active = false
    },
  },
}
</script>
```

## visibility

This directive allows you to trigger a function whenever an element becomes
visible in the viewport. In the following example, whenever the visibility of
the gray box is changed, the values `visible` and `intersectionRatio` are
updated. This feature internally uses the
[IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API),
and the second parameter to the function is the
[`entry` object](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

<Story class="">
  <div class="w-full">
    <pre>visible: {{ visible }}</pre>
    <pre>intersectionRatio: {{ intersectionRatio }}</pre>
    <div
        class="mt-20 h-20 w-full rounded-lg bg-gray-100 p-8"
        v-visibility="onVisibilityChange"
    >
        <pre>target element</pre>
    </div>
  </div>
</Story>

```vue
<template>
  <pre>visible: {{ visible }}</pre>
  <pre>intersectionRatio: {{ intersectionRatio }}</pre>
  <div
    class="mt-20 h-20 w-full rounded-lg bg-gray-100 p-8"
    v-visibility="onVisibilityChange"
  >
    <pre>target element</pre>
  </div>
</template>
<script>
import { visibilityDirective } from 'frappe-ui'
export default {
  directives: {
    visibility: visibilityDirective,
  },
  data() {
    return {
      visible: false,
      intersectionRatio: 0,
    }
  },
  methods: {
    onVisibilityChange(visible, entry) {
      this.visible = visible
      this.intersectionRatio = entry.intersectionRatio
    },
  },
}
</script>
```
