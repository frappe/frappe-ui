import './histoire.css'
import './src/style.css'

// development
if (document.readyState == 'complete') {
  updateThemeAttrOnThemeChange()
}

// production
window.addEventListener('DOMContentLoaded', () => {
  updateThemeAttrOnThemeChange()
})

function updateThemeAttrOnThemeChange() {
  let observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      const newValue = m.target.getAttribute(m.attributeName)

      if (newValue === 'htw-dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }
  })
  // observe changes to the class attribute on root element
  observer.observe(document.documentElement, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class'],
  })
}

// handle route param in url
const urlParams = new URLSearchParams(window.location.search)
const route = urlParams.get('route')
if (route) {
  history.pushState({}, '', route)
}
