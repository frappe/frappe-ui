export default async function call(method, args, _headers) {
  if (!args) {
    args = {}
  }

  let headers = Object.assign(
    {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname,
    },
    _headers
  )

  if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
    headers['X-Frappe-CSRF-Token'] = window.csrf_token
  }

  const res = await fetch(`/api/method/${method}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(args),
  })

  if (res.ok) {
    const data = await res.json()
    if (data.docs || method === 'login') {
      return data
    }
    return data.message
  } else {
    let response = await res.text()
    let error, exception
    try {
      error = JSON.parse(response)
      // eslint-disable-next-line no-empty
    } catch (e) {}
    let errorParts = [
      [method, error.exc_type, error._error_message].filter(Boolean).join(' '),
    ]
    if (error.exc) {
      exception = error.exc
      try {
        exception = JSON.parse(exception)[0]
        console.log(exception)
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    let e = new Error(errorParts.join('\n'))
    e.exc_type = error.exc_type
    e.exc = exception
    e.messages = error._server_messages
      ? JSON.parse(error._server_messages)
      : []
    e.messages = e.messages.concat(error.message)
    e.messages = e.messages.map((m) => {
      try {
        return JSON.parse(m).message
      } catch (error) {
        return m
      }
    })
    e.messages = e.messages.filter(Boolean)
    if (!e.messages.length) {
      e.messages = error._error_message
        ? [error._error_message]
        : ['Internal Server Error']
    }

    throw e
  }
}
