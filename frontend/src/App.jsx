import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DiagnosisPage from './pages/DiagnosisPage.jsx'
import DiagnosisQuestionsPage from './pages/DiagnosisQuestionsPage.jsx'
import DiagnosisResultPage from './pages/DiagnosisResultPage.jsx'
import { diagnosisQuestions } from './data/diagnosisQuestions.js'
import { mockDiagnosisResult } from './data/mockDiagnosisResult.js'

function hasCompleteDiagnosis(answers) {
  return Boolean(answers) && Object.keys(answers).length === diagnosisQuestions.length && diagnosisQuestions.every((question) => question.options.some((option) => option.value === answers[question.id]))
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [diagnosisAnswers, setDiagnosisAnswers] = useState(null)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = `${path === '/signup' ? '회원가입' : path === '/diagnosis/result' ? '무료진단 결과' : path === '/diagnosis/questions' ? '무료진단 문제' : path === '/diagnosis' ? '무료진단' : '로그인'} | TOEIC AI`
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

  function handleStartDiagnosis() {
    setDiagnosisAnswers(null)
    if (window.location.pathname !== '/diagnosis/questions') window.history.pushState(null, '', '/diagnosis/questions')
    setPath('/diagnosis/questions')
  }

  function handleCompleteDiagnosis(answers) {
    if (!hasCompleteDiagnosis(answers)) return
    setDiagnosisAnswers(answers)
    if (window.location.pathname !== '/diagnosis/result') window.history.pushState(null, '', '/diagnosis/result')
    setPath('/diagnosis/result')
  }

  if (path === '/diagnosis/result') return <DiagnosisResultPage result={hasCompleteDiagnosis(diagnosisAnswers) ? mockDiagnosisResult : null} onHeaderNavigate={handleHeaderNavigate} onStart={() => handleHeaderNavigate('무료진단')} />
  if (path === '/diagnosis/questions') return <DiagnosisQuestionsPage onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteDiagnosis} completedAnswers={diagnosisAnswers} />
  if (path === '/diagnosis') return <DiagnosisPage onHeaderNavigate={handleHeaderNavigate} onStart={handleStartDiagnosis} />
  if (path === '/signup') return <SignupPage onLogin={(event) => navigate(event, '/login')} onHeaderNavigate={handleHeaderNavigate} />
  return <LoginPage onSignUp={(event) => navigate(event, '/signup')} onHeaderNavigate={handleHeaderNavigate} />
}

export default App
