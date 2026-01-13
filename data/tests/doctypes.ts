export interface ToDoDocType {
  name: string
  description: string
  status: 'Open' | 'Closed'
  priority: number
  assigned_to?: string
  owner: string
  modified: string
  creation: string
}
