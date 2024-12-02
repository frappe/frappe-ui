import { createResource } from '../resources'
import { App } from 'vue'

declare global {
  interface Window {
    __: (message: string, replace?: any, context?: string | null) => string
    translatedMessages?: { [key: string]: string }
  }
}

export default function translationPlugin(app: App) {
  app.config.globalProperties.__ = translate
  window.__ = translate
  if (!window.translatedMessages) fetchTranslations()
}

function format(message: string, replace: string) {
  return message.replace(/{(\d+)}/g, function (match, number) {
    return typeof replace[number] != 'undefined' ? replace[number] : match
  })
}

function translate(
  message: string,
  replace?: any,
  context: string | null = null,
) {
  let translatedMessages = window.translatedMessages || {}
  let translatedMessage = ''

  if (context) {
    let key = `${message}:${context}`
    if (translatedMessages[key]) {
      translatedMessage = translatedMessages[key]
    }
  }

  if (!translatedMessage) {
    translatedMessage = translatedMessages[message] || message
  }

  const hasPlaceholders = /{\d+}/.test(message)
  if (!hasPlaceholders) {
    return translatedMessage
  }

  return format(translatedMessage, replace)
}

function fetchTranslations() {
  createResource({
    url: 'crm.api.get_translations',
    cache: 'translations',
    auto: true,
    transform: (data: { [key: string]: string }) => {
      window.translatedMessages = data
    },
  })
}
