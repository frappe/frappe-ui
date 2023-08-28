import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)

export default defineConfig({
  setupFile: './histoire.setup.ts',
  plugins: [HstVue()],
  theme: {
    title: 'Espresso Design System.',
    defaultColorScheme: 'light',
    hideColorSchemeSwitch: true,
    logo: {
      square: './frappe-ui-only-logo.png',
      light: './frappe-ui-logo-200.png',
      dark: './frappe-ui-logo-200.png',
    },
    colors: {
      gray: fullConfig.theme.colors.gray,
      primary: fullConfig.theme.colors.orange,
    },
  },
  tree: {
    groups: [
      {
        id: 'top',
        title: '',
      },
      {
        id: 'components',
        title: 'Components',
        include: (file) => true,
      },
    ],
  },
})
