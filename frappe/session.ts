import { call } from 'frappe-ui'
import { computed, reactive, ref } from 'vue'

const initialized = ref(false)

const DEFAULT_USER = {
  email: '',
  first_name: '',
  last_name: '',
  full_name: '',
  user_image: '',
  country: '',
  locale: 'en-US',
}

const user = ref({ ...DEFAULT_USER })

const isLoggedIn = computed(() => {
  return user.value.email && user.value.email !== 'Guest'
})

async function initialize() {
  Object.assign(user.value, getSessionFromCookies())
  initialized.value = true
}

async function login(email: string, password: string) {
  reset()
  const res = await call('login', { usr: email, pwd: password })
  if (!res) {
    throw new Error('Login failed')
  }
  Object.assign(user.value, {
    email: res.email,
    first_name: res.first_name,
    last_name: res.last_name,
    full_name: res.full_name,
    user_image: res.user_image,
    country: res.country,
    locale: res.locale || 'en-US',
  })
  window.location.reload()
}

async function logout() {
  reset()
  await call('logout')
  window.location.reload()
}

function reset() {
  Object.assign(user.value, { ...DEFAULT_USER })
}

initialize().catch((err) => {
  console.error('Failed to initialize session:', err)
})

function getSessionFromCookies() {
  const cookieString = document.cookie.split('; ').join('&')
  const urlParams = new URLSearchParams(cookieString)
  const cookies = Object.fromEntries(urlParams.entries())

  if (cookies.user_id) {
    cookies.email = cookies.user_id
    delete cookies.user_id
  }

  if (cookies.email === 'Guest') {
    return { ...DEFAULT_USER }
  }

  return cookies
}

export function sessionUser() {
  return getSessionFromCookies().email
}

export default reactive({
  initialized,
  user,
  isLoggedIn,
  initialize,
  login,
  logout,
  reset,
})
