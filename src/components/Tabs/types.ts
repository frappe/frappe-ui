type Tab = {
  /** Text shown for the tab */
  label: string

  /** Optional icon name displayed with the label */
  icon?: string

  /** Optional route to navigate to when the tab is clicked */
  route?: string
}

export interface TabProps {
  /** Element/component used to render the tab container */
  as?: string

  /** List of tabs to render */
  tabs: Tab[]

  /** Renders tabs vertically instead of horizontally */
  vertical?: boolean
}