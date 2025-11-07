import { toast } from 'frappe-ui'
import { format } from 'date-fns'
import slugify from 'slugify'
import { useTimeAgo } from '@vueuse/core'
export function dynamicList(k) {
  return k.filter((a) => typeof a !== 'object' || !('cond' in a) || a.cond)
}

export function getFileLink(entity, copy = true) {
  let link
  if (entity.is_link) link = entity.path
  else if (entity.mime_type === 'frappe/slides') {
    link = `${window.location.origin}/slides/presentation/${entity.name}`
  } else {
    link = `${window.location.origin}/drive/${getLinkStem(entity)}`
  }
  if (!copy) return link
  try {
    copyToClipboard(link).then(() => toast.success('Copied to your clipboard!'))
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

// Utils to the utils
function getLinkStem(entity) {
  return `${
    {
      true: 'f',
      [new Boolean(entity.is_group)]: 'd',
      [new Boolean(entity.document || entity.mime_type === 'text/markdown')]:
        'w',
    }[true]
  }/${entity.name}/${slugger(entity.title)}`
}

function slugger(title) {
  return slugify(title.split('.').join(' '), {
    lower: true,
    trim: true,
    remove: /[^\w\s\']|_/,
  })
}

const copyToClipboard = (str) => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str)
  } else {
    // Fallback to the legacy clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = str
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}

export const prettyData = (entities) => {
  return entities.map((entity) => {
    entity.file_size_pretty = formatSize(entity.file_size)
    entity.relativeModified = useTimeAgo(entity.modified)
    if (entity.accessed) entity.relativeAccessed = useTimeAgo(entity.accessed)
    return entity
  })
}

export const formatDate = (date) => {
  if (!date) return ''
  const dateObj = new Date(date)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const hourCycle = navigator.language || 'en-US'

  const formattedDate = format(dateObj, 'MM/dd/yy', { timeZone })
  let formattedTime
  if (hourCycle === 'en-US') {
    formattedTime = format(dateObj, 'hh:mm a', { timeZone })
  } else {
    formattedTime = format(dateObj, 'hh:mm a', { timeZone })
  }
  return `${formattedDate}, ${formattedTime}`
}
