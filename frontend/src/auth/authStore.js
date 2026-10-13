import { getMe } from '../api/auth.js'
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStorage.js'
import { clearUserSessionStorage } from './sessionStorage.js'

const signedOutState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: false,
}

const storedAccessToken = getAccessToken()
let state = {
  ...signedOutState,
  accessToken: storedAccessToken,
  isInitializing: Boolean(storedAccessToken),
}
let initializationPromise = null
let sessionVersion = 0
const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener(state))
}

function updateState(nextState) {
  state = { ...state, ...nextState }
  emit()
}

export function getAuthState() {
  return state
}

export function subscribeToAuthState(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setSession(session) {
  const accessToken = session.access_token
  const user = { ...session }
  delete user.access_token
  delete user.refresh_token
  delete user.token_type

  if (!accessToken) {
    throw new Error('An access token is required to create an auth session.')
  }

  setAccessToken(accessToken)
  sessionVersion += 1
  updateState({
    user,
    accessToken,
    isAuthenticated: true,
    isInitializing: false,
  })
}

export function clearSession() {
  sessionVersion += 1
  clearAccessToken()
  clearUserSessionStorage()
  updateState(signedOutState)
}

export function updateCurrentUser(profile) {
  if (!state.user) return
  updateState({ user: { ...state.user, ...profile } })
}

export function initializeAuth() {
  if (initializationPromise) return initializationPromise

  const accessToken = getAccessToken()
  if (!accessToken) {
    updateState(signedOutState)
    return Promise.resolve(signedOutState)
  }

  const initializationVersion = sessionVersion

  updateState({
    user: null,
    accessToken,
    isAuthenticated: false,
    isInitializing: true,
  })

  initializationPromise = getMe()
    .then((user) => {
      if (sessionVersion !== initializationVersion || getAccessToken() !== accessToken) {
        return getAuthState()
      }

      updateState({
        user,
        accessToken,
        isAuthenticated: true,
        isInitializing: false,
      })
      return getAuthState()
    })
    .catch((error) => {
      if (sessionVersion !== initializationVersion || getAccessToken() !== accessToken) {
        throw error
      }

      if (error.response?.status === 401) {
        clearSession()
      } else {
        updateState({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
        })
      }
      throw error
    })
    .finally(() => {
      initializationPromise = null
    })

  return initializationPromise
}
