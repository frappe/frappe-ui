export interface SidebarItem {
  text: string
  link: string
}

export interface SidebarSection {
  text: string
  items: SidebarItem[]
}

// VitePress' route.path includes the configured base (e.g. on a PR preview
// deploy at /pr-preview/pr-716/) and may keep the .html suffix during SSR
// and the initial render even with cleanUrls: true. Sidebar `link` values
// are clean and base-less, so we normalize both sides through this helper.
export function isActiveLink(
  routePath: string,
  link: string,
  base: string,
): boolean {
  const normalize = (p: string) => p.replace(/\.html$/, '').replace(/\/+$/, '')
  const current = normalize(routePath)
  const target = normalize(`${base}${link}`.replace(/\/+/g, '/'))
  if (link === '/') return current === '' || current === normalize(base)
  return current === target
}

export function getSidebarList(
  componentList: string[],
  frappeList: string[] = [],
): SidebarSection[] {
  const componentItems: SidebarItem[] = [
    ...componentList.map((name) => ({
      text: name,
      link: `/docs/components/${name.toLowerCase()}`,
    })),
    { text: 'Legacy components', link: '/docs/components/legacy' },
  ]

  const frappeItems: SidebarItem[] = frappeList.map((name) => ({
    text: name,
    link: `/docs/frappe/${name.toLowerCase()}`,
  }))

  const frappeSection: SidebarSection[] = frappeItems.length
    ? [{ text: 'Frappe Controls', items: frappeItems }]
    : []

  return [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/docs/introduction' },
        { text: 'Getting Started', link: '/docs/getting-started' },
        { text: 'Migration from v0', link: '/docs/migration' },
      ],
    },
    {
      text: 'Foundations',
      items: [
        { text: 'Base Colors', link: '/docs/foundations/colors/base' },
        { text: 'Semantic Colors', link: '/docs/foundations/colors/semantic' },
        { text: 'Typography', link: '/docs/foundations/typography' },
        { text: 'Radius', link: '/docs/foundations/radius' },
        { text: 'Elevation', link: '/docs/foundations/elevation' },
        { text: 'Focus Ring', link: '/docs/foundations/focus-ring' },
      ],
    },
    {
      text: 'Components',
      items: componentItems,
    },
    ...frappeSection,
    {
      text: 'Molecules',
      items: [{ text: 'Editor', link: '/docs/molecules/editor' }],
    },
    {
      text: 'Data Fetching',
      items: [
        { text: 'Resource', link: '/docs/data-fetching/resource' },
        { text: 'List Resource', link: '/docs/data-fetching/list-resource' },
        {
          text: 'Document Resource',
          link: '/docs/data-fetching/document-resource',
        },
      ],
    },
    {
      text: 'Other',
      items: [
        { text: 'Icons', link: '/docs/other/icons' },
        { text: 'Utilities', link: '/docs/other/utilities' },
        { text: 'Directives', link: '/docs/other/directives' },
        { text: 'Internals', link: '/docs/internals' },
      ],
    },
  ]
}
