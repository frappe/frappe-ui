import { useDateFormat, useTimeAgo } from '@vueuse/core'

export function getWidth(size) {
  let sizeMap = {
    xxs: 'w-15',
    xs: 'w-20',
    sm: 'w-24',
    md: 'w-28',
    lg: 'w-32',
    xl: 'w-36',
    '2xl': 'w-40',
    '3xl': 'w-44',
    '4xl': 'w-48',
    '5xl': 'w-52',
    '6xl': 'w-56',
    '7xl': 'w-60',
    full: 'flex-1',
  }

  return sizeMap[size]
}

export function customWidth(size) {
  return size.endsWith('px') || size.endsWith('rem') || size.endsWith('%')
}

export function dateFormat(date, format) {
  const _format = format || 'DD-MM-YYYY HH:mm:ss'
  return useDateFormat(date, _format).value
}

export function timeAgo(date) {
  return useTimeAgo(date).value
}

export function htmlToText(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export const alignmentMap = {
  left: 'justify-start',
  start: 'justify-start',
  center: 'justify-center',
  middle: 'justify-center',
  right: 'justify-end',
  end: 'justify-end',
}
