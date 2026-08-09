// Sprite-based icon trio, moved out of `frappe-ui/icons` before 1.0.0 (#904).
//
// The canonical way to render an icon is a `lucide-*` class (or the root
// `Icon` component, which wraps one). This family draws from a 468 KB SVG
// sprite that `spritePlugin` injects into `<body>`, and `IconPicker` reads
// its icon list back out of that DOM. Apps still on the sprite import from
// here while they migrate; the surface is unstable and will be removed.
export { default as Icon } from './Icon.vue'
export { default as IconPicker } from './IconPicker.vue'
export { default as spritePlugin } from './spritePlugin'
