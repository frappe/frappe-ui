import plugin from "tailwindcss/plugin"
import preset from "frappe-ui/src/tailwind/preset"


export default {
  presets: [preset],
  content: [
    './index.html',
    './App.vue',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './frappe/**/*.{vue,js,ts,jsx,tsx}',
  ]
}
