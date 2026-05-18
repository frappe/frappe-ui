export interface SidebarItem {
  text: string
  link: string
}

export interface SidebarSection {
  text: string
  items: SidebarItem[]
}

export function getSidebarList(componentList: string[]): SidebarSection[] {
  const componentItems: SidebarItem[] = [
    ...componentList.map((name) => ({
      text: name,
      link: `/docs/components/${name.toLowerCase()}`,
    })),
    { text: 'Legacy components', link: '/docs/components/legacy' },
  ]

  return [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/docs/introduction' },
        { text: 'Getting Started', link: '/docs/getting-started' },
      ],
    },
    {
      text: 'Design System',
      items: [
        { text: 'Background Color', link: '/docs/design-system/background-color' },
        { text: 'Text Design', link: '/docs/design-system/text' },
        { text: 'Border Color', link: '/docs/design-system/border-color' },
        { text: 'Drop Shadow', link: '/docs/design-system/drop-shadow' },
        { text: 'Border Radius', link: '/docs/design-system/border-radius' },
      ],
    },
    {
      text: 'Components',
      items: componentItems,
    },
    {
      text: 'Data Fetching',
      items: [
        { text: 'Resource', link: '/docs/data-fetching/resource' },
        { text: 'List Resource', link: '/docs/data-fetching/list-resource' },
        { text: 'Document Resource', link: '/docs/data-fetching/document-resource' },
      ],
    },
    {
      text: 'Other',
      items: [
        { text: 'Icons', link: '/docs/other/icons' },
        { text: 'Utilities', link: '/docs/other/utilities' },
        { text: 'Directives', link: '/docs/other/directives' },
      ],
    },
  ]
}
