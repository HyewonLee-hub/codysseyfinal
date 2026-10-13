import { useEffect, useState } from 'react'
import {
  clearSession,
  getAuthState,
  initializeAuth,
  setSession,
  subscribeToAuthState,
  updateCurrentUser,
} from './authStore.js'
import { subscribeToUnauthorized } from './authEvents.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getAuthState)

  useEffect(() => {
    const unsubscribeFromState = subscribeToAuthState(setAuthState)
    const unsubscribeFromUnauthorized = subscribeToUnauthorized(clearSession)

    initializeAuth().catch(() => {
      // Network and server errors leave the user signed out without redirecting.
    })

    return () => {
      unsubscribeFromState()
      unsubscribeFromUnauthorized()
    }
  }, [])

  return <AuthContext.Provider value={{ ...authState, setSession, clearSession, initializeAuth, updateCurrentUser }}>{children}</AuthContext.Provider>
}
