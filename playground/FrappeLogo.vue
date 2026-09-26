<script setup lang="ts">
// The Frappe mark, from the Frappe Logos file (node 4372:16) — inlined rather
// than linked so it takes a class and needs no asset pipeline.
//
// It is a brand mark, so nothing here is retokenised and nothing flips in the
// dark theme: the purple tile carries its own contrast on either page.
//
// `rx` is 9, not the 4.5 Figma's SVG export writes. The tile is 16x16 with a
// 4.5px corner in the file — 28.125% — and the exporter scales the paths to
// the 2x canvas but leaves the radius at its source value, which halves the
// roundness. 28.125% of 32 is 9.
//
// That draws at 7.875px in the header's 28px box, which the box's own 6px
// clip doesn't touch: a rounder corner cuts away more, so the mark's shape
// sits inside the crop's rather than against it.
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="32" height="32" rx="9" fill="#B352FF" />
    <path d="M12.3 15.5449H9.80002V25.2499H12.3V15.5449Z" fill="white" />
    <path d="M12.3 6.75082H9.80002V11.4508H12.3V6.75082Z" fill="white" />
    <path d="M25.5001 9.54413H7.00012V12.0441H25.5001V9.54413Z" fill="white" />
    <path d="M25.5001 19.9477H7.00012V22.4477H25.5001V19.9477Z" fill="white" />
    <path d="M22.7051 6.75082H20.2051V25.2508H22.7051V6.75082Z" fill="white" />
  </svg>
</template>
