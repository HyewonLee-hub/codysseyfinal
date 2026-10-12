import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DiagnosisPage from './pages/DiagnosisPage.jsx'
import DiagnosisQuestionsPage from './pages/DiagnosisQuestionsPage.jsx'
import DiagnosisResultPage from './pages/DiagnosisResultPage.jsx'
import WordsPage from './pages/WordsPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import StudyResultPage from './pages/StudyResultPage.jsx'
import { diagnosisQuestions } from './data/diagnosisQuestions.js'
import { mockDiagnosisResult } from './data/mockDiagnosisResult.js'
import { calculateStudyResult } from './data/studyResult.js'

function hasCompleteDiagnosis(answers) {
  return Boolean(answers) && Object.keys(answers).length === diagnosisQuestions.length && diagnosisQuestions.every((question) => question.options.some((option) => option.value === answers[question.id]))
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [diagnosisAnswers, setDiagnosisAnswers] = useState(null)
  const [studyResult, setStudyResult] = useState(null)
  const [studyInitialExamId, setStudyInitialExamId] = useState('basic')

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = `${path === '/study/result' ? '학습 결과' : path === '/study' ? '오늘의 문제 풀기' : path === '/words' ? '오늘의 단어' : path === '/signup' ? '회원가입' : path === '/diagnosis/result' ? '무료진단 결과' : path === '/diagnosis/questions' ? '무료진단 문제' : path === '/diagnosis' ? '무료진단' : '로그인'} | TOEIC AI`
  }, [path])

  function navigate(event, nextPath) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleHeaderNavigate(item) {
    const nextPath = item === '무료진단' ? '/diagnosis' : item === '오늘의 단어' ? '/words' : item === '학습' ? '/study' : null
    if (!nextPath) return
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
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

  function handleCompleteStudy(attempt) {
    const result = calculateStudyResult(attempt.examId, attempt.answers)
    if (!result) return
    setStudyResult(result)
    setStudyInitialExamId(result.examId)
    if (window.location.pathname !== '/study/result') window.history.pushState(null, '', '/study/result')
    setPath('/study/result')
  }

  function handleRetakeStudy() {
    if (studyResult) setStudyInitialExamId(studyResult.examId)
    setStudyResult(null)
    if (window.location.pathname !== '/study') window.history.pushState(null, '', '/study')
    setPath('/study')
  }

  if (path === '/diagnosis/result') return <DiagnosisResultPage result={hasCompleteDiagnosis(diagnosisAnswers) ? mockDiagnosisResult : null} onHeaderNavigate={handleHeaderNavigate} onStart={() => handleHeaderNavigate('무료진단')} />
  if (path === '/diagnosis/questions') return <DiagnosisQuestionsPage onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteDiagnosis} completedAnswers={diagnosisAnswers} />
  if (path === '/diagnosis') return <DiagnosisPage onHeaderNavigate={handleHeaderNavigate} onStart={handleStartDiagnosis} />
  if (path === '/words') return <WordsPage onHeaderNavigate={handleHeaderNavigate} />
  if (path === '/study/result') return <StudyResultPage result={studyResult} onHeaderNavigate={handleHeaderNavigate} onStart={() => handleHeaderNavigate('학습')} onRetake={handleRetakeStudy} />
  if (path === '/study') return <StudyPage onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteStudy} initialExamId={studyInitialExamId} completedAttempt={studyResult} />
  if (path === '/signup') return <SignupPage onLogin={(event) => navigate(event, '/login')} onHeaderNavigate={handleHeaderNavigate} />
  return <LoginPage onSignUp={(event) => navigate(event, '/signup')} onHeaderNavigate={handleHeaderNavigate} />
}

export default App
