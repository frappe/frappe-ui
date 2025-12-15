import preset from './src/tailwind/preset'

export default {
  presets: [preset],
  content: [
    './index.html',
    './App.vue',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './website/**/*.{vue,js,ts,jsx,tsx}',
    './website/.vitepress/**/*.{vue,js,ts,jsx,tsx}',
    './frappe/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
