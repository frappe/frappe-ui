import type { Theme } from '../../utils/theme'

/** One half of an option's preview window (a single window for light/dark, two
 *  side-by-side windows for system). */
export interface ThemePreviewPane {
  tone: 'light' | 'dark'
  containerClass: string
  screenClass: string
}

/** Static description of one selectable theme and its preview card. */
export interface ThemeOption {
  value: Theme
  defaultLabel: string
  bars: boolean
  panes: ThemePreviewPane[]
}

// These class strings use literal light/dark colors (`bg-white`, `bg-gray-900`,
// the traffic-light hexes) rather than semantic tokens: each card must always
// depict its own theme, so the preview must not follow `<html data-theme>`.
export const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    defaultLabel: 'Light',
    bars: true,
    panes: [
      {
        tone: 'light',
        containerClass: 'pl-5 pt-3.5 bg-surface-gray-2 rounded-t-[10.5px]',
        screenClass: 'bg-white rounded-tl-sm',
      },
    ],
  },
  {
    value: 'dark',
    defaultLabel: 'Dark',
    bars: true,
    panes: [
      {
        tone: 'dark',
        containerClass: 'pl-5 pt-3.5 bg-surface-gray-2 rounded-t-[10.5px]',
        screenClass: 'bg-gray-900 rounded-tl-sm',
      },
    ],
  },
  {
    value: 'system',
    defaultLabel: 'System',
    bars: false,
    panes: [
      {
        tone: 'light',
        containerClass:
          'flex flex-1 pl-5 pt-3.5 bg-surface-gray-2 rounded-tl-[10.5px]',
        screenClass: 'bg-white rounded-tl-sm w-full',
      },
      {
        tone: 'dark',
        containerClass:
          'flex flex-1 pl-5 pt-3.5 bg-surface-gray-3 rounded-tr-[10.5px]',
        screenClass: 'bg-gray-900 rounded-tl-sm w-full',
      },
    ],
  },
]
