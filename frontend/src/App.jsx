import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

function App() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = `${path === '/signup' ? '회원가입' : '로그인'} | TOEIC AI`
  }, [path])

  function navigate(event, nextPath) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  return path === '/signup'
    ? <SignupPage onLogin={(event) => navigate(event, '/login')} />
    : <LoginPage onSignUp={(event) => navigate(event, '/signup')} />
}

export default App
