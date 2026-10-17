export const ACCESS_TOKEN_STORAGE_KEY = 'toeic_access_token'

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function setAccessToken(accessToken) {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
}

export function clearAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}
