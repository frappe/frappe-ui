type Tab = {
  label: string
  icon?: string
}

export interface TabProps {
  as?: string
  tabs: Tab[]
  vertical: Boolean
}
