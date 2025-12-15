import fs from 'fs'
import path from 'path'
import icons from './theme/icons'

const withIcon = (name: keyof typeof icons, text: string) => {
  return `<span class='iconlink'>${icons[name]} ${text}</span>`
}

function getComponentList() {
  const componentsPath = path.resolve(__dirname, '../../src/components')
  return fs
    .readdirSync(componentsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      text: withIcon('box', d.name),
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
    items: [
      {
        text: 'Tailwind',
        collapsed: true,
        items: [
          {
            text: withIcon('bgColor', 'Background Color'),
            link: '/docs/design-system/bg-color',
          },
          {
            text: withIcon('textColor', 'Text Color'),
            link: '/docs/design-system/text-color',
          },
          {
            text: withIcon('borderColor', 'Border Color'),
            link: '/docs/design-system/border-color',
          },

          {
            text: withIcon('vector', 'Padding'),
            link: '/docs/design-system/padding',
          },
          {
            text: withIcon('frame', 'Margin'),
            link: '/docs/design-system/margin',
          },

          {
            text: withIcon('font', 'Font Size'),
            link: '/docs/design-system/font-size',
          },
          {
            text: withIcon('font', 'Font Weight'),
            link: '/docs/design-system/font-weight',
          },
          {
            text: withIcon('font', 'Font Family'),
            link: '/docs/design-system/font-family',
          },

          {
            text: withIcon('font', 'Letter Spacing'),
            link: '/docs/design-system/letter-spacing',
          },
          {
            text: withIcon('font', 'Line Height'),
            link: '/docs/design-system/line-height',
          },

          {
            text: withIcon('overlay', 'Drop Shadow'),
            link: '/docs/design-system/drop-shadow',
          },
          {
            text: withIcon('radius', 'Border Radius'),
            link: '/docs/design-system/border-radius',
          },
          {
            text: withIcon('squareDashed', 'Border Width'),
            link: '/docs/design-system/border-width',
          },

          {
            text: withIcon('movehoriz', 'Width'),
            link: '/docs/design-system/width',
          },
          {
            text: withIcon('moveup', 'Height'),
            link: '/docs/design-system/height',
          },
        ],
      },
    ],
  },

  {
    text: 'Data Fetching',
    collapsed: false,
    items: [
      { text: 'Resource', link: '/docs/resource' },
      { text: 'List Resource', link: '/docs/list-resource' },
      { text: 'Document Resource', link: '/docs/document-resource' },
    ],
  },

  {
    text: 'Components',
    collapsed: false,
    items: getComponentList(),
  },

  {
    text: withIcon('tool', 'Other'),
    items: [
      { text: 'Utilities', link: '/docs/utilities' },
      { text: 'directives', link: '/docs/directives' },
    ],
  },
]
