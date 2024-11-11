import './histoire.css'
import './src/style.css'

// TODO: Fix a better way to handle this
// Hack
window.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector(
      '#app > div > div > div.htw-relative.htw-top-0.htw-left-0.htw-z-20.htw-border-r.htw-border-gray-300\\/30.dark\\:htw-border-gray-800 > div.htw-flex.htw-flex-col.htw-h-full.htw-bg-gray-100.dark\\:htw-bg-gray-750.__histoire-pane-shadow-from-right > div.histoire-app-header.htw-px-4.htw-h-16.htw-flex.htw-items-center.htw-gap-2.htw-flex-none > div.htw-ml-auto.htw-flex-none.htw-flex > a:nth-child(2)',
    )
    ?.addEventListener('click', () => {
      console.log('clicked')
      if (document.documentElement.classList.contains('htw-dark')) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
    })
})

// handle route param in url
const urlParams = new URLSearchParams(window.location.search)
const route = urlParams.get('route')
if (route) {
  history.pushState({}, '', route)
}
