type Tab = {
  label: string
  icon?: string
	route?:string
}

export interface TabProps {
  as?: string
  tabs: Tab[]
  vertical?: Boolean
}
