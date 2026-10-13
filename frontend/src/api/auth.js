import api from './client.js'

export function login(credentials) {
  return api.post('/auth/login', credentials).then((response) => response.data)
}

export function signup(payload) {
  return api.post('/auth/signup', payload).then((response) => response.data)
}

export function getMe() {
  return api.get('/auth/me').then((response) => response.data)
}
