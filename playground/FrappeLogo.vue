<script setup lang="ts">
// The Frappe mark, straight from `docs/content/public/frappe-logo.svg` —
// inlined rather than linked so it takes a class and needs no asset pipeline.
//
// It is a brand mark, so nothing here is retokenised: black square, white F.
// `dark:invert` is the standard mono inversion — the artwork is pure black and
// white, so inverting gives the white-on-black form the dark theme needs
// without drawing a second version of the logo.
</script>

<template>
  <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="dark:invert"
    aria-hidden="true"
  >
    <path
      d="M12.5714 44L31.4286 44C38.3716 44 44 38.3716 44 31.4286L44 12.5714C44 5.62842 38.3716 0 31.4286 0L12.5714 0C5.62842 0 0 5.62842 0 12.5714L0 31.4286C0 38.3716 5.62842 44 12.5714 44Z"
      fill="black"
    />
    <path d="M27.9084 12.9957H16.1069V16.1385H27.9084V12.9957Z" fill="white" />
    <path
      d="M16.1069 31.0042V20.7742H27.1069V23.917H19.2498V31.0042H16.1069Z"
      fill="white"
    />
  </svg>
</template>
