import { RouterLinkProps } from 'vue-router'

interface BreadcrumbItem {
  label: string
  route?: RouterLinkProps['to']
  onClick?: () => void
  [key: string]: any
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}
