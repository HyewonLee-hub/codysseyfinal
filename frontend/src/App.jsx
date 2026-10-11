import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DiagnosisPage from './pages/DiagnosisPage.jsx'

function App() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = `${path === '/signup' ? '회원가입' : path === '/diagnosis' ? '무료진단' : '로그인'} | TOEIC AI`
  }, [path])

  function navigate(event, nextPath) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleHeaderNavigate(item) {
    if (item !== '무료진단') return
    if (window.location.pathname !== '/diagnosis') window.history.pushState(null, '', '/diagnosis')
    setPath('/diagnosis')
  }

  if (path === '/diagnosis') return <DiagnosisPage onHeaderNavigate={handleHeaderNavigate} />
  if (path === '/signup') return <SignupPage onLogin={(event) => navigate(event, '/login')} onHeaderNavigate={handleHeaderNavigate} />
  return <LoginPage onSignUp={(event) => navigate(event, '/signup')} onHeaderNavigate={handleHeaderNavigate} />
}

export default App
