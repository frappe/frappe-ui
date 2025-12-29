import fs from 'fs'
import path from 'path'
import icons from './theme/icons'

const iconify = (name: keyof typeof icons, text: string) => {
  return `<span class='iconlink'>${icons[name]} ${text}</span>`
}

// temporarily remove dead links
const excludeLinks = [
  'Autocomplete',
  'CommandPalette',
  'Divider',
  'ListFilter',
  'Provider',
  'VueGridLayout',
  'types',
  'Toast',
]

function getComponentList() {
  const componentsPath = path.resolve(__dirname, '../../src/components')
  return fs
    .readdirSync(componentsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !excludeLinks.includes(d.name))
    .map((d) => ({
      text: iconify('box', d.name),
      link: `/docs/${d.name.toLowerCase()}`,
    }))
}

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
    text: 'Design System',
    collapsed: true,
    items: [
      {
        text: iconify('bgColor', 'Background Color'),
        link: '/docs/design-system/background-color',
      },
      {
        text: iconify('textColor', 'Text Color'),
        link: '/docs/design-system/text-color',
      },
      {
        text: iconify('borderColor', 'Border Color'),
        link: '/docs/design-system/border-color',
      },

      {
        text: iconify('font', 'Font Size'),
        link: '/docs/design-system/font-size',
      },
      {
        text: iconify('font', 'Font Weight'),
        link: '/docs/design-system/font-weight',
      },
      {
        text: iconify('font', 'Letter Spacing'),
        link: '/docs/design-system/letter-spacing',
      },
      {
        text: iconify('font', 'Line Height'),
        link: '/docs/design-system/line-height',
      },

      {
        text: iconify('overlay', 'Drop Shadow'),
        link: '/docs/design-system/drop-shadow',
      },
      {
        text: iconify('radius', 'Border Radius'),
        link: '/docs/design-system/border-radius',
      },
    ],
  },

  {
    text: 'Data Fetching',
    collapsed: false,
    items: [
      { text: iconify('db', 'Resource'), link: '/docs/resource' },
      {
        text: iconify('listdb', 'List Resource'),
        link: '/docs/list-resource',
      },
      {
        text: iconify('docdb', 'Document Resource'),
        link: '/docs/document-resource',
      },
    ],
  },

  {
    text: 'Components',
    collapsed: false,
    items: getComponentList(),
  },

  {
    text: 'Other',
    items: [
      { text: iconify('cog', 'Utilities'), link: '/docs/utilities' },
      { text: iconify('cog', 'directives'), link: '/docs/directives' },
    ],
  },
]
