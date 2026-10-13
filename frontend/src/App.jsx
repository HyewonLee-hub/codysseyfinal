import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DiagnosisPage from './pages/DiagnosisPage.jsx'
import DiagnosisQuestionsPage from './pages/DiagnosisQuestionsPage.jsx'
import DiagnosisResultPage from './pages/DiagnosisResultPage.jsx'
import WordsPage from './pages/WordsPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import StudyResultPage from './pages/StudyResultPage.jsx'
import StudyReviewPage from './pages/StudyReviewPage.jsx'
import MyPage from './pages/MyPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SavedWordsPage from './pages/SavedWordsPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePage from './pages/HomePage.jsx'
import WeakLearningPage from './pages/WeakLearningPage.jsx'
import WeakLearningReportPage from './pages/WeakLearningReportPage.jsx'
import WrongReviewPage from './pages/WrongReviewPage.jsx'
import WrongReviewResultPage from './pages/WrongReviewResultPage.jsx'
import VocabularyQuizPage from './pages/VocabularyQuizPage.jsx'
import VocabularyQuizResultPage from './pages/VocabularyQuizResultPage.jsx'
import { createReviewRecord, getReviewType } from './data/studyReview.js'
import { getSavedDiagnosticSessionId } from './api/diagnostic.js'
import { getSavedWeakLearningSession, saveWeakLearningSession } from './api/weakLearning.js'
import { clearLearningTestSession, getSavedLearningTestSession, toFrontendLearningMode } from './api/learning.js'
import { clearWrongReviewSession, getSavedWrongReviewSession, saveWrongReviewSession } from './api/learning.js'
import { clearVocabularyQuizSession, getSavedVocabularyQuizSession, saveVocabularyQuizSession, startVocabularyQuiz } from './api/vocabulary.js'
import { useAuth } from './auth/useAuth.js'

function isProtectedPath(path) {
  return path === '/diagnosis/questions'
    || path === '/diagnosis/result'
    || path === '/study'
    || path.startsWith('/study/')
    || path === '/words'
    || path.startsWith('/words/')
    || path === '/mypage'
    || path.startsWith('/mypage/')
}

function App() {
  const { isAuthenticated, isInitializing } = useAuth()
  const [path, setPath] = useState(() => window.location.pathname)
  const [diagnosticSessionId, setDiagnosticSessionId] = useState(getSavedDiagnosticSessionId)
  const [weakLearningSession, setWeakLearningSession] = useState(getSavedWeakLearningSession)
  const [learningTestSession, setLearningTestSession] = useState(getSavedLearningTestSession)
  const [wrongReviewSessionId, setWrongReviewSessionId] = useState(getSavedWrongReviewSession)
  const [vocabularyQuizSessionId, setVocabularyQuizSessionId] = useState(getSavedVocabularyQuizSession)
  const [studyInitialExamId, setStudyInitialExamId] = useState('basic')
  const [reviewCompleted, setReviewCompleted] = useState(null)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (isInitializing || isAuthenticated || !isProtectedPath(path)) return
    if (window.location.pathname !== '/login') window.history.replaceState(null, '', '/login')
    const redirectTimer = window.setTimeout(() => setPath('/login'), 0)
    return () => window.clearTimeout(redirectTimer)
  }, [isAuthenticated, isInitializing, path])

  useEffect(() => {
    document.title = `${path === '/' ? '홈' : path === '/support/contact' ? '1:1 문의' : path === '/support/faq' ? '자주 묻는 질문' : path.startsWith('/mypage/reports/') ? '학습 보고서' : path === '/mypage/profile' ? '내 정보' : path === '/mypage/words' ? '저장한 단어' : path === '/mypage' ? '나의 학습 기록' : path.startsWith('/study/review') ? '취약 유형 반복' : path === '/study/result' ? '학습 결과' : path === '/study' ? '오늘의 문제 풀기' : path.startsWith('/words/quiz') ? '단어 테스트' : path === '/words' ? '오늘의 단어' : path === '/signup' ? '회원가입' : path === '/diagnosis/result' ? '무료진단 결과' : path === '/diagnosis/questions' ? '무료진단 문제' : path === '/diagnosis' ? '무료진단' : '로그인'} | TOEIC AI`
  }, [path])

  function navigate(event, nextPath) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigateTo(nextPath)
  }

  function navigateTo(nextPath) {
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleHeaderNavigate(item) {
    const nextPath = item === '무료진단' ? '/diagnosis' : item === '오늘의 단어' ? '/words' : item === '학습' ? '/study' : item === '마이페이지' ? '/mypage' : item === '고객센터' ? '/support/faq' : null
    if (!nextPath) return
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleStartDiagnosis() {
    if (window.location.pathname !== '/diagnosis/questions') window.history.pushState(null, '', '/diagnosis/questions')
    setPath('/diagnosis/questions')
  }

  function handleCompleteDiagnosis(sessionId) {
    setDiagnosticSessionId(sessionId)
    if (window.location.pathname !== '/diagnosis/result') window.history.pushState(null, '', '/diagnosis/result')
    setPath('/diagnosis/result')
  }

  function handleStartLearningTest(session) {
    setLearningTestSession(session)
  }

  function handleCompleteStudy(session) {
    if (!session) return
    setLearningTestSession(session)
    if (window.location.pathname !== '/study/result') window.history.pushState(null, '', '/study/result')
    setPath('/study/result')
  }

  function handleRetakeStudy() {
    if (learningTestSession) setStudyInitialExamId(toFrontendLearningMode(learningTestSession.mode) ?? 'basic')
    clearLearningTestSession()
    setLearningTestSession(null)
    if (window.location.pathname !== '/study') window.history.pushState(null, '', '/study')
    setPath('/study')
  }

  function handleResetLearningTest() {
    clearLearningTestSession()
    setLearningTestSession(null)
  }

  function handleOpenReview() {
    if (window.location.pathname !== '/study/review') window.history.pushState(null, '', '/study/review')
    setPath('/study/review')
  }

  function handleStartWeakLearning(session) {
    saveWeakLearningSession(session)
    setWeakLearningSession(session)
    const nextPath = '/study/review/weak'
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleCompleteWeakLearning() {
    const nextPath = '/study/review/weak/result'
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleStartWrongReview(sessionId) {
    saveWrongReviewSession(sessionId)
    setWrongReviewSessionId(sessionId)
    const nextPath = '/study/review/wrong'
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleCompleteWrongReview() {
    const nextPath = '/study/review/wrong/result'
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleResetWrongReview() {
    clearWrongReviewSession()
    setWrongReviewSessionId(null)
    handleOpenReview()
  }

  function handleCompleteReview({ typeId, answers }) {
    const record = createReviewRecord(typeId, answers)
    if (!record) return
    const savedRecord = { ...record, id: crypto.randomUUID() }
    setReviewCompleted(savedRecord)
  }

  function handleOpenReport(report) {
    navigateTo(report.path)
  }

  async function handleStartVocabularyQuiz() {
    const session = await startVocabularyQuiz()
    saveVocabularyQuizSession(session.session_id)
    setVocabularyQuizSessionId(session.session_id)
    const nextPath = '/words/quiz'
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleCompleteVocabularyQuiz() {
    const nextPath = '/words/quiz/result'
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleResetVocabularyQuiz() {
    clearVocabularyQuizSession()
    setVocabularyQuizSessionId(null)
    const nextPath = '/mypage/words'
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  if (isProtectedPath(path) && (isInitializing || !isAuthenticated)) return <div className="min-h-screen bg-canvas"><main className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20"><p role="status" className="text-base text-body">{isInitializing ? '로그인 정보를 확인하는 중입니다.' : '로그인 화면으로 이동하는 중입니다.'}</p></main></div>

  if (path === '/') return <HomePage onHeaderNavigate={handleHeaderNavigate} onNavigate={navigate} onLogin={() => { window.history.pushState(null, '', '/login'); setPath('/login') }} />
  if (path === '/support/faq') return <FaqPage onHeaderNavigate={handleHeaderNavigate} onContact={() => { window.history.pushState(null, '', '/support/contact'); setPath('/support/contact') }} />
  if (path === '/support/contact') return <ContactPage onHeaderNavigate={handleHeaderNavigate} onFaq={(event) => navigate(event, '/support/faq')} />
  if (path === '/diagnosis/result') return <DiagnosisResultPage sessionId={diagnosticSessionId} onHeaderNavigate={handleHeaderNavigate} onStart={() => handleHeaderNavigate('무료진단')} onStartWeakLearning={handleOpenReview} />
  if (path === '/diagnosis/questions') return <DiagnosisQuestionsPage onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteDiagnosis} />
  if (path === '/diagnosis') return <DiagnosisPage onHeaderNavigate={handleHeaderNavigate} onStart={handleStartDiagnosis} />
  if (path === '/words/quiz/result') return <VocabularyQuizResultPage onHeaderNavigate={handleHeaderNavigate} onBack={() => navigateTo('/mypage/words')} onRestart={handleResetVocabularyQuiz} />
  if (path === '/words/quiz') return <VocabularyQuizPage sessionId={vocabularyQuizSessionId} onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteVocabularyQuiz} onBack={() => navigateTo('/mypage/words')} onReset={handleResetVocabularyQuiz} />
  if (path === '/words') return <WordsPage onHeaderNavigate={handleHeaderNavigate} onStartQuiz={handleStartVocabularyQuiz} />
  if (path === '/mypage') return <MyPage onHeaderNavigate={handleHeaderNavigate} onOpenReport={handleOpenReport} onSavedWords={() => navigateTo('/mypage/words')} onEditProfile={() => navigateTo('/mypage/profile')} />
  if (path.startsWith('/mypage/reports/diagnostic/')) {
    const sessionId = path.slice('/mypage/reports/diagnostic/'.length)
    return <DiagnosisResultPage sessionId={sessionId} onHeaderNavigate={handleHeaderNavigate} onStart={() => navigateTo('/mypage')} onStartWeakLearning={handleOpenReview} />
  }
  if (path.startsWith('/mypage/reports/learning/')) {
    const [, , , , mode, sessionId] = path.split('/')
    if (['general', 'vocabulary', 'grammar'].includes(mode) && sessionId) return <StudyResultPage session={{ learningSessionId: sessionId, mode }} onHeaderNavigate={handleHeaderNavigate} onStart={() => navigateTo('/mypage')} onRetake={() => navigateTo('/study')} onReview={handleOpenReview} />
  }
  if (path.startsWith('/mypage/reports/weak/')) {
    const sessionId = path.slice('/mypage/reports/weak/'.length)
    return <WeakLearningReportPage session={{ learningSessionId: sessionId, subtypeId: '' }} onHeaderNavigate={handleHeaderNavigate} onBack={() => navigateTo('/mypage')} />
  }
  if (path === '/mypage/profile') return <ProfilePage onCancel={() => navigateTo('/mypage')} onHeaderNavigate={handleHeaderNavigate} onBack={() => navigateTo('/mypage')} />
  if (path === '/mypage/words') return <SavedWordsPage onStartTest={handleStartVocabularyQuiz} onHeaderNavigate={handleHeaderNavigate} onBack={() => handleHeaderNavigate('마이페이지')} onOpenWords={() => handleHeaderNavigate('오늘의 단어')} />
  if (path === '/study/result') return <StudyResultPage session={learningTestSession} onHeaderNavigate={handleHeaderNavigate} onStart={handleRetakeStudy} onRetake={handleRetakeStudy} onReview={handleOpenReview} />
  if (path === '/study/review/weak/result') return <WeakLearningReportPage session={weakLearningSession} onHeaderNavigate={handleHeaderNavigate} onBack={handleOpenReview} />
  if (path === '/study/review/weak') return <WeakLearningPage session={weakLearningSession} onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteWeakLearning} onBack={handleOpenReview} />
  if (path === '/study/review/wrong/result') return <WrongReviewResultPage sessionId={wrongReviewSessionId} onHeaderNavigate={handleHeaderNavigate} onBack={handleOpenReview} onRestart={handleResetWrongReview} />
  if (path === '/study/review/wrong') return <WrongReviewPage sessionId={wrongReviewSessionId} onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteWrongReview} onBack={handleOpenReview} onReset={handleResetWrongReview} />
  if (path === '/study/review') return <StudyReviewPage onHeaderNavigate={handleHeaderNavigate} onStartWeakSession={handleStartWeakLearning} onStartWrongReview={handleStartWrongReview} />
  if (path.startsWith('/study/review/')) {
    const typeId = path.slice('/study/review/'.length)
    if (getReviewType(typeId)) return <StudyPage key={typeId} reviewTypeId={typeId} reviewCompleted={reviewCompleted} onReviewComplete={handleCompleteReview} onBackToReview={handleOpenReview} onHeaderNavigate={handleHeaderNavigate} />
  }
  if (path === '/study') return <StudyPage onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteStudy} initialExamId={studyInitialExamId} learningTestSession={learningTestSession} onSessionStarted={handleStartLearningTest} onResetSession={handleResetLearningTest} />
  if (path === '/signup') return <SignupPage onLogin={(event) => navigate(event, '/login')} onSignupSuccess={() => navigateTo('/login')} onHeaderNavigate={handleHeaderNavigate} />
  return <LoginPage onSignUp={(event) => navigate(event, '/signup')} onLoginSuccess={() => navigateTo('/')} onHeaderNavigate={handleHeaderNavigate} />
}

export default App
