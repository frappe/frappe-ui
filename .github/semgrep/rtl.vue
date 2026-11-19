<template>
  <!-- ruleid: rtl-physical-class -->
  <div class="ml-2"></div>
  <!-- ruleid: rtl-physical-class -->
  <div class="flex hover:pr-[3px]"></div>
  <!-- ruleid: rtl-physical-class -->
  <div class="absolute -left-1 top-0"></div>
  <!-- ruleid: rtl-physical-class -->
  <div class="border-r rounded-tl-4"></div>
  <!-- ruleid: rtl-physical-class -->
  <div class="text-left"></div>
  <!-- ok: rtl-physical-class -->
  <div
    class="ms-2 pe-[3px] -start-1 border-e rounded-ss-4 text-start gap-x-1"
  ></div>
  <!-- ok: rtl-physical-class -->
  <div class="rtl:rotate-180 rtl:mr-2 ltr:ml-2"></div>
  <!-- ok: rtl-physical-class -->
  <div class="absolute left-1/2 -translate-x-1/2"></div>
</template>

<script setup lang="ts">
// ruleid: rtl-physical-class
const layoutClasses = props.intervals ? 'flex space-x-1' : 'bg-surface-gray-2'
// ok: rtl-physical-class
const side = 'left-start'
/** The grip's `right-2.5` inset, named in a comment. */
const popup = useFloatingPopup({
  // ruleid: rtl-physical-placement
  floatingOptions: { placement: 'right-start' },
})
// ruleid: rtl-physical-css
const OL_STYLE = 'list-style-type: decimal; padding-left: 1.5em'
// ruleid: rtl-physical-css
const align = 'text-align: left'
// ok: rtl-physical-css
const OL_LOGICAL = 'list-style-type: decimal; padding-inline-start: 1.5em'
// ruleid: rtl-physical-css
const indent = { marginLeft: '4px' }
// ok: rtl-physical-css
const width = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
// ok: rtl-physical-css
const logical = { marginInlineStart: '4px' }
const flipped = useFloatingPopup({
  floatingOptions: {
    // ok: rtl-physical-placement
    placement: documentDir() === 'rtl' ? 'left-start' : 'right-start',
  },
})
</script>
