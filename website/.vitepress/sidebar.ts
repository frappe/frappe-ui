import fs from 'fs'
import path from 'path'

const icons = {
  box: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
	home: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
	start: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>',
	tool:'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>',
}

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
    text:  'Introduction',
    link: '/docs/introduction',
  },

  {
    text:  'Getting Started',
    link: '/docs/getting-started',
  },

  {
    text: 'Design System',
    items: [{ text: 'Tailwind', link: '/docs/tailwind', collapsed:true, items: [{ text: 'Badge', link: '/docs/badge' }] }],
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
