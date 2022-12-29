import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Frappe UI',
  description: 'A set of components and utilities for rapid UI development',
  appearance: false,
  themeConfig: {
    logo: '/frappe-ui-logo.svg',
    siteTitle: false,
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Installation', link: '/getting-started' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Alert', link: '/components/alert' },
          { text: 'Autocomplete', link: '/components/autocomplete' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Button', link: '/components/button' },
          { text: 'DatePicker', link: '/components/datepicker' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Dropdown', link: '/components/dropdown' },
          { text: 'ErrorMessage', link: '/components/errormessage' },
          { text: 'FeatherIcon', link: '/components/feathericon' },
          { text: 'FileUploader', link: '/components/fileuploader' },
          { text: 'Input', link: '/components/input' },
          { text: 'Loading Indicator', link: '/components/loading-indicator' },
          { text: 'Popover', link: '/components/popover' },
          { text: 'Resource', link: '/components/resource' },
          { text: 'Text Editor', link: '/components/text-editor' },
          { text: 'Toast', link: '/components/toast' },
          { text: 'Tooltip', link: '/components/tooltip' },
        ],
      },
      {
        text: 'Data Fetching',
        items: [
          { text: 'Resource', link: '/resources/resource' },
          { text: 'List Resource', link: '/resources/list-resource' },
          { text: 'Document Resource', link: '/resources/document-resource' },
        ],
      },
      {
        text: 'Other',
        items: [
          { text: 'Directives', link: '/directives' },
          { text: 'Utilities', link: '/utils' },
        ],
      },
    ],
  },
})
