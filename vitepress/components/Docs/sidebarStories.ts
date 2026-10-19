import { inject, type Component, type InjectionKey } from 'vue'

// Loads the story a sidebar item previews, from its `<Component>-<Story>` id.
// The theme can't glob a site's stories itself, so the site provides this
// (e.g. `app.provide(sidebarStoriesKey, …)` in enhanceApp). Without it the
// hover card shows only the description.
export type SidebarStoryLoader = (
  story: string,
) => (() => Promise<Component | { default: Component }>) | undefined

export const sidebarStoriesKey: InjectionKey<SidebarStoryLoader> =
  Symbol('sidebarStories')

export function useSidebarStories(): SidebarStoryLoader {
  return inject(sidebarStoriesKey, () => undefined)
}
