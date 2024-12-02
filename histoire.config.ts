import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)

export default defineConfig({
  setupFile: './histoire.setup.ts',
  plugins: [HstVue()],
  theme: {
    title: 'Frappe UI',
    defaultColorScheme: 'light',
    hideColorSchemeSwitch: false,
    storeColorScheme: false,
    favicon: 'frappe-ui-square.png',
    logo: {
      square: './frappe-ui-square.png',
      light: './frappe-ui.svg',
      dark: './frappe-ui.svg',
    },
    colors: {
      gray: {
        50: '#f8f8f8',
        100: '#f3f3f3',
        200: '#ededed',
        300: '#e2e2e2',
        400: '#c7c7c7',
        500: '#999999',
        600: '#7c7c7c',
        700: 'rgb(23 23 23)',
        750: 'rgb(20 20 20)',
        800: '#383838',
        900: '#171717',
      },
      primary: {
        50: '#f8f8f8',
        100: '#f3f3f3',
        200: '#ededed',
        300: '#e2e2e2',
        400: '#c7c7c7',
        500: '#999999',
        600: '#7c7c7c',
        700: '#525252',
        800: '#383838',
        900: '#171717',
      },
    },
  },
  tree: {
    order(a, b) {
      let maintainOrder = [
        'Introduction',
        'Getting Started',
        'Resource',
        'List Resource',
        'Document Resource',
        'Utilities',
        'Directives',
      ]
      let aIndex = maintainOrder.indexOf(a)
      let bIndex = maintainOrder.indexOf(b)
      if (aIndex > -1 && bIndex > -1) {
        return aIndex - bIndex
      } else if (aIndex > -1) {
        return -1
      } else if (bIndex > -1) {
        return 1
      } else {
        return a.localeCompare(b)
      }
    },
    groups: [
      {
        id: 'top',
        title: '',
        include: (file) => {
          return (
            file.path.includes('docs/') &&
            !file.path.includes('docs/resources/') &&
            !file.path.includes('docs/other/')
          )
        },
      },
      {
        id: 'resources',
        title: 'Data Fetching',
        include: (file) => {
          return file.path.includes('docs/resources/')
        },
      },
      {
        id: 'components',
        title: 'Components',
        include: (file) => {
          return !file.path.includes('docs/')
        },
      },
      {
        id: 'other',
        title: 'Other',
        include: (file) => true,
      },
    ],
  },
})
