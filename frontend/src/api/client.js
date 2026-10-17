import axios from 'axios'
import { notifyUnauthorized } from '../auth/authEvents.js'
import { clearAccessToken, getAccessToken } from '../auth/tokenStorage.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
    config.authAccessToken = accessToken
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.authAccessToken === getAccessToken()) {
      clearAccessToken()
      notifyUnauthorized()
    }

    return Promise.reject(error)
  },
)

export default api
