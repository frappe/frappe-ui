import { createResource } from '../src'

export default function translation(app, options = {}) {
  if (typeof options !== 'object') {
    options = {
      translationMethod: options,
    }
  }
  if (!options.translationMethod) {
    return console.error(
      'You have to provide a method to fetch translations from.',
    )
  }
  const config = {
    translationMethod: options.translationMethod,
    cache: options.cache === false ? null : options.cache || 'translations',
    ...options,
  }

  app.config.globalProperties.__ = translate
  window.__ = translate

  if (!window.translatedMessages) {
    fetchTranslations(config)
  }
}

function translate(message) {
  let translatedMessages = window.translatedMessages || {}
  let translatedMessage = translatedMessages[message] || message

  const hasPlaceholders = /{\d+}/.test(message)
  if (!hasPlaceholders) {
    return translatedMessage
  }

  return {
    format: function (...args) {
      return translatedMessage.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match
      })
    },
  }
}

function fetchTranslations(config) {
  createResource({
    url: config.translationMethod,
    cache: config.cache,
    auto: true,
    transform: (data) => {
      window.translatedMessages = data
      if (config.onSuccess) {
        config.onSuccess(data)
      }
    },
    onError: (error) => {
      console.warn('Failed to load translations:', error)
      if (config.onError) {
        config.onError(error)
      }
    },
  })
}
