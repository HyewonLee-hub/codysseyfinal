export function clearUserSessionStorage() {
  Object.keys(window.sessionStorage)
    .filter((key) => key.startsWith('toeic_'))
    .forEach((key) => window.sessionStorage.removeItem(key))
}
