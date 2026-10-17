const unauthorizedEventName = 'toeic-auth-unauthorized'

export function notifyUnauthorized() {
  window.dispatchEvent(new Event(unauthorizedEventName))
}

export function subscribeToUnauthorized(callback) {
  window.addEventListener(unauthorizedEventName, callback)
  return () => window.removeEventListener(unauthorizedEventName, callback)
}
