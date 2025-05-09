import type { Component } from 'vue'

export interface ToastProps {
  open: boolean
  message?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  icon?: Component
  closable?: boolean
  action?: {
    label: string
    altText?: string
    onClick: () => void
  }
}
