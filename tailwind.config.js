import preset from './src/tailwind/preset'

export default {
  presets: [preset],
  content: [
    './index.html',
    './App.vue',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './docs/**/*.{vue,js,ts,md}',
    './docs/.vitepress/**/*.{vue,js,ts,css}',
    './frappe/**/*.{vue,js,ts,jsx,tsx}',
    './icons/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
