import { createResource } from '../resources'
import { App } from 'vue'

type Replace = { [key: string]: string }
type TranslatedMessages = Replace

declare global {
  interface Window {
    __: (message: string, replace?: Replace, context?: string | null) => string
    translatedMessages?: TranslatedMessages
  }
}

export default function translationPlugin(app: App) {
  app.config.globalProperties.__ = translate
  window.__ = translate
  if (!window.translatedMessages) fetchTranslations()
}

function format(message: string, replace?: Replace) {
  if (!replace) return message
  return message.replace(/{(\d+)}/g, function (match, number) {
    return typeof replace[number] != 'undefined' ? replace[number] : match
  })
}

export function translate(
  message: string,
  replace?: Replace,
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
    transform: (messages: TranslatedMessages) => {
      window.translatedMessages = messages
    },
  })
}

export function __(
  message: string,
  replace?: Replace,
  context: string | null = null,
): string {
  if (!window.__) return message
  return translate(message, replace, context)
}
