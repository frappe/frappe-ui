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

// Data-driven: sections come from defineDocsConfig({ sidebar }) — no
// hardcoded IA. Returns the configured tree unchanged.
export function getSidebarList(
  sections: SidebarSection[] = [],
): SidebarSection[] {
  return sections
}
