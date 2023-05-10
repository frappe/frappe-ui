export function onDocUpdate(socket, doctype, callback) {
  subscribe(socket, doctype)
  socket.on('list_update', (data) => {
    if (data.doctype == doctype) {
      callback(data.name)
    }
  })
}

let subscribed = {}
function subscribe(socket, doctype) {
  if (subscribed[doctype]) return
  socket.emit('doctype_subscribe', doctype)
  subscribed[doctype] = true
}
