import LucidePalette from '~icons/lucide/palette'
import LucideRows from '~icons/lucide/rows-3'
import LucideJson from '~icons/lucide/braces'
import LucideSquare from '~icons/lucide/square'
import LucideDb from '~icons/lucide/database-zap'
import LucideSettings from '~icons/lucide/settings'
import LucideComponent from '~icons/lucide/box'
import LucideBaseline from '~icons/lucide/baseline'
import LucideCase from '~icons/lucide/case-sensitive'
import LucideBlend from '~icons/lucide/blend'
import LucideRadius from '~icons/lucide/radius'

const componentList = [
  'Alert',
  'Avatar',
  'Badge',
  'Breadcrumbs',
  'Button',
  'Calendar',
  'Charts',
  'Checkbox',
  'CircularProgressBar',
  'Combobox',
  'DatePicker',
  'Dialog',
  'Dropdown',
  'ErrorMessage',
  'FileUploader',
  'MonthPicker',
  'MultiSelect',
  'Popover',
  'Progress',
  'Rating',
  'Select',
  'Sidebar',
  'Spinner',
  'Switch',
  'Tabs',
  'Textarea',
  'TextEditor',
  'TextInput',
  'TimePicker',
  'Tooltip',
  'Tree',
]

const componentItems = componentList.map((name) => ({
  text: name,
  icon: LucideComponent,
  link: `/docs/${name.toLowerCase()}`,
}))

export default [
  {
    text: 'Introduction',
    link: '/docs/introduction',
  },
  {
    text: 'Getting Started',
    link: '/docs/getting-started',
  },

  {
    text: 'Espresso Design System',
    collapsed: true,
    items: [
      {
        text: 'Background Color',
        icon: LucidePalette,
        link: '/docs/design-system/background-color',
      },
      {
        text: 'Text Color',
        icon: LucideBaseline,
        link: '/docs/design-system/text-color',
      },
      {
        text: 'Border Color',
        icon: LucideSquare,
        link: '/docs/design-system/border-color',
      },
      {
        text: 'Font Size',
        icon: LucideCase,
        link: '/docs/design-system/font-size',
      },
      {
        text: 'Font Weight',
        icon: LucideCase,
        link: '/docs/design-system/font-weight',
      },
      {
        text: 'Letter Spacing',
        icon: LucideCase,
        link: '/docs/design-system/letter-spacing',
      },
      {
        text: 'Line Height',
        icon: LucideCase,
        link: '/docs/design-system/line-height',
      },
      {
        text: 'Drop Shadow',
        icon: LucideBlend,
        link: '/docs/design-system/drop-shadow',
      },
      {
        text: 'Border Radius',
        icon: LucideRadius,
        link: '/docs/design-system/border-radius',
      },
    ],
  },

  {
    text: 'Data Fetching',
    collapsed: false,
    items: [
      {
        text: 'Resource',
        icon: LucideDb,
        link: '/docs/resource',
      },
      {
        text: 'List Resource',
        icon: LucideRows,
        link: '/docs/list-resource',
      },
      {
        text: 'Document Resource',
        icon: LucideJson,
        link: '/docs/document-resource',
      },
    ],
  },

  {
    text: 'Components',
    collapsed: false,
    items: componentItems,
  },

  {
    text: 'Other',
    items: [
      {
        text: 'Utilities',
        icon: LucideSettings,
        link: '/docs/utilities',
      },
      {
        text: 'Directives',
        icon: LucideSettings,
        link: '/docs/directives',
      },
    ],
  },
]
